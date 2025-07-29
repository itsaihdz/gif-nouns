"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";


interface NounTraits {
  eyes: string;
  noggles: string;
  background: string;
  body: string;
  head: string;
  glasses?: string;
  hat?: string;
  shirt?: string;
}

interface ImagePreviewProps {
  originalImageUrl: string;
  traits: NounTraits;
  onExport: (gifUrl: string) => void;
  onError: (error: string) => void;
  className?: string;
}

// Color palettes for noggles - these correspond to PNG files in /public/assets/noggles/
// Updated to match actual asset files from GitHub repository
const NOGGLE_COLORS = [
  { name: "Blue", value: "blue", class: "bg-blue-400", file: "blue.png" },
  { name: "Deep Teal", value: "deep-teal", class: "bg-teal-600", file: "deep teal.png" },
  { name: "Gomita", value: "gomita", class: "bg-pink-300", file: "gomita.png" },
  { name: "Grass", value: "grass", class: "bg-green-500", file: "grass.png" },
  { name: "Green Blue", value: "green-blue", class: "bg-cyan-500", file: "green blue.png" },
  { name: "Grey Light", value: "grey-light", class: "bg-gray-300", file: "grey light.png" },
  { name: "Guava", value: "guava", class: "bg-orange-400", file: "guava.png" },
  { name: "Hip Rose", value: "hip-rose", class: "bg-rose-500", file: "hip rose.png" },
  { name: "Honey", value: "honey", class: "bg-amber-400", file: "honey.png" },
  { name: "Hyper", value: "hyper", class: "bg-purple-500", file: "hyper.png" },
  { name: "Hyperliquid", value: "hyperliquid", class: "bg-blue-600", file: "hyperliquid.png" },
  { name: "Lavender", value: "lavender", class: "bg-purple-300", file: "lavender.png" },
  { name: "Magenta", value: "magenta", class: "bg-magenta-400", file: "magenta.png" },
  { name: "Orange", value: "orange", class: "bg-orange-400", file: "orange.png" },
  { name: "Pink Purple", value: "pink-purple", class: "bg-fuchsia-400", file: "pink purple.png" },
  { name: "Purple", value: "purple", class: "bg-purple-400", file: "purple.png" },
  { name: "Red", value: "red", class: "bg-red-400", file: "red.png" },
  { name: "Smoke", value: "smoke", class: "bg-gray-500", file: "smoke.png" },
  { name: "Teal", value: "teal", class: "bg-teal-400", file: "teal.png" },
  { name: "Watermelon", value: "watermelon", class: "bg-green-400", file: "watermelon.png" },
  { name: "Yellow Orange", value: "yellow-orange", class: "bg-orange-300", file: "yellow orange.png" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-400", file: "yellow.png" },
];

// Eye animations - these correspond to GIF files in /public/assets/eyes/
// Updated to match actual asset files from GitHub repository
const EYE_ANIMATIONS = [
  { name: "Nouns", value: "nouns", icon: "eye", file: "nouns.gif" },
  { name: "Ojos Nouns", value: "ojos-nouns", icon: "eye", file: "ojos nouns.gif" },
  { name: "Ojos Pepepunk", value: "ojos-pepepunk", icon: "eye", file: "ojos pepepunk.gif" },
  { name: "Ojos Pepepunk En Medio", value: "ojos-pepepunk-en-medio", icon: "eye", file: "ojos pepepunk en medio.gif" },
  { name: "Arriba", value: "arriba", icon: "eye", file: "arriba.gif" },
  { name: "Arriba Derecha", value: "arriba-derecha", icon: "eye", file: "arriba derecha.gif" },
  { name: "Arriba Izquierda", value: "arriba-izquierda", icon: "eye", file: "arriba izquierda.gif" },
  { name: "Abajo", value: "abajo", icon: "eye", file: "abajo.gif" },
  { name: "Abajo Derecha", value: "abajo-derecha", icon: "eye", file: "abajo derecha.gif" },
  { name: "Abajo Izquierda", value: "abajo-izquierda", icon: "eye", file: "abajo izquierda.gif" },
  { name: "Viscos", value: "viscos", icon: "sparkles", file: "viscos.gif" },
  { name: "Viscos Derecha", value: "viscos-derecha", icon: "sparkles", file: "viscos derecha.gif" },
  { name: "Viscos Izquierda", value: "viscos-izquierda", icon: "sparkles", file: "viscos izquierda.gif" },
  { name: "Locos", value: "locos", icon: "sparkles", file: "locos.gif" },
  { name: "Serpiente", value: "serpiente", icon: "sparkles", file: "serpiente.gif" },
  { name: "Vampiro", value: "vampiro", icon: "sparkles", file: "vampiro.gif" },
];

export function ImagePreview({ 
  originalImageUrl, 
  onExport, 
  onError,
  className = "" 
}: ImagePreviewProps) {
  const [selectedNoggleColor, setSelectedNoggleColor] = useState(NOGGLE_COLORS[0]?.value || "");
  const [selectedEyeAnimation, setSelectedEyeAnimation] = useState(EYE_ANIMATIONS[0]?.value || "");
  const [isExporting, setIsExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(originalImageUrl);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update preview when selections change
  useEffect(() => {
    updatePreview();
  }, [selectedNoggleColor, selectedEyeAnimation, originalImageUrl]);

  const updatePreview = async () => {
    try {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 800;

      // Load original image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = async () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the original image
        ctx.globalAlpha = 1.0;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        // Function to apply eye animation
        const applyEyeAnimation = () => {
          if (selectedEyeAnimation && selectedEyeAnimation !== "normal") {
            const eyeAnimation = EYE_ANIMATIONS.find(e => e.value === selectedEyeAnimation);
            if (eyeAnimation && eyeAnimation.file) {
              try {
                console.log(`Loading eye animation: ${eyeAnimation.file}`);
                const eyeImg = new Image();
                eyeImg.crossOrigin = "anonymous";
                
                eyeImg.onload = () => {
                  console.log(`Successfully loaded eye animation: ${eyeAnimation.file}`);
                  // Apply eye animation overlay with 100% opacity
                  ctx.globalAlpha = 1.0;
                  ctx.globalCompositeOperation = "overlay";
                  ctx.drawImage(eyeImg, 0, 0, canvas.width, canvas.height);
                  ctx.globalCompositeOperation = "source-over";
                  ctx.globalAlpha = 1.0;
                  
                  // Update preview URL
                  setPreviewUrl(canvas.toDataURL('image/png'));
                };
                
                eyeImg.onerror = () => {
                  console.warn(`Failed to load eye animation: ${eyeAnimation.file}`);
                  // Update preview URL without eye animation
                  setPreviewUrl(canvas.toDataURL('image/png'));
                };
                
                eyeImg.src = `/assets/eyes/${eyeAnimation.file}`;
              } catch (error) {
                console.warn("Error loading eye animation:", error);
                setPreviewUrl(canvas.toDataURL('image/png'));
              }
            } else {
              setPreviewUrl(canvas.toDataURL('image/png'));
            }
          } else {
            setPreviewUrl(canvas.toDataURL('image/png'));
          }
        };

        // Apply noggle color overlay using actual PNG files
        if (selectedNoggleColor && selectedNoggleColor !== "original") {
          const noggleColor = NOGGLE_COLORS.find(c => c.value === selectedNoggleColor);
          if (noggleColor && noggleColor.file) {
            try {
              console.log(`Loading noggle: ${noggleColor.file}`);
              const noggleImg = new Image();
              noggleImg.crossOrigin = "anonymous";
              
              noggleImg.onload = () => {
                console.log(`Successfully loaded noggle: ${noggleColor.file}`);
                // Apply noggle overlay with 100% opacity
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = "multiply";
                ctx.drawImage(noggleImg, 0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "source-over";
                ctx.globalAlpha = 1.0;
                
                // Continue with eye animation
                applyEyeAnimation();
              };
              
              noggleImg.onerror = () => {
                console.warn(`Failed to load noggle: ${noggleColor.file}`);
                applyEyeAnimation();
              };
              
              noggleImg.src = `/assets/noggles/${noggleColor.file}`;
            } catch (error) {
              console.warn("Error loading noggle overlay:", error);
              applyEyeAnimation();
            }
          } else {
            applyEyeAnimation();
          }
        } else {
          applyEyeAnimation();
        }
      };

      img.onerror = () => {
        console.error("Failed to load original image");
        onError("Failed to load original image");
      };

      img.src = originalImageUrl;
    } catch (error) {
      console.error("Error updating preview:", error);
      onError("Failed to update preview");
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Generate GIF with specifications: 800px, 8 fps, 16 frames (2 seconds)
      if (!canvasRef.current) {
        throw new Error("Canvas not available");
      }

      // Call the GIF generation API
      const response = await fetch('/api/generate-gif', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: originalImageUrl,
          noggleColor: selectedNoggleColor,
          eyeAnimation: selectedEyeAnimation,
          width: 800,
          height: 800,
          fps: 8,
          frames: 16,
          duration: 2.0
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate GIF');
      }

      const result = await response.json();
      
      if (result.success) {
        onExport(result.gifUrl);
      } else {
        throw new Error(result.error || 'Failed to generate GIF');
      }
    } catch (error) {
      console.error("Error exporting:", error);
      onError("Failed to export GIF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Preview Canvas */}
      <Card variant="elevated" className="relative overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Preview
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 dark:text-green-400">Live</span>
            </div>
          </div>

          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-96 object-contain"
              style={{ display: 'none' }}
            />
            <img
              src={previewUrl}
              alt="Animated Noun Preview"
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Export Button */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleExport}
              loading={isExporting}
              disabled={isExporting}
              icon={<Icon name="download" size="md" />}
            >
              {isExporting ? "Generating GIF..." : "Export as GIF"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Noggle Color Selector */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Noggle Color
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {NOGGLE_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedNoggleColor(color.value)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedNoggleColor === color.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
                title={color.name}
              >
                <div className={`w-full h-8 rounded ${color.class} mb-2`} />
                <p className={`text-xs font-medium ${
                  selectedNoggleColor === color.value 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {color.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Eye Animation Selector */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Choose Eye Animation
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {EYE_ANIMATIONS.map((animation) => (
              <button
                key={animation.value}
                onClick={() => setSelectedEyeAnimation(animation.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedEyeAnimation === animation.value
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                <div className="text-center">
                  <Icon 
                    name={animation.icon} 
                    className={`mx-auto mb-2 ${
                      selectedEyeAnimation === animation.value 
                        ? "text-purple-600 dark:text-purple-400" 
                        : "text-gray-400 dark:text-gray-500"
                    }`} 
                    size="lg" 
                  />
                  <p className={`text-sm font-medium ${
                    selectedEyeAnimation === animation.value 
                      ? "text-purple-600 dark:text-purple-400" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {animation.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
} 