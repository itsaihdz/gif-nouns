"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { downloadGif } from "@/lib/utils";
import { useFarcasterData } from "../../hooks/useFarcasterData";
import { useUserVotes } from "../../hooks/useUserVotes";
import { ShareButton } from "../social/ShareButton";
import { FarcasterShare } from "../social/FarcasterShare";
// import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { useHaptics } from "../../hooks/useHaptics";
import { sdk } from '@farcaster/miniapp-sdk';

interface DownloadSharePageProps {
  gifUrl: string; // Generated GIF URL for preview/download
  shareUrl?: string; // Supabase URL for sharing
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  creator: {
    wallet: string;
    username: string;

  };
  onBackToCreate: () => void;
  onViewInGallery: () => void;
  className?: string;
}

export function DownloadSharePage({ 
  gifUrl, 
  shareUrl,
  title, 
  noggleColor, 
  eyeAnimation, 
  creator,
  onBackToCreate,
  onViewInGallery,
  className = "" 
}: DownloadSharePageProps) {
  console.log('🔄 DownloadSharePage received props:', { gifUrl, shareUrl, title, noggleColor, eyeAnimation, creator });
  console.log('🔄 Share URL type:', typeof shareUrl);
  console.log('🔄 Share URL value:', shareUrl);
  console.log('🔄 GIF URL type:', typeof gifUrl);
  console.log('🔄 GIF URL value:', gifUrl);
  const [isSharing, setIsSharing] = useState(false);
  const [, setShareDialogUrl] = useState<string | null>(null);
  
  // Initialize hooks
  // const { composeCast } = useComposeCast(); // Removed as per edit hint
  const { selectionChanged, notificationOccurred } = useHaptics();

  const handleDownload = async () => {
    await selectionChanged(); // Haptic feedback
    if (gifUrl) {
      const filename = `animated-noun-${Date.now()}.gif`;
      downloadGif(gifUrl, filename);
      await notificationOccurred('success');
    }
  };

  const handleShareToFarcaster = async () => {
    setIsSharing(true);
    await selectionChanged(); // Haptic feedback
    
    try {
      // Use Supabase URL for sharing, fallback to generated GIF URL
      const shareGifUrl = shareUrl || gifUrl;
      console.log('🔄 Sharing to Farcaster with URL:', shareGifUrl);
      console.log('🔄 Share URL available:', !!shareUrl);
      console.log('🔄 Fallback to GIF URL:', !shareUrl);
      
      // Use the same text template from FarcasterShare component
      const shareText = `Check out my animated Noun "${title}"! 🎨✨

Created with GifNouns

${noggleColor} noggle + ${eyeAnimation} eyes = pure magic! 🌟

Vote for it in the gallery! 🗳️

https://farcaster.xyz/miniapps/SXnRtPs9CWf4/gifnouns

${shareGifUrl}`;
      
      // Try to use MiniApp SDK if available, otherwise use fallback
      if (typeof sdk?.actions?.openUrl === 'function') {
        try {
          const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
          await sdk.actions.openUrl(farcasterUrl);
          await notificationOccurred('success');
        } catch (sdkError) {
          console.log('SDK openUrl failed, using fallback:', sdkError);
          // Fallback to regular window.open
          const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
          setShareDialogUrl(farcasterUrl);
          window.open(farcasterUrl, '_blank');
          await notificationOccurred('success');
        }
      } else {
        // Fallback to regular window.open for non-Farcaster environments
        console.log('MiniApp SDK not available, using window.open fallback');
        const farcasterUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`;
        setShareDialogUrl(farcasterUrl);
        window.open(farcasterUrl, '_blank');
        await notificationOccurred('success');
      }
    } catch (error) {
      console.error('Error sharing to Farcaster:', error);
      await notificationOccurred('error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareToTwitter = async () => {
    setIsSharing(true);
    await selectionChanged(); // Haptic feedback
    
    try {
      // Use Supabase URL for sharing, fallback to generated GIF URL
      const shareGifUrl = shareUrl || gifUrl;
      console.log('🔄 Sharing to Twitter with URL:', shareGifUrl);
      console.log('🔄 Share URL available:', !!shareUrl);
      console.log('🔄 Fallback to GIF URL:', !shareUrl);
      
      // Use the same text template as Farcaster sharing for consistency
      const shareText = `Check out my animated Noun "${title}"! 🎨✨

Created with GifNouns

${noggleColor} noggle + ${eyeAnimation} eyes = pure magic! 🌟

Vote for it in the gallery! 🗳️

https://farcaster.xyz/miniapps/SXnRtPs9CWf4/gifnouns

${shareGifUrl}`;
      
      // Try to use MiniApp SDK if available, otherwise use fallback
      if (typeof sdk?.actions?.openUrl === 'function') {
        try {
          // Try Twitter deep link first (for mobile apps)
          const twitterDeepLink = `twitter://post?message=${encodeURIComponent(shareText)}`;
          await sdk.actions.openUrl(twitterDeepLink);
          await notificationOccurred('success');
        } catch (deepLinkError) {
          console.log('Deep link failed, trying web URL:', deepLinkError);
          try {
            // Fallback to web URL via SDK
            const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            await sdk.actions.openUrl(twitterWebUrl);
            await notificationOccurred('success');
          } catch (sdkError) {
            console.log('SDK openUrl failed, using fallback:', sdkError);
            // Final fallback to regular window.open
            const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
            setShareDialogUrl(twitterWebUrl);
            window.open(twitterWebUrl, '_blank');
            await notificationOccurred('success');
          }
        }
      } else {
        // Fallback to regular window.open for non-Farcaster environments
        console.log('MiniApp SDK not available, using window.open fallback');
        const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        setShareDialogUrl(twitterWebUrl);
        window.open(twitterWebUrl, '_blank');
        await notificationOccurred('success');
      }
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      await notificationOccurred('error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await selectionChanged(); // Haptic feedback
      
      // Use Supabase URL for sharing, fallback to generated GIF URL
      const shareGifUrl = shareUrl || gifUrl;
      console.log('🔄 Copying link to clipboard:', shareGifUrl);
      console.log('🔄 Share URL available:', !!shareUrl);
      console.log('🔄 Fallback to GIF URL:', !shareUrl);
      
      await navigator.clipboard.writeText(shareGifUrl);
      await notificationOccurred('success');
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
      await notificationOccurred('error');
    }
  };

  return (
    <div className={`${className} max-w-2xl mx-auto`}>
      <Card variant="outlined" className="p-4">
        {/* Success Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <Icon name="check" className="text-green-600" size="lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            GIF Created Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your Animated Noun has been created, tap and hold to download it.
          </p>
        </div>

        {/* GIF Preview */}
        <div className="mb-4">
          <div className="relative w-full max-w-md mx-auto">
            <img
              src={gifUrl}
              alt={title}
              className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {noggleColor}
              </span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                {eyeAnimation}
              </span>
            </div>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-center mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Created by @{creator.username}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Download Button */}
          <Button
            variant="gradient"
            onClick={handleDownload}
            icon={<Icon name="download" size="sm" />}
            className="w-full"
          >
            Download GIF
          </Button>

          {/* Share Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={handleShareToFarcaster}
              disabled={isSharing}
              icon={<Icon name="share" size="sm" />}
            >
              {/* {typeof composeCast === 'function' ? "Cast to Farcaster" : "Share on Farcaster"} */}
              Share on Farcaster
            </Button>
            <Button
              variant="outline"
              onClick={handleShareToTwitter}
              disabled={isSharing}
              icon={<Icon name="twitter" size="sm" />}
            >
              Share on Twitter
            </Button>
          </div>

          {/* Copy Link Button */}
          <Button
            variant="outline"
            onClick={handleCopyLink}
            icon={<Icon name="link" size="sm" />}
            className="w-full"
          >
            Copy GIF Link
          </Button>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onBackToCreate}
              icon={<Icon name="arrow-left" size="sm" />}
            >
              Create Another
            </Button>
            <Button
              variant="outline"
              onClick={onViewInGallery}
              icon={<Icon name="gallery" size="sm" />}
            >
              View in Gallery
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 