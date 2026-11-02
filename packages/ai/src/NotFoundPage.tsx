"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Home, Search, ArrowLeft, Compass, RefreshCw } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface NotFoundPageProps {
  navigate: (page: 'home' | 'contact' | '404' | '500' | 'maintenance' | 'sitemap') => void;
}

export function NotFoundPage({ navigate }: NotFoundPageProps) {
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
        {/* 404 Number */}
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
            404
          </motion.h1>
          
          {/* Floating elements around 404 */}
          <motion.div
            className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} opacity-20`}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Search className={`w-12 h-12 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`} />
          </motion.div>
          
          <motion.div
            className={`absolute bottom-8 ${isRTL ? 'left-8' : 'right-8'} opacity-20`}
            animate={{
              y: [0, -15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Compass className={`w-10 h-10 ${
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
          Oops! Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
          variants={itemVariants}
        >
          The page you're looking for seems to have wandered off into the digital void. 
          Don't worry though - our AI-powered navigation system can help you find your way back!
        </motion.p>

        {/* Search Suggestion Box */}
        <motion.div
          className={`glass-heavy rounded-2xl p-6 mb-8 max-w-lg mx-auto ${
            isDark 
              ? 'border border-blue-400/20 bg-slate-800/30' 
              : 'border border-blue-200/50 bg-white/30'
          }`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <p className={`text-sm font-medium mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Looking for something specific?
          </p>
          <div className="flex gap-2 text-xs">
            <span className={`px-3 py-1 glass rounded-full ${
              isDark 
                ? 'text-blue-300 border border-blue-400/20' 
                : 'text-blue-600 border border-blue-200'
            }`}>
              Services
            </span>
            <span className={`px-3 py-1 glass rounded-full ${
              isDark 
                ? 'text-blue-300 border border-blue-400/20' 
                : 'text-blue-600 border border-blue-200'
            }`}>
              Portfolio
            </span>
            <span className={`px-3 py-1 glass rounded-full ${
              isDark 
                ? 'text-blue-300 border border-blue-400/20' 
                : 'text-blue-600 border border-blue-200'
            }`}>
              Contact
            </span>
          </div>
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
              onClick={() => navigate('home')}
            >
              <span className={`relative z-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Home className="w-5 h-5" />
                Back to Home
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
              onClick={() => window.history.back()}
            >
              <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                Go Back
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
              onClick={() => window.location.reload()}
            >
              <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RefreshCw className="w-5 h-5" />
                Refresh Page
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Fun Fact */}
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
            💡 Did you know?
          </p>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            HTTP status code 404 was named after room 404 at CERN, where the World Wide Web was born. 
            The room housed the original web servers!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}