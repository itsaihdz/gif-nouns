"use client";

import { useState, useEffect } from "react";
import { useSDK } from "../components/providers/SDKProvider";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function TestMiniAppPage() {
  const { isSDKReady, sdkError, sdk, isFarcasterEnv, initializeSDK, callReady } = useSDK();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [sdkImportTest, setSdkImportTest] = useState<string>('Not tested');

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Test SDK import safely
  useEffect(() => {
    const testSDKImport = async () => {
      try {
        // Only test import in Farcaster environments to prevent Chrome extension errors
        if (typeof window !== 'undefined' && 
            (window.location.hostname.includes('warpcast.com') || 
             window.location.hostname.includes('farcaster.xyz') ||
             window.location.hostname.includes('farcaster.app'))) {
          
          const { sdk } = await import('@farcaster/miniapp-sdk');
          const testResult = `✅ SDK imported successfully. Actions: ${sdk?.actions ? Object.keys(sdk.actions).join(', ') : 'none'}`;
          setSdkImportTest(testResult);
          addTestResult(testResult);
        } else {
          const testResult = `ℹ️ Skipping SDK import test (not in Farcaster environment)`;
          setSdkImportTest(testResult);
          addTestResult(testResult);
        }
      } catch (error) {
        const testResult = `❌ SDK import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        setSdkImportTest(testResult);
        addTestResult(testResult);
      }
    };
    
    testSDKImport();
  }, []);

  useEffect(() => {
    addTestResult('Page loaded');
    addTestResult(`SDK Import Test: ${sdkImportTest}`);
    addTestResult(`Environment: ${isFarcasterEnv ? 'Farcaster' : 'Non-Farcaster'}`);
    
    // Log SDK state immediately
    addTestResult(`SDK state - isSDKReady: ${isSDKReady}, sdkError: ${sdkError}`);
    
    if (!isSDKReady && !sdkError) {
      addTestResult('Initializing SDK...');
      initializeSDK();
    }
  }, [isFarcasterEnv]);

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
    if (!isFarcasterEnv) {
      addTestResult('⚠️ Cannot test SDK functionality outside of Farcaster environment');
      return;
    }

    setIsTesting(true);
    addTestResult('🧪 Testing SDK functionality...');
    
    try {
      // Test ready() call
      addTestResult('📞 Calling sdk.actions.ready()...');
      await callReady();
      addTestResult('✅ sdk.actions.ready() called successfully');
      
      // Test haptics
      if (sdk && typeof sdk.haptics?.impactOccurred === 'function') {
        addTestResult('🧪 Testing haptics...');
        await sdk.haptics.impactOccurred('light');
        addTestResult('✅ Haptics test successful');
      } else {
        addTestResult('⚠️ Haptics not available');
      }
      
      addTestResult(`🌍 Environment: ${isFarcasterEnv ? 'Farcaster' : 'Non-Farcaster'}`);
      
    } catch (error) {
      addTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const testReadyCall = async () => {
    if (!isFarcasterEnv) {
      addTestResult('⚠️ Cannot test ready() call outside of Farcaster environment');
      return;
    }

    try {
      addTestResult('📞 Manually calling ready()...');
      await callReady();
      addTestResult('✅ Ready() call successful');
    } catch (error) {
      addTestResult(`❌ Ready() call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const forceSDKInit = async () => {
    addTestResult('🔄 Force initializing SDK...');
    try {
      await initializeSDK();
      addTestResult('✅ SDK initialization completed');
    } catch (error) {
      addTestResult(`❌ SDK initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const forceReadyCall = async () => {
    if (!isFarcasterEnv) {
      addTestResult('⚠️ Cannot force ready() call outside of Farcaster environment');
      return;
    }

    addTestResult('🚀 Force calling ready()...');
    try {
      await callReady();
      addTestResult('✅ Force ready() call successful');
    } catch (error) {
      addTestResult(`❌ Force ready() call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mini App Embed Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">SDK Status</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium">Environment:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  isFarcasterEnv ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isFarcasterEnv ? 'Farcaster' : 'Non-Farcaster'}
                </span>
              </div>
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
                <span className="font-medium">SDK Import:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800 text-xs`}>
                  {sdkImportTest}
                </span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Button 
                onClick={forceSDKInit}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Force SDK Init
              </Button>
              <Button 
                onClick={testSDKFunctionality}
                disabled={!isFarcasterEnv || isTesting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test SDK Functionality
              </Button>
              <Button 
                onClick={testReadyCall}
                disabled={!isFarcasterEnv || isTesting}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Ready() Call
              </Button>
              <Button 
                onClick={forceReadyCall}
                disabled={!isFarcasterEnv || isTesting}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Force Ready() Call (Debug)
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run a test to see results.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm text-gray-700 font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={clearResults}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Results
            </Button>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">SDK Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Available Actions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.actions ? Object.keys(sdk.actions).map(action => (
                  <li key={action} className="font-mono">• {action}</li>
                )) : (
                  <li className="text-gray-400">No actions available (SDK not imported)</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Available Haptics:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.haptics ? Object.keys(sdk.haptics).map(haptic => (
                  <li key={haptic} className="font-mono">• {haptic}</li>
                )) : (
                  <li className="text-gray-400">No haptics available (SDK not imported)</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
