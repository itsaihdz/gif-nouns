"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { UploadStudio } from "./components/upload/UploadStudio";
import { Gallery } from "./components/gallery/Gallery";
import { StorageGallery } from "./components/gallery/StorageGallery";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/icons";
import { UserProvider } from "./contexts/UserContext";
import { WalletConnect } from "./components/ui/WalletConnect";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

interface GalleryItem {
  id: string;
  gifUrl: string;
  creator: {
    fid: number;
    username: string;
    pfp: string;
  };
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  upvotes: number;
  downvotes: number;
  voters: Array<{
    fid: number;
    username: string;
    pfp: string;
  }>;
  createdAt: string;
  userVote?: 'upvote' | 'downvote' | null;
}

type AppView = "create" | "gallery";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>("create");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  const { setFrameReady, isFrameReady } = useMiniKit();

  // Initialize MiniKit frame readiness
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Fetch gallery items from Supabase
  const fetchGalleryItems = async () => {
    try {
      console.log('🔄 Fetching gallery items...');
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const items = await response.json();
        console.log('✅ Gallery items fetched:', items.length, 'items');
        // Add voters array (empty for now, will be populated when needed)
        const itemsWithVoters = items.map((item: GalleryItem) => ({
          ...item,
          voters: [],
          isVoted: false,
        }));
        setGalleryItems(itemsWithVoters);
      } else {
        console.error('Failed to fetch gallery items');
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Refresh gallery when switching to gallery view
  useEffect(() => {
    if (currentView === "gallery") {
      fetchGalleryItems();
    }
  }, [currentView]);

  const handleGifCreated = async (gifData: { 
    gifUrl: string; 
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      fid: number;
      username: string;
      pfp: string;
    };
  }) => {
    console.log('🔄 handleGifCreated called with data:', gifData);
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gifUrl: gifData.gifUrl,
          creator: gifData.creator,
          title: gifData.title,
          noggleColor: gifData.noggleColor,
          eyeAnimation: gifData.eyeAnimation,
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        const itemWithVoters = {
          ...newItem,
          voters: [],
          userVote: null,
        };
        console.log('✅ Gallery item created successfully:', newItem);
        setGalleryItems(prev => [itemWithVoters, ...prev]);
        setCurrentView("gallery"); // Auto-switch to gallery
        console.log('✅ Switched to gallery view');
      } else {
        console.error('Failed to create gallery item');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
    }
  };

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <Header />
          <main className="container mx-auto px-2 py-2">
            {/* Welcome Screen */}
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-2">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Icon name="sparkles" className="text-white" size="xl" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Nouns Remix Studio
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  Create animated Nouns and discover community creations
                </p>
              </div>

              {/* Wallet Connection */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-2">
                  <Icon name="wallet" className="text-purple-600 mx-auto mb-2" size="lg" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Connect Your Wallet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Connect your wallet to start creating animated Nouns
                  </p>
                </div>
                
                <div className="max-w-sm mx-auto">
                  <WalletConnect variant="button" size="lg" />
                </div>

                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>By connecting, you agree to our terms of service</p>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="upload" className="text-purple-600" size="md" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload & Customize</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload your Noun PFP and customize with different noggles and eye animations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="gallery" className="text-blue-600" size="md" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community Gallery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover and vote on community creations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name="share" className="text-green-600" size="md" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share & Mint</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share your creations and mint them as NFTs
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </UserProvider>
    );
  }

  // Show full app when wallet is connected
  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <Header />
        <main className="container mx-auto px-2 py-2">
          {/* Mini App Header */}
          <div className="text-center mb-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Nouns Remix Studio
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Create animated Nouns and discover community creations
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center gap-2 mb-2">
            <Button
              variant={currentView === "create" ? "gradient" : "outline"}
              onClick={() => setCurrentView("create")}
              icon={<Icon name="upload" size="sm" />}
            >
              Create
            </Button>
            <Button
              variant={currentView === "gallery" ? "gradient" : "outline"}
              onClick={() => setCurrentView("gallery")}
              icon={<Icon name="gallery" size="sm" />}
            >
              Gallery
            </Button>

          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-2 mb-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? "..." : galleryItems.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Creations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : galleryItems.reduce((sum, item) => sum + item.upvotes - item.downvotes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
            </div>
          </div>

          {/* Main Content */}
          {currentView === "create" ? (
            <UploadStudio onGifCreated={handleGifCreated} className="max-w-4xl mx-auto" />
          ) : (
            <StorageGallery className="max-w-7xl mx-auto" />
          )}
        </main>
      </div>
    </UserProvider>
  );
}
