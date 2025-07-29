"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

interface FeaturesProps {
  className?: string;
}

export function Features({ className = "" }: FeaturesProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: "sparkles",
      title: "Animation Engine",
      description: "Transform static Nouns with 5 color palettes and 3 eye animations (blink, wink, glow). Create unique animated art in seconds.",
      highlight: "5 palettes + 3 animations",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: "refresh",
      title: "Remix System",
      description: "Build on others' creations with automatic attribution and credit chains. Every remix preserves the original creator's legacy.",
      highlight: "Automatic attribution",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: "share",
      title: "Farcaster Native",
      description: "Auto-generated frames for seamless social sharing. Your animations go viral through the Farcaster ecosystem.",
      highlight: "Auto-generated frames",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: "wallet",
      title: "Base L2 Integration",
      description: "One-click NFT minting with ultra-low gas costs (~$0.01). Built on Coinbase's secure and scalable Base network.",
      highlight: "~$0.01 gas costs",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: "dollar",
      title: "Creator Economy",
      description: "Earn royalties every time someone remixes your art. Support the Nouns culture through creative collaboration.",
      highlight: "Revenue sharing",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: "palette",
      title: "Open Source",
      description: "Transparent remix attribution and IPFS metadata storage for permanence. Community-driven development.",
      highlight: "IPFS storage",
      color: "from-teal-500 to-blue-500",
    },
  ];

  const benefits = [
    {
      title: "For Creators",
      description: "Earn royalties every time someone remixes your art",
      icon: "star",
      color: "text-yellow-500",
    },
    {
      title: "For Collectors",
      description: "Own unique animated art before it goes viral",
      icon: "heart",
      color: "text-red-500",
    },
    {
      title: "For Community",
      description: "Support Nouns culture through creative collaboration",
      icon: "sparkles",
      color: "text-purple-500",
    },
  ];

  return (
    <section id="features" className={`py-20 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6">
            <Icon name="sparkles" className="mr-2" size="sm" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              create viral art
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The first social remix platform built specifically for the Nouns community. 
            Create, remix, and collect unique animated PFPs with seamless Farcaster integration.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              variant="elevated"
              className={`transition-all duration-700 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              hover
            >
              <div className="p-6">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon name={feature.icon} className="text-white" size="lg" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>

                {/* Highlight */}
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                  <Icon name="check" className="mr-1" size="sm" />
                  {feature.highlight}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits section */}
        <div className={`bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8 lg:p-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Built for the entire{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Nouns ecosystem
              </span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Whether you're a creator, collector, or community member, 
              Nouns Remix Studio has something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${(index + 6) * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon name={benefit.icon} className={benefit.color} size="xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className={`mt-16 text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Trusted by the Nouns community
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 dark:text-gray-500">
            <div className="flex items-center space-x-2">
              <Icon name="check" className="text-green-500" size="sm" />
              <span className="text-sm">Coinbase partnership</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="check" className="text-green-500" size="sm" />
              <span className="text-sm">Base L2 official integration</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="check" className="text-green-500" size="sm" />
              <span className="text-sm">Open source code</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="check" className="text-green-500" size="sm" />
              <span className="text-sm">2.5% platform fee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 