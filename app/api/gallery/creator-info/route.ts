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

    if (!userInfo) {
      console.log('❌ No user found for wallet:', walletAddress);
      return NextResponse.json({
        fid: null,
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        pfp: `https://picsum.photos/32/32?random=${walletAddress.slice(2, 8)}`,
        wallet: walletAddress,
      });
    }

    console.log('✅ Found user info:', userInfo);

    return NextResponse.json({
      fid: userInfo.fid,
      username: userInfo.username || userInfo.display_name || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      pfp: userInfo.pfp_url || `https://picsum.photos/32/32?random=${walletAddress.slice(2, 8)}`,
      wallet: walletAddress,
    });
  } catch (error) {
    console.error('Error fetching creator info:', error);
    return NextResponse.json({ error: 'Failed to fetch creator info' }, { status: 500 });
  }
} 