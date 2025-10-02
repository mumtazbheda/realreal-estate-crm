#!/usr/bin/env node
/**
 * Run Supabase migration directly using service role key
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load env from miniapp/.env.local
require('dotenv').config({ path: path.join(__dirname, '../apps/miniapp/.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in apps/miniapp/.env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Running migration: 0001_schema.sql')

  const migrationPath = path.join(__dirname, '../supabase/migrations/0001_schema.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  try {
    // Execute the migration SQL using the REST API
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      // If rpc doesn't exist, try direct SQL execution
      console.log('⚠️  RPC method not available, trying direct execution...')

      // Split into individual statements and execute
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      console.log(`📋 Found ${statements.length} SQL statements to execute`)

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i] + ';'
        console.log(`\n[${i + 1}/${statements.length}] Executing...`)

        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({ query: stmt })
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`❌ Statement ${i + 1} failed:`, errorText)
        } else {
          console.log(`✅ Statement ${i + 1} executed`)
        }
      }
    } else {
      console.log('✅ Migration executed successfully!')
      console.log('Data:', data)
    }

    // Verify tables were created
    console.log('\n🔍 Verifying tables...')
    const { data: tables, error: tablesError } = await supabase
      .from('tenants')
      .select('count')
      .limit(1)

    if (tablesError) {
      console.log('⚠️  Could not verify tables (this might be a permissions issue)')
      console.log('Please check Supabase Dashboard manually')
    } else {
      console.log('✅ Tables verified! Migration successful.')
    }

  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    console.log('\n📝 Alternative: Copy SQL from supabase/migrations/0001_schema.sql')
    console.log('   and run it manually in Supabase Dashboard > SQL Editor')
    process.exit(1)
  }
}

runMigration()
