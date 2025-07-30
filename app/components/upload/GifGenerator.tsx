import { useCallback, useRef } from 'react';
import GIF from 'gif.js';
import { parseGIF, decompressFrames } from 'gifuct-js';

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
      const gifRef = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: '/gif.worker.js'
      });

      // Load binary data of eye animation GIF
      const response = await fetch(`/assets/eyes/${eyeAnimation}.gif`);
      const arrayBuffer = await response.arrayBuffer();
      const gif = parseGIF(arrayBuffer);
      const framesData = decompressFrames(gif, true);

      // Load original image and noggle overlay
      const originalImg = await loadImage(originalImageUrl);
      let noggleImg = null;
      if (noggleColor && noggleColor !== "original") {
        noggleImg = await loadImage(`/assets/noggles/${noggleColor}.png`);
      }

      // Iterate through each extracted GIF frame
      for (let i = 0; i < framesData.length; i++) {
        const frame = framesData[i];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas context error');

        // Draw base image
        ctx.drawImage(originalImg, 0, 0, width, height);

        // Optional overlay
        if (noggleImg) {
          ctx.drawImage(noggleImg, 0, 0, width, height);
        }

        // Draw GIF frame manually
        const imageData = ctx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        ctx.putImageData(imageData, frame.dims.left, frame.dims.top);

        // Add to output GIF
        gifRef.addFrame(canvas, { delay: frame.delay || 100 });

        onProgress?.(((i + 1) / framesData.length) * 100);
      }

      gifRef.on('finished', (blob: Blob) => {
        const gifUrl = URL.createObjectURL(blob);
        onComplete?.(gifUrl);
      });

      gifRef.render();
    } catch (err) {
      console.error('Error:', err);
      onError?.(err instanceof Error ? err.message : 'GIF generation failed');
    }
  }, [originalImageUrl, noggleColor, eyeAnimation, width, height, onProgress, onComplete, onError]);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
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