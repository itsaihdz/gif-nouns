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
  onShare?: () => void;
  onClose?: () => void;
}

export function FarcasterShare({ gifUrl, title, noggleColor, eyeAnimation, onShare, onClose }: FarcasterShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState("");

  const generateShareText = () => {
    return `Check out my animated Noun "${title}"! 🎨✨\n\nCreated with GifNouns\n\n${noggleColor} noggle + ${eyeAnimation} eyes = pure magic! 🌟\n\nVote for it in the gallery! https://farcaster.xyz/miniapps/SXnRtPs9CWf4/gifnouns`;
  };

  useState(() => {
    setShareText(generateShareText());
  });

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // TODO: Implement actual Farcaster sharing
      console.log("Sharing to Farcaster:", shareText);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onShare?.();
      alert("Shared to Farcaster successfully!");
    } catch (error) {
      console.error("Share error:", error);
      alert("Failed to share to Farcaster");
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Copy error:", error);
      alert("Failed to copy link");
    }
  };

  const characterCount = shareText.length;
  const maxCharacters = 280;

  return (
    <Card variant="outlined" className="max-w-md mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Share on Farcaster</h3>
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
            Share Text
          </label>
          <textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
            placeholder="Write your share message..."
            maxLength={maxCharacters}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {characterCount}/{maxCharacters} characters
            </span>
            {characterCount > maxCharacters && (
              <span className="text-xs text-red-500">Too long!</span>
            )}
          </div>
        </div>

        {/* Traits Display */}
        <div className="mb-4 flex gap-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
            {noggleColor} noggle
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
            {eyeAnimation} eyes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="gradient"
            onClick={handleShare}
            disabled={isSharing || characterCount > maxCharacters}
            icon={<Icon name="farcaster" size="sm" />}
            className="flex-1"
          >
            {isSharing ? "Sharing..." : "Share"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCopyLink}
            icon={<Icon name="copy" size="sm" />}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </Card>
  );
} 