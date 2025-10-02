-- ========== EXTENSIONS ==========
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ========== TENANCY & USERS ==========
create table if not exists public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  tg_user_id text,               -- Telegram user id (string)
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_users (
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id   uuid references public.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','agent','viewer','super_admin')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

-- ========== CONTACTS & LEADS (starter) ==========
create table if not exists public.contacts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_contacts_tenant_created on public.contacts(tenant_id, created_at desc);

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  title text,
  status text not null default 'new',
  source text,
  assignee_id uuid references public.users(id),
  budget numeric,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_tenant_status_created on public.leads(tenant_id, status, created_at desc);
create index if not exists idx_leads_assignee_created on public.leads(assignee_id, created_at desc);

-- ========== EVENTS / LOGS (starter) ==========
create table if not exists public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references public.users(id),
  entity text not null,           -- e.g., 'lead','contact'
  entity_id uuid,
  verb text not null,             -- 'create','update','assign'
  delta jsonb,
  created_at timestamptz not null default now()
);

-- ========== INTEGRATION TABLES (placeholders) ==========
create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  provider text not null,         -- 'aichats','mailwizz','pf','bayut'
  event_key text not null,        -- idempotency key
  payload jsonb not null,
  status text not null default 'received', -- 'received','processed','error'
  error text,
  created_at timestamptz not null default now(),
  unique (provider, event_key)
);

create table if not exists public.whatsapp_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  contact_phone text,
  message_id text,
  body text,
  media_url text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.email_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  event_type text not null,       -- 'open','click','bounce'
  email text,
  campaign_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ========== RLS ENABLE ==========
alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.tenant_users enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.activity_log enable row level security;
alter table public.webhook_events enable row level security;
alter table public.whatsapp_events enable row level security;
alter table public.email_events enable row level security;

-- === Helper: current user id from JWT (supabase uses auth.jwt())
-- We expect our API to sign JWTs with `user_id` and `tenant_ids` claims.
-- Example payload claim keys: `uid` and `tenants` (array).
-- Adjust names to match your signer later.
create or replace function public.current_user_id()
returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb->>'uid','')::uuid
$$;

create or replace function public.current_tenants()
returns jsonb language sql stable as $$
  select coalesce(current_setting('request.jwt.claims', true)::jsonb->'tenants','[]'::jsonb)
$$;

-- ========== RLS POLICIES (deny-by-default, then allow per tenant) ==========
-- Deny all by default (implicit when no policies). Define allow policies per table.

-- Tenants: only super_admins can read/write tenants (we'll tune later). For now block all.
create policy tenants_no_access on public.tenants for all using (false);

-- Users: a user can read their own row; managers/owners may read tenant users via joins (we'll add views later).
create policy users_self_read on public.users
for select using (id = public.current_user_id());

-- Tenant memberships: allow select if the row's tenant is in user's tenant list
create policy tenant_users_by_membership on public.tenant_users
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);

-- Contacts/Leads/Logs: allow within tenant membership
create policy contacts_by_tenant on public.contacts
for all using (
  (public.current_tenants()) ?| array[tenant_id::text]
);

create policy leads_by_tenant on public.leads
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);
-- NOTE: We will add role-specific insert/update policies later (agent vs manager).

create policy activity_by_tenant on public.activity_log
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);

create policy webhook_events_by_tenant on public.webhook_events
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);

create policy wa_events_by_tenant on public.whatsapp_events
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);

create policy email_events_by_tenant on public.email_events
for select using (
  (public.current_tenants()) ?| array[tenant_id::text]
);
