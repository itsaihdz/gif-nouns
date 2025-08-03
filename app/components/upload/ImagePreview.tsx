"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { useGifGenerator } from "./GifGenerator";
import { useUser } from "../../contexts/UserContext";
import { useAccount } from "wagmi";
import { ShareDialog } from "../social/ShareDialog";


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
  originalImageUrl: string;
  traits: NounTraits;
  onError: (error: string) => void;
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
  className?: string;
}

// Color palettes for noggles - these correspond to PNG files in /public/assets/noggles/
// Updated to match actual asset files from GitHub repository
const NOGGLE_COLORS = [
  { name: "Blue", value: "blue", class: "bg-blue-400", file: "blue.png" },
  { name: "Deep Teal", value: "deep-teal", class: "bg-teal-600", file: "deep teal.png" },
  { name: "Gomita", value: "gomita", class: "bg-pink-300", file: "gomita.png" },
  { name: "Grass", value: "grass", class: "bg-green-500", file: "grass.png" },
  { name: "Green Blue", value: "green-blue", class: "bg-cyan-500", file: "green blue.png" },
  { name: "Grey Light", value: "grey-light", class: "bg-gray-300", file: "grey light.png" },
  { name: "Guava", value: "guava", class: "bg-orange-400", file: "guava.png" },
  { name: "Hip Rose", value: "hip-rose", class: "bg-rose-500", file: "hip rose.png" },
  { name: "Honey", value: "honey", class: "bg-amber-400", file: "honey.png" },
  { name: "Hyper", value: "hyper", class: "bg-purple-500", file: "hyper.png" },
  { name: "Hyperliquid", value: "hyperliquid", class: "bg-blue-600", file: "hyperliquid.png" },
  { name: "Lavender", value: "lavender", class: "bg-purple-300", file: "lavender.png" },
  { name: "Magenta", value: "magenta", class: "bg-magenta-400", file: "magenta.png" },
  { name: "Orange", value: "orange", class: "bg-orange-400", file: "orange.png" },
  { name: "Pink Purple", value: "pink-purple", class: "bg-fuchsia-400", file: "pink purple.png" },
  { name: "Purple", value: "purple", class: "bg-purple-400", file: "purple.png" },
  { name: "Red", value: "red", class: "bg-red-400", file: "red.png" },
  { name: "Smoke", value: "smoke", class: "bg-gray-500", file: "smoke.png" },
  { name: "Teal", value: "teal", class: "bg-teal-400", file: "teal.png" },
  { name: "Watermelon", value: "watermelon", class: "bg-green-400", file: "watermelon.png" },
  { name: "Yellow Orange", value: "yellow-orange", class: "bg-orange-300", file: "yellow orange.png" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-400", file: "yellow.png" },
];

// Eye animations - these correspond to GIF files in /public/assets/eyes/
// Updated to match actual asset files from GitHub repository
const EYE_ANIMATIONS = [
  { name: "Nouns", value: "nouns", icon: "eye", file: "nouns.gif" },
  { name: "Ojos Nouns", value: "ojos-nouns", icon: "eye", file: "ojos nouns.gif" },
  { name: "Ojos Pepepunk", value: "ojos-pepepunk", icon: "eye", file: "ojos pepepunk.gif" },
  { name: "Ojos Pepepunk En Medio", value: "ojos-pepepunk-en-medio", icon: "eye", file: "ojos pepepunk en medio.gif" },
  { name: "Arriba", value: "arriba", icon: "eye", file: "arriba.gif" },
  { name: "Arriba Derecha", value: "arriba-derecha", icon: "eye", file: "arriba derecha.gif" },
  { name: "Arriba Izquierda", value: "arriba-izquierda", icon: "eye", file: "arriba izquierda.gif" },
  { name: "Abajo", value: "abajo", icon: "eye", file: "abajo.gif" },
  { name: "Abajo Derecha", value: "abajo-derecha", icon: "eye", file: "abajo derecha.gif" },
  { name: "Abajo Izquierda", value: "abajo-izquierda", icon: "eye", file: "abajo izquierda.gif" },
  { name: "Viscos", value: "viscos", icon: "sparkles", file: "viscos.gif" },
  { name: "Viscos Derecha", value: "viscos-derecha", icon: "sparkles", file: "viscos derecha.gif" },
  { name: "Viscos Izquierda", value: "viscos-izquierda", icon: "sparkles", file: "viscos izquierda.gif" },
  { name: "Locos", value: "locos", icon: "sparkles", file: "locos.gif" },
  { name: "Serpiente", value: "serpiente", icon: "sparkles", file: "serpiente.gif" },
  { name: "Vampiro", value: "vampiro", icon: "sparkles", file: "vampiro.gif" },
];

export function ImagePreview({ 
  originalImageUrl, 
  onError,
  onGifCreated,
  className = "" 
}: ImagePreviewProps) {
  const [selectedNoggleColor, setSelectedNoggleColor] = useState(NOGGLE_COLORS[0]?.value || "");
  const [selectedEyeAnimation, setSelectedEyeAnimation] = useState(EYE_ANIMATIONS[0]?.value || "");
  const [isExporting, setIsExporting] = useState(false);
  const [animatedPreviewUrl, setAnimatedPreviewUrl] = useState<string>("");
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string>("");
  const [exportProgress, setExportProgress] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [nextGifNumber, setNextGifNumber] = useState(1);
  const { user, isAuthenticated } = useUser();
  const { address } = useAccount();
  const [ipfsMetadataUrl, setIpfsMetadataUrl] = useState<string | null>(null);

  // Get the next sequential number when component mounts
  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const items = await response.json();
          setNextGifNumber(items.length + 1);
        }
      } catch (error) {
        console.log("Could not fetch gallery count, using default number");
      }
    };
    
    fetchNextNumber();
  }, []);

  // Initialize GIF generator
  const { generateGif, downloadGif, mintAsNFT } = useGifGenerator({
    originalImageUrl,
    noggleColor: selectedNoggleColor,
    eyeAnimation: selectedEyeAnimation,
    width: 800,
    height: 800,
    fps: 8,
    frames: 16,
    duration: 2.0,
    onProgress: setExportProgress,
    onComplete: (gifUrl) => {
      setGeneratedGifUrl(gifUrl);
      setIsExporting(false);
    },
    onError: (error) => {
      onError(error);
      setIsExporting(false);
    }
  });

  // Update animated preview when selections change
  const updateAnimatedPreview = useCallback(() => {
    // For preview, we'll show the eye animation GIF directly
    // since the user's image and noggle are static layers
    if (selectedEyeAnimation && selectedEyeAnimation !== "normal") {
      const eyeAnimation = EYE_ANIMATIONS.find(e => e.value === selectedEyeAnimation);
      if (eyeAnimation && eyeAnimation.file) {
        // Show the animated eye GIF directly for preview
        setAnimatedPreviewUrl(`/assets/eyes/${eyeAnimation.file}`);
      } else {
        setAnimatedPreviewUrl(originalImageUrl);
      }
    } else {
      setAnimatedPreviewUrl(originalImageUrl);
    }
  }, [selectedEyeAnimation, originalImageUrl]);

  useEffect(() => {
    updateAnimatedPreview();
  }, [updateAnimatedPreview]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    try {
      // First generate the GIF
      await generateGif();
      setExportProgress(25);
      
      // Then upload to IPFS if generation was successful
      if (generatedGifUrl) {
        setExportProgress(50);
        
        // Fetch the generated GIF as a blob
        const response = await fetch(generatedGifUrl);
        const gifBlob = await response.blob();

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `gifnouns_${timestamp}.gif`;

        // Upload GIF to IPFS
        const formData = new FormData();
        formData.append('file', gifBlob, filename);
        formData.append('type', 'gif');
        formData.append('filename', filename);

        setExportProgress(75);

        const uploadResponse = await fetch('/api/ipfs/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload GIF to IPFS');
        }

        const uploadResult = await uploadResponse.json();
        const ipfsGifUrl = uploadResult.url;
        const ipfsGifHash = uploadResult.hash;

        // Create NFT metadata
        const metadata = {
          name: `gifnouns #${nextGifNumber}`,
          description: `An animated Noun with ${selectedNoggleColor} noggle and ${selectedEyeAnimation} eyes. Created with gifnouns.`,
          image: ipfsGifUrl,
          animation_url: ipfsGifUrl,
          external_url: "https://gifnouns.freezerverse.com",
          attributes: [
            {
              trait_type: "Noggle Color",
              value: selectedNoggleColor
            },
            {
              trait_type: "Eye Animation",
              value: selectedEyeAnimation
            },
            {
              trait_type: "Creator",
              value: address ? `user_${address.slice(2, 8)}` : "anonymous"
            }
          ],
          properties: {
            files: [
              {
                type: "image/gif",
                uri: ipfsGifUrl
              }
            ],
            category: "image"
          }
        };

        // Upload metadata to IPFS
        const metadataFormData = new FormData();
        metadataFormData.append('type', 'metadata');
        metadataFormData.append('filename', `metadata_${timestamp}.json`);
        metadataFormData.append('metadata', JSON.stringify(metadata));

        setExportProgress(90);

        const metadataResponse = await fetch('/api/ipfs/upload', {
          method: 'POST',
          body: metadataFormData,
        });

        if (!metadataResponse.ok) {
          throw new Error('Failed to upload metadata to IPFS');
        }

        const metadataResult = await metadataResponse.json();
        const ipfsMetadataUrl = metadataResult.url;
        const ipfsMetadataHash = metadataResult.hash;

        // Store the IPFS URLs
        setGeneratedGifUrl(ipfsGifUrl);
        setIpfsMetadataUrl(ipfsMetadataUrl);

        setExportProgress(95);

        // Automatically add to gallery
        await handleUploadToGallery();

        setExportProgress(100);

        // Show success message
        onError(`GIF created successfully! Uploaded to IPFS and added to gallery.`);
        
        console.log('IPFS Upload Results:', {
          gifUrl: ipfsGifUrl,
          gifHash: ipfsGifHash,
          metadataUrl: ipfsMetadataUrl,
          metadataHash: ipfsMetadataHash
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      onError("Failed to export GIF to IPFS");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (generatedGifUrl) {
      const filename = `animated-noun-${Date.now()}.gif`;
      downloadGif(generatedGifUrl, filename);
    }
  };

  const handleMintNFT = async () => {
    if (!ipfsMetadataUrl) {
      onError("Please export the GIF to IPFS first");
      return;
    }

    try {
      // TODO: Implement actual NFT minting using the IPFS metadata URL
      console.log('Minting NFT with metadata URL:', ipfsMetadataUrl);
      
      // For now, show a success message
      onError(`NFT ready to mint! Metadata: ${ipfsMetadataUrl}`);
    } catch (error) {
      console.error('Minting error:', error);
      onError("Failed to mint NFT");
    }
  };

  const handleShareToFarcaster = () => {
    if (generatedGifUrl) {
      setShowShareDialog(true);
    } else {
      onError("Please generate a GIF first");
    }
  };

  const handleCloseShare = () => {
    setShowShareDialog(false);
  };

  const handleUploadToGallery = async () => {
    try {
      if (!generatedGifUrl) {
        onError("Please generate a GIF first");
        return;
      }

      // Use IPFS URL if available, otherwise use the generated URL
      const gifUrlToUse = generatedGifUrl.startsWith('https://ipfs.io/') 
        ? generatedGifUrl 
        : generatedGifUrl;

      // Get user data - either from Farcaster context or fetch from API
      let creatorData = null;
      
      if (isAuthenticated && user) {
        // Use authenticated Farcaster user
        creatorData = {
          fid: user.fid,
          username: user.username,
          pfp: user.pfp,
        };
      } else if (address) {
        // Try to fetch user data by wallet address
        try {
          const response = await fetch(`/api/auth/farcaster?address=${address}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.user) {
              creatorData = {
                fid: result.user.fid,
                username: result.user.username,
                pfp: result.user.pfp,
              };
            }
          }
        } catch (error) {
          console.log("Could not fetch user by wallet address:", error);
        }
      }

      // If no user data found, use wallet address as fallback
      if (!creatorData && address) {
        creatorData = {
          fid: 0, // Will be handled by backend
          username: `user_${address.slice(2, 8)}.noun`,
          pfp: `https://picsum.photos/32/32?random=${address.slice(2, 8)}`,
        };
      }

      if (!creatorData) {
        onError("Unable to identify user. Please connect your wallet or Farcaster account.");
        return;
      }

      // Get the next sequential number from the gallery
      let nextNumber = 1;
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const items = await response.json();
          nextNumber = items.length + 1;
        }
      } catch (error) {
        console.log("Could not fetch gallery count, using default number");
      }

      const gifData = {
        gifUrl: gifUrlToUse,
        title: `gifnouns #${nextNumber}`,
        noggleColor: selectedNoggleColor,
        eyeAnimation: selectedEyeAnimation,
        creator: creatorData,
      };

      onGifCreated?.(gifData);
    } catch (error) {
      onError("Failed to upload to gallery");
      console.error("Gallery upload error:", error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Preview Section */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Animated Preview
          </h3>
          
          {/* Animated Preview */}
          <div className="relative">
            {animatedPreviewUrl ? (
              <div className="relative">
                {/* Base image with noggle (static) */}
                <div className="relative w-full h-96">
                  <img
                    src={originalImageUrl}
                    alt="Original Noun"
                    className="w-full h-full object-contain border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                  
                  {/* Noggle overlay if selected */}
                  {selectedNoggleColor && selectedNoggleColor !== "original" && (
                    <div className="absolute inset-0">
                      <img
                        src={`/assets/noggles/${NOGGLE_COLORS.find(c => c.value === selectedNoggleColor)?.file}`}
                        alt="Noggle overlay"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Animated eye overlay if selected */}
                  {selectedEyeAnimation && selectedEyeAnimation !== "normal" && (
                    <div className="absolute inset-0">
                      <img
                        src={`/assets/eyes/${EYE_ANIMATIONS.find(e => e.value === selectedEyeAnimation)?.file}`}
                        alt="Eye animation"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Preview shows static layers. Export to see the full animated GIF.
                </p>
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Upload an image to see preview</p>
              </div>
            )}
          </div>

          {/* Export Actions */}
          <div className="space-y-4">
            {/* Generate GIF Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleExport}
                disabled={isExporting}
                icon={<Icon name="sparkles" size="md" />}
                className="flex-1"
              >
                {isExporting ? `Creating... ${exportProgress.toFixed(0)}%` : "Create & Upload GIF"}
              </Button>
            </div>

            {/* Export Progress */}
            {isExporting && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            )}

            {/* Generated GIF Actions */}
            {generatedGifUrl && (
              <div className="space-y-4">
                {/* IPFS Status */}
                {generatedGifUrl && generatedGifUrl.startsWith('https://ipfs.io/') && (
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-600" size="sm" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Stored on IPFS & Added to Gallery
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                      Hash: {generatedGifUrl.split('/').pop()}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={!generatedGifUrl}
                    icon={<Icon name="download" size="sm" />}
                    className="w-full"
                  >
                    Download GIF
                  </Button>
                  
                  <Button
                    variant="gradient"
                    onClick={handleMintNFT}
                    disabled={!ipfsMetadataUrl}
                    icon={<Icon name="sparkles" size="sm" />}
                    className="w-full"
                  >
                    Mint NFT
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleShareToFarcaster}
                    disabled={!generatedGifUrl}
                    icon={<Icon name="share" size="sm" />}
                    className="w-full"
                  >
                    Share Creation
                  </Button>
                </div>

                {/* NFT Metadata Info */}
                {ipfsMetadataUrl && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                    NFT Metadata: {ipfsMetadataUrl.split('/').pop()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Share Dialog */}
      <ShareDialog
        gifUrl={generatedGifUrl}
        title={`gifnouns #${nextGifNumber}`}
        noggleColor={selectedNoggleColor}
        eyeAnimation={selectedEyeAnimation}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />

      {/* Noggle Color Selector */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Noggle Color
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {NOGGLE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedNoggleColor(color.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedNoggleColor === color.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
                title={color.name}
              >
                {color.file ? (
                  <img
                    src={`/assets/noggles/${color.file}`}
                    alt={color.name}
                    className={`w-full h-8 object-contain mb-2 rounded ${
                      selectedNoggleColor === color.value 
                        ? "ring-2 ring-purple-500" 
                        : ""
                    }`}
                  />
                ) : (
                  <div className={`w-full h-8 rounded ${color.class} mb-2`} />
                )}
                <p className={`text-xs font-medium ${
                  selectedNoggleColor === color.value 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {color.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Eye Animation Selector */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Eye Animation
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {EYE_ANIMATIONS.map((animation) => (
              <button
                key={animation.value}
                onClick={() => setSelectedEyeAnimation(animation.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedEyeAnimation === animation.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="text-center">
                  {animation.file ? (
                    <img
                      src={`/assets/eyes/${animation.file}`}
                      alt={animation.name}
                      className={`mx-auto mb-2 w-12 h-12 object-contain rounded ${
                        selectedEyeAnimation === animation.value 
                          ? "ring-2 ring-purple-500" 
                          : ""
                      }`}
                    />
                  ) : (
                    <Icon 
                      name={animation.icon} 
                      className={`mx-auto mb-2 ${
                        selectedEyeAnimation === animation.value 
                          ? "text-purple-600 dark:text-purple-400" 
                          : "text-gray-400 dark:text-gray-500"
                      }`} 
                      size="lg" 
                    />
                  )}
                  <p className={`text-sm font-medium ${
                    selectedEyeAnimation === animation.value 
                      ? "text-purple-600 dark:text-purple-400" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {animation.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Share Dialog */}
      <ShareDialog
        gifUrl={generatedGifUrl}
        title={`gifnouns #${nextGifNumber}`}
        noggleColor={selectedNoggleColor}
        eyeAnimation={selectedEyeAnimation}
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </div>
  );
} 