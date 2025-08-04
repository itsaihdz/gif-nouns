"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { NounDetector } from "./NounDetector";
import { ImagePreview } from "./ImagePreview";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { useTracking } from "../analytics/Tracking";

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

interface UploadStudioProps {
  className?: string;
  onGifCreated?: (gifData: { 
    gifUrl: string; 
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      fid: number;
      username: string;
      pfp: string;
    };
  }) => void;
}

type UploadStep = "upload" | "detecting" | "preview";

export function UploadStudio({ className = "", onGifCreated }: UploadStudioProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [traits, setTraits] = useState<NounTraits | null>(null);
  const [error, setError] = useState<string>("");
  const tracking = useTracking();

  const handleFileUpload = (file: File) => {
    try {
      setError("");
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Move to detection step
      setCurrentStep("detecting");
      
      // Track upload event
      tracking.uploadStart(file.name, file.size);
      
    } catch (err) {
      setError("Failed to process uploaded file");
      console.error("File processing error:", err);
    }
  };

  const handleTraitsDetected = (detectedTraits: NounTraits) => {
    setTraits(detectedTraits);
    setCurrentStep("preview");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleGifCreated = (gifData: { 
    gifUrl: string; 
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      fid: number;
      username: string;
      pfp: string;
    };
  }) => {
    onGifCreated?.(gifData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "upload":
        return (
          <FileUpload
            onFileSelect={handleFileUpload}
            onError={handleError}
            className="max-w-2xl mx-auto"
          />
        );

      case "detecting":
        return (
          <NounDetector
            imageUrl={imageUrl}
            onTraitsDetected={handleTraitsDetected}
            onError={handleError}
            className="max-w-4xl mx-auto"
          />
        );

      case "preview":
        return traits ? (
          <ImagePreview
            originalImageUrl={imageUrl}
            traits={traits}
            onError={handleError}
            onGifCreated={handleGifCreated}
            className="max-w-6xl mx-auto"
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 ${className}`}>
      <div className="container mx-auto px-2 py-2">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Nouns Remix Studio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your Noun PFP and transform it into animated art with custom noggle colors and eye animations
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-2">
          <div className="flex items-center justify-center space-x-2">
            {[
              { step: "upload", label: "Upload", icon: "upload" },
              { step: "detecting", label: "Detect", icon: "eye" },
              { step: "preview", label: "Customize", icon: "palette" },
              { step: "exported", label: "Export", icon: "download" },
            ].map((stepInfo, index) => {
              const isActive = currentStep === stepInfo.step;
              const isCompleted = [
                "detecting", "preview", "exported"
              ].includes(currentStep) && index < [
                "detecting", "preview", "exported"
              ].indexOf(currentStep) + 1;

              return (
                <div key={stepInfo.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? "border-purple-500 bg-purple-500 text-white" 
                      : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                  }`}>
                    <Icon name={stepInfo.icon} size="sm" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive 
                      ? "text-purple-600 dark:text-purple-400" 
                      : isCompleted
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {stepInfo.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-2">
            <Card variant="default" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <div className="p-2 flex items-center space-x-2">
                <Icon name="close" className="text-red-500" size="md" />
                <div>
                  <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError("")}
                  className="ml-auto"
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="min-h-[600px]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with ❤️ for the Nouns community
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Base L2</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Farcaster Native</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">Open Source</span>
          </div>
        </div>
      </div>
    </div>
  );
} 