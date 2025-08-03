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

  const generateShareImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('');
        return;
      }

      canvas.width = 1200;
      canvas.height = 630;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#3B82F6');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 630);

      // Add title
      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Nouns Remix Studio', 600, 150);

      // Add subtitle
      ctx.font = '24px Arial';
      ctx.fillText(`${title} - ${noggleColor} ${eyeAnimation}`, 600, 200);

      // Add GIF preview (placeholder)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(400, 250, 400, 300);
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('Animated Noun Preview', 600, 420);

      // Add call to action
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Create your own at', 600, 500);
      ctx.font = '24px Arial';
      ctx.fillText('gif-nouns.vercel.app', 600, 540);

      resolve(canvas.toDataURL());
    });
  };

  const shareToFarcaster = async () => {
    try {
      setIsSharing(true);
      
      // Generate share image (stored for potential future use)
      await generateShareImage();
      
      // Create share text
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun on Nouns Remix Studio\n\n#Nouns #AnimatedNouns #Farcaster`;
      
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
      
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun on Nouns Remix Studio\n\n#Nouns #AnimatedNouns #Farcaster`;
      const encodedText = encodeURIComponent(shareText);
      const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent('https://gif-nouns.vercel.app')}`;
      
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
      const url = `https://gif-nouns.vercel.app?gif=${encodeURIComponent(gifUrl)}&title=${encodeURIComponent(title)}`;
      await navigator.clipboard.writeText(url);
      
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
          size="sm"
          onClick={() => window.open(shareUrl, '_blank')}
          icon={<Icon name="external-link" size="sm" />}
        >
          Open Share
        </Button>
        <Button
          variant="outline"
          size="sm"
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
        size="sm"
        onClick={shareToFarcaster}
        disabled={isSharing}
        icon={<Icon name="farcaster" size="sm" />}
      >
        {isSharing ? 'Sharing...' : 'Share to Farcaster'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareToTwitter}
        disabled={isSharing}
        icon={<Icon name="twitter" size="sm" />}
      >
        {isSharing ? 'Sharing...' : 'Share to Twitter'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={copyLink}
        icon={<Icon name="link" size="sm" />}
      >
        Copy Link
      </Button>
    </div>
  );
} 