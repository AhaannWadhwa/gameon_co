# Google OAuth Configuration

## Current Status

❌ **Google OAuth is NOT WORKING** - Credentials are missing

The environment file `.env.local` contains placeholder values that prevent Google sign-in from functioning:

```env
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

## What You Need to Do

### Step 1: Get Google Credentials

Follow the comprehensive guide in [`GOOGLE_OAUTH_SETUP.md`](file:///Users/rhythmshokeen/Desktop/gameon_co/GOOGLE_OAUTH_SETUP.md) which provides step-by-step instructions for:

1. Creating a Google Cloud project
2. Enabling Google+ API
3. Configuring OAuth consent screen
4. Creating OAuth 2.0 Client credentials
5. Adding authorized redirect URIs

### Step 2: Update Environment Variables

Once you have your credentials from Google Cloud Console:

1. Open `.env.local` in your project root
2. Replace the placeholder values:

```env
# Google OAuth
GOOGLE_CLIENT_ID="<your-actual-client-id>.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-<your-actual-secret>"
```

3. Save the file
4. Restart the development server:

```bash
npm run dev
```

### Step 3: Test Google Sign-In

1. Navigate to `http://localhost:3000/login`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authentication, you'll be redirected back to the dashboard

## Technical Details

### NextAuth Configuration

The NextAuth configuration is already properly set up in [`route.ts`](file:///Users/rhythmshokeen/Desktop/gameon_co/src/app/api/auth/[...nextauth]/route.ts):

- ✅ Google Provider configured (lines 15-25)
- ✅ Proper authorization parameters (consent prompt, offline access)
- ✅ Callback handling for new Google users
- ✅ JWT and session management

### Redirect URIs

Make sure to add these authorized redirect URIs in Google Cloud Console:

- Development: `http://localhost:3000/api/auth/callback/google`
- Alternative port: `http://localhost:3001/api/auth/callback/google`
- Production (when deployed): `https://your-domain.com/api/auth/callback/google`

## Common Issues

### "redirect_uri_mismatch" Error

- Check that the redirect URI in Google Console exactly matches your local URL
- Verify you're using the correct port (3000 or 3001)
- Wait a few minutes after updating URIs in Google Console

### "Invalid client" Error

- Double-check the Client ID and Secret are copied correctly
- Ensure there are no extra spaces or quotes
- Restart the dev server after updating `.env.local`

### Sign-In Button Does Nothing

- Check browser console for errors
- Verify credentials are not the placeholder values
- Ensure the dev server has been restarted after environment changes

## Security Reminders

- ✅ `.env.local` is already in `.gitignore` - credentials won't be committed
- ⚠️ Never commit credentials to version control
- 🔒 Keep your Client Secret private
- 🔄 Rotate credentials immediately if compromised
