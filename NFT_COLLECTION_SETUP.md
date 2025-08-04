# 🎨 GIF Nouns Collective - OnchainKit NFT Setup Guide

## Overview

This guide will help you deploy the **GIF Nouns Collective** using OnchainKit's transaction system and a custom smart contract on Base L2. This approach allows multiple users to mint unique NFTs into a single collection.

## 🚀 Step 1: Deploy the Smart Contract

### Prerequisites
- Node.js and npm installed
- Hardhat configured for Base network
- Base L2 testnet/mainnet access

### 1. Install Dependencies
```bash
npm install --save-dev hardhat @openzeppelin/contracts
```

### 2. Configure Hardhat for Base
Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 8453,
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 84532,
    },
  },
};
```

### 3. Deploy the Contract
```bash
npx hardhat run scripts/deploy.js --network base
```

Deployment script (`scripts/deploy.js`):
```javascript
const hre = require("hardhat");

async function main() {
  const AnimatedNounsNFT = await hre.ethers.getContractFactory("AnimatedNounsNFT");
  
  const contract = await AnimatedNounsNFT.deploy(
    "GIF Nouns Collective", // name
    "GIFN", // symbol
    "https://gifnouns.freezerverse.com/metadata/" // base URI
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("GIF Nouns Collective deployed to:", address);
  console.log("Contract name:", await contract.name());
  console.log("Contract symbol:", await contract.symbol());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 🔧 Step 2: Update App Configuration

### 1. Environment Variables
Add to `.env.local`:
```bash
# NFT Contract Address (Base L2)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x... # Your deployed contract address

# OnchainKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

### 2. Update Vercel Environment
```bash
vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
```

## 🎯 Step 3: Test the Integration

### 1. Local Testing
```bash
npm run dev
```

### 2. Test Minting Flow
1. Connect wallet (Base network)
2. Upload and customize a Noun GIF
3. Click "Mint NFT (0.01 ETH)"
4. Confirm transaction in wallet
5. Verify NFT appears in wallet

## 📊 Step 4: Collection Management

### Monitor Activity
- Track mints on BaseScan: `https://basescan.org/address/YOUR_CONTRACT_ADDRESS`
- View collection on marketplaces like OpenSea Base
- Monitor contract events

### Contract Functions
- **mintAnimatedNoun**: Users mint their GIFs
- **updateMintPrice**: Owner can adjust mint price
- **withdraw**: Owner can withdraw collected fees
- **totalSupply**: Get current number of minted NFTs

## 🎉 Benefits of OnchainKit Approach

✅ **Gasless Transactions**: OnchainKit covers gas fees  
✅ **Seamless UX**: Built-in transaction handling  
✅ **Multiple Mints**: Users can mint multiple NFTs  
✅ **Single Collection**: All NFTs in one contract  
✅ **Base L2**: Fast and cheap transactions  
✅ **Marketplace Ready**: Compatible with all Base marketplaces  

## 🔄 Step 5: Advanced Features

### Custom Metadata
Each NFT includes:
- GIF URL (IPFS)
- Noggle color trait
- Eye animation trait
- Collection identifier
- Creator information

### Royalties
Configure royalties on marketplaces:
- OpenSea: 5-10% creator royalties
- Other marketplaces: Similar royalty structure

### Community Features
- **Allowlist**: Add specific users for early access
- **Batch Operations**: Bulk metadata updates
- **Analytics**: Track collection growth

## 🚨 Important Notes

1. **Contract Ownership**: You own the collection contract
2. **Mint Price**: 0.01 ETH per mint (configurable)
3. **Gas Coverage**: OnchainKit handles gas fees
4. **IPFS Storage**: All GIFs stored permanently on IPFS
5. **Base Network**: All transactions on Base L2

## 📞 Support

- **OnchainKit Docs**: [https://onchainkit.xyz](https://onchainkit.xyz)
- **Base Network**: [https://base.org](https://base.org)
- **BaseScan**: [https://basescan.org](https://basescan.org)

## 🔗 Contract Verification

After deployment, verify on BaseScan:
```bash
npx hardhat verify --network base CONTRACT_ADDRESS "GIF Nouns Collective" "GIFN" "https://gifnouns.freezerverse.com/metadata/"
```

---

**Next Steps**: Deploy the contract, update environment variables, and test the minting flow! 