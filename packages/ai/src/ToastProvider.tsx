"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, AlertCircle, Info, X, AlertTriangle,
  Zap, Crown, Gift, Bell, Star, Heart, Lightbulb
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (message: string, options?: Partial<Toast>) => string;
  error: (message: string, options?: Partial<Toast>) => string;
  warning: (message: string, options?: Partial<Toast>) => string;
  info: (message: string, options?: Partial<Toast>) => string;
  loading: (message: string, options?: Partial<Toast>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { isDark } = useDarkMode();

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      duration: 5000,
      position: 'top-right',
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration (unless persistent)
    if (!newToast.persistent && newToast.type !== 'loading') {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({ ...options, message, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({ ...options, message, type: 'error', duration: 7000 });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({ ...options, message, type: 'warning', duration: 6000 });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({ ...options, message, type: 'info' });
  }, [addToast]);

  const loading = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({ ...options, message, type: 'loading', persistent: true });
  }, [addToast]);

  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) acc[position] = [];
    acc[position].push(toast);
    return acc;
  }, {} as Record<string, Toast[]>);

  // Get position classes
  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6';
      case 'top-center':
        return 'top-6 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-center':
        return 'bottom-6 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-6 right-6';
      default:
        return 'top-6 right-6';
    }
  };

  // Get toast styles
  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-900 dark:text-green-100'
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-red-900 dark:text-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          textColor: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'loading':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: Zap,
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-900 dark:text-blue-100'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
          icon: Info,
          iconColor: 'text-slate-600 dark:text-slate-400',
          textColor: 'text-slate-900 dark:text-slate-100'
        };
    }
  };

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    loading
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Containers */}
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 pointer-events-none ${getPositionClasses(position)}`}
          style={{ maxWidth: '420px' }}
        >
          <div className="space-y-3">
            <AnimatePresence>
              {positionToasts.map((toast) => {
                const styles = getToastStyles(toast.type);
                const IconComponent = styles.icon;

                return (
                  <motion.div
                    key={toast.id}
                    layout
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8,
                      x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
                      y: position.includes('top') ? -50 : position.includes('bottom') ? 50 : 0
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: 0,
                      y: 0
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8,
                      x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0,
                      y: position.includes('top') ? -50 : position.includes('bottom') ? 50 : 0
                    }}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeOut",
                      layout: { duration: 0.2 }
                    }}
                    className={`
                      ${styles.bg} border rounded-xl shadow-lg backdrop-blur-md
                      pointer-events-auto max-w-sm w-full overflow-hidden
                      glass-heavy
                    `}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {toast.type === 'loading' ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                            </motion.div>
                          ) : (
                            <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {toast.title && (
                            <h4 className={`text-sm font-semibold ${styles.textColor} mb-1`}>
                              {toast.title}
                            </h4>
                          )}
                          <p className={`text-sm ${styles.textColor} leading-relaxed`}>
                            {toast.message}
                          </p>
                          
                          {/* Action Button */}
                          {toast.action && (
                            <div className="mt-3">
                              <button
                                onClick={toast.action.onClick}
                                className={`text-sm font-medium ${styles.iconColor} hover:underline focus:outline-none focus:underline`}
                              >
                                {toast.action.label}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Close Button */}
                        <button
                          onClick={() => removeToast(toast.id)}
                          className={`flex-shrink-0 ${styles.iconColor} hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md p-1`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress Bar for Non-Persistent Toasts */}
                      {!toast.persistent && toast.type !== 'loading' && (
                        <motion.div
                          className={`mt-3 h-1 ${styles.iconColor.replace('text-', 'bg-')} opacity-30 rounded-full overflow-hidden`}
                        >
                          <motion.div
                            className={`h-full ${styles.iconColor.replace('text-', 'bg-')} rounded-full`}
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ 
                              duration: (toast.duration || 5000) / 1000,
                              ease: "linear" 
                            }}
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Utility functions for common toast patterns
export const toast = {
  success: (message: string, options?: Partial<Toast>) => {
    // This would work if ToastProvider is mounted
    console.log('Success:', message);
  },
  error: (message: string, options?: Partial<Toast>) => {
    console.log('Error:', message);
  },
  warning: (message: string, options?: Partial<Toast>) => {
    console.log('Warning:', message);
  },
  info: (message: string, options?: Partial<Toast>) => {
    console.log('Info:', message);
  },
  loading: (message: string, options?: Partial<Toast>) => {
    console.log('Loading:', message);
  }
};

// Pre-configured toast messages for common scenarios
export const commonToasts = {
  // Authentication
  loginSuccess: () => toast.success("Welcome back! You've been successfully logged in."),
  loginError: () => toast.error("Login failed. Please check your credentials and try again."),
  logoutSuccess: () => toast.success("You've been successfully logged out."),
  signupSuccess: () => toast.success("Account created successfully! Welcome to Delibix."),
  passwordResetSent: () => toast.success("Password reset email sent. Check your inbox."),
  
  // Account Management
  profileUpdated: () => toast.success("Your profile has been updated successfully."),
  passwordChanged: () => toast.success("Your password has been changed successfully."),
  
  // E-commerce
  addedToCart: (item: string) => toast.success(`${item} added to cart.`),
  removedFromCart: (item: string) => toast.info(`${item} removed from cart.`),
  orderPlaced: () => toast.success("Order placed successfully! You'll receive a confirmation email."),
  paymentSuccess: () => toast.success("Payment processed successfully."),
  paymentError: () => toast.error("Payment failed. Please try again or contact support."),
  
  // Notifications
  notificationRead: () => toast.info("Notification marked as read."),
  allNotificationsRead: () => toast.success("All notifications marked as read."),
  
  // File Operations
  fileUploaded: (filename: string) => toast.success(`${filename} uploaded successfully.`),
  fileUploadError: () => toast.error("File upload failed. Please try again."),
  fileDownloaded: (filename: string) => toast.success(`${filename} downloaded.`),
  
  // Form Submissions
  formSubmitted: () => toast.success("Form submitted successfully."),
  formError: () => toast.error("Please correct the errors and try again."),
  
  // Data Operations
  dataSaved: () => toast.success("Data saved successfully."),
  dataDeleted: () => toast.success("Data deleted successfully."),
  dataError: () => toast.error("An error occurred. Please try again."),
  
  // Network & System
  connectionError: () => toast.error("Connection lost. Please check your internet connection."),
  serverError: () => toast.error("Server error. Please try again later."),
  maintenanceMode: () => toast.warning("System maintenance in progress. Some features may be unavailable."),
  
  // Feature Updates
  newFeature: (feature: string) => toast.info(`New feature available: ${feature}`, {
    action: { label: 'Learn More', onClick: () => {} }
  }),
  
  // Subscription & Billing
  subscriptionUpgraded: () => toast.success("Subscription upgraded successfully!"),
  subscriptionCancelled: () => toast.warning("Subscription cancelled. Access continues until period end."),
  billingUpdated: () => toast.success("Billing information updated successfully."),
  
  // Admin Actions
  userCreated: () => toast.success("User created successfully."),
  userDeleted: () => toast.success("User deleted successfully."),
  settingsUpdated: () => toast.success("Settings updated successfully."),
  
  // AI & Tools
  analysisComplete: () => toast.success("Analysis completed successfully."),
  reportGenerated: () => toast.success("Report generated and ready for download."),
  aiInsightReady: () => toast.info("New AI insights are available for your review.")
};