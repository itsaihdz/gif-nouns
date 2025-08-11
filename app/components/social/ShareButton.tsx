"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
// import { useComposeCast } from '@coinbase/onchainkit/minikit';
import { useHaptics } from "../../hooks/useHaptics";
import { sdk } from '@farcaster/miniapp-sdk';

declare global {
  function gtag(...args: any[]): void;
}

interface ShareButtonProps {
  gifUrl: string;
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  className?: string;
}

export function ShareButton({ gifUrl, title, noggleColor, eyeAnimation, className = "" }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  // Initialize hooks
  // const { composeCast } = useComposeCast();
  const { selectionChanged, notificationOccurred } = useHaptics();

  const shareToFarcaster = async () => {
    try {
      setIsSharing(true);
      await selectionChanged(); // Haptic feedback
      
      // Create share text with GIF URL
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun: ${gifUrl}\n\n#Nouns https://farcaster.xyz/miniapps/SXnRtPs9CWf4/gifnouns`;
      
      // Use native composeCast if available, otherwise fallback
      // if (typeof composeCast === 'function') {
      //   await composeCast({
      //     text: shareText,
      //     embeds: [gifUrl],
      //   });
      //   await notificationOccurred('success');
      // } else {
        // Fallback to URL
        const encodedText = encodeURIComponent(shareText);
        const url = `https://warpcast.com/~/compose?text=${encodedText}`;
        setShareUrl(url);
        await notificationOccurred('warning'); // Different feedback for fallback
      // }
      
      // Track share event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'farcaster',
          content_type: 'animated_noun',
          item_id: title
        });
      }
      
    } catch (error) {
      console.error('Error sharing to Farcaster:', error);
      await notificationOccurred('error');
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTwitter = async () => {
    try {
      setIsSharing(true);
      await selectionChanged(); // Haptic feedback
      
      // Use consistent text template like Farcaster sharing
      const shareText = `Check out my animated Noun "${title}"! 🎨✨

Created with GifNouns

${noggleColor} noggle + ${eyeAnimation} eyes = pure magic! 🌟

Vote for it in the gallery! https://farcaster.xyz/miniapps/SXnRtPs9CWf4/gifnouns

${gifUrl}`;
      
      // Try Twitter deep link first (for mobile apps)
      const twitterDeepLink = `twitter://post?message=${encodeURIComponent(shareText)}`;
      const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
      
      // Try opening with MiniApp SDK openUrl if available, otherwise use fallback
      if (typeof sdk?.actions?.openUrl === 'function') {
        try {
          // Try deep link first
          await sdk.actions.openUrl(twitterDeepLink);
          await notificationOccurred('success');
        } catch (deepLinkError) {
          console.log('Deep link failed, trying web URL:', deepLinkError);
          // Fallback to web URL
          await sdk.actions.openUrl(twitterWebUrl);
          await notificationOccurred('success');
        }
      } else {
        // Fallback to setting shareUrl for external window.open
        console.log('MiniApp SDK not available, using window.open fallback');
        setShareUrl(twitterWebUrl);
        await notificationOccurred('warning'); // Different feedback for fallback
      }
      
      // Track share event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'twitter',
          content_type: 'animated_noun',
          item_id: title
        });
      }
      
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      await notificationOccurred('error');
    } finally {
      setIsSharing(false);
    }
  };

  const copyLink = async () => {
    try {
      await selectionChanged(); // Haptic feedback
      
      // Copy the direct GIF URL instead of the app URL
      await navigator.clipboard.writeText(gifUrl);
      await notificationOccurred('success');
      
      // Track copy event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_link', {
          content_type: 'animated_noun',
          item_id: title
        });
      }
      
    } catch (error) {
      console.error('Error copying link:', error);
      await notificationOccurred('error');
    }
  };

  if (shareUrl) {
    return (
      <div className={`flex gap-2 ${className}`}>
        <Button
          variant="outline"
          onClick={() => window.open(shareUrl, '_blank')}
          icon={<Icon name="external-link" size="sm" />}
          className="flex-1"
        >
          Open Share Link
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShareUrl('')}
          icon={<Icon name="x" size="sm" />}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        onClick={shareToFarcaster}
        disabled={isSharing}
        icon={<Icon name="farcaster" size="sm" />}
        className="flex-1"
      >
        {isSharing ? 'Sharing...' : (typeof sdk?.actions?.openUrl === 'function' ? 'Cast to Farcaster' : 'Share to Farcaster')}
      </Button>
      
      <Button
        variant="outline"
        onClick={shareToTwitter}
        disabled={isSharing}
        icon={<Icon name="twitter" size="sm" />}
        className="flex-1"
      >
        {isSharing ? 'Sharing...' : 'Share to Twitter'}
      </Button>
      
      <Button
        variant="outline"
        onClick={copyLink}
        icon={<Icon name="link" size="sm" />}
      >
        Copy Link
      </Button>
    </div>
  );
} 