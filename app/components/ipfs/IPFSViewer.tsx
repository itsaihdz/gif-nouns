"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";

interface IPFSItem {
  hash: string;
  url: string;
  size: number;
  type?: string;
}

interface IPFSViewerProps {
  className?: string;
}

export function IPFSViewer({ className = "" }: IPFSViewerProps) {
  const [ipfsItems, setIpfsItems] = useState<IPFSItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState("ipfs.io");

  const gateways = [
    { name: "IPFS.io", url: "https://ipfs.io/ipfs/" },
    { name: "Pinata", url: "https://gateway.pinata.cloud/ipfs/" },
    { name: "Cloudflare", url: "https://cloudflare-ipfs.com/ipfs/" },
    { name: "Dweb", url: "https://dweb.link/ipfs/" },
  ];

  const fetchIPFSItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-gif-upload');
      const data = await response.json();
      
      if (data.success) {
        setIpfsItems([
          {
            hash: data.gif.hash,
            url: data.gif.url,
            size: data.gif.size,
            type: "image/gif"
          },
          {
            hash: data.metadata.hash,
            url: data.metadata.url,
            size: data.metadata.size,
            type: "application/json"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching IPFS items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIPFSItems();
  }, []);

  const getGatewayUrl = (hash: string) => {
    const gateway = gateways.find(g => g.name === selectedGateway);
    return gateway ? `${gateway.url}${hash}` : `https://ipfs.io/ipfs/${hash}`;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          IPFS Content Viewer
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          View and test your uploaded GIFs and metadata on IPFS
        </p>
        
        <div className="flex gap-4 mb-4">
          <Button
            variant="outline"
            onClick={fetchIPFSItems}
            disabled={isLoading}
            icon={<Icon name="refresh" size="sm" />}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gateway:
            </span>
            <select
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm"
            >
              {gateways.map(gateway => (
                <option key={gateway.name} value={gateway.name}>
                  {gateway.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ipfsItems.map((item, index) => (
          <Card key={item.hash} variant="outlined" className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.type === "image/gif" ? "GIF File" : "Metadata"}
                </h3>
                <span className="text-xs text-gray-500">
                  {item.size} bytes
                </span>
              </div>

              {/* Hash Display */}
              <div className="mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  IPFS Hash:
                </label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                    {item.hash}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.hash)}
                    icon={<Icon name="link" size="sm" />}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Preview */}
              {item.type === "image/gif" ? (
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Preview:
                  </label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={getGatewayUrl(item.hash)}
                      alt="IPFS GIF"
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const nextElement = target.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="hidden w-full h-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                      <span className="text-sm">Failed to load image</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Metadata:
                  </label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 max-h-20 overflow-y-auto">
                    <pre className="text-xs text-gray-600 dark:text-gray-400">
                      {JSON.stringify({ hash: item.hash, size: item.size }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getGatewayUrl(item.hash), '_blank')}
                  icon={<Icon name="external-link" size="sm" />}
                  className="flex-1"
                >
                  View on {selectedGateway}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getGatewayUrl(item.hash))}
                  icon={<Icon name="link" size="sm" />}
                >
                  Copy URL
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {ipfsItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Icon name="gallery" size="xl" className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No IPFS content found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a GIF to see it here
          </p>
        </div>
      )}
    </div>
  );
} 