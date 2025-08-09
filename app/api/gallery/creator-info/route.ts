import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletAddress } from '../../../../lib/neynar';

// Simple in-memory cache to reduce API calls
const cache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    // Check cache first
    const cached = cache.get(walletAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('💾 Using cached creator info for:', walletAddress);
      return NextResponse.json(cached.data);
    }

    console.log('🔄 Fetching creator info for wallet:', walletAddress);

    try {
      // Try to fetch user info from Neynar with error handling
      const userInfo = await getUserByWalletAddress(walletAddress);

      if (userInfo && userInfo.user) {
        console.log('✅ Found user info:', userInfo.user);
        
        const result = {
          fid: userInfo.user.fid,
          username: userInfo.user.username || userInfo.user.displayName || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
          wallet: walletAddress,
        };

        // Cache successful result
        cache.set(walletAddress, { data: result, timestamp: Date.now() });
        return NextResponse.json(result);
      }
    } catch (neynarError) {
      console.log('⚠️ Neynar API error (using fallback):', neynarError);
      // Continue to fallback instead of failing
    }

    // Fallback response when Neynar fails or returns no data
    console.log('🔄 Using fallback for wallet:', walletAddress);
    const fallbackResult = {
      fid: 0,
      username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      displayName: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      followerCount: 0,
      followingCount: 0,
      verifiedAddresses: [walletAddress],
    };

    // Cache fallback result for shorter time
    cache.set(walletAddress, { data: fallbackResult, timestamp: Date.now() });
    return NextResponse.json(fallbackResult);

  } catch (error) {
    console.error('Error fetching creator info:', error);
    return NextResponse.json({ error: 'Failed to fetch creator info' }, { status: 500 });
  }
} 