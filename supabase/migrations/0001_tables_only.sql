-- ========== EXTENSIONS ==========
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ========== TENANCY & USERS ==========
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default uuid_generate_v4(),
  tg_user_id text,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create table public.tenant_users (
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','agent','viewer','super_admin')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

-- ========== CONTACTS & LEADS ==========
create table public.contacts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create index idx_contacts_tenant_created on public.contacts(tenant_id, created_at desc);

create table public.leads (
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

create index idx_leads_tenant_status_created on public.leads(tenant_id, status, created_at desc);
create index idx_leads_assignee_created on public.leads(assignee_id, created_at desc);

-- ========== LOGS ==========
create table public.activity_log (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_id uuid references public.users(id),
  entity text not null,
  entity_id uuid,
  verb text not null,
  delta jsonb,
  created_at timestamptz not null default now()
);

-- ========== INTEGRATION TABLES ==========
create table public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  provider text not null,
  event_key text not null,
  payload jsonb not null,
  status text not null default 'received',
  error text,
  created_at timestamptz not null default now(),
  unique (provider, event_key)
);

create table public.whatsapp_events (
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

create table public.email_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  event_type text not null,
  email text,
  campaign_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);
