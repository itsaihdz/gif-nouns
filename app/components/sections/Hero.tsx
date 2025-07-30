"use client";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 nouns-gradient opacity-10"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="nouns-heading nouns-typography text-5xl md:text-7xl lg:text-8xl mb-6 nouns-gradient-text fade-in">
            This is Nouns
          </h1>
          
          {/* Subtitle */}
          <p className="nouns-text nouns-typography text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto slide-up">
            Turn your Noun into viral animated art. Create, remix, and collect unique animated PFPs in the Farcaster ecosystem.
          </p>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="nouns-card p-6 text-center slide-up">
              <div className="text-3xl font-bold nouns-gradient-text mb-2">537</div>
              <div className="text-gray-600">Nouns Created</div>
            </Card>
            <Card className="nouns-card p-6 text-center slide-up">
              <div className="text-3xl font-bold nouns-gradient-text mb-2">8</div>
              <div className="text-gray-600">Noun Owners</div>
            </Card>
            <Card className="nouns-card p-6 text-center slide-up">
              <div className="text-3xl font-bold nouns-gradient-text mb-2">∞</div>
              <div className="text-gray-600">Ideas Funded</div>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-up">
            <Button
              href="/upload"
              className="nouns-button text-lg px-8 py-4"
              icon={<Icon name="sparkles" className="w-5 h-5" />}
            >
              Start Creating Your Animated Noun
            </Button>
            
            <Button
              href="#learn-more"
              variant="outline"
              className="nouns-button-secondary text-lg px-8 py-4"
              icon={<Icon name="arrow-right" className="w-5 h-5" />}
            >
              Learn More
            </Button>
          </div>

          {/* Features preview */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="nouns-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 nouns-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="image" className="w-8 h-8 text-white" />
              </div>
              <h3 className="nouns-heading text-xl mb-2">Upload & Customize</h3>
              <p className="nouns-text text-gray-600">Upload your Noun and customize it with unique noggles and eye animations.</p>
            </Card>

            <Card className="nouns-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 nouns-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="sparkles" className="w-8 h-8 text-white" />
              </div>
              <h3 className="nouns-heading text-xl mb-2">Animated GIFs</h3>
              <p className="nouns-text text-gray-600">Generate beautiful animated GIFs with 16 frames at 8fps for social sharing.</p>
            </Card>

            <Card className="nouns-card p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 nouns-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="crown" className="w-8 h-8 text-white" />
              </div>
              <h3 className="nouns-heading text-xl mb-2">Mint as NFT</h3>
              <p className="nouns-text text-gray-600">Mint your animated Noun as an NFT on Base L2 and share on Farcaster.</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="chevron-down" className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
} 