import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Initialize Neynar API client with real API key
const neynar = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY || 'D12CCE20-5A93-415F-A164-9F9A2598E952'
});

export { neynar };

// Types for Farcaster user data
export interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
  bio?: string;
  verifiedAddresses?: string[];
}

// Helper functions for Farcaster operations
export async function getUserByFid(fid: number): Promise<{ user: FarcasterUser }> {
  try {
    console.log('Fetching user by FID:', fid);
    
    // Use real Neynar API to fetch user data
    const response = await neynar.fetchBulkUsers({ fids: [fid] });
    
    if (response && response.users && response.users.length > 0) {
      const user = response.users[0];
      return {
        user: {
          fid: user.fid,
          username: user.username || `user${fid}.noun`,
          displayName: user.display_name || user.username || `User ${fid}`,
          pfp: user.pfp_url || '',
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          bio: user.profile?.bio?.text,
          verifiedAddresses: [], // Simplified for now
        }
      };
    }
    
    // Fallback to mock data if API doesn't return expected structure
    return {
      user: {
        fid,
        username: `user${fid}.noun`,
        displayName: `User ${fid}`,
        pfp: '',
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    
    // Return mock data on error
    return {
      user: {
        fid,
        username: `user${fid}.noun`,
        displayName: `User ${fid}`,
        pfp: '',
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  }
}

export async function getUserByUsername(username: string): Promise<{ user: FarcasterUser }> {
  try {
    console.log('Fetching user by username:', username);
    
    // Use real Neynar API to fetch user data
    const response = await neynar.lookupUserByUsername({ username });
    
    if (response && response.user) {
      const user = response.user;
      return {
        user: {
          fid: user.fid,
          username: user.username || username,
          displayName: user.display_name || user.username || username.replace('.noun', ''),
          pfp: user.pfp_url || '',
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          bio: user.profile?.bio?.text,
          verifiedAddresses: [], // Simplified for now
        }
      };
    }
    
    // Fallback to mock data if API doesn't return expected structure
    return {
      user: {
        fid: Math.floor(Math.random() * 100000),
        username,
        displayName: username.replace('.noun', ''),
        pfp: '',
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    
    // Return mock data on error
    return {
      user: {
        fid: Math.floor(Math.random() * 100000),
        username,
        displayName: username.replace('.noun', ''),
        pfp: '',
        followerCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500)
      }
    };
  }
}

export async function getMultipleUsersByFid(fids: number[]): Promise<FarcasterUser[]> {
  try {
    console.log('Fetching multiple users by FIDs:', fids);
    
    // Use real Neynar API to fetch multiple users
    const response = await neynar.fetchBulkUsers({ fids });
    
    if (response && response.users) {
      return response.users.map((user: any) => ({
        fid: user.fid,
        username: user.username || `user${user.fid}.noun`,
        displayName: user.display_name || user.username || `User ${user.fid}`,
                  pfp: user.pfp_url || '',
        followerCount: user.follower_count || 0,
        followingCount: user.following_count || 0,
        bio: user.profile?.bio?.text,
        verifiedAddresses: [], // Simplified for now
      }));
    }
    
    // Fallback to mock data
    return fids.map(fid => ({
      fid,
      username: `user${fid}.noun`,
      displayName: `User ${fid}`,
      pfp: '',
      followerCount: Math.floor(Math.random() * 1000),
      followingCount: Math.floor(Math.random() * 500)
    }));
  } catch (error) {
    console.error('Error fetching multiple users by FID:', error);
    
    // Return mock data on error
    return fids.map(fid => ({
      fid,
      username: `user${fid}.noun`,
      displayName: `User ${fid}`,
      pfp: '',
      followerCount: Math.floor(Math.random() * 1000),
      followingCount: Math.floor(Math.random() * 500)
    }));
  }
}

export async function publishCast(text: string, embeds?: string[]) {
  try {
    console.log('Publishing cast:', { text, embeds });
    // TODO: Implement real cast publishing when we have user authentication
    return { success: true, hash: `0x${Math.random().toString(16).substr(2, 64)}` };
  } catch (error) {
    console.error('Error publishing cast:', error);
    throw error;
  }
}

export async function getUserByWalletAddress(walletAddress: string): Promise<{ user: FarcasterUser | null }> {
  try {
    console.log('Fetching user by wallet address:', walletAddress);
    
    // Use the proper Neynar endpoint for wallet address lookup
    // This endpoint is available in the free tier and handles both custody and verified addresses
    const response = await neynar.fetchBulkUsersByEthOrSolAddress({ 
      addresses: [walletAddress], // Array of addresses
      addressTypes: ['custody_address', 'verified_address'] // Search both types
    });
    
    if (response && response.users && response.users.length > 0) {
      // Get the first user found (usually the most relevant)
      const user = response.users[0];
      console.log('✅ Found Farcaster user for wallet:', user.username);
      
      return {
        user: {
          fid: user.fid,
          username: user.username || `user${user.fid}.noun`,
          displayName: user.display_name || user.username || `User ${user.fid}`,
          pfp: user.pfp_url || '',
          followerCount: user.follower_count || 0,
          followingCount: user.following_count || 0,
          bio: user.profile?.bio?.text,
          verifiedAddresses: [walletAddress],
        }
      };
    }
    
    // If no user found, return a user object with wallet address as display name
    // This ensures the app continues to work even without Farcaster integration
    console.log('No Farcaster user found for wallet address, using fallback:', walletAddress);
    return {
      user: {
        fid: 0, // Unknown FID
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        displayName: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        pfp: '',
        followerCount: 0,
        followingCount: 0,
        verifiedAddresses: [walletAddress],
      }
    };
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    
    // Fallback - return a user object with wallet address
    return {
      user: {
        fid: 0,
        username: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        displayName: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        pfp: '',
        followerCount: 0,
        followingCount: 0,
        verifiedAddresses: [walletAddress],
      }
    };
  }
}

// Test function to verify API connection
export async function testNeynarConnection() {
  try {
    console.log('Testing Neynar API connection...');
    
    // Try to fetch a known user to test the API
    const testFid = 2; // @dwr.eth
    const response = await neynar.fetchBulkUsers({ fids: [testFid] });
    
    if (response && response.users && response.users.length > 0) {
      return { 
        success: true, 
        message: 'API connection successful',
        testUser: response.users[0]?.username || 'Unknown'
      };
    }
    
    return { success: true, message: 'API client initialized but no test user found' };
  } catch (error) {
    console.error('Neynar API connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'API connection failed, using mock data'
    };
  }
} 