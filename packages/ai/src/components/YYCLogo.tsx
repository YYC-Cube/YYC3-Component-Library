import React from 'react';
import { motion } from 'motion/react';

interface YYCLogoProps {
  variant?: 'full' | 'short' | 'icon';
  size?: 'small' | 'medium' | 'large' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export function YYCLogo({ 
  variant = 'full', 
  size = 'medium', 
  className = '',
  showTagline = false 
}: YYCLogoProps) {
  
  const sizeClasses = {
    small: 'h-6 text-sm',
    medium: 'h-8 text-base',
    large: 'h-10 text-lg',
    xl: 'h-14 text-2xl'
  };

  const iconSizes = {
    small: 24,
    medium: 32,
    large: 40,
    xl: 56
  };

  const iconSize = iconSizes[size];

  // Colors based on brand: Primary Blue, Secondary Purple, Accent Cyan
  return (
    <div className={`flex items-center gap-2 select-none ${sizeClasses[size]} ${className}`}>
      {/* Logo Icon */}
      <div className="relative flex items-center justify-center">
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            d="M20 5L30 10V20L20 25L10 20V10L20 5Z" 
            stroke="url(#yyc-gradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <motion.path
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
             d="M20 25V35" 
             stroke="url(#yyc-gradient-2)" 
             strokeWidth="3" 
             strokeLinecap="round"
          />
          <defs>
            <linearGradient id="yyc-gradient" x1="10" y1="5" x2="30" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" /> {/* Blue */}
              <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple */}
            </linearGradient>
            <linearGradient id="yyc-gradient-2" x1="20" y1="25" x2="20" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text Content */}
      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              YYC
            </span>
            {variant === 'full' && (
              <span className="font-medium text-slate-600 dark:text-slate-300 tracking-wide">
                Cloud
              </span>
            )}
          </div>
          {(showTagline || variant === 'full') && size !== 'small' && (
             <span className="text-[0.65em] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest scale-90 origin-left">
               Enterprise
             </span>
          )}
        </div>
      )}
    </div>
  );
}
