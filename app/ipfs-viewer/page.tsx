import { IPFSViewer } from "../components/ipfs/IPFSViewer";

export default function IPFSViewerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-8">
        <IPFSViewer className="max-w-6xl mx-auto" />
      </div>
    </div>
  );
} 