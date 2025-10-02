#!/usr/bin/env node
/**
 * Test database connection and verify schema
 */
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
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔌 Testing Supabase Connection...\n')
console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${anonKey.substring(0, 20)}...\n`)

const tables = ['companies', 'users', 'leads', 'contacts', 'properties', 'deals']

async function testTable(tableName) {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/${tableName}?select=count&limit=0`,
      {
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
        }
      }
    )

    if (response.ok) {
      console.log(`✅ ${tableName}`)
      return true
    } else {
      const error = await response.text()
      console.log(`❌ ${tableName}: ${error}`)
      return false
    }
  } catch (err) {
    console.log(`❌ ${tableName}: ${err.message}`)
    return false
  }
}

async function testAll() {
  console.log('📋 Testing existing tables:\n')

  for (const table of tables) {
    await testTable(table)
  }

  console.log('\n✨ Connection test complete!\n')
}

testAll()
