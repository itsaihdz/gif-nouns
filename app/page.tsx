"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { UploadStudio } from "./components/upload/UploadStudio";
import { Gallery } from "./components/gallery/Gallery";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/icons";
import { UserProvider } from "./contexts/UserContext";
import { FarcasterAuth } from "./components/auth/FarcasterAuth";
import { FarcasterReady } from "./components/FarcasterReady";

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
  votes: number;
  voters: Array<{
    fid: number;
    username: string;
    pfp: string;
  }>;
  createdAt: string;
  isVoted?: boolean;
}

type AppView = "create" | "gallery";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>("create");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch gallery items from Supabase
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const items = await response.json();
          // Add voters array (empty for now, will be populated when needed)
          const itemsWithVoters = items.map((item: any) => ({
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

    fetchGalleryItems();
  }, []);

  const handleGifCreated = async (gifData: { gifUrl: string; title: string; noggleColor: string; eyeAnimation: string }) => {
    try {
      // Get current user from localStorage or context
      const storedUser = localStorage.getItem("farcaster_user");
      if (!storedUser) {
        console.error('No user found for creating gallery item');
        return;
      }

      const user = JSON.parse(storedUser);
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gifUrl: gifData.gifUrl,
          creator: {
            fid: user.fid,
            username: user.username,
            pfp: user.pfp,
          },
          title: gifData.title || "My Animated Noun",
          noggleColor: gifData.noggleColor,
          eyeAnimation: gifData.eyeAnimation,
        }),
      });

      if (response.ok) {
        const newItem = await response.json();
        const itemWithVoters = {
          ...newItem,
          voters: [],
          isVoted: false,
        };
        setGalleryItems(prev => [itemWithVoters, ...prev]);
        setCurrentView("gallery"); // Auto-switch to gallery
      } else {
        console.error('Failed to create gallery item');
      }
    } catch (error) {
      console.error('Error creating gallery item:', error);
    }
  };

  return (
    <UserProvider>
      <FarcasterReady />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Mini App Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Nouns Remix Studio
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Create animated Nouns and discover community creations
            </p>
          </div>

          {/* Temporarily bypass AuthGate for testing */}
          {/* <AuthGate> */}
            {/* Farcaster Auth */}
            <div className="max-w-md mx-auto mb-8">
              <FarcasterAuth />
            </div>

            {/* View Toggle */}
            <div className="flex justify-center gap-4 mb-8">
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
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {isLoading ? "..." : galleryItems.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Creations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? "..." : galleryItems.reduce((sum, item) => sum + item.votes, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
              </div>
            </div>

            {/* Main Content */}
            {currentView === "create" ? (
              <UploadStudio onGifCreated={handleGifCreated} className="max-w-4xl mx-auto" />
            ) : (
              <Gallery items={galleryItems} setItems={setGalleryItems} className="max-w-7xl mx-auto" />
            )}
          {/* </AuthGate> */}
        </main>
      </div>
    </UserProvider>
  );
}
