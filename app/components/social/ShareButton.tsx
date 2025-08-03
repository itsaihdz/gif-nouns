"use client";

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../icons';

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

  const shareToFarcaster = async () => {
    try {
      setIsSharing(true);
      
      // Create share text with GIF URL
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun: ${gifUrl}\n\n#Nouns #AnimatedNouns #Farcaster`;
      
      // For now, use URL fallback since compose method may not be available
      const encodedText = encodeURIComponent(shareText);
      const url = `https://warpcast.com/~/compose?text=${encodedText}`;
      setShareUrl(url);
      
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
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTwitter = async () => {
    try {
      setIsSharing(true);
      
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun: ${gifUrl}\n\n#Nouns #AnimatedNouns #Farcaster`;
      const encodedText = encodeURIComponent(shareText);
      const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent('https://gifnouns.freezerserve.com')}`;
      
      setShareUrl(url);
      
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
    } finally {
      setIsSharing(false);
    }
  };

  const copyLink = async () => {
    try {
      // Copy the direct GIF URL instead of the app URL
      await navigator.clipboard.writeText(gifUrl);
      
      // Track copy event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_link', {
          content_type: 'animated_noun',
          item_id: title
        });
      }
      
    } catch (error) {
      console.error('Error copying link:', error);
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
        {isSharing ? 'Sharing...' : 'Share to Farcaster'}
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