"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";

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
  isVoted: boolean;
}

interface GalleryProps {
  className?: string;
  items: GalleryItem[];
  setItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
}

export function Gallery({ className = "", items, setItems }: GalleryProps) {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [filterBy, setFilterBy] = useState<string>("all");

  const handleVote = async (itemId: string) => {
    // Optimistic update
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            votes: item.isVoted ? item.votes - 1 : item.votes + 1,
            isVoted: !item.isVoted,
            voters: item.isVoted 
              ? item.voters.filter(v => v.fid !== 12345) // Mock current user FID
              : [...item.voters, { fid: 12345, username: "you.noun", pfp: "https://picsum.photos/32/32?random=8" }]
          }
        : item
    ));

    // TODO: Call API to actually vote
    console.log(`Voting for item ${itemId}`);
  };

  const handleShare = (item: GalleryItem) => {
    // TODO: Implement Farcaster sharing
    const shareText = `Check out this amazing animated Noun by @${item.creator.username}! 🎨✨\n\nCreated with #NounsRemixStudio\n\nVote for it in the gallery! 🗳️`;
    console.log("Sharing:", shareText);
    alert("Share functionality coming soon!");
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "votes") {
      return b.votes - a.votes;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const filteredItems = filterBy === "all" 
    ? sortedItems 
    : sortedItems.filter(item => item.noggleColor === filterBy || item.eyeAnimation === filterBy);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Community Gallery
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Discover and vote for the best animated Nouns created by the community
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant={sortBy === "votes" ? "gradient" : "outline"}
            size="sm"
            onClick={() => setSortBy("votes")}
          >
            <Icon name="trending-up" size="sm" />
            Most Voted
          </Button>
          <Button
            variant={sortBy === "recent" ? "gradient" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
          >
            <Icon name="clock" size="sm" />
            Recent
          </Button>
        </div>

        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Styles</option>
            <option value="blue">Blue Noggles</option>
            <option value="grass">Grass Noggles</option>
            <option value="purple">Purple Noggles</option>
            <option value="nouns">Nouns Eyes</option>
            <option value="viscos">Viscos Eyes</option>
            <option value="locos">Locos Eyes</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} variant="outlined" className="overflow-hidden">
            {/* GIF Preview */}
            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
              <img
                src={item.gifUrl}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              
              {/* Vote Button Overlay */}
              <div className="absolute top-3 right-3">
                <Button
                  variant={item.isVoted ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => handleVote(item.id)}
                  icon={<Icon name="heart" size="sm" />}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
                >
                  {item.votes}
                </Button>
              </div>
            </div>

            {/* Item Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img
                    src={item.creator.pfp}
                    alt={item.creator.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.creator.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(item)}
                  icon={<Icon name="share" size="sm" />}
                >
                  Share
                </Button>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>

              {/* Traits */}
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  {item.noggleColor} noggle
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  {item.eyeAnimation} eyes
                </span>
              </div>

              {/* Voters */}
              {item.voters.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Voted by {item.voters.length} people:
                  </p>
                  <div className="flex -space-x-2">
                    {item.voters.slice(0, 5).map((voter, index) => (
                      <img
                        key={voter.fid}
                        src={voter.pfp}
                        alt={voter.username}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                        title={voter.username}
                      />
                    ))}
                    {item.voters.length > 5 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          +{item.voters.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Icon name="gallery" size="xl" className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No GIFs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filterBy === "all" 
              ? "Be the first to create and share an animated Noun!" 
              : `No GIFs match the "${filterBy}" filter. Try a different filter or create something new!`
            }
          </p>
        </div>
      )}
    </div>
  );
} 