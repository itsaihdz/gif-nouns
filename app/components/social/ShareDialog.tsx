"use client";

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../icons';
import { ShareImageGenerator } from './ShareImageGenerator';
import { useUser } from '../../contexts/UserContext';

declare global {
  function gtag(...args: any[]): void;
}

interface ShareDialogProps {
  gifUrl: string;
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareDialog({ 
  gifUrl, 
  title, 
  noggleColor, 
  eyeAnimation, 
  isOpen, 
  onClose 
}: ShareDialogProps) {
  const [shareImageUrl, setShareImageUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useUser();

  if (!isOpen) return null;

  const shareToFarcaster = async () => {
    try {
      setIsSharing(true);
      
      const shareText = `🎨 Just created "${title}" with ${noggleColor} noggle and ${eyeAnimation} eyes!\n\n✨ Check out my animated Noun: ${gifUrl}\n\n#Nouns #AnimatedNouns #Farcaster`;
      
      const encodedText = encodeURIComponent(shareText);
      const url = `https://warpcast.com/~/compose?text=${encodedText}`;
      window.open(url, '_blank');
      
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
      
      window.open(url, '_blank');
      
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

  const downloadShareImage = () => {
    if (!shareImageUrl) return;
    
    const link = document.createElement('a');
    link.href = shareImageUrl;
    link.download = `${title}-share-image.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track download event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        content_type: 'share_image',
        item_id: title
      });
    }
  };

  const copyGifLink = async () => {
    try {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Share Your Creation
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<Icon name="x" size="sm" />}
            >
              Close
            </Button>
          </div>

          {/* Share Image Preview */}
          <div className="mb-6">
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              {shareImageUrl ? (
                <img 
                  src={shareImageUrl} 
                  alt="Share preview" 
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-500">Generating share image...</div>
                </div>
              )}
            </div>
          </div>

          {/* Hidden ShareImageGenerator */}
          <ShareImageGenerator
            gifUrl={gifUrl}
            title={title}
            creator={user?.username || 'anonymous'}
            noggleColor={noggleColor}
            eyeAnimation={eyeAnimation}
            onImageGenerated={setShareImageUrl}
          />

          {/* Share Options */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareToFarcaster}
                disabled={isSharing}
                icon={<Icon name="farcaster" size="sm" />}
                className="w-full"
              >
                {isSharing ? 'Sharing...' : 'Share to Farcaster'}
              </Button>
              
              <Button
                variant="outline"
                onClick={shareToTwitter}
                disabled={isSharing}
                icon={<Icon name="twitter" size="sm" />}
                className="w-full"
              >
                {isSharing ? 'Sharing...' : 'Share to Twitter'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={downloadShareImage}
                disabled={!shareImageUrl}
                icon={<Icon name="download" size="sm" />}
                className="w-full"
              >
                Download Image
              </Button>
              
              <Button
                variant="outline"
                onClick={copyGifLink}
                icon={<Icon name="link" size="sm" />}
                className="w-full"
              >
                Copy GIF Link
              </Button>
            </div>
          </div>

          {/* Creation Details */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Creation Details</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Title:</strong> {title}</div>
              <div><strong>Creator:</strong> {user?.username || 'anonymous'}</div>
              <div><strong>Noggle Color:</strong> {noggleColor}</div>
              <div><strong>Eye Animation:</strong> {eyeAnimation}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 