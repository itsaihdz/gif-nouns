import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfp: string;
  followerCount: number;
  followingCount: number;
}

export function useFarcasterData() {
  const { address, isConnected } = useAccount();
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFarcasterData = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching Farcaster data for wallet:', walletAddress);
      
      // First, try to get user by wallet address
      const response = await fetch(`/api/test/neynar?test=user&address=${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Farcaster data: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.user) {
        console.log('✅ Farcaster data fetched successfully:', data.user);
        setFarcasterUser(data.user);
        return data.user;
      } else {
        console.log('ℹ️ No Farcaster data found for this wallet');
        setFarcasterUser(null);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Farcaster data';
      console.error('❌ Error fetching Farcaster data:', errorMessage);
      setError(errorMessage);
      setFarcasterUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Farcaster data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      console.log('🔗 Wallet connected, fetching Farcaster data...');
      fetchFarcasterData(address);
    } else if (!isConnected) {
      console.log('🔌 Wallet disconnected, clearing Farcaster data');
      setFarcasterUser(null);
      setError(null);
    }
  }, [isConnected, address]);

  return {
    farcasterUser,
    isLoading,
    error,
    fetchFarcasterData,
    refetch: () => address ? fetchFarcasterData(address) : null
  };
} 