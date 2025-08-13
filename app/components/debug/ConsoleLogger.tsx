"use client";

import { useEffect } from 'react';

export function ConsoleLogger() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const ENDPOINT = "https://webhook.site/a1d4c769-2f20-4f74-9d40-6bd5ed303577";
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
        // on failure, requeue (best-effort)
        console.warn('Failed to send logs to webhook:', error);
        queue.unshift(...batch);
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