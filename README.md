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
   git clone <repo>
   cd realreal-estate-crm
   npm install
   ```

2. **Environment variables**:
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase, Telegram, and integration credentials
   ```

3. **Run migrations**:
   ```bash
   # Set up Supabase CLI and run migrations
   npx supabase db push
   ```

4. **Start dev server**:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start all dev servers
- `npm run build` - Build all apps
- `npm run lint` - Lint all packages
- `npm run test` - Run tests

## Hard Rules

- Every table has `tenant_id` - no exceptions
- RLS enabled on all tables - deny by default
- All API inputs validated with Zod
- Never commit secrets
- Add unit tests for new modules
- Filter/sort queries must have indexes

## License

Private - All rights reserved
