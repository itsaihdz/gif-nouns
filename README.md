# GifNouns - Landing Page

A professional, modern landing page for the GifNouns Mini App built with Next.js 14, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Mobile-First**: Fully responsive design optimized for all devices
- **Dark Mode**: Built-in dark mode support
- **SEO Optimized**: Comprehensive meta tags and structured data
- **Performance**: Optimized for fast loading and high Lighthouse scores
- **Accessibility**: WCAG compliant with proper focus management
- **Analytics**: Vercel Analytics integration for user behavior tracking
- **MiniKit Integration**: Seamless integration with Base MiniKit
- **Farcaster Native**: Designed specifically for the Farcaster ecosystem
- **Web3 Ready**: Complete wallet connection and transaction handling
- **Base L2**: Optimized for Base network with low gas fees
- **NFT Minting**: Ready for NFT creation and remixing functionality

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom component library
- **Icons**: Custom SVG icon system
- **Animations**: CSS animations and Framer Motion
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
app/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation and wallet connection
│   │   └── Footer.tsx          # Footer with links and social
│   ├── sections/
│   │   ├── Hero.tsx           # Main hero section
│   │   ├── Features.tsx       # Feature showcase
│   │   ├── Demo.tsx           # Interactive demo with Web3
│   │   └── CTA.tsx            # Call-to-action section
│   ├── ui/
│   │   ├── Button.tsx         # Reusable button component
│   │   ├── Card.tsx           # Card component
│   │   ├── WalletConnect.tsx  # Wallet connection component
│   │   └── TransactionHandler.tsx # Web3 transaction handling
│   ├── analytics/
│   │   └── Tracking.tsx       # Analytics tracking component
│   └── icons/
│       └── index.tsx          # Icon component library
├── globals.css                # Global styles and animations
├── layout.tsx                 # Root layout with SEO
├── page.tsx                   # Main landing page
└── providers.tsx              # Web3 providers setup
lib/
└── utils.ts                   # Utility functions
config/
└── web3.ts                    # Web3 configuration
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) to Blue (#3B82F6) gradient
- **Secondary**: Gray scale with dark mode support
- **Accent**: Yellow (#FCD34D) for highlights

### Typography
- **Font**: Geist Sans
- **Headings**: Bold weights with gradient text effects
- **Body**: Regular weight with good readability

### Components
- **Buttons**: Multiple variants (primary, secondary, outline, gradient)
- **Cards**: Elevated, outlined, and gradient variants
- **Icons**: Custom SVG icon system with consistent sizing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itsaihdz/gif-nouns.git
   cd gif-nouns
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   Then edit `.env.local` with your actual values.

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Run production audit:**
   ```bash
   node scripts/audit.js
   ```

### Web3 Configuration
Before running the app, you need to configure the Web3 environment variables:

1. Create a `.env.local` file in the root directory:
```bash
# MiniKit Configuration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=GifNouns
NEXT_PUBLIC_ICON_URL=https://your-domain.com/icon.png

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# App Configuration
NEXT_PUBLIC_URL=https://nouns-remix-studio.vercel.app
NEXT_PUBLIC_APP_HERO_IMAGE=https://your-domain.com/hero.png
NEXT_PUBLIC_SPLASH_IMAGE=https://your-domain.com/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=#8B5CF6

# Contract Addresses (replace with actual deployed contracts)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_REMIX_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Farcaster Configuration
NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC=your_farcaster_developer_mnemonic_here
NEXT_PUBLIC_FARCASTER_NETWORK=mainnet
```

2. Get your API keys:
   - **OnchainKit API Key**: Sign up at [OnchainKit](https://onchainkit.com)
   - **WalletConnect Project ID**: Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nouns-remix-studio.git
cd nouns-remix-studio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Web3 Integration

### Wallet Connection
- **Multi-Wallet Support**: Connect with Base Wallet, Coinbase Wallet, and WalletConnect
- **Connection Status**: Real-time wallet connection status with address display
- **Error Handling**: Comprehensive error handling for connection failures
- **Network Detection**: Automatic Base network detection and switching

### Transaction Handling
- **NFT Minting**: Ready for NFT creation with configurable gas prices
- **Remix Functionality**: Support for remixing existing NFTs
- **Transaction Status**: Real-time transaction status updates
- **Error Recovery**: Graceful error handling and user feedback
- **Gas Optimization**: Optimized for Base L2 low gas fees (~$0.01)

### MiniKit Integration
- **Base Network**: Configured for Base mainnet
- **Frame Support**: Ready for Farcaster frame integration
- **Mini App Deployment**: Prepared for Coinbase Mini App deployment
- **Provider Setup**: Complete Wagmi and MiniKit provider configuration

### Configuration
- **Environment Variables**: Centralized configuration in `config/web3.ts`
- **Contract Addresses**: Configurable contract addresses for different environments
- **Gas Settings**: Adjustable gas prices and limits
- **Error Messages**: Customizable error messages and user feedback

## 📱 Sections Overview

### Hero Section
- Compelling headline with gradient text
- Animated Noun preview
- Social proof statistics
- Clear call-to-action buttons

### Features Section
- 6 key features with icons and descriptions
- Benefits for different user types
- Trust signals and credibility indicators

### Demo Section
- Interactive animation preview
- Color palette selector
- Animation type controls
- Real-time preview updates

### CTA Section
- Urgency with countdown timer
- Creator testimonials with earnings
- Feature list
- Multiple conversion points

## 🎯 SEO Features

- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Structured Data**: JSON-LD markup for rich snippets
- **Performance**: Optimized images and code splitting
- **Accessibility**: ARIA labels and semantic HTML
- **Mobile**: Mobile-first responsive design

## 🔧 Customization

### Colors
Update the color scheme in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
      }
    }
  }
}
```

### Content
Update content in the respective section components:
- `Hero.tsx` - Main headline and stats
- `Features.tsx` - Feature descriptions
- `Demo.tsx` - Demo content and controls
- `CTA.tsx` - Testimonials and offers

### Styling
Custom styles are in `app/globals.css`:
- Animation keyframes
- Custom utility classes
- Responsive breakpoints

## 📊 Performance

### Lighthouse Scores Target
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Optimization Techniques
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS purging with TailwindCSS
- Minimal JavaScript bundle

## 🚀 Production Deployment

### **Vercel Deployment (Recommended)**

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard

2. **Required Environment Variables:**
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_URL=https://your-domain.vercel.app
   ```

3. **Deploy:**
   ```bash
   npm run build
   npm run start
   ```

### **Pre-deployment Checklist**

- [ ] All environment variables configured
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Performance audit passes (`node scripts/audit.js`)
- [ ] Images optimized (< 100KB each)
- [ ] Bundle size acceptable (< 500KB total)
- [ ] Error boundaries implemented
- [ ] Loading states added
- [ ] SEO meta tags complete
- [ ] Responsive design tested

### **Performance Monitoring**

- **Lighthouse Score**: Target 90+ in all categories
- **Bundle Size**: Monitor with `npm run analyze`
- **Error Tracking**: Implement error boundaries
- **Analytics**: Vercel Analytics integrated for user behavior tracking
- **Custom Events**: Track wallet connections, transactions, and demo interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Base](https://base.org/) for MiniKit
- [Farcaster](https://farcaster.xyz/) for the social protocol
- [Nouns](https://nouns.wtf/) for the community
- [TailwindCSS](https://tailwindcss.com/) for the styling framework
- [Next.js](https://nextjs.org/) for the React framework

## 📞 Support

For support, email support@nounsremix.studio or join our [Discord](https://discord.gg/nounsremix).

---

Built with ❤️ for the Nouns community
