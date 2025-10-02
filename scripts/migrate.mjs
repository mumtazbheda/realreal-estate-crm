#!/usr/bin/env node
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse .env.local manually
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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

// Extract connection details from URL
const projectRef = 'basrflycubhhgggqvogw'

console.log('🚀 Connecting to Supabase...')
console.log(`📦 Project: ${projectRef}`)

// Try direct connection via Supabase API
const client = new pg.Client({
  host: `db.${projectRef}.supabase.co`,
  database: 'postgres',
  user: 'postgres',
  password: serviceRoleKey.split('.')[2], // Extract password from JWT
  port: 5432,
  ssl: { rejectUnauthorized: false }
})

async function migrate() {
  try {
    await client.connect()
    console.log('✅ Connected!')

    const sql = readFileSync(join(__dirname, '../supabase/migrations/0001_schema.sql'), 'utf8')

    console.log('\n📝 Running migration...')
    await client.query(sql)

    console.log('✅ Migration completed successfully!')

    // Verify tables
    console.log('\n🔍 Verifying tables...')
    const result = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `)

    console.log('\n📋 Created tables:')
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.tablename}`)
    })

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message)
    console.log('\n💡 Please run manually in Supabase Dashboard:')
    console.log('   https://basrflycubhhgggqvogw.supabase.co/project/basrflycubhhgggqvogw/sql/new')
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrate()
