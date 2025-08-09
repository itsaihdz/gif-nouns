# 🚀 Complete Supabase Setup Guide

## 📋 Overview
This guide will help you set up Supabase for your GifNouns app. Supabase will handle:
- ✅ Gallery items storage
- ✅ User voting system
- ✅ User profiles
- ✅ Real-time updates

## 🔧 Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign in or create an account**
3. **Click "New Project"**
4. **Fill in project details:**
   - **Name:** `nouns-remix-studio`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to your users
5. **Click "Create new project"**
6. **Wait for setup to complete (2-3 minutes)**

## 🔑 Step 2: Get Your Credentials

1. **In your Supabase dashboard, go to Settings → API**
2. **Copy these values:**
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`)

## 📝 Step 3: Configure Environment Variables

### For Local Development:
1. **Open your `.env.local` file**
2. **Add these lines:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```
3. **Replace the placeholder values with your actual credentials**

### For Vercel Deployment:
1. **Go to your Vercel project dashboard**
2. **Navigate to Settings → Environment Variables**
3. **Add these variables:**
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your service role key

## 🗄️ Step 4: Set Up Database Schema

1. **In your Supabase dashboard, go to SQL Editor**
2. **Click "New query"**
3. **Copy the entire content from `supabase-schema.sql`**
4. **Paste it into the SQL Editor**
5. **Click "Run" to execute the schema**

This will create:
- ✅ `users` table (for Farcaster users)
- ✅ `gallery_items` table (for animated Nouns)
- ✅ `votes` table (for voting system)
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Sample data

## 🧪 Step 5: Test Your Setup

### Test Locally:
```bash
# Test Supabase connection
node test-supabase-connection.js

# Start development server
npm run dev
```

### Expected Results:
- ✅ Connection test should show "All tests passed!"
- ✅ Gallery should load real data instead of mock data
- ✅ Voting should work properly
- ✅ No more "fetch failed" errors

## 🔒 Step 6: Verify Row Level Security

The schema includes RLS policies, but verify they're working:

1. **Go to Authentication → Policies**
2. **Check that these policies exist:**
   - Users: Public read, authenticated insert/update
   - Gallery items: Public read, authenticated insert/update
   - Votes: Public read, authenticated insert/delete

## 🚨 Troubleshooting

### Common Issues:

1. **"fetch failed" errors:**
   - ✅ Check your environment variables
   - ✅ Ensure Supabase project is active
   - ✅ Verify URL and keys are correct

2. **"column votes.vote_type does not exist":**
   - ✅ Run the schema from `supabase-schema.sql`
   - ✅ The schema includes the correct `vote_type` column

3. **"relation gallery_items does not exist":**
   - ✅ Run the schema from `supabase-schema.sql`
   - ✅ Check if the SQL executed successfully

4. **Environment variables not working:**
   - ✅ Restart your development server after updating `.env.local`
   - ✅ Check for typos in variable names
   - ✅ Ensure no spaces around `=` in `.env.local`

### Testing Commands:
```bash
# Test Supabase connection
node test-supabase-connection.js

# Check environment variables
grep SUPABASE .env.local

# Test API endpoints
curl http://localhost:3000/api/gallery
```

## 🎯 Success Indicators

When Supabase is properly configured, you should see:

1. **✅ No "fetch failed" errors in console**
2. **✅ Gallery loads real data from database**
3. **✅ Voting system works without errors**
4. **✅ User creations are saved to database**
5. **✅ Real-time updates work (if implemented)**

## 📊 Monitoring

After setup, you can monitor your database:

1. **Go to Table Editor** in Supabase dashboard
2. **Check the tables:**
   - `gallery_items` - Your animated Nouns
   - `votes` - User votes
   - `users` - Farcaster users

## 🔄 Next Steps

Once Supabase is working:

1. **✅ Test the full user flow**
2. **✅ Verify voting works**
3. **✅ Check that creations are saved**
4. **✅ Deploy to Vercel with environment variables**
5. **✅ Monitor for any issues**

## 📞 Support

If you encounter issues:

1. **Check the troubleshooting section above**
2. **Run the test script: `node test-supabase-connection.js`**
3. **Check Supabase dashboard for errors**
4. **Verify environment variables are set correctly**

---

**🎉 You're all set! Your app now has a fully functional database backend.** 