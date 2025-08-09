import { NextRequest, NextResponse } from 'next/server';
import { getUserByWalletAddress, testNeynarConnection } from '../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    console.log('🧪 Testing Neynar API...');

    // Test 1: Basic API connection
    const connectionTest = await testNeynarConnection();
    console.log('🔗 Connection test result:', connectionTest);

    // Test 2: Wallet address lookup (if provided)
    let walletTest = null;
    if (walletAddress) {
      console.log('🔍 Testing wallet address lookup:', walletAddress);
      walletTest = await getUserByWalletAddress(walletAddress);
      console.log('👤 Wallet lookup result:', walletTest);
    }

    return NextResponse.json({
      success: true,
      connectionTest,
      walletTest,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Neynar API test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 