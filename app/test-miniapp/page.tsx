"use client";

import { useEffect, useState } from 'react';
import { useSDK } from '../components/providers/SDKProvider';

export default function TestMiniAppPage() {
  const { isSDKReady, sdkError, sdk, initializeSDK, callReady } = useSDK();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    addTestResult('Page loaded');
    
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
                    'Server'
                  }
                </span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={testSDKFunctionality}
                disabled={isTesting || !isSDKReady}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTesting ? 'Testing...' : 'Test SDK Functionality'}
              </button>
              
              <button
                onClick={testReadyCall}
                disabled={!isSDKReady}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test Ready() Call
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
                    <div key={index} className="text-sm font-mono">
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
        
        {/* SDK Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">SDK Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Available Actions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.actions ? Object.keys(sdk.actions).map(action => (
                  <li key={action} className="font-mono">• {action}</li>
                )) : <li>No actions available</li>}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Available Haptics:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {sdk?.haptics ? Object.keys(sdk.haptics).map(haptic => (
                  <li key={haptic} className="font-mono">• {haptic}</li>
                )) : <li>No haptics available</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
