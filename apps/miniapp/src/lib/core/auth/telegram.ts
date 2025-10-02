import crypto from 'crypto'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

/**
 * Validate Telegram Mini App initData
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramAuth(initData: string, botToken: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')

    if (!hash) {
      console.error('No hash in initData')
      return null
    }

    // Remove hash from data
    urlParams.delete('hash')

    // Sort params alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Create secret key from bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    // Verify hash matches
    if (calculatedHash !== hash) {
      console.error('Hash mismatch', { calculated: calculatedHash, received: hash })
      return null
    }

    // Parse user data
    const userParam = urlParams.get('user')
    if (!userParam) {
      console.error('No user in initData')
      return null
    }

    const user = JSON.parse(userParam) as TelegramUser
    user.auth_date = parseInt(urlParams.get('auth_date') || '0')
    user.hash = hash

    // Check auth_date is recent (within 24 hours)
    const authDate = new Date(user.auth_date * 1000)
    const now = new Date()
    const hoursDiff = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 24) {
      console.error('Auth data too old', { hoursDiff })
      return null
    }

    return user
  } catch (error) {
    console.error('Telegram auth validation error:', error)
    return null
  }
}

/**
 * Parse Telegram initData without validation (for development/testing)
 */
export function parseTelegramInitData(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const userParam = urlParams.get('user')

    if (!userParam) {
      return null
    }

    const user = JSON.parse(userParam) as TelegramUser
    user.auth_date = parseInt(urlParams.get('auth_date') || '0')
    user.hash = urlParams.get('hash') || ''

    return user
  } catch (error) {
    console.error('Parse initData error:', error)
    return null
  }
}
