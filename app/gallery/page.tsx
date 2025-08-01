import { Gallery } from "../components/gallery/Gallery";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <Gallery className="max-w-7xl mx-auto" />
      </div>
    </div>
  );
} 