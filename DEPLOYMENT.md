# 🚀 Deployment Guide

## Step 1: Push to GitHub

Your repo is already connected to: `https://github.com/mumtazbheda/realreal-estate-crm.git`

You need to authenticate Git and push:

### Option A: Using GitHub CLI (Easiest)
```bash
gh auth login
git push origin main
```

### Option B: Using SSH
```bash
git remote set-url origin git@github.com:mumtazbheda/realreal-estate-crm.git
git push origin main
```

### Option C: Using Personal Access Token
```bash
git push origin main
# Enter your GitHub username
# Enter your Personal Access Token (not password)
```

---

## Step 2: Configure Vercel

You mentioned you already imported the repo to Vercel. Now let's configure it:

### 2.1 Vercel Project Settings

1. Go to: https://vercel.com/dashboard
2. Find your project: `realreal-estate-crm`
3. Go to **Settings** → **Environment Variables**

### 2.2 Add Environment Variables

Add these variables for **Production, Preview, and Development**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://basrflycubhhgggqvogw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3JmbHljdWJoaGdnZ3F2b2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODUzODIsImV4cCI6MjA3MTI2MTM4Mn0.YOKsEc0Z1dbDEcMGdhadntoaIa06k-67OkbD409dS1c
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3JmbHljdWJoaGdnZ3F2b2d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY4NTM4MiwiZXhwIjoyMDcxMjYxMzgyfQ.C3_UQqe3LXG2LskN3Yw9Y4jryYWAZr0G_-ZYrVVB_KA

# JWT Secret
JWT_SECRET=rDsWWTxq+U3vKzJ2OLbCd6S9cgFHY6mDmzhcAfgzUx/gyexxMGAaUXprOLd0jDI0GF8HJ4I5JpAOBrEKKG1TBQ==

# Telegram Bot
TELEGRAM_BOT_TOKEN=8055786666:AAFFpppmgr_KNjVVv5wGUUKvTG7UhGGktQQ
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=zyoracrm_bot
```

### 2.3 Vercel Build Settings

Make sure these are set in **Settings** → **General**:

- **Framework Preset**: Next.js
- **Root Directory**: `apps/miniapp`
- **Build Command**: `pnpm run build` (or leave default)
- **Output Directory**: `.next` (or leave default)
- **Install Command**: `pnpm install` (or leave default)

---

## Step 3: Deploy

Once environment variables are added:

1. Go to **Deployments** tab
2. Click **Redeploy** or wait for auto-deploy from GitHub push
3. Wait for build to complete (~2-3 minutes)
4. Copy your deployment URL (e.g., `https://realreal-estate-crm.vercel.app`)

---

## Step 4: Set up Telegram Bot

### 4.1 Set Menu Button

1. Open Telegram and find **@BotFather**
2. Send command:
   ```
   /setmenubutton
   ```
3. Select your bot: `@zyoracrm_bot`
4. **Button text**: `Open CRM`
5. **Web App URL**: `https://your-vercel-url.vercel.app`

### 4.2 Alternative: Send Web App Link

You can also just send yourself a link:
```
https://t.me/zyoracrm_bot/app?startapp=https://your-vercel-url.vercel.app
```

---

## Step 5: Test!

1. Open your bot in Telegram: https://t.me/zyoracrm_bot
2. Click the menu button or web app link
3. You should see the login page
4. App will auto-authenticate using Telegram data
5. You'll be redirected to the home page with your name!

---

## 🐛 Troubleshooting

### Build fails on Vercel
- Check build logs
- Make sure `pnpm-lock.yaml` is committed
- Verify root directory is set to `apps/miniapp`

### Auth fails
- Check Vercel logs (Functions tab)
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Make sure `JWT_SECRET` is set

### Database errors
- Verify Supabase keys are correct
- Check if tables exist in Supabase dashboard
- Run integration tables migration (0003_add_integration_tables.sql)

---

## 📊 What You'll See

After successful authentication:
- ✅ Home page with "Welcome, [Your Name]!"
- ✅ Your role and company count
- ✅ Bottom navigation (Leads, Properties, Deals, etc.)
- ✅ Logout button

**Screenshots coming after first deploy!** 📸
