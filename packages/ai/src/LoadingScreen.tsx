"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Sparkles, ChevronRight } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";

// Import the logo image
import delibixLogo from 'figma:asset/c874324ee6010c04a39e6a2042438c041a7af36e.png';

interface LoadingScreenProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function LoadingScreen({ isVisible, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const { isDark } = useDarkMode();

  const loadingStages = [
    { text: "Initializing Delibix Platform", progress: 20 },
    { text: "Loading AI Components", progress: 40 },
    { text: "Establishing Connections", progress: 60 },
    { text: "Optimizing Experience", progress: 80 },
    { text: "Welcome to Delibix", progress: 100 }
  ];

  useEffect(() => {
    if (!isVisible) return;

    let progressTimer: NodeJS.Timeout;
    let stageTimer: NodeJS.Timeout;
    let completionTimer: NodeJS.Timeout;

    const animateProgress = () => {
      const targetProgress = loadingStages[currentStage]?.progress || 0;
      const progressIncrement = (targetProgress - progress) / 20;

      progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + progressIncrement;
          if (newProgress >= targetProgress) {
            clearInterval(progressTimer);
            
            // Move to next stage after a brief pause
            if (currentStage < loadingStages.length - 1) {
              stageTimer = setTimeout(() => {
                setCurrentStage(prev => prev + 1);
              }, 300);
            } else {
              // Loading complete
              setShowContent(true);
              completionTimer = setTimeout(() => {
                onComplete();
              }, 1200);
            }
            
            return targetProgress;
          }
          return newProgress;
        });
      }, 50);
    };

    // Start animation after a brief delay
    setTimeout(animateProgress, 500);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stageTimer);
      clearTimeout(completionTimer);
    };
  }, [currentStage, isVisible, onComplete, progress, loadingStages]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Enhanced Background with Dark Mode Support */}
        <div className="absolute inset-0 z-0">
          {/* Main gradient background */}
          <motion.div 
            className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-800/30' 
                : 'bg-gradient-to-br from-white via-blue-50/60 to-blue-100/40'
            }`}
            animate={{
              background: isDark ? [
                "linear-gradient(135deg, #0f172a 0%, rgba(30, 58, 138, 0.4) 50%, rgba(30, 41, 59, 0.3) 100%)",
                "linear-gradient(135deg, #0f172a 0%, rgba(30, 58, 138, 0.6) 50%, rgba(30, 41, 59, 0.5) 100%)",
                "linear-gradient(135deg, #0f172a 0%, rgba(30, 58, 138, 0.4) 50%, rgba(30, 41, 59, 0.3) 100%)"
              ] : [
                "linear-gradient(135deg, #ffffff 0%, rgba(239, 246, 255, 0.6) 50%, rgba(219, 234, 254, 0.4) 100%)",
                "linear-gradient(135deg, #ffffff 0%, rgba(239, 246, 255, 0.8) 50%, rgba(219, 234, 254, 0.6) 100%)",
                "linear-gradient(135deg, #ffffff 0%, rgba(239, 246, 255, 0.6) 50%, rgba(219, 234, 254, 0.4) 100%)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${
                isDark ? 'bg-blue-400/20' : 'bg-blue-500/15'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, ${isDark ? '0.1' : '0.1'}) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, ${isDark ? '0.1' : '0.1'}) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Logo Section */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div
              className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-xl ${
                isDark 
                  ? 'glass border border-blue-400/20 bg-slate-800/50' 
                  : 'glass border border-blue-200/50 bg-white/50'
              }`}
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Logo Image */}
              <motion.img
                src={delibixLogo}
                alt="Delibix Logo"
                className="w-12 h-12 object-contain"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Glowing ring effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${
                  isDark 
                    ? 'border-2 border-blue-400/30' 
                    : 'border-2 border-blue-500/30'
                }`}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Delibix
            </motion.h1>
            
            <motion.p
              className={`text-sm ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              AI-Native Digital Consulting
            </motion.p>
          </motion.div>

          {/* Loading Stage Text */}
          <motion.div
            className="mb-8"
            key={currentStage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className={`flex items-center justify-center gap-2 mb-3 ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {currentStage < 2 && <Brain className="w-4 h-4 text-blue-500" />}
              {currentStage >= 2 && currentStage < 4 && <Zap className="w-4 h-4 text-blue-500" />}
              {currentStage >= 4 && <Sparkles className="w-4 h-4 text-blue-500" />}
              
              <motion.span
                className="text-sm font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {loadingStages[currentStage]?.text}
              </motion.span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              isDark 
                ? 'bg-slate-800/50 border border-blue-400/20' 
                : 'bg-blue-50/50 border border-blue-200/50'
            }`}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.div>
            </div>
            
            {/* Progress percentage */}
            <motion.div
              className={`text-xs mt-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {Math.round(progress)}%
            </motion.div>
          </motion.div>

          {/* Welcome Message (when complete) */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <motion.div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                    isDark 
                      ? 'glass border border-blue-400/20 bg-slate-800/30' 
                      : 'glass border border-blue-200/50 bg-white/30'
                  }`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm font-medium ${
                    isDark ? 'text-blue-300' : 'text-blue-600'
                  }`}>
                    Ready to Transform
                  </span>
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </motion.div>
                
                <motion.p
                  className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Entering the future of digital consulting...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner accents */}
          <motion.div
            className={`absolute top-8 left-8 w-16 h-16 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-blue-400/5 to-blue-600/5' 
                : 'bg-gradient-to-br from-blue-400/10 to-blue-600/10'
            }`}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          <motion.div
            className={`absolute top-8 right-8 w-12 h-12 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-blue-500/8 to-blue-700/5' 
                : 'bg-gradient-to-br from-blue-500/15 to-blue-700/10'
            }`}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          <motion.div
            className={`absolute bottom-8 left-8 w-10 h-10 rounded-full ${
              isDark 
                ? 'bg-gradient-to-br from-blue-300/10 to-blue-500/5' 
                : 'bg-gradient-to-br from-blue-300/20 to-blue-500/10'
            }`}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          <motion.div
            className={`absolute bottom-8 right-8 w-14 h-14 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-blue-600/8 to-blue-800/5' 
                : 'bg-gradient-to-br from-blue-600/15 to-blue-800/10'
            }`}
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 8, 0]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}