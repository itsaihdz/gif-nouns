import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletAddress } from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
    }

    console.log('🔄 Fetching creator info for wallet:', walletAddress);

    // Fetch user info from Neynar
    const userInfo = await getUserByWalletAddress(walletAddress);

    if (!userInfo || !userInfo.user) {
      console.log('❌ No user found for wallet:', walletAddress);
      return NextResponse.json({
        fid: null,
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        pfp: '',
        wallet: walletAddress,
      });
    }

    console.log('✅ Found user info:', userInfo.user);

    return NextResponse.json({
      fid: userInfo.user.fid,
      username: userInfo.user.username || userInfo.user.displayName || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      pfp: userInfo.user.pfp || '',
      wallet: walletAddress,
    });
  } catch (error) {
    console.error('Error fetching creator info:', error);
    return NextResponse.json({ error: 'Failed to fetch creator info' }, { status: 500 });
  }
} 