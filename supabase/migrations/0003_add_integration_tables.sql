-- ========== Add Integration Tables to Existing Schema ==========
-- This assumes you already have: companies, users, company_users, contacts, leads, etc.

-- Webhook events for all integrations
create table if not exists public.webhook_events (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete cascade,
  provider text not null,  -- 'aichats', 'mailwizz', 'propertyfinder', 'bayut'
  event_key text not null,  -- idempotency key
  payload jsonb not null,
  status text not null default 'received',  -- 'received', 'processed', 'error'
  error text,
  created_at timestamptz not null default now(),
  unique (provider, event_key)
);

create index if not exists idx_webhook_events_company on public.webhook_events(company_id, created_at desc);
create index if not exists idx_webhook_events_status on public.webhook_events(status, created_at desc);

-- WhatsApp messages via AI Chats
create table if not exists public.whatsapp_messages (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  direction text not null check (direction in ('in', 'out')),
  contact_phone text,
  message_id text,  -- External message ID
  body text,
  media_url text,
  meta jsonb,  -- Additional metadata
  created_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_messages_company on public.whatsapp_messages(company_id, created_at desc);
create index if not exists idx_whatsapp_messages_contact on public.whatsapp_messages(contact_id, created_at desc);
create index if not exists idx_whatsapp_messages_phone on public.whatsapp_messages(contact_phone, created_at desc);

-- Email campaign events from MailWizz
create table if not exists public.email_events (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references public.companies(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  event_type text not null,  -- 'sent', 'open', 'click', 'bounce', 'unsubscribe'
  email text,
  campaign_id text,
  campaign_name text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_events_company on public.email_events(company_id, created_at desc);
create index if not exists idx_email_events_contact on public.email_events(contact_id, created_at desc);
create index if not exists idx_email_events_type on public.email_events(event_type, created_at desc);

-- Automations configuration
create table if not exists public.automations (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  trigger_type text not null,  -- 'new_lead', 'status_change', 'schedule', etc.
  action_type text not null,  -- 'assign_agent', 'send_email', 'send_whatsapp', etc.
  config jsonb not null,  -- Configuration for trigger and action
  is_active boolean not null default true,
  created_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_automations_company on public.automations(company_id, is_active);

-- Automation runs log
create table if not exists public.automation_runs (
  id uuid primary key default uuid_generate_v4(),
  automation_id uuid not null references public.automations(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  entity_type text,  -- 'lead', 'contact', etc.
  entity_id uuid,
  status text not null,  -- 'success', 'failed', 'skipped'
  error text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_automation_runs_automation on public.automation_runs(automation_id, created_at desc);
create index if not exists idx_automation_runs_company on public.automation_runs(company_id, created_at desc);
