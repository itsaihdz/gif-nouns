"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { useGifGenerator } from "./GifGenerator";
import { useUser } from "../../contexts/UserContext";
import { useAccount, useWalletClient } from "wagmi";
import { ShareDialog } from "../social/ShareDialog";
import { HighlightInfo } from "../ui/HighlightInfo";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";
import { encodeFunctionData, parseEther } from "viem";


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
  onSuccess?: (message: string) => void;
  onGifCreated?: (gifData: { 
    gifUrl: string; 
    shareUrl?: string; // Supabase URL for sharing
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
  traits,
  onError,
  onSuccess,
  onGifCreated,
  className = "" 
}: ImagePreviewProps) {
  console.log('🔄 ImagePreview component rendered with:', { originalImageUrl, traits });
  
  // Derive noggle color and eye animation from traits
  const getNoggleColorFromTraits = () => {
    if (traits?.noggles) {
      const noggleColor = traits.noggles.toLowerCase();
      console.log('🔄 Looking for noggle color:', noggleColor, 'in available colors:', NOGGLE_COLORS.map(c => c.value));
      
      // Try exact match first
      let found = NOGGLE_COLORS.find(color => color.value.toLowerCase() === noggleColor);
      
      // If not found, try partial match
      if (!found) {
        found = NOGGLE_COLORS.find(color => 
          color.value.toLowerCase().includes(noggleColor) || 
          noggleColor.includes(color.value.toLowerCase())
        );
      }
      
      if (found) {
        console.log('✅ Found noggle color:', found.value);
        return found.value;
      }
    }
    console.log('⚠️ Using default noggle color');
    return NOGGLE_COLORS[0]?.value || "";
  };

  const getEyeAnimationFromTraits = () => {
    if (traits?.eyes) {
      const eyeType = traits.eyes.toLowerCase();
      console.log('🔄 Looking for eye animation:', eyeType, 'in available animations:', EYE_ANIMATIONS.map(e => e.value));
      
      // Try exact match first
      let found = EYE_ANIMATIONS.find(animation => animation.value.toLowerCase() === eyeType);
      
      // If not found, try partial match
      if (!found) {
        found = EYE_ANIMATIONS.find(animation => 
          animation.value.toLowerCase().includes(eyeType) || 
          eyeType.includes(animation.value.toLowerCase())
        );
      }
      
      if (found) {
        console.log('✅ Found eye animation:', found.value);
        return found.value;
      }
    }
    console.log('⚠️ Using default eye animation');
    return EYE_ANIMATIONS[0]?.value || "";
  };

  const [selectedNoggleColor, setSelectedNoggleColor] = useState(getNoggleColorFromTraits());
  const [selectedEyeAnimation, setSelectedEyeAnimation] = useState(getEyeAnimationFromTraits());
  
  // Update selected values when traits change
  useEffect(() => {
    const newNoggleColor = getNoggleColorFromTraits();
    const newEyeAnimation = getEyeAnimationFromTraits();
    
    setSelectedNoggleColor(newNoggleColor);
    setSelectedEyeAnimation(newEyeAnimation);
    
    console.log('🔄 Updated trait values:', {
      traits,
      newNoggleColor,
      newEyeAnimation
    });
  }, [traits]);
  
  // Debug: Log the derived values
  console.log('🔄 Current trait values:', {
    traits,
    selectedNoggleColor,
    selectedEyeAnimation,
    noggleFromTraits: getNoggleColorFromTraits(),
    eyeFromTraits: getEyeAnimationFromTraits()
  });
  const [isExporting, setIsExporting] = useState(false);
  const [animatedPreviewUrl, setAnimatedPreviewUrl] = useState<string>("");
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string>("");
  const [exportProgress, setExportProgress] = useState(0);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [nextGifNumber, setNextGifNumber] = useState(1);
  const { user, isAuthenticated } = useUser();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const sendNotification = useNotification();

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
  const { generateGif, generateGifAsync, downloadGif, mintAsNFT } = useGifGenerator({
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

  // Debug: Log when generatedGifUrl changes
  useEffect(() => {
    console.log('🔄 generatedGifUrl changed:', generatedGifUrl);
  }, [generatedGifUrl]);

  const handleExport = async () => {
    console.log('🔄 handleExport started');
    setIsExporting(true);
    setExportProgress(0);
    try {
      // First generate the GIF and wait for it to complete
      console.log('🔄 Starting GIF generation...');
      const gifUrl = await generateGifAsync();
      console.log('🔄 GIF generation completed:', gifUrl);
      
      setExportProgress(25);
      
      // Then upload to Supabase Storage if generation was successful
      if (gifUrl) {
        setExportProgress(50);
        
        console.log('Starting Supabase Storage upload process...');
        console.log('Generated GIF URL:', gifUrl);
        
        // Fetch the generated GIF as a blob
        const response = await fetch(gifUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch GIF: ${response.status} ${response.statusText}`);
        }
        
        const gifBlob = await response.blob();
        console.log('GIF blob size:', gifBlob.size, 'bytes');
        console.log('GIF blob type:', gifBlob.type);
        
        if (gifBlob.size === 0) {
          throw new Error('Generated GIF is empty (0 bytes)');
        }

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `gifnouns_${nextGifNumber}_${timestamp}.gif`;

        // Upload GIF to Supabase Storage
        const formData = new FormData();
        formData.append('file', gifBlob, filename);
        formData.append('filename', filename);

        setExportProgress(75);

        console.log('Uploading to Supabase Storage...');
        const uploadResponse = await fetch('/api/storage/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Supabase Storage upload failed:', uploadResponse.status, errorText);
          throw new Error(`Failed to upload GIF to Supabase Storage: ${uploadResponse.status} ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        const storageGifUrl = uploadResult.url;
        const storagePath = uploadResult.path;

        console.log('✅ Supabase Storage upload successful:', uploadResult);

        // Store the Supabase Storage URL
        setGeneratedGifUrl(storageGifUrl);
        console.log('✅ Generated GIF URL set:', storageGifUrl);

        setExportProgress(90);

        setExportProgress(100);

        // Show success message
        onSuccess?.(`GIF created successfully! Uploaded to Supabase Storage and added to gallery.`);
        
        console.log('🔄 ===== STARTING GALLERY UPLOAD PROCESS =====');
        
        // Automatically add to gallery first
        console.log('🔄 About to call handleUploadToGallery with URL:', storageGifUrl);
        try {
          await handleUploadToGallery(storageGifUrl);
          console.log('🔄 handleUploadToGallery completed successfully');
        } catch (error) {
          console.error('❌ handleUploadToGallery failed:', error);
          // Don't throw here, just log the error
        }
        
        // Debug: Check if onGifCreated is available
        console.log('🔄 onGifCreated callback available:', !!onGifCreated);
        console.log('🔄 ===== GALLERY UPLOAD PROCESS COMPLETED =====');
        
        // IMPORTANT: Call onGifCreated directly here as a fallback
        if (onGifCreated) {
          console.log('🔄 Calling onGifCreated directly as fallback...');
          
          // Use generated GIF URL for preview/download, Supabase URL for sharing
          const previewGifUrl = generatedGifUrl; // This is the blob URL from GIF generation
          const shareGifUrl = storageGifUrl; // This is the Supabase URL for sharing
          
          const gifData = {
            gifUrl: previewGifUrl, // Use generated GIF URL for preview
            shareUrl: shareGifUrl, // Use Supabase URL for sharing
            title: `gifnouns #${nextGifNumber}`,
            noggleColor: selectedNoggleColor,
            eyeAnimation: selectedEyeAnimation,
            creator: {
              fid: 0,
              username: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown Creator',
              pfp: address ? `https://picsum.photos/32/32?random=${address.slice(2, 8)}` : 'https://picsum.photos/32/32?random=unknown',
            },
          };
          console.log('🔄 Calling onGifCreated with fallback data:', gifData);
          onGifCreated(gifData);
          console.log('🔄 onGifCreated fallback call completed');
        }
        
        console.log('✅ Export process completed successfully');
        
        console.log('Supabase Storage Upload Results:', {
          gifUrl: storageGifUrl,
          path: storagePath,
          size: uploadResult.size
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to export GIF to Supabase Storage';
      onError(errorMessage);
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

  const handleMintSuccess = useCallback(async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;
    
    console.log(`NFT minted successfully: ${transactionHash}`);

    await sendNotification({
      title: "🎉 NFT Minted Successfully!",
      body: `Your animated Noun #${nextGifNumber} is now live on Base!`,
    });

    onError(`🎉 NFT minted successfully! Transaction: ${transactionHash.slice(0, 10)}...`);
  }, [sendNotification, nextGifNumber, onError]);

  const handleMintError = useCallback((error: TransactionError) => {
    console.error("NFT minting failed:", error);
    onError("Failed to mint NFT. Please check your wallet and try again.");
  }, [onError]);

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

  const handleUploadToGallery = async (storageGifUrl?: string) => {
    console.log('🔄 ===== handleUploadToGallery FUNCTION CALLED =====');
    console.log('🔄 Received storageGifUrl parameter:', storageGifUrl);
    console.log('🔄 Current generatedGifUrl state:', generatedGifUrl);
    
    try {
      console.log('🔄 Starting gallery upload process...');
      
      // Use provided storageGifUrl or fallback to generatedGifUrl
      const gifUrlToUse = storageGifUrl || generatedGifUrl;
      console.log('🔄 Using GIF URL:', gifUrlToUse);
      
      if (!gifUrlToUse) {
        onError("Please generate a GIF first");
        return;
      }

      // Get user data - simplified approach
      let creatorData = null;
      
      if (address) {
        // Always use wallet address for now (simplified)
        console.log('🔄 Using wallet address for creator data:', address);
        creatorData = {
          fid: 0, // Will be handled by backend
          username: `${address.slice(0, 6)}...${address.slice(-4)}`, // Truncated for database
          pfp: `https://picsum.photos/32/32?random=${address.slice(2, 8)}`,
        };
        console.log('🔄 Created creator data:', creatorData);
      } else {
        console.log('⚠️ No wallet address found, using fallback creator data');
        creatorData = {
          fid: 0,
          username: 'Unknown Creator',
          pfp: 'https://picsum.photos/32/32?random=unknown',
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

      console.log('🔄 Final GIF data being saved:', gifData);
      console.log('🔄 Traits used:', { selectedNoggleColor, selectedEyeAnimation });
      console.log('🔄 Original traits:', traits);
      console.log('🔄 Available noggle colors:', NOGGLE_COLORS.map(c => c.value));
      console.log('🔄 Available eye animations:', EYE_ANIMATIONS.map(e => e.value));

      // Save to database via API
      const saveResponse = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gifData),
      });

      if (!saveResponse.ok) {
        console.error('Failed to save to database:', await saveResponse.text());
      } else {
        console.log('✅ Saved to database successfully');
      }

      console.log('✅ Calling onGifCreated with data:', gifData);
      console.log('✅ onGifCreated function exists:', !!onGifCreated);
      if (onGifCreated) {
        onGifCreated(gifData);
        console.log('✅ onGifCreated called successfully');
      } else {
        console.error('❌ onGifCreated is not available!');
      }
      console.log('✅ Gallery upload completed successfully');
    } catch (error) {
      console.error("❌ Gallery upload error:", error);
      onError("Failed to upload to gallery");
    }
  };

  // NFT minting transaction calls
  const mintCalls = useMemo(() => {
    if (!address) return [];

    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;
    if (!contractAddress || contractAddress === "0x0000000000000000000000000000000000000000") {
      console.warn("NFT contract address not configured");
      return [];
    }

    // Encode the mintAnimatedNoun function call
    const mintData = encodeFunctionData({
      abi: [
        {
          name: "mintAnimatedNoun",
          type: "function",
          stateMutability: "payable",
          inputs: [
            { name: "gifUrl", type: "string" },
            { name: "noggleColor", type: "string" },
            { name: "eyeAnimation", type: "string" },
            { name: "title", type: "string" }
          ],
          outputs: [],
        },
      ],
      functionName: "mintAnimatedNoun",
      args: [
        generatedGifUrl,
        selectedNoggleColor,
        selectedEyeAnimation,
        `gifnouns #${nextGifNumber}`
      ],
    });

    return [
      {
        to: contractAddress,
        data: mintData,
        value: parseEther("0.01"), // 0.01 ETH mint price
      },
    ];
  }, [address, generatedGifUrl, selectedNoggleColor, selectedEyeAnimation, nextGifNumber]);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Preview Card */}
      <Card variant="outlined">
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Preview & Export
          </h3>
          
          {/* Image Preview */}
          <div className="relative mb-2">
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
          <div className="space-y-2">
            {/* Generate GIF Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => {
                  console.log('🔄 Create & Upload GIF button clicked');
                  handleExport();
                }}
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
              <div className="space-y-2">
                {/* Storage Status */}
                {generatedGifUrl && generatedGifUrl.includes('supabase.co') && (
                  <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="check" className="text-green-600" size="sm" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Stored on Supabase Storage & Added to Gallery
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400">
                      File: {generatedGifUrl.split('/').pop()}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="gradient"
                    onClick={handleDownload}
                    icon={<Icon name="download" size="sm" />}
                    className="w-full"
                  >
                    Download GIF
                  </Button>

                  {/* NFT Minting with OnchainKit */}
                  {mintCalls.length > 0 ? (
                    <Transaction
                      calls={mintCalls}
                      onSuccess={handleMintSuccess}
                      onError={handleMintError}
                    >
                      <TransactionButton />
                      <TransactionStatus>
                        <TransactionStatusAction />
                        <TransactionStatusLabel />
                      </TransactionStatus>
                      <TransactionToast className="mb-2">
                        <TransactionToastIcon />
                        <TransactionToastLabel />
                        <TransactionToastAction />
                      </TransactionToast>
                    </Transaction>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      icon={<Icon name="sparkles" size="sm" />}
                      className="w-full"
                    >
                      {!address ? "Connect Wallet to Mint" : "Preparing NFT..."}
                    </Button>
                  )}

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

                {/* NFT Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                  <div className="flex items-start gap-2">
                    <Icon name="sparkles" className="text-blue-600 mt-0.5" size="sm" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Mint in GIF Nouns Collective
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                        Your GIF will be minted as a unique NFT in the GIF Nouns Collective on Base L2!
                      </p>
                      <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                        <div className="flex items-center gap-2">
                          <Icon name="check" size="sm" />
                          <span>Part of the GIF Nouns Collective</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="check" size="sm" />
                          <span>Stored permanently on Supabase Storage</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="check" size="sm" />
                          <span>Gas fees covered by OnchainKit</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="check" size="sm" />
                          <span>Tradeable on Base marketplaces</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlight Integration Info */}
                <HighlightInfo className="mt-2" />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Noggle Color Selector */}
      <Card variant="outlined">
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Choose Noggle Color
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {NOGGLE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedNoggleColor(color.value)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
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
                    className={`w-full h-10 object-contain mb-1 rounded ${
                      selectedNoggleColor === color.value 
                        ? "ring-2 ring-purple-500" 
                        : ""
                    }`}
                  />
                ) : (
                  <div className={`w-full h-10 rounded ${color.class} mb-1`} />
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
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Choose Eye Animation
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {EYE_ANIMATIONS.map((animation) => (
              <button
                key={animation.value}
                onClick={() => setSelectedEyeAnimation(animation.value)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 ${
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
                      className={`mx-auto mb-1 w-10 h-10 object-contain rounded ${
                        selectedEyeAnimation === animation.value 
                          ? "ring-2 ring-purple-500" 
                          : ""
                      }`}
                    />
                  ) : (
                    <Icon 
                      name={animation.icon} 
                      className={`mx-auto mb-1 ${
                        selectedEyeAnimation === animation.value 
                          ? "text-purple-600 dark:text-purple-400" 
                          : "text-gray-400 dark:text-gray-500"
                      }`} 
                      size="lg" 
                    />
                  )}
                  <p className={`text-xs font-medium ${
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