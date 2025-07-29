"use client";

import { Button } from "../ui/Button";
import { Icon } from "../icons";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Demo", href: "#demo" },
      { name: "Gallery", href: "#gallery" },
      { name: "Pricing", href: "#pricing" },
    ],
    community: [
      { name: "Farcaster Channel", href: "https://warpcast.com/~/channel/nouns-remix" },
      { name: "Discord", href: "https://discord.gg/nounsremix" },
      { name: "Twitter", href: "https://twitter.com/nounsremix" },
      { name: "GitHub", href: "https://github.com/nouns-remix-studio" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Reference", href: "/api" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "Support", href: "/support" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "License", href: "/license" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/nounsremix", icon: "twitter" },
    { name: "GitHub", href: "https://github.com/nouns-remix-studio", icon: "github" },
    { name: "Discord", href: "https://discord.gg/nounsremix", icon: "discord" },
  ];

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="sparkles" className="text-white" size="sm" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Nouns Remix Studio
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The first social remix platform for Nouns. Create, remix, and collect unique 
              animated PFPs in the Farcaster ecosystem.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon name={social.icon} className="text-gray-400 hover:text-white" size="sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay updated with the latest features
              </h3>
              <p className="text-gray-400 text-sm">
                Get notified about new animations, remix opportunities, and community updates.
              </p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                variant="primary"
                className="rounded-l-none"
                icon={<Icon name="arrowRight" size="sm" />}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} Nouns Remix Studio. All rights reserved.
              </p>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Icon name="heart" className="text-red-400" size="sm" />
                <span>Built with love for the Nouns community</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Icon name="check" className="text-green-400" size="sm" />
                <span>Built on Base L2</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Icon name="check" className="text-green-400" size="sm" />
                <span>Farcaster Native</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Icon name="check" className="text-green-400" size="sm" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 