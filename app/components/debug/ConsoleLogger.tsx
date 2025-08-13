"use client";

import { useEffect } from 'react';

export function ConsoleLogger() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const ENDPOINT = "/api/debug-logs";
    const LEVELS = ["log", "info", "warn", "error"];
    const original: Record<string, (...args: any[]) => void> = {};
    const sessionId = crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random();
    const context = {
      url: location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId,
      app: "gif-nouns-farcaster-debug"
    };

    // ---- helpers ----
    function toSerializable(v: any): any {
      if (v instanceof Error) {
        return { __type: "Error", name: v.name, message: v.message, stack: v.stack };
      }
      try {
        // Functions and DOM nodes won't JSON nicely; fallback to String
        return typeof v === "object" && v !== null ? JSON.parse(JSON.stringify(v)) : v;
      } catch {
        try { return String(v); } catch { return "[unserializable]"; }
      }
    }

    // simple queue + batch
    const queue: any[] = [];
    const MAX_BATCH = 25;
    const FLUSH_MS = 2000;
    let timer: NodeJS.Timeout | null = null;
    let inflight = false;

    function enqueue(payload: any) {
      queue.push(payload);
      if (queue.length >= MAX_BATCH) flush();
      else if (!timer) timer = setTimeout(flush, FLUSH_MS);
    }

    function flush(useBeacon = false) {
      if (!queue.length) return;
      if (timer) { clearTimeout(timer); timer = null; }
      const batch = queue.splice(0, queue.length);

      const body = JSON.stringify({ context, ts: Date.now(), entries: batch });

      // Try sendBeacon on unload; fall back to fetch
      if (useBeacon && navigator.sendBeacon) {
        try { 
          navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" })); 
          return; 
        } catch {
          console.warn('SendBeacon failed');
        }
      }

      // Avoid parallel flushes
      if (inflight) { queue.unshift(...batch); return; }
      inflight = true;

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body
      }).catch((error) => {
        // on failure, requeue (best-effort) and store in localStorage
        console.warn('Failed to send logs to webhook:', error);
        queue.unshift(...batch);
        
        // Fallback: store in localStorage for later inspection
        try {
          const stored = localStorage.getItem('debug_logs_failed') || '[]';
          const failedLogs = JSON.parse(stored);
          failedLogs.push({
            timestamp: Date.now(),
            error: error instanceof Error ? error.message : String(error),
            batch: batch
          });
          localStorage.setItem('debug_logs_failed', JSON.stringify(failedLogs.slice(-20))); // Keep last 20 failed batches
          console.log('📦 Stored failed logs in localStorage');
        } catch (storageError) {
          console.error('❌ Failed to store in localStorage:', storageError);
        }
      }).finally(() => { inflight = false; });
    }

    // send on page hide
    const unloadEvents = ["visibilitychange", "pagehide", "beforeunload"];
    unloadEvents.forEach(ev => {
      window.addEventListener(ev, () => {
        if (document.visibilityState === "hidden" || ev !== "visibilitychange") {
          flush(true);
        }
      });
    });

    // ---- override console methods ----
    LEVELS.forEach(level => {
      original[level] = (console as any)[level].bind(console);
      (console as any)[level] = function (...args: any[]) {
        // ALWAYS log to the local console first
        try { 
          original[level](...args); 
        } catch (e) {
          // Fallback if original console method fails
          try {
            console.log(`[${level.toUpperCase()}]`, ...args);
          } catch {}
        }

        // Then enqueue for webhook
        enqueue({
          level,
          time: Date.now(),
          args: args.map(toSerializable)
        });
      };
    });

    // also capture unhandled errors/rejections
    window.addEventListener("error", (e) => {
      const errorInfo = toSerializable(e.error || (e.message + " @ " + e.filename + ":" + e.lineno));
      
      // Log locally first
      try {
        original.error("Unhandled Error:", errorInfo);
      } catch {
        console.error("Unhandled Error:", errorInfo);
      }

      enqueue({
        level: "error",
        time: Date.now(),
        args: ["Unhandled Error", errorInfo]
      });
    });

    window.addEventListener("unhandledrejection", (e) => {
      const rejectionInfo = toSerializable(e.reason);
      
      // Log locally first
      try {
        original.error("Unhandled Promise Rejection:", rejectionInfo);
      } catch {
        console.error("Unhandled Promise Rejection:", rejectionInfo);
      }

      enqueue({
        level: "error",
        time: Date.now(),
        args: ["UnhandledPromiseRejection", rejectionInfo]
      });
    });

    // Add a special debug identifier
    console.log('🔍 Console Logger initialized for Farcaster SDK debugging', {
      sessionId,
      timestamp: new Date().toISOString(),
      url: context.url,
      userAgent: context.userAgent.substring(0, 100)
    });

    // Test fetch capability immediately
    const testFetch = async () => {
      try {
        console.log('🧪 Testing fetch capability to internal API...');
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: { ...context, test: true },
            ts: Date.now(),
            entries: [{ level: 'info', time: Date.now(), args: ['Console Logger Test Message'] }]
          })
        });
        console.log('✅ Fetch test response:', response.status, response.statusText);
      } catch (fetchError) {
        console.error('❌ Fetch test failed:', fetchError);
        // Try to store in localStorage as fallback
        try {
          const stored = localStorage.getItem('debug_logs') || '[]';
          const logs = JSON.parse(stored);
          logs.push({
            error: 'Fetch failed',
            details: fetchError instanceof Error ? fetchError.message : String(fetchError),
            timestamp: Date.now(),
            context
          });
          localStorage.setItem('debug_logs', JSON.stringify(logs.slice(-50))); // Keep last 50
          console.log('📦 Stored fetch error in localStorage');
        } catch (storageError) {
          console.error('❌ localStorage fallback also failed:', storageError);
        }
      }
    };

    // Test immediately and after a delay
    testFetch();
    setTimeout(testFetch, 1000);

    // Cleanup function
    return () => {
      // Restore original console methods
      LEVELS.forEach(level => {
        if (original[level]) {
          (console as any)[level] = original[level];
        }
      });
      
      // Flush any remaining logs
      flush(true);
    };
  }, []);

  return null; // This component doesn't render anything
}