"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";

import { ImagePreview } from "./ImagePreview";
import { DownloadSharePage } from "./DownloadSharePage";
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
    shareUrl?: string; // Supabase URL for sharing
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      wallet: string;
      username: string;
      pfp: string;
    };
  }) => void;
}

type UploadStep = "upload" | "customize" | "download";

export function UploadStudio({ className = "", onGifCreated }: UploadStudioProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>("upload");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [traits, setTraits] = useState<NounTraits | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [createdGifData, setCreatedGifData] = useState<{
    gifUrl: string;
    shareUrl?: string; // Supabase URL for sharing
    title: string;
    noggleColor: string;
    eyeAnimation: string;
    creator: {
      wallet: string;
      username: string;
      pfp: string;
    };
  } | null>(null);
  const tracking = useTracking();

  const handleFileUpload = (file: File) => {
    try {
      setError("");
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      
      // Don't set default traits - let user select them in the customize step
      setTraits(null);
      
      // Move to customize step
      setCurrentStep("customize");
      
      // Track upload event
      tracking.uploadStart(file.name, file.size);
      
    } catch (err) {
      setError("Failed to process uploaded file");
      console.error("File processing error:", err);
    }
  };



  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSuccess = (message: string) => {
    // Clear any existing errors and show success
    setError("");
    setSuccessMessage(message);
    // Auto-clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleGifCreated = (gifData: { 
    gifUrl: string; // Generated GIF URL for preview/download
    shareUrl?: string; // Supabase URL for sharing
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      wallet: string;
      username: string;
      pfp: string;
    };
  }) => {
    console.log('🔄 ===== UploadStudio handleGifCreated CALLED =====');
    console.log('🔄 Received gifData:', gifData);
    console.log('🔄 Setting createdGifData...');
    setCreatedGifData(gifData);
    console.log('🔄 Changing step to download...');
    setCurrentStep("download");
    // Don't call onGifCreated here - only call it when user clicks "View in Gallery"
    console.log('🔄 ===== UploadStudio handleGifCreated COMPLETED =====');
  };

  const handleBackToCreate = () => {
    setCurrentStep("upload");
    setImageUrl("");
    setTraits(null);
    setCreatedGifData(null);
    setError("");
    setSuccessMessage("");
  };

  const handleViewInGallery = async () => {
    console.log('🔄 ===== handleViewInGallery CALLED =====');
    console.log('🔄 createdGifData:', createdGifData);
    
    if (!createdGifData) {
      console.error('❌ No GIF data available for gallery upload');
      return;
    }

    try {
      console.log('🔄 Uploading to gallery...');
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gifUrl: createdGifData.shareUrl || createdGifData.gifUrl, // Use Supabase URL if available
          creator: createdGifData.creator,
          title: createdGifData.title,
          noggleColor: createdGifData.noggleColor,
          eyeAnimation: createdGifData.eyeAnimation,
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        console.log('✅ Gallery item created successfully:', newItem);
        
        // Call parent callback to update gallery and switch view
        onGifCreated?.(createdGifData);
      } else {
        console.error('❌ Failed to create gallery item');
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
      }
    } catch (error) {
      console.error('❌ Error uploading to gallery:', error);
    }
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



      case "customize":
        return (
          <ImagePreview
            originalImageUrl={imageUrl}
            traits={traits}
            onError={handleError}
            onSuccess={handleSuccess}
            onGifCreated={handleGifCreated}
            className="max-w-6xl mx-auto"
          />
        );

      case "download":
        console.log('🔄 ===== RENDERING DOWNLOAD STEP =====');
        console.log('🔄 Current step:', currentStep);
        console.log('🔄 createdGifData:', createdGifData);
        console.log('🔄 createdGifData type:', typeof createdGifData);
        console.log('🔄 createdGifData is null?', createdGifData === null);
        console.log('🔄 createdGifData is undefined?', createdGifData === undefined);
        
        if (!createdGifData) {
          console.error('❌ createdGifData is null/undefined in download step');
          console.error('❌ This means handleGifCreated was not called properly');
          return (
            <div className="text-center p-8">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error: GIF data not found. Please try creating the GIF again.
              </p>
              <Button onClick={handleBackToCreate} variant="outline">
                Back to Create
              </Button>
            </div>
          );
        }
        return (
          <DownloadSharePage
            gifUrl={createdGifData.gifUrl}
            shareUrl={createdGifData.shareUrl}
            title={createdGifData.title}
            noggleColor={createdGifData.noggleColor}
            eyeAnimation={createdGifData.eyeAnimation}
            creator={createdGifData.creator}
            onBackToCreate={handleBackToCreate}
            onViewInGallery={handleViewInGallery}
            className="max-w-6xl mx-auto"
          />
        );

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
              { step: "customize", label: "Customize", icon: "palette" },
              { step: "download", label: "Download", icon: "download" },
            ].map((stepInfo, index) => {
              const isActive = currentStep === stepInfo.step;
              const isCompleted = [
                "customize", "download"
              ].includes(currentStep) && index < [
                "customize", "download"
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

        {/* Success Display */}
        {successMessage && (
          <div className="max-w-2xl mx-auto mb-2">
            <Card variant="default" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <div className="p-2 flex items-center space-x-2">
                <Icon name="check" className="text-green-500" size="md" />
                <div>
                  <p className="text-green-700 dark:text-green-300 font-medium">Success!</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSuccessMessage("")}
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