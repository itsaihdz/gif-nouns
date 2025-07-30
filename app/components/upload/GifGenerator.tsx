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
    try {
      // Fetch the GIF file
      const response = await fetch(gifUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      // Parse the GIF
      const gif = parseGIF(arrayBuffer);
      const frames = decompressFrames(gif, true);
      
      // Convert frames to ImageElements
      const imageFrames: HTMLImageElement[] = [];
      
      for (let i = 0; i < Math.min(frameCount, frames.length); i++) {
        const frame = frames[i];
        
        // Create canvas to convert frame data to image
        const canvas = document.createElement('canvas');
        canvas.width = frame.dims.width;
        canvas.height = frame.dims.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Create ImageData from frame pixels
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.pixels),
          frame.dims.width,
          frame.dims.height
        );
        
        // Put the frame data on canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to image
        const img = new Image();
        img.src = canvas.toDataURL();
        
        // Wait for image to load
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load frame image'));
        });
        
        imageFrames.push(img);
      }
      
      // If we have fewer frames than requested, repeat the last frame
      while (imageFrames.length < frameCount) {
        const lastFrame = imageFrames[imageFrames.length - 1];
        const repeatedFrame = new Image();
        repeatedFrame.src = lastFrame.src;
        await new Promise<void>((resolve, reject) => {
          repeatedFrame.onload = () => resolve();
          repeatedFrame.onerror = () => reject(new Error('Failed to load repeated frame'));
        });
        imageFrames.push(repeatedFrame);
      }
      
      return imageFrames;
      
    } catch (error) {
      console.error('Error extracting GIF frames:', error);
      // Fallback: create simple animated frames
      return createFallbackFrames(gifUrl, frameCount);
    }
  };

  const createFallbackFrames = async (gifUrl: string, frameCount: number): Promise<HTMLImageElement[]> => {
    return new Promise((resolve, reject) => {
      const frames: HTMLImageElement[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Create animated frames by applying different transformations
        for (let i = 0; i < frameCount; i++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the base GIF image
          ctx.drawImage(img, 0, 0);
          
          // Apply frame-specific transformations to simulate animation
          const progress = i / frameCount;
          
          // Create different visual states for each frame
          if (progress > 0.25 && progress <= 0.5) {
            // Apply subtle rotation for frames 25-50%
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((progress - 0.25) * 0.1);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
          } else if (progress > 0.5 && progress <= 0.75) {
            // Apply subtle scale for frames 50-75%
            const scale = 1 + (progress - 0.5) * 0.05;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.scale(scale, scale);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
          } else if (progress > 0.75) {
            // Apply subtle brightness adjustment for frames 75-100%
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = `rgba(1, 1, 1, ${(progress - 0.75) * 0.2})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
          }
          
          const frameImg = new Image();
          frameImg.src = canvas.toDataURL();
          frames.push(frameImg);
        }

        resolve(frames);
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