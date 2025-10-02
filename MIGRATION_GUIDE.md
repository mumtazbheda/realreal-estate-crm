# Running Database Migration

## ⚠️ The service role key is a JWT token, not a database password

To run the migration, you have **2 options**:

## Option 1: Manual (Recommended - 2 minutes)

1. **Open Supabase SQL Editor**:
   👉 https://basrflycubhhgggqvogw.supabase.co/project/basrflycubhhgggqvogw/sql/new

2. **Copy the entire SQL file**:
   ```bash
   cat supabase/migrations/0001_schema.sql | pbcopy
   ```
   Or open `supabase/migrations/0001_schema.sql` and copy all content

3. **Paste into SQL Editor** and click **"Run"**

4. **Verify tables created**:
   - Go to Table Editor: https://basrflycubhhgggqvogw.supabase.co/project/basrflycubhhgggqvogw/editor
   - You should see: tenants, users, tenant_users, contacts, leads, etc.

---

## Option 2: Get Database Password from Supabase

1. **Go to Project Settings**:
   👉 https://basrflycubhhgggqvogw.supabase.co/project/basrflycubhhgggqvogw/settings/database

2. **Find "Database password"** (the actual postgres password, not the JWT)

3. **Update the migration script**:
   ```bash
   # Edit apps/miniapp/.env.local and add:
   SUPABASE_DB_PASSWORD=your-actual-database-password
   ```

4. **Run migration**:
   ```bash
   node scripts/migrate.mjs
   ```

---

## After Migration

Once tables are created, we'll verify with:
```bash
# Check tables exist
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://basrflycubhhgggqvogw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3JmbHljdWJoaGdnZ3F2b2d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY4NTM4MiwiZXhwIjoyMDcxMjYxMzgyfQ.C3_UQqe3LXG2LskN3Yw9Y4jryYWAZr0G_-ZYrVVB_KA'
);
supabase.from('tenants').select('count').then(console.log);
"
```

---

## ✅ Once Complete

Reply "migration done" and I'll proceed to **Step 8: Telegram Authentication**!
