"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Button } from "./Button";
import { Icon } from "../icons";
import { Loading } from "./Loading";
import { web3Config, transactionMessages } from "../../../config/web3";
import { useTracking } from "../analytics/Tracking";

interface TransactionHandlerProps {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function TransactionHandler({ 
  onSuccess, 
  onError, 
  className = "" 
}: TransactionHandlerProps) {
  const { isConnected } = useAccount();
  const [error, setError] = useState<string | null>(null);
  const tracking = useTracking();

  // Contract configuration for NFT minting
  const contractConfig = {
    address: web3Config.contracts.nftContract as `0x${string}`,
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "payable",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
  };

  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMintNFT = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError(null);
      tracking.transactionStart("mint");

      // Mint transaction
      writeContract({
        ...contractConfig,
        functionName: "mint",
        value: parseEther(web3Config.gas.mintPrice),
      });

    } catch (err) {
      console.error("Transaction error:", err);
      const errorMessage = err instanceof Error ? err.message : "Transaction failed";
      setError(errorMessage);
      tracking.transactionError("mint", errorMessage);
      onError?.(err instanceof Error ? err : new Error("Transaction failed"));
    }
  };

  const handleRemixNFT = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setError(null);
      tracking.transactionStart("remix");

      // Remix transaction
      writeContract({
        ...contractConfig,
        functionName: "mint",
        value: parseEther(web3Config.gas.remixPrice),
      });

    } catch (err) {
      console.error("Remix error:", err);
      const errorMessage = err instanceof Error ? err.message : "Remix failed";
      setError(errorMessage);
      tracking.transactionError("remix", errorMessage);
      onError?.(err instanceof Error ? err : new Error("Remix failed"));
    }
  };

  // Handle transaction success
  if (isSuccess && hash) {
    tracking.transactionSuccess("mint", hash);
    onSuccess?.(hash);
  }

  // Handle transaction errors
  if (writeError) {
    setError(writeError.message);
    onError?.(writeError);
  }

  return (
    <div className={`space-y-4 ${className}`}>
                   {/* Transaction Status */}
             {isPending && (
               <div className="flex items-center space-x-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                 <Loading variant="spinner" size="sm" />
                 <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                   {transactionMessages.CONFIRMING}
                 </span>
               </div>
             )}

             {isConfirming && (
               <div className="flex items-center space-x-2 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                 <Loading variant="spinner" size="sm" />
                 <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                   {transactionMessages.PROCESSING}
                 </span>
               </div>
             )}

      {isSuccess && (
        <div className="flex items-center space-x-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Icon name="check" size="sm" className="text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {transactionMessages.SUCCESS}
          </span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <Icon name="close" size="sm" className="text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-300">
            {error}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleMintNFT}
          disabled={!isConnected || isPending || isConfirming}
          loading={isPending || isConfirming}
          icon={<Icon name="sparkles" size="md" />}
          className="flex-1"
        >
          {isPending || isConfirming ? "Minting..." : "Mint NFT"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleRemixNFT}
          disabled={!isConnected || isPending || isConfirming}
          loading={isPending || isConfirming}
          icon={<Icon name="refresh" size="md" />}
          className="flex-1"
        >
          {isPending || isConfirming ? "Remixing..." : "Remix NFT"}
        </Button>
      </div>

      {/* Transaction Hash */}
      {hash && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Transaction Hash:
          </p>
          <a
            href={`${web3Config.base.explorerUrl}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono text-purple-600 dark:text-purple-400 hover:underline break-all"
          >
            {hash}
          </a>
        </div>
      )}
    </div>
  );
} 