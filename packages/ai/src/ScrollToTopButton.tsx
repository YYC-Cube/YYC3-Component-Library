"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ArrowUp, Navigation } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ScrollToTopButtonProps {
  showLiveChat?: boolean;
  isNavigating?: boolean;
  onScrollToTop?: (behavior?: 'smooth' | 'instant') => void;
  className?: string;
}

export function ScrollToTopButton({ 
  showLiveChat = false, 
  isNavigating = false,
  onScrollToTop,
  className = "" 
}: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();

  // Enhanced scroll detection with progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Show button after scrolling 200px or more
      setIsVisible(scrollTop > 200);
      
      // Calculate scroll progress (0-100%)
      const progress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };

    // Throttled scroll listener for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  // Enhanced scroll to top function
  const handleScrollToTop = useCallback((behavior: 'smooth' | 'instant' = 'smooth') => {
    if (onScrollToTop) {
      onScrollToTop(behavior);
    } else {
      // Fallback scroll logic
      try {
        window.scrollTo({ 
          top: 0, 
          left: 0, 
          behavior: behavior 
        });
        
        // Additional fallback methods
        if (document.body.scrollTop !== 0) {
          document.body.scrollTop = 0;
        }
        
        if (document.documentElement.scrollTop !== 0) {
          document.documentElement.scrollTop = 0;
        }
      } catch (error) {
        console.warn('Scroll to top error:', error);
        // Force scroll without smooth behavior
        window.scrollTo(0, 0);
      }
    }
    
    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'scroll_to_top', {
        event_category: 'engagement',
        event_label: 'scroll_button_click'
      });
    }
  }, [onScrollToTop]);

  // Show/hide tooltip
  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowTooltip(true), 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  // Calculate position based on live chat visibility
  const getPosition = () => {
    const baseBottom = showLiveChat ? '6rem' : '2rem';
    const baseRight = isRTL ? 'auto' : '2rem';
    const baseLeft = isRTL ? '2rem' : 'auto';
    
    return {
      bottom: baseBottom,
      right: baseRight,
      left: baseLeft,
    };
  };

  const position = getPosition();

  return (
    <AnimatePresence>
      {(isVisible || isNavigating) && (
        <motion.div
          className={`fixed z-40 ${className}`}
          style={position}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            y: 20
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            y: 20
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeOut",
            type: "spring",
            damping: 25,
            stiffness: 300
          }}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                className={`absolute bottom-full mb-2 px-3 py-1.5 text-xs font-medium rounded-lg glass-heavy text-center min-w-max ${
                  isRTL ? 'right-0' : 'left-1/2 -translate-x-1/2'
                } ${
                  isDark 
                    ? 'text-blue-200 bg-slate-800/90 border-blue-400/20' 
                    : 'text-blue-700 bg-white/90 border-blue-200/50'
                }`}
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                {t("scrollToTop") || "Back to Top"}
                
                {/* Tooltip arrow */}
                <div 
                  className={`absolute top-full ${isRTL ? 'right-4' : 'left-1/2 -translate-x-1/2'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                    isDark ? 'border-t-slate-800/90' : 'border-t-white/90'
                  }`} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            onClick={() => handleScrollToTop('smooth')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
              relative w-14 h-14 rounded-2xl shadow-lg transition-all duration-300 group overflow-hidden
              ${isDark 
                ? 'glass border-2 border-blue-400/30 bg-slate-800/50 hover:bg-slate-700/50 hover:border-blue-400/50' 
                : 'glass border-2 border-blue-200/50 bg-white/50 hover:bg-blue-50/50 hover:border-blue-300/50'
              }
              ${isHovered ? 'shadow-xl scale-105' : 'shadow-lg scale-100'}
              ${isNavigating ? 'animate-pulse' : ''}
            `}
            whileHover={{ 
              scale: 1.05,
              boxShadow: isDark 
                ? "0 8px 32px rgba(59, 130, 246, 0.2)" 
                : "0 8px 32px rgba(59, 130, 246, 0.15)"
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
            aria-label={t("scrollToTop") || "Scroll to top"}
          >
            {/* Progress Ring */}
            <svg 
              className="absolute inset-0 w-full h-full -rotate-90" 
              viewBox="0 0 56 56"
            >
              {/* Background Circle */}
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke={isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.08)"}
                strokeWidth="2"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke={isDark ? "rgba(59, 130, 246, 0.6)" : "rgba(59, 130, 246, 0.5)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={163.36} // 2 * π * 26
                strokeDashoffset={163.36 * (1 - scrollProgress / 100)}
                transition={{ duration: 0.1 }}
              />
            </svg>

            {/* Icon Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: isHovered ? -1 : 0,
                  rotateY: isNavigating ? 180 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  rotateY: { duration: 0.6 }
                }}
              >
                {isNavigating ? (
                  <Navigation className={`w-5 h-5 ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`} />
                ) : (
                  <ChevronUp className={`w-5 h-5 ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`} />
                )}
              </motion.div>
            </div>

            {/* Ripple Effect on Click */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${
                isDark 
                  ? 'bg-blue-400/10' 
                  : 'bg-blue-500/10'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 2, opacity: 0.3 }}
              transition={{ duration: 0.3 }}
            />

            {/* Hover Glow Effect */}
            <motion.div
              className={`absolute inset-0 rounded-2xl pointer-events-none ${
                isDark 
                  ? 'bg-blue-400/5' 
                  : 'bg-blue-500/5'
              }`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Scroll Progress Indicator (optional text) */}
          {scrollProgress > 10 && (
            <motion.div
              className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-md ${
                isDark 
                  ? 'text-blue-300 bg-slate-800/70' 
                  : 'text-blue-600 bg-white/70'
              }`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(scrollProgress)}%
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}