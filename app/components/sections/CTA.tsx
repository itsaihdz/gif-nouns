"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

interface CTAProps {
  className?: string;
}

export function CTA({ className = "" }: CTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        if (totalSeconds <= 0) {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Alex Chen",
      handle: "@alexchen.eth",
      avatar: "AC",
      earnings: "$2,847",
      text: "Made more from remixes in one month than I did in a year of static art!",
    },
    {
      name: "Sarah Kim",
      handle: "@sarahkim.nouns",
      avatar: "SK",
      earnings: "$1,923",
      text: "The remix system is genius. My original art keeps earning while I sleep.",
    },
    {
      name: "Mike Rodriguez",
      handle: "@mikerod.eth",
      avatar: "MR",
      earnings: "$3,156",
      text: "Finally found a way to monetize my PFP creativity. This is revolutionary!",
    },
  ];

  const features = [
    "5 color palettes + 3 eye animations",
    "Automatic remix attribution",
    "Farcaster frame integration",
    "Base L2 NFT minting (~$0.01 gas)",
    "Revenue sharing for creators",
    "IPFS metadata storage",
  ];

  return (
    <section className={`py-20 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Urgency badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
              <Icon name="sparkles" className="mr-2" size="sm" />
              Limited Time: Early Creator Bonus
            </div>

            {/* Main headline */}
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Don't let your Noun stay{" "}
                <span className="text-yellow-300">
                  static
                </span>{" "}
                while others{" "}
                <span className="text-yellow-300">
                  animate
                </span>{" "}
                theirs
              </h2>
              <p className="text-xl text-purple-100 max-w-2xl">
                Join 500+ creators already earning from their animated art. 
                The remix revolution is happening now - don't miss out!
              </p>
            </div>

            {/* Countdown timer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <p className="text-purple-100 text-sm font-medium mb-3">
                Early Creator Bonus Ends In:
              </p>
              <div className="flex space-x-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div className="bg-white/20 rounded-lg px-3 py-2">
                      <div className="text-2xl font-bold text-white">
                        {value.toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div className="text-xs text-purple-200 mt-1 capitalize">
                      {unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="secondary" 
                size="xl"
                className="group bg-white text-purple-600 hover:bg-gray-100"
                icon={<Icon name="sparkles" size="lg" />}
              >
                Connect Farcaster & Start Creating
                <Icon 
                  name="arrowRight" 
                  size="sm" 
                  className="ml-2 group-hover:translate-x-1 transition-transform" 
                />
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-white text-white hover:bg-white/10"
                href="#demo"
              >
                <Icon name="play" className="mr-2" size="sm" />
                Watch Demo
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 text-purple-100">
              <div className="flex items-center space-x-2">
                <Icon name="check" className="text-green-300" size="sm" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="check" className="text-green-300" size="sm" />
                <span className="text-sm">Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="check" className="text-green-300" size="sm" />
                <span className="text-sm">Instant setup</span>
              </div>
            </div>
          </div>

          {/* Right content - Testimonials */}
          <div className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Stats card */}
            <Card variant="elevated" className="bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Creator Success Stories
                </h3>
                <div className="space-y-4">
                  {testimonials.map((testimonial, index) => (
                    <div 
                      key={testimonial.name}
                      className={`flex items-start space-x-3 p-4 bg-white/10 rounded-lg transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="font-medium text-white">{testimonial.name}</p>
                            <p className="text-sm text-purple-200">{testimonial.handle}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-yellow-300">{testimonial.earnings}</p>
                            <p className="text-xs text-purple-200">earned</p>
                          </div>
                        </div>
                        <p className="text-sm text-purple-100">{testimonial.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Features list */}
            <Card variant="elevated" className="bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Everything Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div 
                      key={feature}
                      className={`flex items-center space-x-2 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                      style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                    >
                      <Icon name="check" className="text-green-300" size="sm" />
                      <span className="text-sm text-purple-100">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Social proof */}
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-2">
                Featured in
              </p>
              <div className="flex justify-center items-center space-x-6 text-white/60">
                <div className="flex items-center space-x-2">
                  <Icon name="star" size="sm" />
                  <span className="text-sm">/nouns Farcaster</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="star" size="sm" />
                  <span className="text-sm">Base Builders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="star" size="sm" />
                  <span className="text-sm">Crypto Twitter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 