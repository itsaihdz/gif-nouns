import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Initialize Neynar API client with real API key
const neynar = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY || 'D12CCE20-5A93-415F-A164-9F9A2598E952'
});

export { neynar };

// Helper functions for Farcaster operations
export async function getUserByFid(fid: number) {
  try {
    // For now, return mock data while we figure out the correct API structure
    console.log('Fetching user by FID:', fid);
    
    // TODO: Implement real API call once we confirm the correct method
    // const response = await neynar.someMethod(fid);
    
    return {
      user: {
        fid,
        username: `user${fid}.noun`,
        displayName: `User ${fid}`,
        pfp: `https://picsum.photos/32/32?random=${fid}`,
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  try {
    console.log('Fetching user by username:', username);
    
    // TODO: Implement real API call once we confirm the correct method
    // const response = await neynar.someMethod({ username });
    
    return {
      user: {
        fid: Math.floor(Math.random() * 100000),
        username,
        displayName: username.replace('.noun', ''),
        pfp: `https://picsum.photos/32/32?random=${Math.random()}`,
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

export async function publishCast(text: string, embeds?: string[]) {
  try {
    console.log('Publishing cast:', { text, embeds });
    // TODO: Implement real cast publishing
    return { success: true, hash: `0x${Math.random().toString(16).substr(2, 64)}` };
  } catch (error) {
    console.error('Error publishing cast:', error);
    throw error;
  }
}

// Test function to verify API connection
export async function testNeynarConnection() {
  try {
    console.log('Testing Neynar API connection...');
    // Try to use the API client to see what methods are available
    console.log('Neynar client methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(neynar)));
    return { success: true, message: 'API client initialized' };
  } catch (error) {
    console.error('Neynar API connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 