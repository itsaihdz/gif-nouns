"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../icons";
import { Loading } from "../ui/Loading";

// File upload configuration
const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/svg+xml": [".svg"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  onError, 
  isLoading = false,
  className = "" 
}: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === "file-too-large") {
        onError("File size must be less than 5MB");
      } else if (error.code === "file-invalid-type") {
        onError("Please upload a PNG, JPG, or SVG file");
      } else {
        onError("Invalid file. Please try again.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  return (
    <Card 
      variant="outlined" 
      className={`relative overflow-hidden transition-all duration-300 ${
        isDragActive ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : ""
      } ${className}`}
    >
      <div
        {...getRootProps()}
        className={`p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? "scale-105" : "hover:scale-[1.02]"
        }`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="space-y-4">
            <Loading variant="spinner" size="lg" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Processing your Noun...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Detecting traits and preparing preview
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Upload Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
              <Icon 
                name={isDragActive ? "sparkles" : "upload"} 
                className="text-purple-600 dark:text-purple-400" 
                size="xl" 
              />
            </div>

            {/* Upload Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isDragActive ? "Drop your Noun here" : "Upload your Noun PFP"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop your Noun image, or click to browse
              </p>
            </div>

            {/* File Requirements */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Supported formats:
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">PNG</span>
                <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">JPG</span>
                <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">SVG</span>
                <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded">Max 5MB</span>
              </div>
            </div>

            {/* Upload Button */}
            <Button
              variant="gradient"
              size="lg"
              icon={<Icon name="upload" size="md" />}
              className="w-full"
            >
              Choose File
            </Button>

            {/* Tips */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>💡 Tip: Use a square image for best results</p>
              <p>🔍 We&apos;ll automatically detect your Noun&apos;s traits</p>
            </div>
          </div>
        )}
      </div>

      {/* Drag Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-purple-500/10 border-2 border-dashed border-purple-500 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Icon name="sparkles" className="text-purple-500 mx-auto mb-2" size="xl" />
            <p className="text-purple-700 dark:text-purple-300 font-medium">
              Drop to upload your Noun
            </p>
          </div>
        </div>
      )}
    </Card>
  );
} 