"use client";

import { useRef, useEffect, useState } from 'react';

interface ShareImageGeneratorProps {
  gifUrl: string;
  title: string;
  creator: string;
  noggleColor: string;
  eyeAnimation: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export function ShareImageGenerator({
  gifUrl,
  title,
  creator,
  noggleColor,
  eyeAnimation,
  onImageGenerated
}: ShareImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateShareImage();
  }, [gifUrl, title, creator, noggleColor, eyeAnimation, onImageGenerated]);

  const generateShareImage = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for social media (1200x630)
    canvas.width = 1200;
    canvas.height = 630;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < canvas.width; i += 50) {
      for (let j = 0; j < canvas.height; j += 50) {
        if ((i + j) % 100 === 0) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }

    // Load and draw the GIF (first frame as preview)
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = gifUrl;
      });

      // Calculate dimensions to fit in the center
      const maxWidth = 400;
      const maxHeight = 400;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the GIF
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2 - 50;
      
      // Add shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;
      
      // Draw GIF
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } catch {
      console.log('Could not load GIF, using placeholder');
      // Draw placeholder if GIF fails to load
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 200, 400, 400);
    }

    // Add title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Montserrat, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(title, canvas.width / 2, 50);
    
    // Add subtitle
    ctx.font = '24px Montserrat, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(`by ${creator}`, canvas.width / 2, 110);
    
    // Add traits info
    ctx.font = '18px Montserrat, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`${noggleColor} noggles • ${eyeAnimation} eyes`, canvas.width / 2, 140);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Add logo/branding
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px Montserrat, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('gifnouns.freezerserve.com', canvas.width / 2, canvas.height - 30);

    // Convert canvas to data URL
    const imageUrl = canvas.toDataURL('image/png');
    onImageGenerated?.(imageUrl);
    setIsGenerating(false);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="hidden" // Hide the canvas, we only use it for generation
      />
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className="text-white">Generating share image...</div>
        </div>
      )}
    </div>
  );
} 