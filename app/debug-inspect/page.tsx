"use client";

import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function DebugInspectPage() {
  const [debugLogs, setDebugLogs] = useState<any[]>([]);
  const [failedLogs, setFailedLogs] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const loadLogs = () => {
    try {
      setError('');
      
      // Load regular debug logs
      const stored = localStorage.getItem('debug_logs') || '[]';
      const parsedLogs = JSON.parse(stored);
      setDebugLogs(parsedLogs);

      // Load failed logs
      const failedStored = localStorage.getItem('debug_logs_failed') || '[]';
      const parsedFailedLogs = JSON.parse(failedStored);
      setFailedLogs(parsedFailedLogs);

      console.log('📋 Loaded debug logs:', parsedLogs);
      console.log('📋 Loaded failed logs:', parsedFailedLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const clearLogs = () => {
    localStorage.removeItem('debug_logs');
    localStorage.removeItem('debug_logs_failed');
    setDebugLogs([]);
    setFailedLogs([]);
    console.log('🗑️ Cleared all debug logs');
  };

  const testFetch = async () => {
    try {
      console.log('🧪 Manual fetch test to /api/debug-logs...');
      const response = await fetch('/api/debug-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: {
            url: location.href,
            userAgent: navigator.userAgent,
            test: 'manual-test'
          },
          ts: Date.now(),
          entries: [{ 
            level: 'info', 
            time: Date.now(), 
            args: ['Manual test from debug inspect page'] 
          }]
        })
      });
      console.log('✅ Manual fetch response:', response.status, response.statusText);
      alert(`Fetch test: ${response.status} ${response.statusText}`);
    } catch (err) {
      console.error('❌ Manual fetch failed:', err);
      alert(`Fetch failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Inspector</h1>
        
        <div className="mb-6 space-x-4">
          <Button onClick={loadLogs}>Reload Logs</Button>
          <Button onClick={clearLogs} variant="secondary">Clear Logs</Button>
          <Button onClick={testFetch} variant="secondary">Test Fetch</Button>
        </div>

        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Debug Logs */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Debug Logs ({debugLogs.length})</h2>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {debugLogs.length === 0 ? (
                <p className="text-gray-500">No debug logs found</p>
              ) : (
                debugLogs.map((log, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded text-sm">
                    <div className="font-mono text-xs text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-1">
                      <strong>Error:</strong> {log.error}
                    </div>
                    <div className="mt-1">
                      <strong>Details:</strong> {log.details}
                    </div>
                    {log.context && (
                      <div className="mt-1">
                        <strong>URL:</strong> {log.context.url}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Failed Logs */}
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Failed Log Batches ({failedLogs.length})</h2>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {failedLogs.length === 0 ? (
                <p className="text-gray-500">No failed logs found</p>
              ) : (
                failedLogs.map((failedBatch, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded text-sm">
                    <div className="font-mono text-xs text-gray-600">
                      {new Date(failedBatch.timestamp).toLocaleString()}
                    </div>
                    <div className="mt-1">
                      <strong>Error:</strong> {failedBatch.error}
                    </div>
                    <div className="mt-1">
                      <strong>Batch Size:</strong> {failedBatch.batch?.length || 0} entries
                    </div>
                    {failedBatch.batch && failedBatch.batch.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-semibold">View Batch Details</summary>
                        <div className="mt-2 ml-4 space-y-1">
                          {failedBatch.batch.slice(0, 5).map((entry: any, entryIndex: number) => (
                            <div key={entryIndex} className="text-xs">
                              <span className="font-semibold">[{entry.level}]</span> {JSON.stringify(entry.args)}
                            </div>
                          ))}
                          {failedBatch.batch.length > 5 && (
                            <div className="text-xs text-gray-500">...and {failedBatch.batch.length - 5} more entries</div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Environment Info */}
        <Card className="mt-6 p-4">
          <h2 className="text-xl font-semibold mb-4">Environment Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
            </div>
            <div>
              <strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 100) + '...' : 'N/A'}
            </div>
            <div>
              <strong>Referrer:</strong> {typeof window !== 'undefined' ? document.referrer || 'None' : 'N/A'}
            </div>
            <div>
              <strong>LocalStorage Available:</strong> {typeof window !== 'undefined' && window.localStorage ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Fetch Available:</strong> {typeof window !== 'undefined' && typeof window.fetch === 'function' ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Console Methods:</strong> {typeof window !== 'undefined' ? Object.keys(console).join(', ') : 'N/A'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}