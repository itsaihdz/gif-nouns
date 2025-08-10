"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { useHaptics } from "../../hooks/useHaptics";
import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { sdk } from '@farcaster/miniapp-sdk';
import { Avatar, Identity, Name, Badge } from '@coinbase/onchainkit/identity';
import { useUserVotes } from "../../hooks/useUserVotes";
import { useAccount } from "wagmi";

interface StorageGif {
  url: string;
  path: string;
  size: number;
  contentType: string;
  created_at: string;
  creator?: {
    username: string;
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
  const { addVote, removeVote, getUserVote } = useUserVotes();
  const { address, isConnected } = useAccount();

  // Debug state changes
  useEffect(() => {
    console.log('🔥 FILTER STATE CHANGED:', { selectedNoggleColor, selectedEyeAnimation, sortBy });
  }, [selectedNoggleColor, selectedEyeAnimation, sortBy]);

      const handleVote = async (gifUrl: string, voteType: 'upvote' | 'downvote') => {
      try {
        // Check if wallet is connected
        if (!isConnected || !address) {
          console.error('❌ Wallet not connected');
          await notificationOccurred('error');
          return;
        }

        // Use connected wallet address as user identifier
        const walletAddress = address;
        const userFid = parseInt(address.slice(-8), 16); // Convert last 8 hex chars to number for unique FID
        const username = `${address.slice(0, 6)}...${address.slice(-4)}`;
        
        console.log('🔄 Voting with wallet data:', { 
          gifUrl, 
          voteType, 
          userFid, 
          username, 
          walletAddress 
        });

      const response = await fetch('/api/gallery/vote-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gifUrl,
          voteType,
          userFid,
          username,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Vote successful:', result);
        
        if (result.success) {
          // Success haptic feedback for voting
          await notificationOccurred('success');
          
          // Update vote tracking - check if vote was removed or changed
          const currentVote = getUserVote(gifUrl);
          console.log('🔄 Vote state update:', { 
            currentVote, 
            newVote: result.userVote, 
            upvotes: result.upvotes, 
            downvotes: result.downvotes 
          });
          
          if (result.userVote) {
            // Vote was added or changed
            addVote(gifUrl, result.userVote);
          } else {
            // Vote was removed (user clicked same button)
            removeVote(gifUrl);
          }
          
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
          
          // Note: filterGifs will be called automatically via useEffect when gifs state changes
        } else {
          console.error('❌ Vote failed:', result);
          await notificationOccurred('error');
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Vote failed:', response.status, errorData);
        await notificationOccurred('error');
      }
    } catch (error) {
      console.error('Error voting:', error);
      await notificationOccurred('error');
    }
  };

  const handleShareToFarcaster = async (gif: StorageGif) => {
    try {
      console.log('🔄 handleShareToFarcaster called with:', gif.title);
      console.log('🔄 Available MiniKit functions:', { 
        composeCast: typeof composeCast, 
        sdk: typeof sdk,
        sdkActions: typeof sdk?.actions,
        sdkComposeCast: typeof sdk?.actions?.composeCast,
        sdkOpenUrl: typeof sdk?.actions?.openUrl
      });
      await selectionChanged(); // Haptic feedback
      
      // Use consistent text template from other sharing components
      const shareText = `Check out this animated Noun "${gif.title || 'GIF'}"! 🎨✨

Created with #NounsRemixStudio

${gif.noggleColor || 'custom'} noggle + ${gif.eyeAnimation || 'custom'} eyes = pure magic! 🌟

Vote for it in the gallery! 🗳️`;
      
      // Try native Farcaster composeCast first
      if (typeof composeCast === 'function') {
        console.log('🎯 Using native composeCast function');
        await composeCast({
          text: shareText,
          embeds: [gif.url], // Include GIF as embed
        });
        console.log('✅ Native composeCast completed');
        await notificationOccurred('success');
      } else if (typeof sdk?.actions?.composeCast === 'function') {
        console.log('🎯 Using MiniApp SDK composeCast');
        // Fallback to Farcaster MiniApp SDK
        await sdk.actions.composeCast({ 
          text: shareText,
          embeds: [gif.url]
        });
        console.log('✅ SDK composeCast completed');
        await notificationOccurred('success');
      } else {
        console.log('🎯 Using fallback web URL');
        // Fallback to external link
        const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
        console.log('🔗 Farcaster URL:', farcasterUrl);
        if (typeof sdk?.actions?.openUrl === 'function') {
          console.log('🎯 Using SDK openUrl');
          await sdk.actions.openUrl(farcasterUrl);
        } else {
          console.log('🎯 Using window.open fallback');
          window.open(farcasterUrl, '_blank');
        }
        console.log('✅ Fallback sharing completed');
        await notificationOccurred('warning'); // Different feedback for fallback
      }
      
    } catch (error) {
      console.error('❌ Error sharing to Farcaster:', error);
      try {
        await notificationOccurred('error');
      } catch (hapticError) {
        console.error('❌ Haptic feedback error:', hapticError);
      }
    }
  };

  const handleShareToTwitter = async (gif: StorageGif) => {
    try {
      console.log('🔄 handleShareToTwitter called with:', gif.title);
      console.log('🔄 Available SDK for Twitter:', { 
        sdk: typeof sdk,
        sdkActions: typeof sdk?.actions,
        sdkOpenUrl: typeof sdk?.actions?.openUrl
      });
      await selectionChanged(); // Haptic feedback
      
      // Use consistent text template from other sharing components
      const shareText = `Check out this animated Noun "${gif.title || 'GIF'}"! 🎨✨

Created with #NounsRemixStudio

${gif.noggleColor || 'custom'} noggle + ${gif.eyeAnimation || 'custom'} eyes = pure magic! 🌟

Vote for it in the gallery! 🗳️

${gif.url}`;
      
      // Try Twitter deep link first (for mobile apps)
      const twitterDeepLink = `twitter://post?message=${encodeURIComponent(shareText)}`;
      const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      
      // Try opening with MiniApp SDK openUrl if available, otherwise use fallback
      if (typeof sdk?.actions?.openUrl === 'function') {
        try {
          console.log('🎯 Trying Twitter deep link:', twitterDeepLink);
          // Try deep link first
          await sdk.actions.openUrl(twitterDeepLink);
          console.log('✅ Twitter deep link completed');
          await notificationOccurred('success');
        } catch (deepLinkError) {
          console.log('🔄 Deep link failed, trying web URL:', deepLinkError);
          console.log('🎯 Trying Twitter web URL:', twitterWebUrl);
          // Fallback to web URL
          await sdk.actions.openUrl(twitterWebUrl);
          console.log('✅ Twitter web URL completed');
          await notificationOccurred('success');
        }
      } else {
        // Fallback to regular window.open
        console.log('🎯 MiniApp SDK not available, using window.open');
        console.log('🔗 Opening Twitter URL:', twitterWebUrl);
        window.open(twitterWebUrl, '_blank');
        console.log('✅ window.open completed');
        await notificationOccurred('warning'); // Different feedback for fallback
      }
    } catch (error) {
      console.error('❌ Error sharing to Twitter:', error);
      try {
        await notificationOccurred('error');
      } catch (hapticError) {
        console.error('❌ Haptic feedback error:', hapticError);
      }
    }
  };

  const fetchGifsFromStorage = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching GIFs with metadata directly from database...');
      
      // Fetch all GIF metadata directly from the database
      const metadataResponse = await fetch('/api/gallery/metadata');
      
      if (!metadataResponse.ok) {
        throw new Error(`HTTP error! status: ${metadataResponse.status}`);
      }
      
      const metadataResult = await metadataResponse.json();
      
      if (metadataResult.success) {
        console.log(`✅ Fetched ${metadataResult.count} GIF metadata records from database`);
        
        // Transform the metadata into the format expected by the component
        const gifsWithMetadata = metadataResult.data.map((item: any) => ({
          url: item.gifUrl,
          path: item.title || 'Untitled GIF',
          size: 0, // Not available from metadata
          contentType: 'image/gif',
          created_at: new Date().toISOString(), // Not available from metadata
          creator: {
            username: item.creatorWallet ? `${item.creatorWallet.slice(0, 6)}...${item.creatorWallet.slice(-4)}` : 'Unknown Creator',
            wallet: item.creatorWallet || 'unknown',
          },
          title: item.title || 'Untitled GIF',
          noggleColor: item.noggleColor || 'unknown',
          eyeAnimation: item.eyeAnimation || 'unknown',
          upvotes: item.upvotes || 0,
          downvotes: item.downvotes || 0,
          hasCreatorInfo: true
        }));
        
        console.log('🔥 FINAL PROCESSED GIFS WITH METADATA:', gifsWithMetadata.map((g: any) => ({
          title: g.title,
          noggleColor: g.noggleColor,
          eyeAnimation: g.eyeAnimation,
          upvotes: g.upvotes,
          downvotes: g.downvotes
        })));
        
        setGifs(gifsWithMetadata);
        setFilteredGifs(gifsWithMetadata);
      } else {
        throw new Error(metadataResult.error || 'Failed to fetch GIF metadata');
      }
    } catch (err) {
      console.error('❌ Error fetching GIF metadata:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GIF metadata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifsFromStorage();
  }, []);

  const handleRefresh = () => {
    setError(null);
    fetchGifsFromStorage();
  };

  // Get available noggle colors from actual data (excluding 'unknown')
  const getAvailableNoggleColors = () => {
    const availableColors = new Set<string>();
    const unknownCount = { noggle: 0, eye: 0 };
    
    gifs.forEach(gif => {
      if (gif.noggleColor && gif.noggleColor !== 'unknown') {
        availableColors.add(gif.noggleColor);
      } else if (gif.noggleColor === 'unknown') {
        unknownCount.noggle++;
      }
      
      if (gif.eyeAnimation && gif.eyeAnimation !== 'unknown') {
        // Track eye animations too
      } else if (gif.eyeAnimation === 'unknown') {
        unknownCount.eye++;
      }
    });
    
    console.log('🎨 Available noggle colors from data:', Array.from(availableColors));
    console.log('⚠️ GIFs with unknown noggle colors:', unknownCount.noggle);
    console.log('⚠️ GIFs with unknown eye animations:', unknownCount.eye);
    
    // Convert to array format for the dropdown
    const colorOptions = [
      { name: "All Noggle Colors", value: "all" },
      ...Array.from(availableColors).sort().map(color => ({
        name: color.charAt(0).toUpperCase() + color.slice(1).replace(/-/g, ' '),
        value: color
      }))
    ];
    
    return colorOptions;
  };

  // Get available eye animations from actual data (excluding 'unknown')
  const getAvailableEyeAnimations = () => {
    const availableAnimations = new Set<string>();
    gifs.forEach(gif => {
      if (gif.eyeAnimation && gif.eyeAnimation !== 'unknown') {
        availableAnimations.add(gif.eyeAnimation);
      }
    });
    
    // Convert to array format for the dropdown
    const animationOptions = [
      { name: "All Eye Animations", value: "all" },
      ...Array.from(availableAnimations).sort().map(animation => ({
        name: animation.charAt(0).toUpperCase() + animation.slice(1).replace(/-/g, ' '),
        value: animation
      }))
    ];
    
    console.log('👁️ Available eye animations from data:', animationOptions);
    return animationOptions;
  };

  // Run filter whenever filter states or gifs change
  useEffect(() => {
    console.log('🔄 useEffect triggered - running filterGifs');
    console.log('🔥 Current filter state:', { selectedNoggleColor, selectedEyeAnimation, sortBy });
    console.log('🔥 Available GIFs:', gifs.map(g => ({ title: g.title, noggleColor: g.noggleColor, eyeAnimation: g.eyeAnimation })));
    console.log('🔥 Looking for noggle color:', selectedNoggleColor);
    console.log('🔥 Looking for eye animation:', selectedEyeAnimation);
    
    if (gifs.length > 0) {
      // Call filterGifs directly instead of including it in dependencies
      const filtered = gifs.filter(gif => {
        console.log('🔄 Filtering GIF:', { title: gif.title, noggleColor: gif.noggleColor, eyeAnimation: gif.eyeAnimation });
        
        // Filter by noggle color
        if (selectedNoggleColor !== 'all' && gif.noggleColor !== selectedNoggleColor) {
          console.log('❌ Filtered out by noggle color:', gif.noggleColor, '!==', selectedNoggleColor);
          console.log('❌ GIF title:', gif.title, 'has noggle color:', gif.noggleColor, 'but filter wants:', selectedNoggleColor);
          
          // Skip GIFs with unknown noggle color when filtering by specific color
          if (gif.noggleColor === 'unknown') {
            console.log('⚠️ Skipping GIF with unknown noggle color:', gif.title);
            return false;
          }
          
          return false;
        }
        
        // Filter by eye animation
        if (selectedEyeAnimation !== 'all' && gif.eyeAnimation !== selectedEyeAnimation) {
          console.log('❌ Filtered out by eye animation:', gif.eyeAnimation, '!==', selectedEyeAnimation);
          return false;
        }
        
        console.log('✅ GIF passed filters:', gif.title);
        return true;
      });
      
      console.log('🔥 Filtered results:', filtered.length, 'out of', gifs.length);
      
      // Sort the filtered results
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'most-upvotes':
            return (b.upvotes || 0) - (a.upvotes || 0);
          case 'most-downvotes':
            return (b.downvotes || 0) - (a.downvotes || 0);
          default:
            return 0;
        }
      });
      
      setFilteredGifs(sorted);
      console.log('✅ Filtered and sorted GIFs:', sorted.length);
    }
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
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">
          Community Gallery
        </h2>
        <div className="text-center mb-4 sm:mb-6 px-2">
          <div className="flex items-center justify-center gap-2">
            {(selectedNoggleColor !== 'all' || selectedEyeAnimation !== 'all') && (
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                Filtered
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                Sorted: {sortBy === 'most-upvotes' ? 'More Upvotes' : 
                         sortBy === 'most-downvotes' ? 'More Downvotes' : 
                         sortBy === 'oldest' ? 'Oldest First' : 
                         sortBy.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Filter and Sort Controls */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 mb-4 sm:mb-6 sm:justify-center">
          
          {/* Warning about unknown metadata */}

                  <select
          value={selectedNoggleColor}
          onChange={async (e) => {
            const newValue = e.target.value;
            console.log('🔥 DROPDOWN CHANGED - Noggle Color:', newValue, 'Previous:', selectedNoggleColor);
            console.log('🔥 Available GIFs with noggle colors:', gifs.map(g => ({ title: g.title, noggleColor: g.noggleColor })));
            console.log('🔥 Looking for noggle color:', newValue);
            await selectionChanged();
            setSelectedNoggleColor(newValue);
            console.log('🔥 State updated to:', newValue);
          }}
          className={`w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            selectedNoggleColor !== 'all' 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100 font-medium' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        >
          {getAvailableNoggleColors().map(color => (
            <option key={color.value} value={color.value}>{color.name}</option>
          ))}
        </select>
          
          <select
            value={selectedEyeAnimation}
            onChange={async (e) => {
              const newValue = e.target.value;
              console.log('🔥 DROPDOWN CHANGED - Eye Animation:', newValue, 'Previous:', selectedEyeAnimation);
              await selectionChanged();
              setSelectedEyeAnimation(newValue);
              console.log('🔥 State updated to:', newValue);
            }}
            className={`w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              selectedEyeAnimation !== 'all' 
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-900 dark:text-purple-100 font-medium' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
                      {getAvailableEyeAnimations().map(animation => (
            <option key={animation.value} value={animation.value}>{animation.name}</option>
          ))}
          </select>
          
          <select
            value={sortBy}
            onChange={async (e) => {
              const newValue = e.target.value;
              console.log('🔥 DROPDOWN CHANGED - Sort By:', newValue, 'Previous:', sortBy);
              await selectionChanged();
              setSortBy(newValue);
              console.log('🔥 State updated to:', newValue);
            }}
            className={`w-full sm:w-auto px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              sortBy !== 'newest' 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 font-medium' 
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-upvotes">More Upvotes</option>
            <option value="most-downvotes">More Downvotes</option>
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

      {/* Gallery Grid - Mobile first, 1:1 ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredGifs.map((gif, index) => (
          <Card key={gif.path} variant="outlined" className="overflow-hidden">
            {/* GIF Container - 1:1 aspect ratio */}
            <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
              <img
                src={gif.url}
                alt={`GIF ${index + 1}`}
                className="w-full h-full object-contain bg-gray-100 dark:bg-gray-800 rounded-t-lg"
                loading="lazy"
                onError={(e) => {
                  console.error('Failed to load GIF:', gif.url);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* GIF Details */}
            <div className="p-3 sm:p-4">
              {/* Creator Info */}
              {gif.creator && gif.creator.wallet && gif.creator.wallet !== 'unknown' && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Identity
                    address={gif.creator.wallet as `0x${string}`}
                    schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                  >
                    <Avatar className="w-5 h-5 sm:w-4 sm:h-4" />
                    <Name className="text-xs text-gray-500 dark:text-gray-500">
                      <Badge />
                    </Name>
                  </Identity>
                  
                  {/* Share Buttons - positioned at right */}
                  <div className="ml-auto flex gap-1.5">
                    <button
                      onClick={() => {
                        console.log('🔥 FARCASTER BUTTON CLICKED! (OnchainKit)', gif.title);
                        handleShareToFarcaster(gif);
                      }}
                      className="p-1.5 sm:p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
                      title="Share to Farcaster"
                    >
                      <Icon name="share" size="sm" className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('🔥 TWITTER BUTTON CLICKED! (OnchainKit)', gif.title);
                        handleShareToTwitter(gif);
                      }}
                      className="p-1.5 sm:p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                      title="Share to Twitter"
                    >
                      <Icon name="twitter" size="sm" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Fallback for GIFs without valid wallet info */}
              {gif.creator && (!gif.creator.wallet || gif.creator.wallet === 'unknown') && (
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 sm:w-4 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <Icon name="user" size="sm" className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {gif.creator.username || 'Unknown Creator'}
                  </span>
                  
                  {/* Share Buttons - positioned at right */}
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={() => {
                        console.log('🔥 FARCASTER BUTTON CLICKED! (Fallback)', gif.title);
                        handleShareToFarcaster(gif);
                      }}
                      className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
                      title="Share to Farcaster"
                    >
                      <Icon name="share" size="sm" className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300" />
                    </button>
                    <button
                      onClick={() => {
                        console.log('🔥 TWITTER BUTTON CLICKED! (Fallback)', gif.title);
                        handleShareToTwitter(gif);
                      }}
                      className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                      title="Share to Twitter"
                    >
                      <Icon name="twitter" size="sm" className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300" />
                    </button>
                  </div>
                </div>
              )}



              {/* Voting */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(gif.url, 'upvote')}
                  className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                    getUserVote(gif.url) === 'upvote'
                      ? 'bg-green-500 text-white font-semibold' // Active state
                      : 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300' // Default state
                  }`}
                >
                  👍 {gif.upvotes || 0}
                </button>
                <button
                  onClick={() => handleVote(gif.url, 'downvote')}
                  className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors ${
                    getUserVote(gif.url) === 'downvote'
                      ? 'bg-red-500 text-white font-semibold' // Active state
                      : 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300' // Default state
                  }`}
                >
                  👎 {gif.downvotes || 0}
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