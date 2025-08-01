"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Icon } from "../icons";

interface NFTMintProps {
  gifUrl: string;
  title: string;
  noggleColor: string;
  eyeAnimation: string;
  onMintSuccess?: (tokenId: string, txHash: string) => void;
  onClose?: () => void;
  className?: string;
}

export function NFTMint({
  gifUrl,
  title,
  noggleColor,
  eyeAnimation,
  onMintSuccess,
  onClose,
  className = ""
}: NFTMintProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintPrice, setMintPrice] = useState("0.01"); // ETH
  const [error, setError] = useState<string>("");

  const handleMint = async () => {
    setIsMinting(true);
    setError("");

    try {
      // TODO: Implement actual NFT minting
      // This would typically involve:
      // 1. Connecting to user's wallet (Base network)
      // 2. Calling the smart contract's mintAnimatedNoun function
      // 3. Handling the transaction and gas fees
      // 4. Getting the token ID and transaction hash
      
      console.log("Minting NFT:", {
        gifUrl,
        title,
        noggleColor,
        eyeAnimation,
        mintPrice
      });

      // Mock minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockTokenId = "123";
      const mockTxHash = "0x1234567890abcdef...";
      
      // Success
      onMintSuccess?.(mockTokenId, mockTxHash);
      
      // Show success message
      alert(`🎉 NFT minted successfully!\n\nToken ID: #${mockTokenId}\nTransaction: ${mockTxHash}\n\nView on BaseScan: https://basescan.org/tx/${mockTxHash}`);
      
    } catch (err) {
      console.error("NFT minting error:", err);
      setError("Failed to mint NFT. Please check your wallet connection and try again.");
    } finally {
      setIsMinting(false);
    }
  };

  const handleViewOnBaseScan = () => {
    // TODO: Open BaseScan explorer
    window.open("https://basescan.org", "_blank");
  };

  return (
    <Card variant="outlined" className={`max-w-md mx-auto ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mint as NFT
          </h3>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<Icon name="close" size="sm" />}
            >
              Close
            </Button>
          )}
        </div>

        {/* NFT Preview */}
        <div className="mb-4">
          <img
            src={gifUrl}
            alt={title}
            className="w-full h-48 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg"
          />
        </div>

        {/* NFT Details */}
        <div className="mb-4 space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
              {noggleColor} noggle
            </span>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">
              {eyeAnimation} eyes
            </span>
          </div>
        </div>

        {/* Minting Details */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mint Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">{mintPrice} ETH</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Network:</span>
            <span className="font-medium text-gray-900 dark:text-white">Base L2</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Gas Fee:</span>
            <span className="font-medium text-gray-900 dark:text-white">~$0.50</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleMint}
            disabled={isMinting}
            icon={<Icon name="nft" size="md" />}
            className="w-full"
          >
            {isMinting ? "Minting..." : `Mint NFT (${mintPrice} ETH)`}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewOnBaseScan}
            icon={<Icon name="external-link" size="md" />}
            className="w-full"
          >
            View on BaseScan
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Minting creates a unique NFT on Base L2. You'll own the exclusive rights to this animated Noun!
          </p>
        </div>
      </div>
    </Card>
  );
} 