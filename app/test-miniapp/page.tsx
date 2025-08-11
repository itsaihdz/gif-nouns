"use client";

import { useEffect, useState } from 'react';
import { useSDK } from '../components/providers/SDKProvider';

// Test SDK import directly
let sdkImportTest = 'Not tested';
try {
  const { sdk } = require('@farcaster/miniapp-sdk');
  sdkImportTest = `✅ SDK imported successfully. Actions: ${sdk?.actions ? Object.keys(sdk.actions).join(', ') : 'none'}`;
} catch (error) {
  sdkImportTest = `❌ SDK import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
}

export default function TestMiniAppPage() {
  const { isSDKReady, sdkError, sdk, initializeSDK, callReady } = useSDK();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    addTestResult('Page loaded');
    addTestResult(`SDK Import Test: ${sdkImportTest}`);
    
    // Log SDK state immediately
    addTestResult(`SDK state - isSDKReady: ${isSDKReady}, sdkError: ${sdkError}`);
    
    if (!isSDKReady && !sdkError) {
      addTestResult('Initializing SDK...');
      initializeSDK();
    }
  }, []);

  useEffect(() => {
    if (isSDKReady) {
      addTestResult('✅ SDK is ready!');
    }
    
    if (sdkError) {
      addTestResult(`❌ SDK error: ${sdkError}`);
    }
  }, [isSDKReady, sdkError]);

  // Monitor SDK state changes
  useEffect(() => {
    addTestResult(`🔄 SDK state changed - isSDKReady: ${isSDKReady}, sdkError: ${sdkError}`);
  }, [isSDKReady, sdkError]);

  const testSDKFunctionality = async () => {
    setIsTesting(true);
    addTestResult('🧪 Testing SDK functionality...');
    
    try {
      // Test ready() call
      addTestResult('📞 Calling sdk.actions.ready()...');
      await callReady();
      addTestResult('✅ sdk.actions.ready() called successfully');
      
      // Test haptics
      if (typeof sdk.haptics.impactOccurred === 'function') {
        addTestResult('🧪 Testing haptics...');
        await sdk.haptics.impactOccurred('light');
        addTestResult('✅ Haptics test successful');
      } else {
        addTestResult('⚠️ Haptics not available');
      }
      
      // Test environment detection
      const isFarcasterEnv = typeof window !== 'undefined' && 
        (window.location.hostname.includes('warpcast.com') || 
         window.location.hostname.includes('farcaster.xyz') ||
         window.navigator.userAgent.includes('Farcaster'));
      
      addTestResult(`🌍 Environment: ${isFarcasterEnv ? 'Farcaster' : 'Non-Farcaster'}`);
      
    } catch (error) {
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testReadyCall = async () => {
    try {
      addTestResult('📞 Manually calling ready()...');
      await callReady();
      addTestResult('✅ Manual ready() call successful');
    } catch (error) {
      addTestResult(`❌ Manual ready() call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const forceSDKInit = async () => {
    try {
      addTestResult('🔄 Force initializing SDK...');
      await initializeSDK();
      addTestResult('✅ Force SDK init completed');
    } catch (error) {
      addTestResult(`❌ Force SDK init failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mini App Embed Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SDK Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">SDK Status</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium">SDK Ready:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  isSDKReady ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isSDKReady ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">SDK Error:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  sdkError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {sdkError || 'None'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Environment:</span>
                <span className="ml-2 px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                  {typeof window !== 'undefined' ? 
                    (window.location.hostname.includes('warpcast.com') || 
                     window.location.hostname.includes('farcaster.xyz') ||
                     window.navigator.userAgent.includes('Farcaster') ? 'Farcaster' : 'Non-Farcaster') : 
                    'Server'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">SDK Import:</span>
                <span className="ml-2 px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800 text-xs">
                  {sdkImportTest.length > 50 ? sdkImportTest.substring(0, 50) + '...' : sdkImportTest}
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <button 
                onClick={forceSDKInit}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Force SDK Init
              </button>
              <button 
                onClick={testSDKFunctionality}
                disabled={!isSDKReady || isTesting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Test SDK Functionality'}
              </button>
              <button 
                onClick={testReadyCall}
                disabled={!isSDKReady || isTesting}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Ready() Call
              </button>
              <button 
                onClick={testReadyCall}
                disabled={isTesting}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Force Ready() Call (Debug)
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setTestResults([])}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* SDK Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">SDK Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Available Actions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.actions ? Object.keys(sdk.actions).map(action => (
                  <li key={action} className="font-mono">• {action}</li>
                )) : (
                  <li className="text-red-500">No actions available</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Available Haptics:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.haptics ? Object.keys(sdk.haptics).map(haptic => (
                  <li key={haptic} className="font-mono">• {haptic}</li>
                )) : (
                  <li className="text-red-500">No haptics available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
