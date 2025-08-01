import { NextRequest, NextResponse } from 'next/server';
import { testNeynarConnection, getUserByFid, getUserByUsername } from '../../../../lib/neynar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');
    
    if (test === 'connection') {
      // Test API connection
      const result = await testNeynarConnection();
      return NextResponse.json(result);
    }
    
    if (test === 'user') {
      const fid = searchParams.get('fid');
      const username = searchParams.get('username');
      
      if (fid) {
        const user = await getUserByFid(parseInt(fid));
        return NextResponse.json({ success: true, user });
      }
      
      if (username) {
        const user = await getUserByUsername(username);
        return NextResponse.json({ success: true, user });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Neynar test endpoint',
      availableTests: ['connection', 'user'],
      usage: {
        connection: '/api/test/neynar?test=connection',
        user: '/api/test/neynar?test=user&fid=12345'
      }
    });
    
  } catch (error) {
    console.error('Neynar test error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
} 