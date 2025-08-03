import { NextResponse } from 'next/server';
import { testIPFSConnection } from '../../../../lib/ipfs';

export async function GET() {
  try {
    const result = await testIPFSConnection();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing IPFS connection:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test IPFS connection'
    });
  }
} 