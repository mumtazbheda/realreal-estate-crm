-- ========== RLS Policies (Run AFTER 0001_schema_fixed.sql) ==========

-- First, create helper functions if they don't exist
create or replace function public.current_user_id()
returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'uid','')::uuid
$$;

create or replace function public.current_tenants()
returns jsonb language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb->'tenants','[]'::jsonb)
$$;

-- Enable RLS on all tables
alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.tenant_users enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.activity_log enable row level security;
alter table public.webhook_events enable row level security;
alter table public.whatsapp_events enable row level security;
alter table public.email_events enable row level security;

-- Drop existing policies (if any)
drop policy if exists tenants_no_access on public.tenants;
drop policy if exists users_self_read on public.users;
drop policy if exists tenant_users_by_membership on public.tenant_users;
drop policy if exists contacts_by_tenant on public.contacts;
drop policy if exists leads_by_tenant on public.leads;
drop policy if exists activity_by_tenant on public.activity_log;
drop policy if exists webhook_events_by_tenant on public.webhook_events;
drop policy if exists wa_events_by_tenant on public.whatsapp_events;
drop policy if exists email_events_by_tenant on public.email_events;

-- Create policies

-- Tenants: block all for now (we'll add super_admin logic later)
create policy tenants_no_access on public.tenants
  for all using (false);

-- Users: can read their own row
create policy users_self_read on public.users
  for select using (id = public.current_user_id());

-- Tenant memberships: can read if tenant is in user's tenant list
create policy tenant_users_by_membership on public.tenant_users
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- Contacts: full access within tenant
create policy contacts_by_tenant on public.contacts
  for all using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- Leads: read access within tenant
create policy leads_by_tenant on public.leads
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- Activity log: read access within tenant
create policy activity_by_tenant on public.activity_log
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- Webhook events: read access within tenant
create policy webhook_events_by_tenant on public.webhook_events
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- WhatsApp events: read access within tenant
create policy wa_events_by_tenant on public.whatsapp_events
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );

-- Email events: read access within tenant
create policy email_events_by_tenant on public.email_events
  for select using (
    public.current_tenants() ?| array[tenant_id::text]
  );
