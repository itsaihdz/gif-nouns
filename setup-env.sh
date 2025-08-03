#!/bin/bash

echo "🚀 Setting up environment variables for Nouns Remix Studio"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

echo "📝 Creating .env.local file..."

# Create .env.local with template
cat > .env.local << 'EOF'
# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Neynar API Key (for Farcaster integration)
# Get from https://neynar.com/
NEYNAR_API_KEY=your-neynar-api-key-here

# OnchainKit API Key (for wallet connections)
# Get from https://onchainkit.com/
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key-here

# Optional: WalletConnect Project ID
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Optional: Analytics
NEXT_PUBLIC_GA_ID=

# Optional: Icon URL for Mini App
NEXT_PUBLIC_ICON_URL=https://gif-nouns.vercel.app/icon.png
EOF

echo "✅ .env.local created successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Update the values in .env.local with your actual API keys"
echo "2. For Supabase: Go to https://supabase.com/dashboard and create a new project"
echo "3. For Neynar: Go to https://neynar.com/ and get your API key"
echo "4. For OnchainKit: Go to https://onchainkit.com/ and get your API key"
echo ""
echo "📚 For detailed setup instructions, see SUPABASE_SETUP.md"
echo ""
echo "🚀 Run 'npm run dev' to start the development server" 