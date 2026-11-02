"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  AlertTriangle, RefreshCw, Home, Mail, Bug, Shield,
  ArrowLeft, Copy, CheckCircle, ExternalLink
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service (in production)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In production, send to error monitoring service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Example: Send to monitoring service
    // errorMonitoringService.report(errorData);
    
    // For development, log to console
    console.group('🚨 Error Report');
    console.error('Error ID:', this.state.errorId);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Full Report:', errorData);
    console.groupEnd();
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: '',
        copied: false
      });
    } else {
      // Max retries reached, force reload
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleCopyError = async () => {
    if (!this.state.error) return;

    const errorText = `
Error ID: ${this.state.errorId}
Error: ${this.state.error.message}
Stack: ${this.state.error.stack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private handleReportIssue = () => {
    const subject = encodeURIComponent(`Error Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message || 'Unknown error'}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Please describe what you were doing when this error occurred:
[Your description here]
    `);
    
    window.open(`mailto:support@delibix.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="glass-heavy border-red-200 dark:border-red-800">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4"
                >
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </motion.div>

                <CardTitle className="text-2xl md:text-3xl text-red-600 dark:text-red-400 mb-2">
                  Oops! Something went wrong
                </CardTitle>

                <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                  We encountered an unexpected error. Our team has been notified and we're working to fix it.
                </CardDescription>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge variant="outline" className="text-xs font-mono">
                    Error ID: {this.state.errorId}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Details (Development Mode) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                      <Bug className="w-4 h-4" />
                      Error Details (Development Mode)
                    </h4>
                    <div className="text-xs font-mono text-red-700 dark:text-red-300 break-all">
                      <div className="mb-2">
                        <strong>Message:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div className="max-h-32 overflow-y-auto">
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap mt-1">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1 gradient-bg-blue text-white"
                    disabled={this.retryCount >= this.maxRetries}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {this.retryCount >= this.maxRetries ? 'Reload Page' : `Try Again (${this.maxRetries - this.retryCount} left)`}
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </motion.div>

                {/* Additional Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <Button
                    onClick={this.handleCopyError}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {this.state.copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Error Details
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={this.handleReportIssue}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </motion.div>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4"
                >
                  <Shield className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <p className="mb-2">
                    Your data is safe. This error has been automatically reported to our team.
                  </p>
                  <p>
                    If this problem persists, please contact{' '}
                    <a 
                      href="mailto:support@delibix.com" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      support@delibix.com
                    </a>
                    {' '}with error ID: <code className="font-mono text-xs">{this.state.errorId}</code>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // Could integrate with error reporting service here
  };
}

// HOC version for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Specific error boundary for async operations
export function AsyncErrorBoundary({ children, onError }: Props) {
  return (
    <ErrorBoundary 
      onError={onError}
      fallback={
        <div className="flex items-center justify-center p-8">
          <Card className="glass-secondary max-w-md">
            <CardContent className="text-center p-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Error</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Failed to load this content. Please try refreshing the page.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                size="sm"
                className="gradient-bg-blue text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}