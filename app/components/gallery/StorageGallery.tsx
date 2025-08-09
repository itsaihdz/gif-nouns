"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { useHaptics } from "../../hooks/useHaptics";
import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk';
import { Avatar, Identity, Name, Badge, Address } from '@coinbase/onchainkit/identity';

interface StorageGif {
  url: string;
  path: string;
  size: number;
  contentType: string;
  created_at: string;
  creator?: {
    username: string;
    pfp: string;
    wallet: string;
  };
  title?: string;
  noggleColor?: string;
  eyeAnimation?: string;
  upvotes?: number;
  downvotes?: number;
  hasCreatorInfo?: boolean;
}

interface StorageGalleryProps {
  className?: string;
}

export function StorageGallery({ className = "" }: StorageGalleryProps) {
  const [gifs, setGifs] = useState<StorageGif[]>([]);
  const [filteredGifs, setFilteredGifs] = useState<StorageGif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNoggleColor, setSelectedNoggleColor] = useState<string>('all');
  const [selectedEyeAnimation, setSelectedEyeAnimation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const { selectionChanged, notificationOccurred } = useHaptics();
  const { composeCast } = useComposeCast();

  // Debug state changes
  useEffect(() => {
    console.log('🔥 FILTER STATE CHANGED:', { selectedNoggleColor, selectedEyeAnimation, sortBy });
  }, [selectedNoggleColor, selectedEyeAnimation, sortBy]);

  const handleVote = async (gifUrl: string, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/gallery/vote-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gifUrl,
          userFid: 12345, // Mock user ID
          username: "you.noun",
          pfp: "https://picsum.photos/32/32?random=8",
          voteType,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Success haptic feedback for voting
          await notificationOccurred('success');
          
          // Update the GIF in the list
          setGifs(prevGifs => 
            prevGifs.map(gif => 
              gif.url === gifUrl 
                ? {
                    ...gif,
                    upvotes: result.upvotes,
                    downvotes: result.downvotes,
                  }
                : gif
            )
          );
          
          // Refresh creator info after a short delay since a new gallery item might have been created
          setTimeout(() => {
            fetchGifsFromStorage();
          }, 1000);
        } else {
          await notificationOccurred('error');
        }
      } else {
        await notificationOccurred('error');
      }
    } catch (error) {
      console.error('Error voting:', error);
      await notificationOccurred('error');
    }
  };

  const handleShare = async (gif: StorageGif) => {
    try {
      await selectionChanged(); // Haptic feedback
      
      // Use consistent text template from other sharing components
      const shareText = `Check out this animated Noun "${gif.title || 'GIF'}"! 🎨✨

Created with #NounsRemixStudio

${gif.noggleColor || 'custom'} noggle + ${gif.eyeAnimation || 'custom'} eyes = pure magic! 🌟

Vote for it in the gallery! 🗳️`;
      
      // Try native Farcaster composeCast first
      if (typeof composeCast === 'function') {
        await composeCast({
          text: shareText,
          embeds: [gif.url], // Include GIF as embed
        });
        await notificationOccurred('success');
      } else if (typeof sdk?.actions?.composeCast === 'function') {
        // Fallback to Farcaster MiniApp SDK
        await sdk.actions.composeCast({ 
          text: shareText,
          embeds: [gif.url]
        });
        await notificationOccurred('success');
      } else {
        // Fallback to external link
        const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
        if (typeof sdk?.actions?.openUrl === 'function') {
          await sdk.actions.openUrl(farcasterUrl);
        } else {
          window.open(farcasterUrl, '_blank');
        }
        await notificationOccurred('warning'); // Different feedback for fallback
      }
      
    } catch (error) {
      console.error('Error sharing GIF:', error);
      await notificationOccurred('error');
    }
  };

  const fetchGifsFromStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching GIFs from storage...');
      const response = await fetch('/api/gallery/storage');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Fetched ${result.count} GIFs from storage`);
        
        // Fetch creator info for each GIF from database and Neynar
        const gifsWithCreatorInfo = await Promise.all(
          result.data.map(async (gif: StorageGif) => {
            try {
              // First get creator info from database
              const creatorResponse = await fetch(`/api/gallery/storage/creator?gifUrl=${encodeURIComponent(gif.url)}`);
              if (creatorResponse.ok) {
                const creatorResult = await creatorResponse.json();
                if (creatorResult.success) {
                  console.log('✅ Found creator info:', creatorResult.data);
                  
                  // Try to get wallet address (new schema) or username (old schema)
                  let walletAddress = creatorResult.data.creator_wallet;
                  let username = creatorResult.data.creator_username;
                  let pfp = creatorResult.data.creator_pfp;
                  
                  // For wallet addresses, OnchainKit Identity will handle ENS resolution
                  // Only use Neynar for additional Farcaster-specific data if needed
                  if (walletAddress && (!username || !pfp)) {
                    try {
                      const neynarResponse = await fetch(`/api/gallery/creator-info?wallet=${encodeURIComponent(walletAddress)}`);
                      if (neynarResponse.ok) {
                        const neynarResult = await neynarResponse.json();
                        // Only override if we don't have data and Neynar has it
                        username = username || neynarResult.username;
                        pfp = pfp || neynarResult.pfp;
                      }
                    } catch (error) {
                      console.log('Neynar lookup failed, OnchainKit Identity will handle wallet resolution');
                    }
                  }
                  
                  return {
                    ...gif,
                    creator: {
                      username: username || (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Unknown Creator'),
                      pfp: pfp || `https://picsum.photos/32/32?random=${walletAddress?.slice(2, 8) || 'unknown'}`,
                      wallet: walletAddress || 'unknown',
                    },
                    title: creatorResult.data.title || gif.path,
                    noggleColor: creatorResult.data.noggle_color || 'unknown',
                    eyeAnimation: creatorResult.data.eye_animation || 'unknown',
                    upvotes: creatorResult.data.upvotes || 0,
                    downvotes: creatorResult.data.downvotes || 0,
                    hasCreatorInfo: true
                  };
                }
              }
            } catch (error) {
              console.error('Error fetching creator info for:', gif.url, error);
            }
            
            // Fallback for GIFs without creator info
            return {
              ...gif,
              creator: {
                username: 'Unknown Creator',
                pfp: 'https://picsum.photos/32/32?random=unknown',
                wallet: 'unknown',
              },
              title: gif.path,
              noggleColor: 'unknown',
              eyeAnimation: 'unknown',
              upvotes: 0,
              downvotes: 0,
              hasCreatorInfo: false
            };
          })
        );
        
        setGifs(gifsWithCreatorInfo);
        setFilteredGifs(gifsWithCreatorInfo);
      } else {
        throw new Error(result.error || 'Failed to fetch GIFs');
      }
    } catch (err) {
      console.error('❌ Error fetching GIFs from storage:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GIFs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifsFromStorage();
  }, []);

  const handleRefresh = () => {
    fetchGifsFromStorage();
  };

  // Filter and sort GIFs based on selected traits and sort option
  const filterGifs = useCallback(() => {
    console.log('🔄 filterGifs called with:', { selectedNoggleColor, selectedEyeAnimation, sortBy });
    console.log('🔄 Total gifs before filtering:', gifs.length);
    console.log('🔄 All GIFs with their traits:', gifs.map(g => ({ 
      title: g.title, 
      noggleColor: g.noggleColor, 
      eyeAnimation: g.eyeAnimation 
    })));
    
    let filtered = gifs;
    
    if (selectedNoggleColor !== 'all') {
      console.log('🔍 Filtering by noggle color:', selectedNoggleColor);
      console.log('🔍 Available noggle colors in gifs:', gifs.map(g => g.noggleColor));
      filtered = filtered.filter(gif => {
        const matches = gif.noggleColor === selectedNoggleColor;
        console.log(`🔍 GIF "${gif.title}" has noggleColor "${gif.noggleColor}", matches "${selectedNoggleColor}": ${matches}`);
        return matches;
      });
      console.log('🔄 After noggle color filter:', filtered.length);
    }
    
    if (selectedEyeAnimation !== 'all') {
      console.log('🔍 Filtering by eye animation:', selectedEyeAnimation);
      console.log('🔍 Available eye animations in gifs:', gifs.map(g => g.eyeAnimation));
      filtered = filtered.filter(gif => {
        const matches = gif.eyeAnimation === selectedEyeAnimation;
        console.log(`🔍 GIF "${gif.title}" has eyeAnimation "${gif.eyeAnimation}", matches "${selectedEyeAnimation}": ${matches}`);
        return matches;
      });
      console.log('🔄 After eye animation filter:', filtered.length);
    }
    
    // Sort GIFs based on selected option
    console.log('🔄 Sorting by:', sortBy);
    switch (sortBy) {
      case 'most-votes':
        filtered = filtered.sort((a, b) => {
          const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
          const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
          console.log('🔄 Comparing votes for most-votes:', { 
            a: { title: a.title, upvotes: a.upvotes, downvotes: a.downvotes, netVotes: aVotes },
            b: { title: b.title, upvotes: b.upvotes, downvotes: b.downvotes, netVotes: bVotes }
          });
          return bVotes - aVotes; // Most votes first (descending)
        });
        break;
      case 'least-votes':
        filtered = filtered.sort((a, b) => {
          const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
          const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
          console.log('🔄 Comparing votes for least-votes:', { 
            a: { title: a.title, upvotes: a.upvotes, downvotes: a.downvotes, netVotes: aVotes },
            b: { title: b.title, upvotes: b.upvotes, downvotes: b.downvotes, netVotes: bVotes }
          });
          return aVotes - bVotes; // Least votes first (ascending)
        });
        break;
      case 'newest':
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      default:
        // Default to newest
        filtered = filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }
    
    console.log('🔄 Final filtered gifs:', filtered.length);
    console.log('🔄 First few gifs after sorting:', filtered.slice(0, 5).map(gif => ({
      title: gif.title,
      noggleColor: gif.noggleColor,
      eyeAnimation: gif.eyeAnimation,
      upvotes: gif.upvotes,
      downvotes: gif.downvotes,
      netVotes: (gif.upvotes || 0) - (gif.downvotes || 0),
      created_at: gif.created_at
    })));
    
    setFilteredGifs(filtered);
  }, [selectedNoggleColor, selectedEyeAnimation, sortBy, gifs]);

  // All available noggle colors from ImagePreview component
  const ALL_NOGGLE_COLORS = [
    { name: "Blue", value: "blue" },
    { name: "Deep Teal", value: "deep-teal" },
    { name: "Gomita", value: "gomita" },
    { name: "Grass", value: "grass" },
    { name: "Green Blue", value: "green-blue" },
    { name: "Grey Light", value: "grey-light" },
    { name: "Guava", value: "guava" },
    { name: "Hip Rose", value: "hip-rose" },
    { name: "Honey", value: "honey" },
    { name: "Hyper", value: "hyper" },
    { name: "Hyperliquid", value: "hyperliquid" },
    { name: "Lavender", value: "lavender" },
    { name: "Magenta", value: "magenta" },
    { name: "Orange", value: "orange" },
    { name: "Pink Purple", value: "pink-purple" },
    { name: "Purple", value: "purple" },
    { name: "Red", value: "red" },
    { name: "Smoke", value: "smoke" },
    { name: "Teal", value: "teal" },
    { name: "Watermelon", value: "watermelon" },
    { name: "Yellow Orange", value: "yellow-orange" },
    { name: "Yellow", value: "yellow" },
  ];

  // All available eye animations from ImagePreview component
  const ALL_EYE_ANIMATIONS = [
    { name: "Nouns", value: "nouns" },
    { name: "Ojos Nouns", value: "ojos-nouns" },
    { name: "Ojos Pepepunk", value: "ojos-pepepunk" },
    { name: "Ojos Pepepunk En Medio", value: "ojos-pepepunk-en-medio" },
    { name: "Arriba", value: "arriba" },
    { name: "Arriba Derecha", value: "arriba-derecha" },
    { name: "Arriba Izquierda", value: "arriba-izquierda" },
    { name: "Abajo", value: "abajo" },
    { name: "Abajo Derecha", value: "abajo-derecha" },
    { name: "Abajo Izquierda", value: "abajo-izquierda" },
    { name: "Viscos", value: "viscos" },
    { name: "Viscos Derecha", value: "viscos-derecha" },
    { name: "Viscos Izquierda", value: "viscos-izquierda" },
    { name: "Locos", value: "locos" },
    { name: "Serpiente", value: "serpiente" },
    { name: "Vampiro", value: "vampiro" },
  ];

  useEffect(() => {
    filterGifs();
  }, [filterGifs]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center min-h-64`}>
        <div className="text-center">
          <Icon name="loading" size="lg" className="animate-spin mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">Loading GIFs from storage...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center min-h-64`}>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error: {error}</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <Icon name="refresh" size="sm" className="mr-1" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (gifs.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center min-h-64`}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-2">No GIFs found in storage</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <Icon name="refresh" size="sm" className="mr-1" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Gallery Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Gallery
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          All GIFs from Supabase Storage ({filteredGifs.length} of {gifs.length} total)
        </p>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <select
            value={selectedNoggleColor}
            onChange={async (e) => {
              console.log('🔥 DROPDOWN CHANGED - Noggle Color:', e.target.value);
              await selectionChanged();
              setSelectedNoggleColor(e.target.value);
            }}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Noggle Colors</option>
            {ALL_NOGGLE_COLORS.map(color => (
              <option key={color.value} value={color.value}>{color.name}</option>
            ))}
          </select>
          
          <select
            value={selectedEyeAnimation}
            onChange={async (e) => {
              console.log('🔥 DROPDOWN CHANGED - Eye Animation:', e.target.value);
              await selectionChanged();
              setSelectedEyeAnimation(e.target.value);
            }}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Eye Animations</option>
            {ALL_EYE_ANIMATIONS.map(animation => (
              <option key={animation.value} value={animation.value}>{animation.name}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={async (e) => {
              await selectionChanged();
              setSortBy(e.target.value);
            }}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-votes">Most Votes</option>
            <option value="least-votes">Least Votes</option>
          </select>
          
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            icon={<Icon name="refresh" size="sm" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Gallery Grid - 1:1 ratio, no cropping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {filteredGifs.map((gif, index) => (
          <Card key={gif.path} variant="outlined" className="overflow-hidden">
            {/* GIF Container - 1:1 aspect ratio */}
            <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
              <img
                src={gif.url}
                alt={`GIF ${index + 1}`}
                className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load GIF:', gif.url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* GIF Details */}
            <div className="p-2">
              {/* Creator Info */}
              {gif.creator && gif.creator.wallet && gif.creator.wallet !== 'unknown' && (
                <div className="flex items-center gap-1 mb-1">
                  <Identity
                    address={gif.creator.wallet as `0x${string}`}
                    schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                  >
                    <Avatar className="w-4 h-4" />
                    <Name className="text-xs text-gray-500 dark:text-gray-500 max-w-20 truncate">
                      <Badge />
                    </Name>
                  </Identity>
                  
                  {/* Share Icon - positioned at right */}
                  <button
                    onClick={() => handleShare(gif)}
                    className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Share this GIF"
                  >
                    <Icon name="share" size="sm" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                </div>
              )}
              
              {/* Fallback for GIFs without valid wallet info */}
              {gif.creator && (!gif.creator.wallet || gif.creator.wallet === 'unknown') && (
                <div className="flex items-center gap-1 mb-1">
                  <img
                    src={gif.creator.pfp || 'https://picsum.photos/32/32?random=unknown'}
                    alt={gif.creator.username || 'Unknown Creator'}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {gif.creator.username || 'Unknown Creator'}
                  </span>
                  
                  {/* Share Icon - positioned at right */}
                  <button
                    onClick={() => handleShare(gif)}
                    className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Share this GIF"
                  >
                    <Icon name="share" size="sm" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                  </button>
                </div>
              )}

              {/* Traits Info */}
              <div className="flex gap-1 mb-1">
                {gif.noggleColor && gif.noggleColor !== 'unknown' && (
                  <span className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                    {gif.noggleColor}
                  </span>
                )}
                {gif.eyeAnimation && gif.eyeAnimation !== 'unknown' && (
                  <span className="text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                    {gif.eyeAnimation}
                  </span>
                )}
              </div>
              


              {/* Voting */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(gif.url, 'upvote')}
                  className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded"
                >
                  upvote {gif.upvotes || 0}
                </button>
                <button
                  onClick={() => handleVote(gif.url, 'downvote')}
                  className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded"
                >
                  downvote {gif.downvotes || 0}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredGifs.length} of {gifs.length} GIFs from Supabase Storage
      </div>
    </div>
  );
} 