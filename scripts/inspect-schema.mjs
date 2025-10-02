#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse .env.local
const envPath = join(__dirname, '../apps/miniapp/.env.local')
const envContent = readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) {
    env[match[1].trim()] = match[2].trim()
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function inspectSchema() {
  console.log('🔍 Inspecting existing schema...\n')

  const tables = [
    'companies',
    'users',
    'company_users',
    'contacts',
    'leads',
    'properties',
    'deals',
    'tasks',
    'activities',
    'notifications',
    'pipeline_stages'
  ]

  for (const table of tables) {
    console.log(`📋 Table: ${table}`)

    // Get sample row to see columns
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)

    if (error) {
      console.log(`   ❌ Error: ${error.message}\n`)
    } else if (data && data.length > 0) {
      const columns = Object.keys(data[0])
      console.log(`   Columns: ${columns.join(', ')}`)
      console.log(`   Sample data exists ✓\n`)
    } else {
      // Try to get table structure even if no data
      const { data: emptyData, error: emptyError } = await supabase
        .from(table)
        .select('*')
        .limit(0)

      if (!emptyError) {
        console.log(`   Table exists but empty ✓\n`)
      }
    }
  }
}

inspectSchema()
