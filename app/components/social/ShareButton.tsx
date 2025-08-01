"use client";

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../icons';
import { useUser } from '../../contexts/UserContext';

// Declare gtag for TypeScript
declare global {
  function gtag(...args: any[]): void;
}

interface ShareButtonProps {
  gifUrl: string;
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  votes: number;
  creator: {
    fid: number;
    username: string;
    pfp: string;
  };
  className?: string;
}

export function ShareButton({ gifUrl, title, noggleColor, eyeAnimation, votes, creator, className = "" }: ShareButtonProps) {
  const { user } = useUser();
  const [isSharing, setIsSharing] = useState(false);

  const generateShareImage = async () => {
    // Create a canvas to generate dynamic share image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#8B5CF6');
    gradient.addColorStop(1, '#3B82F6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Check out this Animated Noun!', 600, 100);

    // Creator info
    ctx.font = '24px Arial';
    ctx.fillText(`Created by @${creator.username}`, 600, 150);

    // Achievement text
    ctx.font = 'bold 36px Arial';
    ctx.fillText(`🎉 ${votes} votes and counting!`, 600, 200);

    // Style info
    ctx.font = '20px Arial';
    ctx.fillText(`${noggleColor} noggle • ${eyeAnimation} eyes`, 600, 240);

    // Call to action
    ctx.font = 'bold 32px Arial';
    ctx.fillText('Create your own at Nouns Remix Studio!', 600, 550);

    return canvas.toDataURL('image/png');
  };

  const shareToFarcaster = async () => {
    setIsSharing(true);
    try {
      // Generate dynamic share image
      const shareImage = await generateShareImage();
      
      // Create share URL with embed
      const shareUrl = `${window.location.origin}/share/${creator.fid}/${title}`;
      
      // Pre-fill cast with social context
      const castText = `🎨 Just discovered this amazing animated Noun by @${creator.username}!\n\n` +
        `✨ ${title}\n` +
        `🎯 ${votes} votes • ${noggleColor} noggle • ${eyeAnimation} eyes\n\n` +
        `🚀 Create your own at Nouns Remix Studio!\n` +
        `#NounsRemix #AnimatedNouns #Farcaster`;

      // Use Farcaster SDK to compose cast
      if (typeof window !== 'undefined' && (window as any).farcaster) {
        try {
          await (window as any).farcaster.actions.compose({
            text: castText,
            embeds: [{
              url: shareUrl,
              castId: null
            }]
          });
        } catch (error) {
          console.log('Farcaster compose not available, falling back to URL');
          // Fallback: open in new tab
          window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds=${encodeURIComponent(shareUrl)}`, '_blank');
        }
      } else {
        // Fallback for non-Farcaster environments
        window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds=${encodeURIComponent(shareUrl)}`, '_blank');
      }

      // Track share event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'farcaster',
          content_type: 'gallery_item',
          item_id: creator.fid
        });
      }

    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTwitter = async () => {
    setIsSharing(true);
    try {
      const shareText = `🎨 Amazing animated Noun by @${creator.username}!\n\n` +
        `✨ ${title}\n` +
        `🎯 ${votes} votes • ${noggleColor} noggle • ${eyeAnimation} eyes\n\n` +
        `🚀 Create your own at Nouns Remix Studio!\n` +
        `#NounsRemix #AnimatedNouns #Farcaster`;

      const shareUrl = `${window.location.origin}/share/${creator.fid}/${title}`;
      
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');

      // Track share event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'twitter',
          content_type: 'gallery_item',
          item_id: creator.fid
        });
      }

    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="gradient"
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
        Share to Twitter
      </Button>
    </div>
  );
} 