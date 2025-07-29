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

interface NounDetectorProps {
  imageUrl: string;
  onTraitsDetected: (traits: NounTraits) => void;
  onError: (error: string) => void;
  className?: string;
}

export function NounDetector({ 
  imageUrl, 
  onTraitsDetected, 
  onError,
  className = "" 
}: NounDetectorProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!imageUrl) return;

    const detectTraits = async () => {
      try {
        setIsProcessing(true);
        setProgress(0);

        // Simulate image loading
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(30);

        // Simulate trait detection (in real implementation, this would use ML/AI)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(60);
        
        // Mock trait detection - replace with actual AI detection
        const detectedTraits: NounTraits = {
          eyes: "nouns",
          noggles: "blue",
          background: "blue",
          body: "normal",
          head: "normal",
        };

        setProgress(100);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsProcessing(false);
        onTraitsDetected(detectedTraits);

      } catch (error) {
        console.error("Error detecting traits:", error);
        onError("Failed to detect Noun traits. Please try again.");
        setIsProcessing(false);
      }
    };

    detectTraits();
  }, [imageUrl, onTraitsDetected, onError]);

  return (
    <Card variant="elevated" className={className}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detecting Noun Traits
          </h3>
          {isProcessing && (
            <div className="flex items-center space-x-2">
              <Loading variant="dots" size="sm" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {progress}%
              </span>
            </div>
          )}
        </div>

        {/* Image Preview */}
        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Uploaded Noun"
            className="w-full h-64 object-contain"
          />
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loading variant="spinner" size="lg" />
                <p className="mt-2 text-sm">Analyzing your Noun...</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Loading image</span>
              <span>Detecting traits</span>
              <span>Preparing preview</span>
            </div>
          </div>
        )}

        {/* Status Messages */}
        <div className="mt-4 space-y-2">
          {progress >= 30 && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <Icon name="check" size="sm" />
              <span>Image loaded successfully</span>
            </div>
          )}
          {progress >= 60 && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <Icon name="check" size="sm" />
              <span>Traits detected</span>
            </div>
          )}
          {progress >= 100 && (
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <Icon name="check" size="sm" />
              <span>Ready for customization</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 