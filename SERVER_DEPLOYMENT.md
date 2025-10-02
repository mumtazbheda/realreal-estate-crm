# 🚀 Linux Server Deployment Guide

This guide will help you deploy the RealReal Estate CRM to your Linux server.

## Prerequisites

- Linux server (Ubuntu 20.04+ recommended)
- Domain name pointed to your server
- Root or sudo access

## Step 1: Prepare Your Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (required for Next.js)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Upload Your Code

From your laptop, copy the entire project to your server:

```bash
# Option 1: Using rsync
rsync -avz --exclude 'node_modules' --exclude '.next' \
  /Users/mumtazahmed/realreal-estate-crm/ \
  user@your-server-ip:/var/www/realreal-estate-crm/

# Option 2: Using Git (recommended)
# On server:
cd /var/www
git clone https://github.com/mumtazbheda/realreal-estate-crm.git
cd realreal-estate-crm
```

## Step 3: Configure Environment Variables

On your server:

```bash
cd /var/www/realreal-estate-crm/apps/miniapp

# Create .env.local file
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://basrflycubhhgggqvogw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3JmbHljdWJoaGdnZ3F2b2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODUzODIsImV4cCI6MjA3MTI2MTM4Mn0.YOKsEc0Z1dbDEcMGdhadntoaIa06k-67OkbD409dS1c
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc3JmbHljdWJoaGdnZ3F2b2d3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTY4NTM4MiwiZXhwIjoyMDcxMjYxMzgyfQ.C3_UQqe3LXG2LskN3Yw9Y4jryYWAZr0G_-ZYrVVB_KA

# JWT Secret
JWT_SECRET=rDsWWTxq+U3vKzJ2OLbCd6S9cgFHY6mDmzhcAfgzUx/gyexxMGAaUXprOLd0jDI0GF8HJ4I5JpAOBrEKKG1TBQ==

# Telegram Bot
TELEGRAM_BOT_TOKEN=8055786666:AAFFpppmgr_KNjVVv5wGUUKvTG7UhGGktQQ
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=zyoracrm_bot

# Production URL (update with your domain)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF
```

## Step 4: Install Dependencies and Build

```bash
cd /var/www/realreal-estate-crm

# Install all dependencies
pnpm install

# Build the production version
pnpm run build
```

## Step 5: Set Up PM2

Create PM2 ecosystem file:

```bash
cd /var/www/realreal-estate-crm/apps/miniapp

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'realreal-crm',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/realreal-estate-crm/apps/miniapp',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions printed by the above command
```

## Step 6: Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/realreal-crm

# Add this configuration (replace yourdomain.com):
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/realreal-crm /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

```bash
# Get SSL certificate (replace yourdomain.com)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure SSL and redirect HTTP to HTTPS
```

## Step 8: Configure Telegram Bot

Now that your app is deployed:

1. Open Telegram and find **@BotFather**
2. Send: `/setmenubutton`
3. Select your bot: `@zyoracrm_bot`
4. Enter button text: `Open CRM`
5. Enter Web App URL: `https://yourdomain.com`

## Step 9: Test!

1. Open your bot in Telegram: https://t.me/zyoracrm_bot
2. Click the menu button
3. You should see the login page
4. App will auto-authenticate using Telegram data
5. You'll be redirected to the home page!

---

## Useful PM2 Commands

```bash
# View logs
pm2 logs realreal-crm

# Restart app
pm2 restart realreal-crm

# Stop app
pm2 stop realreal-crm

# View status
pm2 status

# Monitor
pm2 monit
```

## Updating Your App

When you make changes:

```bash
cd /var/www/realreal-estate-crm

# Pull latest code (if using Git)
git pull origin main

# Reinstall dependencies (if package.json changed)
pnpm install

# Rebuild
pnpm run build

# Restart PM2
pm2 restart realreal-crm
```

## Troubleshooting

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Restart PM2
pm2 restart realreal-crm
```

### Build fails
```bash
# Clear build cache
cd apps/miniapp
rm -rf .next node_modules
cd ../..
pnpm install
pnpm run build
```

### Nginx errors
```bash
# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🎉 Done!

Your app is now running on your Linux server at `https://yourdomain.com` and accessible via Telegram!
