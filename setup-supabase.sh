#!/bin/bash

echo "🚀 Setting up environment variables for gifnouns..."

# Create .env.local file
cat > .env.local << EOF
# Supabase Configuration
SUPABASE_URL=https://zidivolizgoabfdkuybi.supabase.co
SUPABASE_KEY=sbp_fb409a1fdce1df8d42cbcba5d172a59cef050ecf

# Neynar API (for Farcaster integration)
NEYNAR_API_KEY=D12CCE20-5A93-415F-A164-9F9A2598E952

# IPFS Configuration (Optional - for permanent GIF storage)
# Get this from https://www.lighthouse.storage/ (create a new API key)
# Free tier: 5GB storage, 5GB bandwidth
# Lite tier: 200GB storage, 100GB bandwidth for $10/month
LIGHTHOUSE_API_KEY=a7ed4f0a.5df477d33a9a4ef9af5228feedfd4d26

# Farcaster Mini App Configuration
NEXT_PUBLIC_APP_URL=https://gifnouns.freezerserve.com
EOF

echo "✅ Environment variables created in .env.local"
echo ""
echo "📝 Next steps:"
echo "1. Update PINATA_API_KEY if you want IPFS storage"
echo "2. Run: node test-supabase.js"
echo "3. Copy the SQL schema to your Supabase dashboard"
echo ""
echo "🔗 Get IPFS credentials from: https://app.pinata.cloud/"
echo "   - Create a new API key"
echo "   - Copy the API key"
echo "" 