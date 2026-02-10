# Google OAuth Setup Guide

## Quick Start

You now have Google OAuth sign-in implemented! To make it work, you need to get credentials from Google Cloud Console.

## Step-by-Step Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
   - Click "Select a project" → "New Project"
   - Name it (e.g., "GameOn Co")
   - Click "Create"

### 2. Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for "Google+ API"
3. Click on it and press **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "GameOn Co"
   - User support email: your email
   - Developer contact: your email
4. Click **"Save and Continue"**
5. Skip "Scopes" (click **"Save and Continue"**)
6. Add test users (your email) if in testing mode
7. Click **Project ID**

### 4. Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Select Application type: **"Web application"**
4. Name it: "GameOn Co Web App"
5. Add **Authorized redirect URIs**:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For port 3001 (if 3000 is taken): `http://localhost:3001/api/auth/callback/google`
   - For production (later): `https://your-domain.vercel.app/api/auth/callback/google`
6. Click **"Create"**

### 5. Copy Credentials

You'll see a dialog with:

- **Client ID**: Looks like `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-abc123xyz789`

**Keep these safe!** You need them in the next step.

### 6. Add Credentials to Your App

1. Open the file `.env.local` in your project root
2. Find the Google OAuth section (should be at the bottom)
3. Replace the placeholder values:

```env
# Google OAuth
GOOGLE_CLIENT_ID="paste-your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-actual-client-secret-here"
```

4. Save the file
5. Restart your dev server (stop with Ctrl+C and run `npm run dev` again)

### 7. Test It Out!

1. Go to `http://localhost:3000/login` (or 3001 if that's your port)
2. Click **"Sign in with Google"**
3. Select your Google account
4. Grant permissions
5. You should be redirected back and logged in! 🎉

## Troubleshooting

### Error: "redirect_uri_mismatch"

- Make sure the redirect URI in Google Console exactly matches your local URL
- Check if you're on port 3000 or 3001
- Add both ports to be safe: `http://localhost:3000/api/auth/callback/google` AND `http://localhost:3001/api/auth/callback/google`

### Error: "Invalid client"

- Double-check you copied the Client ID and Secret correctly
- Make sure there are no extra spaces
- Restart your dev server after updating `.env.local`

### Can't see the button

- The button should appear below the login form with an "Or continue with" divider
- Try refreshing the page
- Check browser console for errors

## For Production (Vercel)

When deploying to Vercel:

1. Add the environment variables in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Add production redirect URI in Google Console:
   - `https://your-domain.vercel.app/api/auth/callback/google`
3. Redeploy your app

## Security Notes

- **Never commit** `.env.local` to git (it's already in .gitignore)
- Keep your Client Secret private
- For production, use environment variables in Vercel/hosting platform
- Rotate credentials if compromised

## What Was Implemented

✅ Google OAuth provider integrated with NextAuth  
✅ Database tables for OAuth (Account, Session, VerificationToken)  
✅ "Sign in with Google" button on login page  
✅ Automatic account linking and session management  
✅ Support for both email/password and Google sign-in

## Next Steps

Once you add the credentials and test:

- Users can sign in with Google OR email/password
- New Google users will need to complete onboarding (select role, sports preferences)
- Google profile pictures will be automatically used
- Email is pre-verified for Google users
