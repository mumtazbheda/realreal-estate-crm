# Real Estate CRM - Telegram Mini App

[![CI](https://github.com/mumtazbheda/realreal-estate-crm/actions/workflows/ci.yml/badge.svg)](https://github.com/mumtazbheda/realreal-estate-crm/actions/workflows/ci.yml)

Multi-tenant Real Estate CRM built as a Telegram Mini App with Next.js, Supabase, and Vercel.

## Stack

- **Frontend**: Next.js (Pages Router) + TypeScript + Tailwind CSS + React Query
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (Postgres + Auth + Storage + RLS)
- **Validation**: Zod
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Lint/Format**: ESLint + Prettier

## Project Structure

```
/
├── apps/
│   ├── miniapp/          # Next.js Telegram Mini App UI
│   └── api/              # Vercel serverless API routes
├── packages/
│   └── core/             # Shared types, clients, utilities
├── supabase/
│   ├── migrations/       # SQL schema + RLS policies
│   └── functions/        # Supabase Edge Functions (optional)
├── .env.example          # Environment variables template
└── vercel.json           # Vercel deployment config
```

## Features

- **Multi-tenant**: Strict tenant isolation with RLS policies
- **Entities**: Leads, Properties, Deals, Tasks, Contacts, Files
- **Integrations**: WhatsApp (AI Chats), Email (MailWizz)
- **Auth**: Telegram Mini App initData verification + JWT
- **Navigation**: Leads • Properties • Deals • Tasks • Inbox • Reports • Settings

## Setup

1. **Clone and install**:
   ```bash
   git clone https://github.com/mumtazbheda/realreal-estate-crm.git
   cd realreal-estate-crm
   pnpm install
   ```

2. **Environment variables**:
   ```bash
   cp .env.example apps/miniapp/.env.local
   # Fill in your Supabase, Telegram, and integration credentials
   ```

3. **Run migrations**:
   ```bash
   # Option 1: Using Supabase CLI (recommended)
   npx supabase link --project-ref your-project-ref
   npx supabase db push

   # Option 2: Manual via Supabase Dashboard
   # Copy contents of supabase/migrations/0001_schema.sql
   # Paste into SQL Editor in Supabase Dashboard and run
   ```

4. **Start dev server**:
   ```bash
   pnpm dev
   # Or run individual apps:
   pnpm -r --parallel dev
   ```

5. **Test the setup**:
   - Open http://localhost:3000 for the Mini App
   - Visit http://localhost:3000/ping to test the API health endpoint

## Development

### Commands

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start all dev servers in parallel
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

### PR Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create PR on GitHub targeting `main` branch
   - CI will automatically run: lint, typecheck, and tests
   - Vercel will create a preview deployment

4. **Review & Merge**:
   - Wait for CI checks to pass ✅
   - Request review from team
   - Merge to `main` after approval
   - Production deploy happens automatically via Vercel

### CI/CD

- **CI**: GitHub Actions runs on every PR to `main`
  - Linting with ESLint
  - Type checking with TypeScript
  - Unit tests with Vitest
- **CD**: Vercel handles deployments
  - Preview: Every PR gets a preview URL
  - Production: Merges to `main` auto-deploy

## Environment Variables

All secrets are read from `process.env` at runtime. For local development, create `apps/miniapp/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `MAILWIZZ_API_URL` - MailWizz API endpoint
- `MAILWIZZ_API_KEY` - MailWizz API key
- `AICHATS_API_URL` - AI Chats API endpoint
- `AICHATS_API_KEY` - AI Chats API key

**For production**: Set these in Vercel's environment variables dashboard. Never commit secrets to git.

## Database Schema

### Core Tables

- **tenants** - Multi-tenant organizations
- **users** - Global user accounts (Telegram ID + email)
- **tenant_users** - User-tenant memberships with roles (owner, manager, agent, viewer, super_admin)
- **contacts** - Contact information with tenant isolation
- **leads** - Lead tracking with status, source, assignee
- **activity_log** - Audit trail for all entity changes
- **webhook_events** - Incoming webhook events from integrations
- **whatsapp_events** - WhatsApp message log
- **email_events** - Email campaign events

### RLS (Row Level Security)

All tables have RLS enabled with **deny-by-default** policies:
- JWT claims expected: `uid` (user ID) and `tenants` (array of tenant IDs)
- Helper functions: `current_user_id()`, `current_tenants()`
- Users can only access data from tenants they belong to
- Policies use `?|` operator to check tenant membership

### Migrations

Run migrations in order:
```bash
# 0001_schema.sql - Core multi-tenant schema with RLS
npx supabase db push
```

## Hard Rules

- Every table has `tenant_id` - no exceptions
- RLS enabled on all tables - deny by default
- All API inputs validated with Zod
- Never commit secrets
- Add unit tests for new modules
- Filter/sort queries must have indexes

## License

Private - All rights reserved
