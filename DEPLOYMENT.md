# Vercel Deployment Guide for GameOn Co.

## Prerequisites

✅ Vercel CLI installed (completed)
✅ Code pushed to GitHub (completed)
⚠️ Database setup required
⚠️ Environment variables needed

---

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

This is the easiest method and provides a visual interface.

1. **Go to [vercel.com](https://vercel.com) and sign in**
   - Use GitHub to sign in for automatic repo access

2. **Click "New Project"**

3. **Import your GitHub repository**
   - Search for: `rhythmshokeen/gameon_co`
   - Click "Import"

4. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

5. **Add Environment Variables** (CRITICAL)

   Click "Environment Variables" and add these:

   ```bash
   # Database (Use Vercel Postgres, Supabase, or Neon)
   DATABASE_URL=postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1

   # NextAuth
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=<generate-new-secret>

   # App Config
   APP_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   ```

6. **Click "Deploy"**

---

### Option 2: Deploy via CLI (Interactive)

```bash
# Login to Vercel
vercel login

# Deploy (will prompt for configuration)
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - What's your project's name? gameon-co
# - In which directory is your code located? ./
# - Want to modify settings? N
```

---

## Database Setup (REQUIRED)

Your app needs a PostgreSQL database. Choose one:

### Option A: Vercel Postgres (Easiest)

1. In Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Choose a region close to your users
4. Copy the `DATABASE_URL` connection string
5. Add it to your environment variables

### Option B: Supabase (Recommended for PostgreSQL features)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection pooling" URL)
5. Format: `postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true`

### Option C: Neon (Good free tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a project
3. Copy the connection string
4. Format: `postgresql://user:password@host/database?sslmode=require`

---

## Environment Variables Setup

### Generate New NEXTAUTH_SECRET

```bash
# Run this in terminal:
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET`

### Complete Environment Variables List

Add these in Vercel Dashboard → Settings → Environment Variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true&connection_limit=1"

# NextAuth
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="<your-generated-secret>"

# App
APP_URL="https://your-app-name.vercel.app"
NODE_ENV="production"
PRISMA_CLIENT_ENGINE_TYPE="library"
```

---

## Database Migrations

After deploying, you need to run migrations:

### Option 1: Vercel CLI

```bash
# Set environment variable locally for migration
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Option 2: Add to Build Command (Automatic)

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Then redeploy.

---

## Post-Deployment Checklist

- [ ] Database is accessible from Vercel
- [ ] Environment variables are set correctly
- [ ] Prisma migrations have run successfully
- [ ] Can access the deployed URL
- [ ] Can sign up a new user
- [ ] Can log in
- [ ] Session persists across page refreshes
- [ ] Dark mode works correctly

---

## Troubleshooting

### "Can't reach database server"

**Solution:**

- Check `DATABASE_URL` includes `?pgbouncer=true&connection_limit=1`
- Verify database allows connections from Vercel IPs
- For Supabase: Use the "Connection pooling" URL, not direct

### "NEXTAUTH_SECRET missing"

**Solution:**

- Verify environment variable is set in Vercel Dashboard
- Redeploy after adding the variable

### "Module not found: Can't resolve 'prisma'"

**Solution:**

- Add `postinstall` script: `"postinstall": "prisma generate"`
- Redeploy

### Build Failures

**Solution:**

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json` (not devDependencies)
- Verify TypeScript compilation succeeds locally

---

## Quick Deploy Command

```bash
# One-command deploy (after CLI login)
vercel --prod
```

---

## Updating After Deployment

Automatic deployments are enabled by default:

1. Push to GitHub `main` branch
2. Vercel automatically deploys
3. Preview deployments for other branches

Manual deploy:

```bash
vercel --prod
```

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `APP_URL` to your custom domain

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
