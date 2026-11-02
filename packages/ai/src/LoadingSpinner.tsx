"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'premium';
  color?: 'blue' | 'white' | 'gray';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  color = 'blue',
  text,
  fullScreen = false,
  className = ''
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-600 dark:border-gray-800 dark:border-t-gray-400'
  };

  const dotColors = {
    blue: 'bg-blue-600 dark:bg-blue-400',
    white: 'bg-white',
    gray: 'bg-gray-600 dark:bg-gray-400'
  };

  const spinnerContent = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${dotColors[color]}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`${sizeClasses[size]} rounded-full border-2 ${colorClasses[color]}`}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );

      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${dotColors[color]}`}
                animate={{
                  y: [-10, 0, -10]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        );

      case 'premium':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} border-2 border-transparent rounded-full`}
              style={{
                background: `conic-gradient(from 0deg, transparent, ${color === 'blue' ? '#3b82f6' : color === 'white' ? '#ffffff' : '#6b7280'})`
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className={`absolute inset-1 bg-background rounded-full`} />
            <motion.div
              className="absolute inset-2 bg-blue-500 rounded-full"
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        );

      default:
        return (
          <motion.div
            className={`${sizeClasses[size]} border-2 rounded-full ${colorClasses[color]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {spinnerContent()}
      {text && (
        <motion.p
          className={`text-sm font-medium ${
            color === 'white' 
              ? 'text-white' 
              : 'text-foreground-muted'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="glass p-8 rounded-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return content;
}

// Specialized loading components
export function PageLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <LoadingSpinner
      size="lg"
      variant="premium"
      text={message}
      fullScreen={true}
    />
  );
}

export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner
      size={size}
      variant="default"
      color="white"
      className="mr-2"
    />
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return (
    <LoadingSpinner
      size="sm"
      variant="dots"
      text={text}
      className="py-4"
    />
  );
}