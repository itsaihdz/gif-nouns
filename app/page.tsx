"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { UploadStudio } from "./components/upload/UploadStudio";
// import { Gallery } from "./components/gallery/Gallery"; // Unused import
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
    wallet: string;
    username: string;
  };
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  upvotes: number;
  downvotes: number;
  voters: Array<{
    fid: number;
    username: string;
  }>;
  createdAt: string;
  userVote?: 'upvote' | 'downvote' | null;
}

type AppView = "create" | "gallery";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>("create");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [storageGifCount, setStorageGifCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const { isConnected } = useAccount();
  
  // Always call useMiniKit hook (required by React rules)
  const miniKitHook = useMiniKit();
  const { setFrameReady, isFrameReady } = miniKitHook || { setFrameReady: null, isFrameReady: false };

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize MiniKit frame readiness (only in browser environment)
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && !isFrameReady && setFrameReady) {
      try {
        setFrameReady();
      } catch (error) {
        console.warn('Failed to set frame ready:', error);
      }
    }
  }, [setFrameReady, isFrameReady, isMounted]);

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

  const fetchStorageGifCount = async () => {
    try {
      const response = await fetch('/api/gallery/storage');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStorageGifCount(result.count);
        }
      }
    } catch (error) {
      console.error('Error fetching storage GIF count:', error);
    }
  };

  useEffect(() => {
    if (isMounted) {
      fetchGalleryItems();
      fetchStorageGifCount();
    }
  }, [isMounted]);

  // Refresh gallery when switching to gallery view
  useEffect(() => {
    if (isMounted && currentView === "gallery") {
      fetchGalleryItems();
    }
  }, [currentView, isMounted]);

  const handleGifCreated = async (gifData: { 
    gifUrl: string; 
    shareUrl?: string;
    title: string; 
    noggleColor: string; 
    eyeAnimation: string;
    creator: {
      wallet: string;
      username: string;
    };
  }) => {
    console.log('🔄 handleGifCreated called with data:', gifData);
    console.log('🔄 Traits being saved:', { noggleColor: gifData.noggleColor, eyeAnimation: gifData.eyeAnimation });
    
    // This is called when user clicks "View in Gallery" from download page
    // Switch to gallery view and refresh gallery items
    console.log('🔄 Switching to gallery view...');
    setCurrentView("gallery");
    
    // Refresh gallery items to show the new GIF
    await fetchGalleryItems();
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <Header />
          <main className="max-w-sm mx-auto px-3 py-3 sm:max-w-md sm:px-4 sm:py-4 md:max-w-2xl lg:max-w-7xl lg:px-8">
            <div className="text-center">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </main>
        </div>
      </UserProvider>
    );
  }

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <Header />
          <main className="max-w-sm mx-auto px-3 py-3 sm:max-w-md sm:px-4 sm:py-4 md:max-w-2xl lg:max-w-7xl lg:px-8">
            {/* Welcome Screen */}
            <div className="text-center">
              <div className="mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Icon name="sparkles" className="text-white" size="lg" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                  GifNouns
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
                  Create animated Nouns and discover community creations
                </p>
              </div>

              {/* Wallet Connection */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="mb-4 sm:mb-6">
                  <Icon name="wallet" className="text-purple-600 mx-auto mb-3 sm:mb-4" size="md" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Connect Your Wallet
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-2">
                    Connect your wallet to start creating animated Nouns
                  </p>
                </div>
                
                <div className="mb-4">
                  <WalletConnect variant="button" size="lg" />
                </div>

                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <p>By connecting, you agree to our terms of service</p>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 md:gap-4">
                <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 sm:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon name="upload" className="text-purple-600" size="sm" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Upload & Customize</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Upload your Noun PFP and customize with different noggles and eye animations
                  </p>
                </div>
                <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon name="gallery" className="text-blue-600" size="sm" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Community Gallery</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Discover and vote on community creations
                  </p>
                </div>
                <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <Icon name="share" className="text-green-600" size="sm" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">Share & Mint</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
        <main className="max-w-sm mx-auto px-3 py-3 sm:max-w-md sm:px-4 sm:py-4 md:max-w-2xl lg:max-w-7xl lg:px-8">
          {/* Mini App Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              GifNouns
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-2">
              Create animated Nouns and discover community creations
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
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
                {isLoading ? "..." : storageGifCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Creations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isLoading ? "..." : galleryItems.reduce((sum, item) => sum + (item.upvotes || 0) + (item.downvotes || 0), 0)}
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
