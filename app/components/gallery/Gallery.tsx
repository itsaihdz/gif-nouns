"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { ShareButton } from "../social/ShareButton";

interface GalleryItem {
  id: string;
  gifUrl: string;
  creator: {
    fid: number;
    username: string;
    pfp: string;
  };
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  upvotes: number;
  downvotes: number;
  voters: Array<{
    fid: number;
    username: string;
    pfp: string;
  }>;
  createdAt: string;
  userVote?: 'upvote' | 'downvote' | null;
}

interface GalleryProps {
  className?: string;
  items: GalleryItem[];
  setItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
}

export function Gallery({ className = "", items, setItems }: GalleryProps) {
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [showShareDialog, setShowShareDialog] = useState<string | null>(null);

  const handleVote = async (itemId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await fetch('/api/gallery/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          userFid: 12345, // Mock user ID
          username: "you.noun",
          pfp: "https://picsum.photos/32/32?random=8",
          voteType,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
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
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleShare = (itemId: string) => {
    setShowShareDialog(itemId);
  };

  const handleCloseShare = () => {
    setShowShareDialog(null);
  };

  const filteredAndSortedItems = items
    .filter(item => {
      if (filterBy === "all") return true;
      return item.noggleColor === filterBy || item.eyeAnimation === filterBy;
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

  return (
    <div className={className}>
      {/* Gallery Header */}
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Gallery
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Discover and vote for the best animated Nouns created by the community
        </p>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "votes" | "recent")}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              <option value="votes">Most Voted</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
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
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredAndSortedItems.map((item) => (
          <Card key={item.id} variant="outlined" className="overflow-hidden">
            {/* GIF Preview */}
            <div className="relative">
              <img
                src={item.gifUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {item.noggleColor}
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  {item.eyeAnimation}
                </span>
              </div>
            </div>

            {/* Item Details */}
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              
              {/* Creator Info */}
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={item.creator.pfp}
                  alt={item.creator.username}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  @{item.creator.username}
                </span>
              </div>

              {/* Vote Count and Voters */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="heart" size="sm" className={item.userVote === 'upvote' ? "text-red-500" : "text-gray-400"} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.upvotes - item.downvotes} votes
                  </span>
                  <span className="text-xs text-gray-500">
                    ({item.upvotes} up, {item.downvotes} down)
                  </span>
                </div>
                
                {/* Voter Avatars */}
                {item.voters.length > 0 && (
                  <div className="flex -space-x-2">
                    {item.voters.slice(0, 5).map((voter) => (
                      <img
                        key={voter.fid}
                        src={voter.pfp}
                        alt={voter.username}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                        title={voter.username}
                      />
                    ))}
                    {item.voters.length > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                        +{item.voters.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={item.userVote === 'upvote' ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id, 'upvote')}
                  icon={<Icon name="arrow-up" size="sm" />}
                  className="flex-1"
                >
                  {item.userVote === 'upvote' ? "Upvoted" : "Upvote"}
                </Button>
                
                <Button
                  variant={item.userVote === 'downvote' ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id, 'downvote')}
                  icon={<Icon name="arrow-down" size="sm" />}
                  className="flex-1"
                >
                  {item.userVote === 'downvote' ? "Downvoted" : "Downvote"}
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