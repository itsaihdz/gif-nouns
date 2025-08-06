"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";

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
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
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
                  
                  // If we have a wallet address, try to get Farcaster info from Neynar
                  if (walletAddress) {
                    try {
                      const neynarResponse = await fetch(`/api/gallery/creator-info?wallet=${encodeURIComponent(walletAddress)}`);
                      if (neynarResponse.ok) {
                        const neynarResult = await neynarResponse.json();
                        username = neynarResult.username;
                        pfp = neynarResult.pfp;
                        walletAddress = neynarResult.wallet;
                      }
                    } catch (neynarError) {
                      console.log('Neynar lookup failed, using fallback data');
                    }
                  }
                  
                  return {
                    ...gif,
                    creator: {
                      username: username || 'Unknown Creator',
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
  const filterGifs = () => {
    console.log('🔄 filterGifs called with:', { selectedNoggleColor, selectedEyeAnimation, sortBy });
    console.log('🔄 Total gifs before filtering:', gifs.length);
    
    let filtered = gifs;
    
    if (selectedNoggleColor !== 'all') {
      filtered = filtered.filter(gif => gif.noggleColor === selectedNoggleColor);
      console.log('🔄 After noggle color filter:', filtered.length);
    }
    
    if (selectedEyeAnimation !== 'all') {
      filtered = filtered.filter(gif => gif.eyeAnimation === selectedEyeAnimation);
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
  };

  // Get unique trait values for filter options
  const getUniqueTraits = () => {
    console.log('🔄 Getting unique traits from gifs:', gifs.length);
    console.log('🔄 All noggle colors:', gifs.map(gif => gif.noggleColor));
    console.log('🔄 All eye animations:', gifs.map(gif => gif.eyeAnimation));
    
    // Include all traits, even "unknown" ones, but filter out null/undefined
    const noggleColors = [...new Set(gifs.map(gif => gif.noggleColor).filter(color => color))];
    const eyeAnimations = [...new Set(gifs.map(gif => gif.eyeAnimation).filter(animation => animation))];
    
    console.log('🔄 All noggle colors (including unknown):', noggleColors);
    console.log('🔄 All eye animations (including unknown):', eyeAnimations);
    
    return { noggleColors, eyeAnimations };
  };

  useEffect(() => {
    filterGifs();
  }, [selectedNoggleColor, selectedEyeAnimation, sortBy, gifs]);

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
            onChange={(e) => setSelectedNoggleColor(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Noggle Colors</option>
            {getUniqueTraits().noggleColors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
          
          <select
            value={selectedEyeAnimation}
            onChange={(e) => setSelectedEyeAnimation(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Eye Animations</option>
            {getUniqueTraits().eyeAnimations.map(animation => (
              <option key={animation} value={animation}>{animation}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
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
              {gif.creator && (
                <div className="flex items-center gap-1 mb-1">
                  <img
                    src={gif.creator.pfp}
                    alt={gif.creator.username}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {gif.creator.wallet ? `${gif.creator.wallet.slice(0, 6)}...${gif.creator.wallet.slice(-4)}` : gif.creator.username}
                  </span>
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