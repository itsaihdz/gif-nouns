#!/bin/bash

echo "🚀 Supabase Setup for GIF Nouns"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    touch .env.local
fi

echo "🔑 Please provide your Supabase credentials:"
echo ""

# Get Supabase URL
read -p "Enter your Supabase URL (https://zidivolizgoabfdkuybi.supabase.co): " supabase_url
supabase_url=${supabase_url:-"https://zidivolizgoabfdkuybi.supabase.co"}

# Get Supabase Key
read -p "Enter your Supabase anon key: " supabase_key

if [ -z "$supabase_key" ]; then
    echo "❌ Supabase key is required!"
    exit 1
fi

echo ""
echo "📝 Updating .env.local file..."

# Update .env.local with Supabase credentials
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_key
SUPABASE_KEY=$supabase_key

# Neynar API
NEYNAR_API_KEY=D12CCE20-5A93-415F-A164-9F9A2598E952

# Other configurations
NEXT_PUBLIC_APP_URL=https://gifnouns.freezerserve.com
EOF

echo "✅ Environment variables updated!"
echo ""

echo "🔗 Testing Supabase connection..."
node test-supabase.js

echo ""
echo "📋 Next steps:"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "2. Navigate to your project: $supabase_url"
echo "3. Go to SQL Editor"
echo "4. Copy and paste the contents of supabase-schema.sql"
echo "5. Run the SQL to create the database tables"
echo "6. Test the connection again with: node test-supabase.js"
echo ""
echo "🎉 Once the database is set up, your app will save user creations permanently!" 