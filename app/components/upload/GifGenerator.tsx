import { useCallback } from 'react';
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

// Mapping from values to actual file names
const EYE_ANIMATION_FILES: Record<string, string> = {
  "nouns": "nouns.gif",
  "ojos-nouns": "ojos nouns.gif",
  "ojos-pepepunk": "ojos pepepunk.gif",
  "ojos-pepepunk-en-medio": "ojos pepepunk en medio.gif",
  "arriba": "arriba.gif",
  "arriba-derecha": "arriba derecha.gif",
  "arriba-izquierda": "arriba izquierda.gif",
  "abajo": "abajo.gif",
  "abajo-derecha": "abajo derecha.gif",
  "abajo-izquierda": "abajo izquierda.gif",
  "viscos": "viscos.gif",
  "viscos-derecha": "viscos derecha.gif",
  "viscos-izquierda": "viscos izquierda.gif",
  "locos": "locos.gif",
  "serpiente": "serpiente.gif",
  "vampiro": "vampiro.gif",
};

const NOGGLE_COLOR_FILES: Record<string, string> = {
  "blue": "blue.png",
  "deep-teal": "deep teal.png",
  "gomita": "gomita.png",
  "grass": "grass.png",
  "green-blue": "green blue.png",
  "grey-light": "grey light.png",
  "guava": "guava.png",
  "hip-rose": "hip rose.png",
  "honey": "honey.png",
  "hyper": "hyper.png",
  "hyperliquid": "hyperliquid.png",
  "lavender": "lavender.png",
  "magenta": "magenta.png",
  "orange": "orange.png",
  "pink-purple": "pink purple.png",
  "purple": "purple.png",
  "red": "red.png",
  "smoke": "smoke.png",
  "teal": "teal.png",
  "watermelon": "watermelon.png",
  "yellow-orange": "yellow orange.png",
  "yellow": "yellow.png",
};

export function useGifGenerator({
  originalImageUrl,
  noggleColor,
  eyeAnimation,
  width = 800,
  height = 800,
  fps = 8,
  duration = 2.0,
  onProgress,
  onComplete,
  onError
}: GifGeneratorProps) {
  const generateGif = useCallback(async () => {
    try {
      // Validate that we have required parameters
      if (!eyeAnimation || !eyeAnimation.trim()) {
        throw new Error('Eye animation is required');
      }
      
      // Get the correct file name for the eye animation
      const eyeAnimationFile = EYE_ANIMATION_FILES[eyeAnimation];
      if (!eyeAnimationFile) {
        throw new Error(`Unknown eye animation: ${eyeAnimation}`);
      }

      // Load binary data of eye animation GIF
      const response = await fetch(`/assets/eyes/${eyeAnimationFile}`);
      const arrayBuffer = await response.arrayBuffer();
      const gif = parseGIF(arrayBuffer);
      const framesData = decompressFrames(gif, true);

      // Load original image and noggle overlay
      const originalImg = await loadImage(originalImageUrl);
      let noggleImg = null;
      if (noggleColor && noggleColor.trim() && noggleColor !== "original") {
        const noggleFile = NOGGLE_COLOR_FILES[noggleColor];
        if (noggleFile) {
          noggleImg = await loadImage(`/assets/noggles/${noggleFile}`);
        }
      }

      // Create GIF with the same frame count as the original eye animation
      const gifRef = new GIF({
        workers: 2,
        quality: 10,
        width,
        height,
        workerScript: '/gif.worker.js'
      });

      // Calculate delay for 8fps (125ms per frame)
      const frameDelay = 1000 / fps; // Convert fps to milliseconds

      // Use the exact frame count from the original eye animation but with 8fps timing
      for (let i = 0; i < framesData.length; i++) {
        const frame = framesData[i];
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) throw new Error('Canvas context error');

        // Clear canvas with transparent background
        ctx.clearRect(0, 0, width, height);

        // Draw base image
        ctx.drawImage(originalImg, 0, 0, width, height);

        // Optional noggle overlay
        if (noggleImg) {
          ctx.drawImage(noggleImg, 0, 0, width, height);
        }

        // Create a temporary canvas for the eye frame to handle transparency properly
        const eyeCanvas = document.createElement('canvas');
        eyeCanvas.width = width;
        eyeCanvas.height = height;
        const eyeCtx = eyeCanvas.getContext('2d');

        if (!eyeCtx) throw new Error('Eye canvas context error');

        // Clear eye canvas
        eyeCtx.clearRect(0, 0, width, height);

        // Draw the eye frame with proper positioning
        const imageData = eyeCtx.createImageData(frame.dims.width, frame.dims.height);
        imageData.data.set(frame.patch);
        eyeCtx.putImageData(imageData, frame.dims.left, frame.dims.top);

        // Composite the eye frame onto the main canvas
        ctx.drawImage(eyeCanvas, 0, 0);

        // Add frame with 8fps timing (125ms delay)
        gifRef.addFrame(canvas, { delay: frameDelay });

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
  }, [originalImageUrl, noggleColor, eyeAnimation, width, height, fps, onProgress, onComplete, onError]);

  // Promise-based version of generateGif
  const generateGifAsync = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create temporary handlers for this specific call
      const tempOnComplete = (gifUrl: string) => {
        resolve(gifUrl);
      };
      
      const tempOnError = (error: string) => {
        reject(new Error(error));
      };

      // Create a temporary GIF instance for this call
      const tempGifGenerator = async () => {
        try {
          // Get the correct file name for the eye animation
          const eyeAnimationFile = EYE_ANIMATION_FILES[eyeAnimation || ""];
          if (!eyeAnimationFile) {
            throw new Error(`Unknown eye animation: ${eyeAnimation}`);
          }

          // Load binary data of eye animation GIF
          const response = await fetch(`/assets/eyes/${eyeAnimationFile}`);
          const arrayBuffer = await response.arrayBuffer();
          const gif = parseGIF(arrayBuffer);
          const framesData = decompressFrames(gif, true);

          // Load original image and noggle overlay
          const originalImg = await loadImage(originalImageUrl);
          let noggleImg = null;
          if (noggleColor && noggleColor !== "original") {
            const noggleFile = NOGGLE_COLOR_FILES[noggleColor];
            if (noggleFile) {
              noggleImg = await loadImage(`/assets/noggles/${noggleFile}`);
            }
          }

          // Create GIF with the same frame count as the original eye animation
          const gifRef = new GIF({
            workers: 2,
            quality: 10,
            width,
            height,
            workerScript: '/gif.worker.js'
          });

          // Calculate delay for 8fps (125ms per frame)
          const frameDelay = 1000 / fps; // Convert fps to milliseconds

          // Use the exact frame count from the original eye animation but with 8fps timing
          for (let i = 0; i < framesData.length; i++) {
            const frame = framesData[i];
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) throw new Error('Canvas context error');

            // Clear canvas with transparent background
            ctx.clearRect(0, 0, width, height);

            // Draw base image
            ctx.drawImage(originalImg, 0, 0, width, height);

            // Optional noggle overlay
            if (noggleImg) {
              ctx.drawImage(noggleImg, 0, 0, width, height);
            }

            // Create a temporary canvas for the eye frame to handle transparency properly
            const eyeCanvas = document.createElement('canvas');
            eyeCanvas.width = width;
            eyeCanvas.height = height;
            const eyeCtx = eyeCanvas.getContext('2d');

            if (!eyeCtx) throw new Error('Eye canvas context error');

            // Clear eye canvas
            eyeCtx.clearRect(0, 0, width, height);

            // Draw the eye frame with proper positioning
            const imageData = eyeCtx.createImageData(frame.dims.width, frame.dims.height);
            imageData.data.set(frame.patch);
            eyeCtx.putImageData(imageData, frame.dims.left, frame.dims.top);

            // Composite the eye frame onto the main canvas
            ctx.drawImage(eyeCanvas, 0, 0);

            // Add frame with 8fps timing (125ms delay)
            gifRef.addFrame(canvas, { delay: frameDelay });

            onProgress?.(((i + 1) / framesData.length) * 100);
          }

          gifRef.on('finished', (blob: Blob) => {
            const gifUrl = URL.createObjectURL(blob);
            tempOnComplete(gifUrl);
          });

          gifRef.render();
        } catch (err) {
          console.error('Error:', err);
          tempOnError(err instanceof Error ? err.message : 'GIF generation failed');
        }
      };

      tempGifGenerator();
    });
  }, [originalImageUrl, noggleColor, eyeAnimation, width, height, fps, onProgress]);

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
    generateGifAsync,
    downloadGif,
    mintAsNFT
  };
} 