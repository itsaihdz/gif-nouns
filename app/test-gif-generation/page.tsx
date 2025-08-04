"use client";

import { useState } from 'react';
import { useGifGenerator } from '../components/upload/GifGenerator';

export default function TestGifGeneration() {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateGifAsync } = useGifGenerator({
    originalImageUrl: '/api/generate-gif?demo=1',
    noggleColor: 'blue',
    eyeAnimation: 'nouns',
    width: 800,
    height: 800,
    fps: 8,
    onProgress: setProgress,
    onComplete: (url) => {
      setResult(url);
      setIsGenerating(false);
    },
    onError: (err) => {
      setError(err);
      setIsGenerating(false);
    }
  });

  const handleTest = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResult('');
    setError('');
    
    try {
      console.log('Starting GIF generation test...');
      const gifUrl = await generateGifAsync();
      console.log('GIF generation completed:', gifUrl);
      setResult(gifUrl);
    } catch (err) {
      console.error('GIF generation failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          GIF Generation Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Original Image:</strong> /api/generate-gif?demo=1
            </div>
            <div>
              <strong>Noggle Color:</strong> blue
            </div>
            <div>
              <strong>Eye Animation:</strong> nouns
            </div>
            <div>
              <strong>FPS:</strong> 8
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <button
            onClick={handleTest}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Test GIF Generation'}
          </button>
          
          {isGenerating && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Progress: {progress.toFixed(1)}%</p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error</h3>
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 dark:text-green-200 font-semibold mb-2">Success!</h3>
            <p className="text-green-700 dark:text-green-300 mb-4">GIF generated successfully</p>
            <img 
              src={result} 
              alt="Generated GIF" 
              className="max-w-full h-auto rounded-lg border"
            />
            <div className="mt-4">
              <a 
                href={result} 
                download="test-gif.gif"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Download GIF
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 