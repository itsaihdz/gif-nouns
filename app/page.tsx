"use client";

import { useState } from "react";
import { Header } from "./components/layout/Header";
import { UploadStudio } from "./components/upload/UploadStudio";
import { Gallery } from "./components/gallery/Gallery";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/icons";
import { UserProvider } from "./contexts/UserContext";
import { FarcasterAuth } from "./components/auth/FarcasterAuth";

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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    // Initial mock data
    { id: "1", gifUrl: "/api/generate-gif?demo=1", creator: { fid: 12345, username: "alice.noun", pfp: "https://picsum.photos/32/32?random=1" }, title: "Cosmic Blue Explorer", noggleColor: "blue", eyeAnimation: "nouns", votes: 42, voters: [], createdAt: "2024-01-15T10:30:00Z", isVoted: false },
    { id: "2", gifUrl: "/api/generate-gif?demo=2", creator: { fid: 23456, username: "bob.noun", pfp: "https://picsum.photos/32/32?random=5" }, title: "Grass Green Dreamer", noggleColor: "grass", eyeAnimation: "viscos", votes: 38, voters: [], createdAt: "2024-01-15T11:15:00Z", isVoted: true }
  ]);

  const handleGifCreated = (gifData: { gifUrl: string; title: string; noggleColor: string; eyeAnimation: string }) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      gifUrl: gifData.gifUrl,
      creator: { fid: 12345, username: "you.noun", pfp: "https://picsum.photos/32/32?random=8" },
      title: gifData.title || "My Animated Noun",
      noggleColor: gifData.noggleColor,
      eyeAnimation: gifData.eyeAnimation,
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString(),
      isVoted: false
    };
    setGalleryItems(prev => [newItem, ...prev]);
    setCurrentView("gallery"); // Auto-switch to gallery
  };

  return (
    <UserProvider>
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
                <div className="text-2xl font-bold text-purple-600">{galleryItems.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Creations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {galleryItems.reduce((sum, item) => sum + item.votes, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {currentView === "create" ? (
            <UploadStudio onGifCreated={handleGifCreated} className="max-w-4xl mx-auto" />
          ) : (
            <Gallery items={galleryItems} setItems={setGalleryItems} className="max-w-7xl mx-auto" />
          )}
        </main>
      </div>
    </UserProvider>
  );
}
