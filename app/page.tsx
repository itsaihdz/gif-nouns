"use client";

import { useState } from "react";
import { Header } from "./components/layout/Header";
import { UploadStudio } from "./components/upload/UploadStudio";
import { Gallery } from "./components/gallery/Gallery";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/icons";

type AppView = "create" | "gallery";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>("create");
  const [galleryItems, setGalleryItems] = useState<any[]>([
    // Initial mock data to show the gallery isn't empty
    {
      id: "1",
      gifUrl: "/api/generate-gif?demo=1",
      creator: {
        fid: 12345,
        username: "alice.noun",
        pfp: "https://picsum.photos/32/32?random=1"
      },
      title: "Cosmic Blue Explorer",
      noggleColor: "blue",
      eyeAnimation: "nouns",
      votes: 42,
      voters: [
        { fid: 23456, username: "bob.noun", pfp: "https://picsum.photos/32/32?random=2" },
        { fid: 34567, username: "charlie.noun", pfp: "https://picsum.photos/32/32?random=3" },
        { fid: 45678, username: "diana.noun", pfp: "https://picsum.photos/32/32?random=4" }
      ],
      createdAt: "2024-01-15T10:30:00Z",
      isVoted: false
    },
    {
      id: "2",
      gifUrl: "/api/generate-gif?demo=2",
      creator: {
        fid: 23456,
        username: "bob.noun",
        pfp: "https://picsum.photos/32/32?random=5"
      },
      title: "Grass Green Dreamer",
      noggleColor: "grass",
      eyeAnimation: "viscos",
      votes: 38,
      voters: [
        { fid: 12345, username: "alice.noun", pfp: "https://picsum.photos/32/32?random=1" },
        { fid: 56789, username: "eve.noun", pfp: "https://picsum.photos/32/32?random=6" }
      ],
      createdAt: "2024-01-15T11:15:00Z",
      isVoted: true
    }
  ]);

  const handleGifCreated = (gifData: any) => {
    // Auto-add to gallery when GIF is created
    const newItem = {
      id: Date.now().toString(),
      gifUrl: gifData.gifUrl,
      creator: {
        fid: 12345, // Mock FID - would come from Farcaster auth
        username: "you.noun",
        pfp: "https://picsum.photos/32/32?random=8"
      },
      title: gifData.title || "My Animated Noun",
      noggleColor: gifData.noggleColor,
      eyeAnimation: gifData.eyeAnimation,
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString(),
      isVoted: false
    };
    
    setGalleryItems(prev => [newItem, ...prev]);
    setCurrentView("gallery"); // Auto-switch to gallery to show the new creation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Mini App Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Nouns Remix Studio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Create animated Nouns and discover community creations in one place
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={currentView === "create" ? "gradient" : "outline"}
              size="lg"
              onClick={() => setCurrentView("create")}
              icon={<Icon name="sparkles" size="md" />}
            >
              Create
            </Button>
            <Button
              variant={currentView === "gallery" ? "gradient" : "outline"}
              size="lg"
              onClick={() => setCurrentView("gallery")}
              icon={<Icon name="gallery" size="md" />}
            >
              Gallery ({galleryItems.length})
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {currentView === "create" ? (
            <UploadStudio 
              onGifCreated={handleGifCreated}
              className="max-w-4xl mx-auto"
            />
          ) : (
            <Gallery 
              items={galleryItems}
              setItems={setGalleryItems}
              className="max-w-7xl mx-auto"
            />
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {galleryItems.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Creations
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {galleryItems.reduce((sum, item) => sum + item.votes, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Votes
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {galleryItems.filter(item => item.votes > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Voted On
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
