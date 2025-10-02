import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { validateTelegramAuth } from '@/lib/core/auth/telegram'
import { signJWT } from '@/lib/core/auth/jwt'
import { createSupabaseServerClient } from '@/lib/core/db/supabase'

const AuthRequestSchema = z.object({
  initData: z.string(),
})

type AuthResponse =
  | { success: true; token: string; user: any }
  | { success: false; error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Validate request body
    const { initData } = AuthRequestSchema.parse(req.body)

    // Validate Telegram auth
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not configured')
    }

    const telegramUser = validateTelegramAuth(initData, botToken)
    if (!telegramUser) {
      return res.status(401).json({ success: false, error: 'Invalid Telegram authentication' })
    }

    // Get Supabase client
    const supabase = createSupabaseServerClient()

    // Upsert user
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert(
        {
          tg_user_id: telegramUser.id.toString(),
          full_name: `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
          email: telegramUser.username ? `${telegramUser.username}@telegram.user` : null,
        },
        { onConflict: 'tg_user_id' }
      )
      .select()
      .single()

    if (userError || !user) {
      console.error('User upsert error:', userError)
      return res.status(500).json({ success: false, error: 'Failed to create/update user' })
    }

    // Check if user belongs to any company
    const { data: companyUsers, error: companyError } = await supabase
      .from('company_users')
      .select('company_id, role')
      .eq('user_id', user.id)

    let companyIds: string[] = []
    let role = 'viewer'

    if (companyUsers && companyUsers.length > 0) {
      // User has existing companies
      companyIds = companyUsers.map(cu => cu.company_id)
      role = companyUsers[0].role // Use first company's role
    } else {
      // New user - create a company for them
      const { data: newCompany, error: companyCreateError } = await supabase
        .from('companies')
        .insert({
          name: `${telegramUser.first_name}'s Company`,
        })
        .select()
        .single()

      if (companyCreateError || !newCompany) {
        console.error('Company creation error:', companyCreateError)
        return res.status(500).json({ success: false, error: 'Failed to create company' })
      }

      // Add user as owner
      const { error: memberError } = await supabase
        .from('company_users')
        .insert({
          company_id: newCompany.id,
          user_id: user.id,
          role: 'owner',
        })

      if (memberError) {
        console.error('Company user creation error:', memberError)
        return res.status(500).json({ success: false, error: 'Failed to add user to company' })
      }

      companyIds = [newCompany.id]
      role = 'owner'
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured')
    }

    const token = signJWT(
      {
        uid: user.id,
        companies: companyIds,
        role,
      },
      jwtSecret,
      '7d' // 7 days expiration
    )

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        tg_user_id: user.tg_user_id,
        full_name: user.full_name,
        companies: companyIds,
        role,
      },
    })
  } catch (error) {
    console.error('Auth error:', error)

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body',
      })
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    })
  }
}
