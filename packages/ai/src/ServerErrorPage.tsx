"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Home, RefreshCw, AlertTriangle, Settings, MessageCircle } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ServerErrorPageProps {
  navigate: (page: 'home' | 'contact' | '404' | '500' | 'maintenance' | 'sitemap') => void;
}

export function ServerErrorPage({ navigate }: ServerErrorPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 py-24 ${isRTL ? 'rtl' : ''}`}>
      <motion.div
        className="max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 500 Number with Warning Icon */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.h1
            className={`text-9xl md:text-[12rem] font-bold gradient-text-blue leading-none ${
              isDark ? 'text-blue-300' : ''
            }`}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            500
          </motion.h1>
          
          {/* Floating warning elements */}
          <motion.div
            className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} opacity-30`}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <AlertTriangle className={`w-16 h-16 ${
              isDark ? 'text-amber-400' : 'text-amber-500'
            }`} />
          </motion.div>
          
          <motion.div
            className={`absolute bottom-8 ${isRTL ? 'left-8' : 'right-8'} opacity-20`}
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Settings className={`w-12 h-12 ${
              isDark ? 'text-blue-500' : 'text-blue-600'
            }`} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className={`text-3xl md:text-4xl font-bold mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
          variants={itemVariants}
        >
          Internal Server Error
        </motion.h2>

        {/* Description */}
        <motion.p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
          variants={itemVariants}
        >
          Oops! Something went wrong on our end. Our AI systems are working to fix this issue. 
          Please try again in a few moments.
        </motion.p>

        {/* Error Details Box */}
        <motion.div
          className={`glass-heavy rounded-2xl p-6 mb-8 max-w-lg mx-auto ${
            isDark 
              ? 'border border-amber-400/20 bg-slate-800/30' 
              : 'border border-amber-200/50 bg-amber-50/30'
          }`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className={`w-5 h-5 ${
              isDark ? 'text-amber-400' : 'text-amber-500'
            }`} />
            <p className={`font-medium ${
              isDark ? 'text-amber-300' : 'text-amber-600'
            }`}>
              What happened?
            </p>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Our servers encountered an unexpected condition that prevented them from fulfilling your request. 
            Our development team has been automatically notified.
          </p>
        </motion.div>

        {/* Status Update */}
        <motion.div
          className={`flex items-center justify-center gap-3 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          variants={itemVariants}
        >
          <motion.div
            className="w-3 h-3 bg-amber-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <p className={`text-sm font-medium ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            System Status: Investigating
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${
            isRTL ? 'sm:flex-row-reverse' : ''
          }`}
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="gradient-bg-blue text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-xl relative overflow-hidden group"
              onClick={() => window.location.reload()}
            >
              <span className={`relative z-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RefreshCw className="w-5 h-5" />
                Try Again
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="lg"
              className={`px-8 py-6 text-lg rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-xl ${
                isDark 
                  ? 'glass-heavy border-2 border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                  : 'glass-heavy border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
              }`}
              onClick={() => navigate('home')}
            >
              <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Home className="w-5 h-5" />
                Back to Home
              </span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              size="lg"
              className={`px-8 py-6 text-lg rounded-2xl font-medium transition-all duration-300 ${
                isDark 
                  ? 'text-slate-400 hover:text-blue-300 hover:bg-blue-400/10' 
                  : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
              onClick={() => navigate('contact')}
            >
              <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Technical Info */}
        <motion.div
          className={`mt-16 p-6 glass-secondary rounded-2xl max-w-2xl mx-auto ${
            isDark 
              ? 'border border-blue-400/10 bg-slate-800/20' 
              : 'border border-blue-100/50 bg-white/20'
          }`}
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <p className={`text-sm font-medium mb-2 ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            🔧 For Developers
          </p>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Error ID: DEL-{Date.now().toString(36).toUpperCase()} | 
            Time: {new Date().toLocaleString()} | 
            If this persists, please contact our technical team with this error ID.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}