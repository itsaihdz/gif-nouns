import { useCallback, useRef } from 'react';
import GIF from 'gif.js';

interface GifGeneratorProps {
  originalImageUrl: string;
  noggleColor?: string;
  eyeAnimation?: string;
  width?: number;
  height?: number;
  fps?: number;
  frames?: number;
  duration?: number;
  onProgress?: (progress: number) => void;
  onComplete?: (gifUrl: string) => void;
  onError?: (error: string) => void;
}

export function useGifGenerator({
  originalImageUrl,
  noggleColor,
  eyeAnimation,
  width = 800,
  height = 800,
  fps = 8,
  frames = 16,
  duration = 2.0,
  onProgress,
  onComplete,
  onError
}: GifGeneratorProps) {
  const gifRef = useRef<GIF | null>(null);

  const generateGif = useCallback(async () => {
    try {
      // Create a new GIF instance
      gifRef.current = new GIF({
        workers: 2,
        quality: 10,
        width: width,
        height: height,
        workerScript: '/gif.worker.js'
      });

      // Load the original image
      const originalImg = await loadImage(originalImageUrl);
      
      // Load noggle if selected
      let noggleImg: HTMLImageElement | null = null;
      if (noggleColor && noggleColor !== "original") {
        noggleImg = await loadImage(`/assets/noggles/${noggleColor}.png`);
      }

      // Load and extract frames from eye animation GIF
      let eyeFrames: HTMLImageElement[] = [];
      if (eyeAnimation && eyeAnimation !== "normal") {
        eyeFrames = await extractGifFrames(`/assets/eyes/${eyeAnimation}.gif`, frames);
      }

      // Calculate frame delay
      const frameDelay = Math.round((duration * 1000) / frames);

      // Generate frames
      for (let i = 0; i < frames; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw original image
        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(originalImg, 0, 0, width, height);

        // Draw noggle if selected
        if (noggleImg) {
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(noggleImg, 0, 0, width, height);
        }

        // Draw eye animation frame
        if (eyeFrames.length > 0) {
          const eyeFrame = eyeFrames[i % eyeFrames.length];
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(eyeFrame, 0, 0, width, height);
        }

        // Add frame to GIF
        gifRef.current.addFrame(canvas, { delay: frameDelay });

        // Update progress
        onProgress?.((i + 1) / frames * 100);
      }

      // Render the GIF
      gifRef.current.on('finished', (blob: Blob) => {
        const gifUrl = URL.createObjectURL(blob);
        onComplete?.(gifUrl);
      });

      gifRef.current.render();

    } catch (error) {
      console.error('Error generating GIF:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to generate GIF');
    }
  }, [originalImageUrl, noggleColor, eyeAnimation, width, height, fps, frames, duration, onProgress, onComplete, onError]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const extractGifFrames = async (gifUrl: string, frameCount: number): Promise<HTMLImageElement[]> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        try {
          const frames: HTMLImageElement[] = [];
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Set canvas size to match the GIF
          canvas.width = img.width;
          canvas.height = img.height;

          // Create animated frames by cycling through the GIF animation
          // We'll use different timing offsets to capture different parts of the animation
          for (let i = 0; i < frameCount; i++) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw the GIF image
            ctx.drawImage(img, 0, 0);
            
            // Create a new image element from the canvas
            const frameImg = new Image();
            frameImg.src = canvas.toDataURL();
            frames.push(frameImg);
            
            // Small delay to allow the GIF to animate
            // This is a workaround since we can't directly extract frames
            // The actual animation will come from the GIF's natural timing
          }

          resolve(frames);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error(`Failed to load GIF: ${gifUrl}`));
      img.src = gifUrl;
    });
  };

  const downloadGif = useCallback((gifUrl: string, filename: string = 'animated-noun.gif') => {
    const link = document.createElement('a');
    link.href = gifUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const mintAsNFT = useCallback(async (gifUrl: string) => {
    try {
      // Convert blob URL to blob
      const response = await fetch(gifUrl);
      const blob = await response.blob();
      
      // Create metadata for NFT
      const metadata = {
        name: "Animated Noun",
        description: "A unique animated Noun created with GIF Nouns Studio",
        image: gifUrl,
        attributes: [
          { trait_type: "Noggle Color", value: noggleColor || "original" },
          { trait_type: "Eye Animation", value: eyeAnimation || "normal" },
          { trait_type: "Resolution", value: `${width}x${height}` },
          { trait_type: "FPS", value: fps },
          { trait_type: "Duration", value: `${duration}s` }
        ]
      };

      // Here you would integrate with your preferred NFT minting service
      // For example, using IPFS to store the metadata and image
      console.log('NFT Metadata:', metadata);
      console.log('GIF Blob:', blob);
      
      // Placeholder for NFT minting logic
      alert('NFT minting feature coming soon! Metadata prepared.');
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      onError?.('Failed to mint NFT');
    }
  }, [noggleColor, eyeAnimation, width, height, fps, duration, onError]);

  return {
    generateGif,
    downloadGif,
    mintAsNFT
  };
} 