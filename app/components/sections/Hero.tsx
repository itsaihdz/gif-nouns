"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { Card } from "../ui/Card";

interface HeroProps {
  className?: string;
}

export function Hero({ className = "" }: HeroProps) {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const animations = [
    { name: "Blink", color: "from-purple-500 to-pink-500" },
    { name: "Wink", color: "from-blue-500 to-cyan-500" },
    { name: "Glow", color: "from-green-500 to-emerald-500" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [animations.length]);

  const stats = [
    { value: "500+", label: "Creators" },
    { value: "$12K+", label: "Paid Out" },
    { value: "2,500+", label: "Animations" },
    { value: "100%", label: "On Base L2" },
  ];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
              <Icon name="sparkles" className="mr-2" size="sm" />
              The first social remix platform for Nouns
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Turn your{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Noun
                </span>{" "}
                into viral{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  animated art
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Create, remix, and collect unique animated PFPs in the Farcaster ecosystem. 
                Join 500+ creators already earning from their art.
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="gradient" 
                size="xl"
                className="group"
                href="/upload"
                icon={<Icon name="sparkles" size="lg" />}
              >
                Start Creating Your Animated Noun
                <Icon 
                  name="arrowRight" 
                  size="sm" 
                  className="ml-2 group-hover:translate-x-1 transition-transform" 
                />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                href="#demo"
              >
                <Icon name="play" className="mr-2" size="sm" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`text-center transition-all duration-500 delay-${index * 100} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Animation preview */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative">
              {/* Main animation card */}
              <Card 
                variant="elevated" 
                className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
                hover
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Icon name="sparkles" className="text-white" size="lg" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Nouns Remix Studio
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {animations[currentAnimation].name} Animation
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Animated Noun preview */}
                  <div className="relative">
                    <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${animations[currentAnimation].color} rounded-2xl flex items-center justify-center shadow-lg animate-pulse`}>
                      <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon name="eye" className="text-white" size="xl" />
                      </div>
                    </div>
                    
                    {/* Animation indicators */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Icon name="play" className="text-white" size="sm" />
                    </div>
                  </div>

                  {/* Color palette */}
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Color Palette
                    </p>
                    <div className="flex space-x-2">
                      {["bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-cyan-500", "bg-green-500"].map((color, index) => (
                        <div 
                          key={index}
                          className={`w-8 h-8 ${color} rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-6 flex space-x-3">
                    <Button variant="primary" size="sm" className="flex-1">
                      <Icon name="refresh" className="mr-2" size="sm" />
                      Remix
                    </Button>
                    <Button variant="outline" size="sm">
                      <Icon name="share" className="mr-2" size="sm" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 