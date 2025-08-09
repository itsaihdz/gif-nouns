"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";
import { TransactionHandler } from "../ui/TransactionHandler";
import { useTracking } from "../analytics/Tracking";

interface DemoProps {
  className?: string;
}

export function Demo({ className = "" }: DemoProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [selectedAnimation, setSelectedAnimation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const tracking = useTracking();

  const palettes = [
    { name: "Purple", colors: ["from-purple-500", "to-pink-500"] },
    { name: "Blue", colors: ["from-blue-500", "to-cyan-500"] },
    { name: "Green", colors: ["from-green-500", "to-emerald-500"] },
    { name: "Orange", colors: ["from-orange-500", "to-red-500"] },
    { name: "Indigo", colors: ["from-indigo-500", "to-purple-500"] },
  ];

  const animations = [
    { name: "Blink", icon: "eye" },
    { name: "Wink", icon: "eye" },
    { name: "Glow", icon: "sparkles" },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSelectedAnimation((prev) => (prev + 1) % animations.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, animations.length]);

  const handlePaletteChange = (index: number) => {
    setSelectedPalette(index);
    tracking.demoPaletteChange(palettes[index].name);
  };

  const handleAnimationChange = (index: number) => {
    setSelectedAnimation(index);
    tracking.demoAnimationChange(animations[index].name);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="demo" className={`py-20 bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <Icon name="play" className="mr-2" size="sm" />
            Interactive Demo
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            See the{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              magic in action
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Try different color palettes and animations to see how easy it is to create 
            unique animated Nouns. Click the controls below to experiment!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo preview */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Card variant="elevated" className="relative overflow-hidden">
              <div className="p-8">
                {/* Demo header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Icon name="sparkles" className="text-white" size="md" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        GifNouns
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Live Preview
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                  </div>
                </div>

                {/* Animated Noun display */}
                <div className="relative mb-8">
                  <div className={`w-48 h-48 mx-auto bg-gradient-to-br ${palettes[selectedPalette].colors[0]} ${palettes[selectedPalette].colors[1]} rounded-3xl flex items-center justify-center shadow-2xl ${isPlaying ? "animate-pulse" : ""}`}>
                    <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Icon 
                        name={animations[selectedAnimation].icon} 
                        className="text-white" 
                        size="xl" 
                      />
                    </div>
                  </div>
                  
                  {/* Animation indicator */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon name="play" className="text-white" size="sm" />
                  </div>
                </div>

                {/* Current settings */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Animation: {animations[selectedAnimation].name}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((selectedAnimation + 1) / animations.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Color Palette: {palettes[selectedPalette].name}
                    </p>
                    <div className="flex space-x-2">
                      {palettes[selectedPalette].colors.map((color, index) => (
                        <div 
                          key={index}
                          className={`w-6 h-6 bg-gradient-to-r ${color} rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Animation controls */}
            <Card variant="outlined">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Animation
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {animations.map((animation, index) => (
                    <button
                      key={animation.name}
                      onClick={() => handleAnimationChange(index)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedAnimation === index
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }`}
                    >
                      <div className="text-center">
                        <Icon 
                          name={animation.icon} 
                          className={`mx-auto mb-2 ${selectedAnimation === index ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"}`} 
                          size="lg" 
                        />
                        <p className={`text-sm font-medium ${selectedAnimation === index ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"}`}>
                          {animation.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Color palette controls */}
            <Card variant="outlined">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Choose Color Palette
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {palettes.map((palette, index) => (
                    <button
                      key={palette.name}
                      onClick={() => handlePaletteChange(index)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedPalette === index
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                      }`}
                    >
                      <div className={`w-full h-8 bg-gradient-to-r ${palette.colors[0]} ${palette.colors[1]} rounded mb-2`} />
                      <p className={`text-xs font-medium ${selectedPalette === index ? "text-purple-600 dark:text-purple-400" : "text-gray-600 dark:text-gray-400"}`}>
                        {palette.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Playback controls */}
            <Card variant="outlined">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Playback Controls
                </h3>
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={isPlaying ? "primary" : "outline"}
                    onClick={togglePlay}
                    icon={<Icon name={isPlaying ? "pause" : "play"} size="sm" />}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Auto-cycling animations
                  </div>
                </div>
              </div>
            </Card>

            {/* CTA */}
            <div className="text-center">
              <Button 
                variant="gradient" 
                size="lg"
                className="w-full"
                icon={<Icon name="sparkles" size="lg" />}
              >
                Start Creating Your Own
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Connect your Farcaster account to begin
              </p>
            </div>

            {/* Web3 Transaction Handler */}
            <Card variant="gradient" className="mt-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ready to Mint Your Creation?
                </h3>
                <p className="text-purple-100 mb-6">
                  Turn your animated Noun into a unique NFT on Base L2. Low gas fees (~$0.01) and instant confirmation.
                </p>
                <TransactionHandler 
                  onSuccess={(hash: string) => {
                    console.log("Transaction successful:", hash);
                  }}
                  onError={(error: Error) => {
                    console.error("Transaction failed:", error);
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 