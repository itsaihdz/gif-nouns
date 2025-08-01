"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { FarcasterShare } from "../social/FarcasterShare";

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
  votes: number;
  voters: Array<{
    fid: number;
    username: string;
    pfp: string;
  }>;
  createdAt: string;
  isVoted?: boolean;
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

  const handleVote = async (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? {
            ...item,
            votes: item.isVoted ? item.votes - 1 : item.votes + 1,
            isVoted: !item.isVoted,
            voters: item.isVoted
              ? item.voters.filter(v => v.fid !== 12345)
              : [...item.voters, { fid: 12345, username: "you.noun", pfp: "https://picsum.photos/32/32?random=8" }]
          }
        : item
    ));
    // TODO: Call API to actually vote
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
        return b.votes - a.votes;
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const uniqueNoggleColors = [...new Set(items.map(item => item.noggleColor))];
  const uniqueEyeAnimations = [...new Set(items.map(item => item.eyeAnimation))];

  return (
    <div className={className}>
      {/* Gallery Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Community Gallery
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Discover and vote for the best animated Nouns created by the community
        </p>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "votes" | "recent")}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
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
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              
              {/* Creator Info */}
              <div className="flex items-center gap-2 mb-3">
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
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="heart" size="sm" className={item.isVoted ? "text-red-500" : "text-gray-400"} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.votes} votes
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
                  variant={item.isVoted ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id)}
                  icon={<Icon name="heart" size="sm" />}
                  className="flex-1"
                >
                  {item.isVoted ? "Voted" : "Vote"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(item.id)}
                  icon={<Icon name="share" size="sm" />}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <FarcasterShare
              gifUrl={items.find(item => item.id === showShareDialog)?.gifUrl || ""}
              title={items.find(item => item.id === showShareDialog)?.title || ""}
              noggleColor={items.find(item => item.id === showShareDialog)?.noggleColor || ""}
              eyeAnimation={items.find(item => item.id === showShareDialog)?.eyeAnimation || ""}
              onClose={handleCloseShare}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <Icon name="gallery" size="xl" className="text-gray-400 mx-auto mb-4" />
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