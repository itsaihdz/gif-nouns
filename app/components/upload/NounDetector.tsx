"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { Loading } from "../ui/Loading";

interface NounTraits {
  eyes: string;
  noggles: string;
  background: string;
  body: string;
  head: string;
  glasses?: string;
  hat?: string;
  shirt?: string;
}

interface ImagePreviewProps {
  imageUrl: string;
  onTraitsReady: (traits: NounTraits) => void;
  onError: (error: string) => void;
  className?: string;
}

export function ImagePreview({ 
  imageUrl, 
  onTraitsReady, 
  onError,
  className = "" 
}: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) return;

    const prepareImage = async () => {
      try {
        setIsLoading(true);

        // Simple image loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Default traits - user will customize these
        const defaultTraits: NounTraits = {
          eyes: "nouns", // Default eye animation
          noggles: "blue", // Default noggle color
          background: "blue",
          body: "normal",
          head: "normal",
        };

        setIsLoading(false);
        onTraitsReady(defaultTraits);

      } catch (error) {
        console.error("Error preparing image:", error);
        onError("Failed to load image. Please try again.");
        setIsLoading(false);
      }
    };

    prepareImage();
  }, [imageUrl, onTraitsReady, onError]);

  return (
    <Card variant="elevated" className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Noun Image
          </h3>
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Loading variant="dots" size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            </div>
          )}
        </div>

        {/* Image Preview */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Your Noun"
            className="w-full h-64 object-contain"
          />
          
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loading variant="spinner" size="lg" />
                <p className="mt-2 text-sm">Loading your image...</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        <div className="mt-4 space-y-2">
          {!isLoading && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <Icon name="check" size="sm" />
              <span>Image loaded successfully</span>
            </div>
          )}
          {!isLoading && (
            <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
              <Icon name="sparkles" size="sm" />
              <span>Ready to customize your animated Noun!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 