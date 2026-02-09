# Production Database Setup for Vercel

## 🚨 CRITICAL: You Must Set Environment Variables in Vercel

Your production deployment **REQUIRES** these environment variables to be set in Vercel Dashboard.

---

## Step 1: Choose Your Database Provider

### Option A: Supabase (Recommended - Easy Setup)

1. Go to [supabase.com](https://supabase.com) → Create Project
2. Settings → Database → Connection string
3. **IMPORTANT**: Use "**Connection pooling**" mode

```bash
# ✅ CORRECT (Connection pooling - port 6543)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# ❌ WRONG (Direct connection - port 5432)
# Do NOT use this in Vercel!
```

### Option B: Neon (Good Free Tier)

1. Go to [neon.tech](https://neon.tech) → Create Project
2. Dashboard → Connection Details
3. Copy "**Pooled connection**" string

```bash
DATABASE_URL="postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require"
```

### Option C: Vercel Postgres (Easiest Integration)

1. Vercel Dashboard → Storage → Create Database → Postgres
2. Automatically adds `DATABASE_URL` and `POSTGRES_URL` for you

---

## Step 2: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Required Variables

```bash
# 1. Database (from above)
DATABASE_URL="postgresql://..."

# 2. Optional: Direct URL for migrations
# Only needed if your provider  gives separate URLs
DIRECT_URL="postgresql://..."

# 3. NextAuth Secret
NEXTAUTH_SECRET="Z61fiyFH/DADG/Q1Fg7e0BBLJMOYX2FKzlvorVik4Uw="

# 4. App URLs (update with your actual Vercel URL)
NEXTAUTH_URL="https://your-app-name.vercel.app"
APP_URL="https://your-app-name.vercel.app"

# 5. Node environment
NODE_ENV="production"
```

**Apply to:** Production, Preview, Development ✅ (check all)

---

## Step 3: Run Database Migrations

### Method 1: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Set environment variable locally for migration
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Method 2: Automatic on Build

Your `package.json` already has:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

This runs migrations automatically on every deployment.

---

## Step 4: Redeploy

After setting environment variables:

1. Go to Vercel Dashboard → Deployments
2. Click "..." on latest deployment → Redeploy
3. **Or** push a new commit to trigger deployment

---

## Troubleshooting

### Error: "Unable to connect to database"

**Check:**

1. DATABASE_URL is set in Vercel environment variables
2. You're using the **pooled** connection string (not direct)
3. For Supabase: Port is **6543** (not 5432)
4. Database allows connections from Vercel IPs

### Error: "DATABASE_URL environment variable is not set"

**Solution:**

- Go to Vercel Dashboard → Settings → Environment Variables
- Add DATABASE_URL
- Redeploy

### Error: Production using localhost

**Solution:**

- DATABASE_URL in Vercel must point to cloud database
- Never use `localhost` or `127.0.0.1` in production

### Build Succeeds but Signup Fails

**Check Vercel Function Logs:**

1. Vercel Dashboard → Functions
2. Click on `/api/register`
3. View logs for error details

**Common issues:**

- DATABASE_URL not set → Add it
- Using direct connection instead of pooled → Use pooled URL
- Database credentials incorrect → Verify password

---

## Verification Checklist

- [ ] Database created (Supabase/Neon/Vercel Postgres)
- [ ] DATABASE_URL added to Vercel environment variables
- [ ] NEXTAUTH_SECRET added to Vercel
- [ ] NEXTAUTH_URL and APP_URL set to actual Vercel URL
- [ ] Using **pooled** connection string (contains `pgbouncer` or `pooler`)
- [ ] Migrations run (either manually or via build script)
- [ ] Redeployed after adding environment variables
- [ ] Tested signup on production URL

---

## Quick Reference: Connection String Formats

**Supabase (Pooled):**

```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Neon (Pooled):**

```
postgresql://[user]:[password]@ep-xxx-xxx.region.neon.tech/[db]?sslmode=require
```

**Vercel Postgres:**

```
postgres://default:[password]@[host]-pooler.region.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15
```

---

## Need Help?

1. **Check Vercel Logs**: Dashboard → Functions → `/api/register` → Logs
2. **Test Connection**: The app now logs connection diagnostics on startup
3. **Database Provider Docs**:
   - [Supabase + Vercel](https://supabase.com/docs/guides/integrations/vercel)
   - [Neon + Vercel](https://neon.tech/docs/guides/vercel)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

## What Changed

✅ Optimized Prisma for Vercel serverless  
✅ Added connection pooling support  
✅ Enhanced production diagnostics  
✅ Better error messages with troubleshooting tips  
✅ Automatic connection validation  
✅ Clear logging of DATABASE_URL presence (not value)
