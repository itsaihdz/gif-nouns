"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { ShareButton } from "../social/ShareButton";
import { Avatar, Identity, Name, Badge } from '@coinbase/onchainkit/identity';
import { useUserVotes } from "../../hooks/useUserVotes";
import { useAccount } from "wagmi";

interface GalleryItem {
  id: string;
  gifUrl: string;
  creator: {
    fid: number;
    username: string;
    wallet?: string; // Add wallet address for OnchainKit Identity
  };
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  upvotes: number;
  downvotes: number;
  voters: Array<{
    fid: number;
    username: string;
  }>;
  createdAt: string;
  userVote?: 'upvote' | 'downvote' | null;
}

interface GalleryProps {
  className?: string;
  items: GalleryItem[];
  setItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onRefresh?: () => void;
}

export function Gallery({ className = "", items, setItems, onRefresh }: GalleryProps) {
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);
  const { addVote, removeVote, getUserVote } = useUserVotes();
  const { address, isConnected } = useAccount();

  const handleVote = async (itemId: string, voteType: 'upvote' | 'downvote') => {
    try {
      // Check if wallet is connected
      if (!isConnected || !address) {
        console.error('❌ Wallet not connected');
        return;
      }

      // Use connected wallet address as user identifier
      const walletAddress = address;
      const userFid = parseInt(address.slice(-8), 16); // Convert last 8 hex chars to number for unique FID
      const username = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      console.log('🔄 Voting with wallet data:', { 
        itemId, 
        voteType, 
        userFid, 
        username, 
        walletAddress 
      });

      const response = await fetch('/api/gallery/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          voteType,
          userFid,
          username,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Vote successful:', result);
        
        // Update vote tracking
        const currentVote = getUserVote(itemId);
        console.log('🔄 Vote state update:', { 
          currentVote, 
          newVote: result.userVote, 
          upvotes: result.upvotes, 
          downvotes: result.downvotes 
        });
        
        if (result.userVote) {
          // Vote was added or changed
          addVote(itemId, result.userVote);
        } else {
          // Vote was removed (user clicked same button)
          removeVote(itemId);
        }
        
        // Update the item in the list
        setItems(prevItems => 
          prevItems.map(item => 
            item.id === itemId 
              ? {
                  ...item,
                  upvotes: result.upvotes,
                  downvotes: result.downvotes,
                  userVote: result.userVote,
                }
              : item
          )
        );
      } else {
        const errorData = await response.json();
        console.error('❌ Vote failed:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Error voting:', error);
    }
  };

  const handleShare = (itemId: string) => {
    console.log('🔄 handleShare called with itemId:', itemId);
    setShowShareDialog(itemId);
  };

  const handleCloseShare = () => {
    setShowShareDialog(null);
  };

  const filteredAndSortedItems = items
    .filter(item => {
      if (filterBy === "all") return true;
      // Make comparison case-insensitive and more robust
      const noggleColor = (item.noggleColor || '').toLowerCase().trim();
      const eyeAnimation = (item.eyeAnimation || '').toLowerCase().trim();
      const filterValue = filterBy.toLowerCase().trim();
      const matches = noggleColor === filterValue || eyeAnimation === filterValue;
      console.log(`🔍 Gallery filter: "${item.title}" noggle:"${noggleColor}" eye:"${eyeAnimation}" vs filter:"${filterValue}" = ${matches}`);
      return matches;
    })
    .sort((a, b) => {
      if (sortBy === "votes") {
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const uniqueNoggleColors = [...new Set(items.map(item => item.noggleColor))];
  const uniqueEyeAnimations = [...new Set(items.map(item => item.eyeAnimation))];

  // Debug: Log available data
  console.log('🔍 Gallery items:', items.length);
  console.log('🔍 Unique noggle colors:', uniqueNoggleColors);
  console.log('🔍 Unique eye animations:', uniqueEyeAnimations);

  return (
    <div className={className}>
      {/* Gallery Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 text-center">
          Community Gallery
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-center px-2">
          Discover and vote for the best animated Nouns created by the community
        </p>

        {/* Filters and Sorting */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 mb-4 sm:mb-6 sm:justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "votes" | "recent")}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="votes">Most Voted</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All</option>
              {uniqueNoggleColors.map(color => (
                <option key={color} value={color}>{color} noggle</option>
              ))}
              {uniqueEyeAnimations.map(animation => (
                <option key={animation} value={animation}>{animation} eyes</option>
              ))}
            </select>
          </div>

          {onRefresh && (
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                icon={<Icon name="refresh" size="sm" />}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredAndSortedItems.map((item) => (
          <Card key={item.id} variant="outlined" className="overflow-hidden">
            {/* GIF Preview */}
            <div className="relative">
              <img
                src={item.gifUrl}
                alt={item.title}
                className="w-full h-48 sm:h-52 object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {item.noggleColor}
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  {item.eyeAnimation}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                {item.title}
              </h3>
              
              {/* Creator Info - OnchainKit Identity First */}
              <div className="flex items-center gap-2 mb-3">
                {item.creator.wallet ? (
                  // Use OnchainKit Identity when wallet address is available
                  <Identity
                    address={item.creator.wallet as `0x${string}`}
                    schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
                  >
                    <Avatar className="w-5 h-5 sm:w-6 sm:h-6" />
                    <Name className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <Badge />
                    </Name>
                  </Identity>
                ) : (
                  // Fallback for when no wallet address - just show username
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    @{item.creator.username}
                  </span>
                )}
              </div>

              {/* Vote Count and Voters */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="heart" size="sm" className={item.userVote === 'upvote' ? "text-red-500" : "text-gray-400"} />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {item.upvotes - item.downvotes} votes
                  </span>
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    ({item.upvotes} up, {item.downvotes} down)
                  </span>
                </div>
                
                {/* Voter Avatars */}
                {item.voters.length > 0 && (
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {item.voters.slice(0, 4).map((voter) => (
                      <div
                        key={voter.fid}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium"
                        title={voter.username}
                      >
                        {voter.username.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {item.voters.length > 4 && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                        +{item.voters.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={getUserVote(item.id) === 'upvote' ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id, 'upvote')}
                  icon={<Icon name="arrow-up" size="sm" />}
                  className="flex-1"
                >
                  <span className="hidden sm:inline">{getUserVote(item.id) === 'upvote' ? "Upvoted" : "Upvote"}</span>
                  <span className="sm:hidden">👍</span>
                </Button>
                
                <Button
                  variant={getUserVote(item.id) === 'downvote' ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id, 'downvote')}
                  icon={<Icon name="arrow-down" size="sm" />}
                  className="flex-1"
                >
                  <span className="hidden sm:inline">{getUserVote(item.id) === 'downvote' ? "Downvoted" : "Downvote"}</span>
                  <span className="sm:hidden">👎</span>
                </Button>
              </div>

              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(item.id)}
                  icon={<Icon name="share" size="sm" />}
                  className="w-full"
                >
                  Share
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 max-w-md w-full mx-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share this creation
                </h3>
                <button
                  onClick={handleCloseShare}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Icon name="x" size="sm" />
                </button>
              </div>
              <ShareButton
                gifUrl={items.find(item => item.id === showShareDialog)?.gifUrl || ""}
                title={items.find(item => item.id === showShareDialog)?.title || ""}
                noggleColor={items.find(item => item.id === showShareDialog)?.noggleColor || ""}
                eyeAnimation={items.find(item => item.id === showShareDialog)?.eyeAnimation || ""}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-2">
          <Icon name="gallery" size="xl" className="text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No GIFs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or create the first animated Noun!
          </p>
        </div>
      )}
    </div>
  );
} 