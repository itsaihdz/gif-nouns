#!/bin/bash

echo "🚀 Supabase Configuration Setup"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "✅ Created .env.local from env.example"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔧 Next Steps:"
echo "=============="
echo ""
echo "1. 📊 Create a Supabase project:"
echo "   - Go to https://supabase.com"
echo "   - Click 'New Project'"
echo "   - Name it 'nouns-remix-studio'"
echo "   - Choose your region"
echo "   - Set a strong database password"
echo ""
echo "2. 🔑 Get your Supabase credentials:"
echo "   - Go to Settings → API in your Supabase dashboard"
echo "   - Copy the Project URL and keys"
echo ""
echo "3. 📝 Update .env.local with your credentials:"
echo "   - Replace 'your-project-url.supabase.co' with your actual URL"
echo "   - Replace 'your-anon-key-here' with your anon key"
echo "   - Replace 'your-service-role-key-here' with your service role key"
echo ""
echo "4. 🗄️ Set up the database schema:"
echo "   - Go to SQL Editor in your Supabase dashboard"
echo "   - Copy the content from supabase-schema.sql"
echo "   - Paste and run it"
echo ""
echo "5. 🌐 For Vercel deployment:"
echo "   - Go to your Vercel project settings"
echo "   - Add these environment variables:"
echo "     * NEXT_PUBLIC_SUPABASE_URL"
echo "     * NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "     * SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "6. 🧪 Test the setup:"
echo "   - Run: npm run dev"
echo "   - Check if the gallery loads real data"
echo ""

echo "📋 Current .env.local structure:"
echo "================================"
if [ -f .env.local ]; then
    grep -E "SUPABASE|NEXT_PUBLIC" .env.local || echo "No Supabase variables found yet"
else
    echo "❌ .env.local not found"
fi

echo ""
echo "🎯 Ready to configure Supabase!" 