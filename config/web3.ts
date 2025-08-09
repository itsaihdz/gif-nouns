// Web3 Configuration for GifNouns
export const web3Config = {
  // MiniKit Configuration
  onchainKit: {
    apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || "",
    projectName: "GifNouns",
    iconUrl: process.env.NEXT_PUBLIC_ICON_URL || "/icon.png",
  },

  // WalletConnect Configuration
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  },

  // Base Network Configuration
  base: {
    chainId: 8453,
    rpcUrl: "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    name: "Base",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },

  // Contract Addresses (replace with actual deployed contracts)
  contracts: {
    nftContract: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    remixContract: process.env.NEXT_PUBLIC_REMIX_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  },

  // Farcaster Configuration
  farcaster: {
    network: process.env.NEXT_PUBLIC_FARCASTER_NETWORK || "mainnet",
    developerMnemonic: process.env.NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC || "",
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_URL || "https://nouns-remix-studio.vercel.app",
    heroImage: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "/hero.png",
    splashImage: process.env.NEXT_PUBLIC_SPLASH_IMAGE || "/splash.png",
    splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#8B5CF6",
  },

  // Gas Configuration
  gas: {
    mintPrice: "0.01", // ETH
    remixPrice: "0.005", // ETH
    maxGasLimit: 500000,
  },
};

// Error messages for wallet connection
export const walletErrors = {
  CONNECTION_FAILED: "Failed to connect wallet. Please try again.",
  NETWORK_UNSUPPORTED: "Please switch to Base network to use this app.",
  INSUFFICIENT_BALANCE: "Insufficient balance for transaction.",
  USER_REJECTED: "Transaction was rejected by user.",
  UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
};

// Transaction status messages
export const transactionMessages = {
  CONFIRMING: "Confirming transaction...",
  PROCESSING: "Transaction confirmed! Processing...",
  SUCCESS: "Transaction successful!",
  FAILED: "Transaction failed. Please try again.",
  PENDING: "Transaction pending...",
}; 