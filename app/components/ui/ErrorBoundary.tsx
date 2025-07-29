"use client";

import { Component, type ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "../icons";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: unknown;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: unknown) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === "production") {
      // You can integrate with services like Sentry, LogRocket, etc.
      console.error("Production error:", {
        error: error.message,
        stack: error.stack,
        errorInfo,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
    }

    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    if (error) {
      // You can implement error reporting logic here
      const errorReport = {
        message: error.message,
        stack: error.stack,
        errorInfo,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };
      
      // Send to your error reporting service
      console.log("Error report:", errorReport);
      
      // For now, just copy to clipboard
      navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
      alert("Error details copied to clipboard. Please report this issue.");
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="close" className="text-red-600 dark:text-red-400" size="xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Something went wrong
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>

              {process.env.NEXT_PUBLIC_DEBUG === "true" && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Error Details (Debug Mode)
                  </summary>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-32">
                    <div className="mb-2">
                      <strong>Message:</strong> {this.state.error.message}
                    </div>
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  onClick={this.handleRetry}
                  className="flex-1"
                  icon={<Icon name="refresh" size="sm" />}
                >
                  Try Again
                </Button>
                
                <Button
                  variant="outline"
                  onClick={this.handleReportError}
                  className="flex-1"
                  icon={<Icon name="share" size="sm" />}
                >
                  Report Issue
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="text-sm"
                  icon={<Icon name="refresh" size="sm" />}
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: unknown) => {
    console.error("Error caught by useErrorHandler:", error, errorInfo);
    
    if (process.env.NODE_ENV === "production") {
      // Log to external service
      console.error("Production error from hook:", {
        error: error.message,
        stack: error.stack,
        errorInfo,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      });
    }
  };
} 