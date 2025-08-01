# 🚀 Farcaster Mini App Implementation Plan

## 🎯 **Current Status: 70% Complete**

### ✅ **What's Working:**
- ✅ Single-page Mini App structure
- ✅ Upload and GIF generation
- ✅ Gallery with voting system
- ✅ Social sharing interface
- ✅ NFT minting interface
- ✅ Smart contract ready for deployment

### 🔄 **What Needs Implementation:**

## **1. 🔐 Farcaster Social Login**

### **Required Dependencies:**
```bash
npm install @neynar/nodejs-sdk @farcaster/hub-web
```

### **Implementation Steps:**

#### **A. Set up Neynar API**
```typescript
// lib/neynar.ts
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
export { neynar };
```

#### **B. Create Farcaster Sign-in**
```typescript
// app/components/auth/FarcasterSignIn.tsx
import { useSignIn } from '@farcaster/hub-web';

export function FarcasterSignIn() {
  const { signIn, isPending, error } = useSignIn();
  
  const handleSignIn = async () => {
    await signIn();
  };
  
  return (
    <Button onClick={handleSignIn} disabled={isPending}>
      {isPending ? "Connecting..." : "Connect with Farcaster"}
    </Button>
  );
}
```

#### **C. User Context Provider**
```typescript
// app/contexts/UserContext.tsx
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Handle Farcaster authentication
  // Store user data in localStorage
  // Provide user data to all components
}
```

### **Environment Variables:**
```env
NEYNAR_API_KEY=your_neynar_api_key
FARCASTER_APP_ID=your_farcaster_app_id
```

---

## **2. 🏆 Real Gallery Database**

### **Option A: Supabase (Recommended)**
```bash
npm install @supabase/supabase-js
```

#### **Database Schema:**
```sql
-- gallery_items table
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gif_url TEXT NOT NULL,
  creator_fid INTEGER NOT NULL,
  creator_username TEXT NOT NULL,
  creator_pfp TEXT NOT NULL,
  title TEXT NOT NULL,
  noggle_color TEXT NOT NULL,
  eye_animation TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES gallery_items(id),
  voter_fid INTEGER NOT NULL,
  voter_username TEXT NOT NULL,
  voter_pfp TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(item_id, voter_fid)
);
```

#### **Supabase Client:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export { supabase };
```

### **Option B: PostgreSQL with Prisma**
```bash
npm install @prisma/client prisma
npx prisma init
```

---

## **3. 🏆 NFT Minting Integration**

### **A. Deploy Smart Contract**
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to Base
npx hardhat run scripts/deploy.js --network base
```

### **B. Contract Integration**
```typescript
// lib/contract.ts
import { ethers } from 'ethers';
import AnimatedNounsNFT from '../contracts/AnimatedNounsNFT.sol';

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const contractABI = AnimatedNounsNFT.abi;

export async function mintNFT(gifUrl: string, title: string, noggleColor: string, eyeAnimation: string) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
  const mintPrice = ethers.parseEther("0.01");
  
  const tx = await contract.mintAnimatedNoun(
    gifUrl,
    noggleColor,
    eyeAnimation,
    title,
    { value: mintPrice }
  );
  
  const receipt = await tx.wait();
  return receipt;
}
```

### **C. Wallet Integration**
```typescript
// lib/wallet.ts
import { getAccount, getNetwork, switchNetwork } from '@wagmi/core';
import { base } from 'wagmi/chains';

export async function ensureBaseNetwork() {
  const { chain } = getNetwork();
  
  if (chain?.id !== base.id) {
    await switchNetwork({ chainId: base.id });
  }
}
```

---

## **4. 🎨 GIF Storage & CDN**

### **Option A: IPFS (Recommended)**
```bash
npm install ipfs-http-client
```

```typescript
// lib/ipfs.ts
import { create } from 'ipfs-http-client';

const ipfs = create({ url: 'https://ipfs.infura.io:5001/api/v0' });

export async function uploadToIPFS(file: File) {
  const result = await ipfs.add(file);
  return `ipfs://${result.path}`;
}
```

### **Option B: Cloudinary**
```bash
npm install cloudinary
```

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'nouns-remix-studio');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url;
}
```

---

## **5. 🔄 Real-time Updates**

### **A. WebSocket Integration**
```typescript
// lib/websocket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);

export function subscribeToGalleryUpdates(callback: (data: any) => void) {
  socket.on('gallery-update', callback);
  
  return () => {
    socket.off('gallery-update', callback);
  };
}
```

### **B. Server-Sent Events**
```typescript
// app/api/gallery/stream/route.ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      // Send real-time updates
      setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ type: 'update' })}\n\n`);
      }, 5000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## **6. 📱 Farcaster Mini App Integration**

### **A. Mini App Manifest**
```json
// public/manifest.json
{
  "name": "Nouns Remix Studio",
  "description": "Create animated Nouns and discover community creations",
  "icon": "/icon.png",
  "splash": "/splash.png",
  "url": "https://your-domain.com",
  "permissions": ["farcaster", "ethereum"]
}
```

### **B. Farcaster SDK Integration**
```typescript
// lib/farcaster.ts
import { FarcasterProvider } from '@farcaster/hub-web';

export function FarcasterWrapper({ children }) {
  return (
    <FarcasterProvider>
      {children}
    </FarcasterProvider>
  );
}
```

---

## **7. 🚀 Deployment Checklist**

### **A. Environment Variables**
```env
# Farcaster
NEYNAR_API_KEY=your_key
FARCASTER_APP_ID=your_app_id

# Database
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Storage
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# WebSocket
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-domain.com
```

### **B. Vercel Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEYNAR_API_KEY
vercel env add FARCASTER_APP_ID
# ... etc
```

### **C. Smart Contract Deployment**
```bash
# Deploy to Base
npx hardhat run scripts/deploy.js --network base

# Verify contract
npx hardhat verify --network base CONTRACT_ADDRESS "Animated Nouns" "ANIM" "https://your-domain.com/metadata/"
```

---

## **8. 🧪 Testing Strategy**

### **A. Unit Tests**
```bash
npm install --save-dev jest @testing-library/react
```

### **B. Integration Tests**
```bash
npm install --save-dev playwright
```

### **C. Smart Contract Tests**
```bash
npx hardhat test
```

---

## **🎯 Priority Order:**

1. **🔐 Farcaster Social Login** (High Priority)
2. **🏆 Real Gallery Database** (High Priority)
3. **🏆 NFT Minting Integration** (Medium Priority)
4. **🎨 GIF Storage & CDN** (Medium Priority)
5. **🔄 Real-time Updates** (Low Priority)
6. **📱 Mini App Integration** (Low Priority)

---

## **💰 Estimated Timeline:**

- **Week 1**: Farcaster login + Database setup
- **Week 2**: NFT minting + Smart contract deployment
- **Week 3**: GIF storage + Real-time updates
- **Week 4**: Testing + Deployment + Mini App submission

**Total: 4 weeks to full production**

---

## **🎉 Success Metrics:**

- ✅ Users can sign in with Farcaster
- ✅ GIFs are stored permanently
- ✅ Gallery persists data
- ✅ NFT minting works on Base
- ✅ Real-time voting updates
- ✅ Mini App discoverable on Farcaster

**Ready to implement! 🚀** 