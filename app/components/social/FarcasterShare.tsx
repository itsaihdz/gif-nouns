"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

interface FarcasterShareProps {
  gifUrl: string;
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  creatorUsername?: string;
  onShare?: () => void;
  onClose?: () => void;
}

export function FarcasterShare({
  gifUrl,
  title,
  noggleColor,
  eyeAnimation,
  creatorUsername,
  onShare,
  onClose
}: FarcasterShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState("");

  // Generate default share text
  const generateShareText = () => {
    const baseText = `🎨 Just created "${title}" with #NounsRemixStudio!\n\n`;
    const traitsText = `✨ ${noggleColor} noggle + ${eyeAnimation} eyes\n\n`;
    const callToAction = `🎯 Create your own animated Noun and join the community! 🚀\n\n`;
    const hashtags = `#Nouns #AnimatedNouns #Farcaster #Base`;
    
    return baseText + traitsText + callToAction + hashtags;
  };

  // Initialize share text
  useState(() => {
    setShareText(generateShareText());
  });

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // TODO: Integrate with Neynar's cast API
      // This would typically involve:
      // 1. Getting user's Farcaster credentials
      // 2. Creating a cast with the GIF embed
      // 3. Adding the share text
      // 4. Posting to Farcaster
      
      console.log("Sharing to Farcaster:", {
        text: shareText,
        gifUrl,
        title,
        noggleColor,
        eyeAnimation
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      onShare?.();
      
      // Show success message
      alert("Successfully shared to Farcaster! 🎉");
      
    } catch (error) {
      console.error("Error sharing to Farcaster:", error);
      alert("Failed to share to Farcaster. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/gallery?gif=${encodeURIComponent(gifUrl)}&title=${encodeURIComponent(title)}`;
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard! 📋");
    } catch (error) {
      console.error("Error copying link:", error);
      alert("Failed to copy link. Please try again.");
    }
  };

  return (
    <Card variant="outlined" className="max-w-md mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Share on Farcaster
          </h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<Icon name="close" size="sm" />}
            >
              Close
            </Button>
          )}
        </div>

        {/* GIF Preview */}
        <div className="mb-4">
          <img
            src={gifUrl}
            alt={title}
            className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        </div>

        {/* Share Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share Message
          </label>
          <textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
            placeholder="Write your share message..."
            maxLength={280}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {shareText.length}/280 characters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShareText(generateShareText())}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Traits Display */}
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {noggleColor} noggle
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
            {eyeAnimation} eyes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleShare}
            disabled={isSharing}
            icon={<Icon name="share" size="md" />}
            className="w-full"
          >
            {isSharing ? "Sharing..." : "Share to Farcaster"}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopyLink}
            icon={<Icon name="link" size="md" />}
            className="w-full"
          >
            Copy Link
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Sharing your creation helps grow the community and lets others discover your amazing animated Noun!
          </p>
        </div>
      </div>
    </Card>
  );
} 