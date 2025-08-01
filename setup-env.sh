#!/bin/bash

echo "🚀 Setting up Supabase Environment Variables"
echo "=============================================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

echo ""
echo "📝 Please enter your Supabase credentials:"
echo ""

# Get Supabase URL
read -p "Enter your Supabase Project URL (e.g., https://xxx.supabase.co): " SUPABASE_URL

# Get Supabase Anon Key
read -p "Enter your Supabase Anon Key (starts with eyJ...): " SUPABASE_ANON_KEY

# Get Supabase Service Role Key (optional)
read -p "Enter your Supabase Service Role Key (optional, starts with eyJ...): " SUPABASE_SERVICE_ROLE_KEY

echo ""
echo "📄 Creating .env.local file..."

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}

# Other environment variables
NEXT_PUBLIC_APP_URL=https://gif-nouns.vercel.app
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Copy the content of supabase-schema.sql to your Supabase SQL Editor"
echo "2. Run the SQL commands to create your database schema"
echo "3. Restart your development server: npm run dev"
echo ""
echo "📚 For detailed instructions, see SUPABASE_SETUP.md" 