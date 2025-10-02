-- ================================================
-- Real Estate CRM - Database Schema
-- ================================================
-- Multi-tenant architecture with RLS policies
-- Every table has tenant_id for isolation
-- Deny-by-default: explicit policies required
-- ================================================

-- Placeholder migration file
-- TODO: Add schema definitions for:
--   - tenants, users, tenant_users (roles)
--   - contacts, phones, emails
--   - leads, lead_sources, lead_status_history
--   - properties, projects, developers, units, media
--   - deals, deal_stages, deal_stage_history
--   - tasks
--   - files (Supabase Storage references)
--   - activity_log, audit_log
--   - automations, automation_runs
--   - integrations: channel_id_map, whatsapp_events, email_events, webhook_events

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS on all tables (to be added)
-- ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
