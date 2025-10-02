# Real Estate CRM - Telegram Mini App

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
   # Set up Supabase CLI and run migrations
   npx supabase db push
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

- `pnpm install` - Install all dependencies
- `pnpm dev` - Start all dev servers in parallel
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests
- `pnpm format` - Format code with Prettier

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

## Hard Rules

- Every table has `tenant_id` - no exceptions
- RLS enabled on all tables - deny by default
- All API inputs validated with Zod
- Never commit secrets
- Add unit tests for new modules
- Filter/sort queries must have indexes

## License

Private - All rights reserved
