# 🚀 Supabase Setup Guide for Nouns Remix Studio

## 📋 Prerequisites
- Supabase account (free tier works great!)
- Your project already has the Supabase client configured

## 🔧 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in
2. **Click "New Project"**
3. **Fill in project details:**
   - Name: `nouns-remix-studio`
   - Database Password: Choose a strong password
   - Region: Choose closest to your users
4. **Click "Create new project"**

## 🔑 Step 2: Get Your Project Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

## 🌍 Step 3: Set Environment Variables

### For Local Development:
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### For Vercel Deployment:
1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add these variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

## 🗄️ Step 4: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste the entire content** from `supabase-schema.sql`
3. **Click "Run"** to execute the schema

This will create:
- ✅ `users` table (for Farcaster users)
- ✅ `gallery_items` table (for animated Nouns)
- ✅ `votes` table (for voting system)
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Sample data

## 🔒 Step 5: Configure Row Level Security

The schema already includes RLS policies, but verify they're working:

1. **Go to Authentication → Policies**
2. **Check that these policies exist:**
   - Users: Public read, authenticated insert/update
   - Gallery items: Public read, authenticated insert/update
   - Votes: Public read, authenticated insert/delete

## 🧪 Step 6: Test the Setup

### Test Database Connection:
```bash
# Start your development server
npm run dev

# Check browser console for any Supabase errors
# The app should now use real data instead of mock data
```

### Test API Endpoints:
```bash
# Test gallery endpoint
curl https://your-domain.vercel.app/api/gallery

# Should return real data from Supabase
```

## 🔄 Step 7: Update Your Code (if needed)

Your code is already configured! The `lib/supabase.ts` file has:
- ✅ Supabase client setup
- ✅ TypeScript types
- ✅ Service layer in `lib/supabase-service.ts`

## 🚨 Troubleshooting

### Common Issues:

1. **"fetch failed" errors:**
   - Check your environment variables
   - Verify Supabase URL is correct
   - Ensure anon key is valid

2. **RLS policy errors:**
   - Go to Authentication → Policies
   - Enable RLS on all tables
   - Check policy permissions

3. **Connection timeouts:**
   - Check your region selection
   - Verify network connectivity
   - Try different regions if needed

### Debug Commands:
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "YOUR_SUPABASE_URL/rest/v1/gallery_items"
```

## 🎯 Next Steps

1. **✅ Database is ready** - Your app will use real data
2. **✅ Users can create gallery items** - Stored in Supabase
3. **✅ Voting system works** - Real-time updates
4. **✅ Farcaster auth** - User data persisted

## 📊 Monitor Your Database

- **Go to Table Editor** to view your data
- **Check Logs** for any errors
- **Monitor Usage** in the dashboard

Your Supabase setup is complete! 🎉 