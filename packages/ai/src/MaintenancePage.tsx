"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Home, Clock, Settings, RefreshCw, Calendar, Sparkles } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";
import { useState, useEffect } from "react";

interface MaintenancePageProps {
  navigate: (page: 'home' | 'contact' | '404' | '500' | 'maintenance' | 'sitemap') => void;
}

export function MaintenancePage({ navigate }: MaintenancePageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock maintenance end time (2 hours from now)
  const maintenanceEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000);

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
        {/* Maintenance Icon */}
        <motion.div
          className="relative mb-8"
          variants={itemVariants}
        >
          <motion.div
            className={`inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full glass-heavy ${
              isDark 
                ? 'border border-blue-400/20 bg-slate-800/30' 
                : 'border border-blue-200/50 bg-white/30'
            } shadow-2xl`}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Settings className={`w-16 h-16 md:w-20 md:h-20 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`} />
          </motion.div>
          
          {/* Floating sparkles */}
          <motion.div
            className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} opacity-40`}
            animate={{
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className={`w-8 h-8 ${
              isDark ? 'text-blue-300' : 'text-blue-400'
            }`} />
          </motion.div>
          
          <motion.div
            className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} opacity-40`}
            animate={{
              y: [0, -15, 0],
              x: [0, -5, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <Sparkles className={`w-6 h-6 ${
              isDark ? 'text-blue-400' : 'text-blue-500'
            }`} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
          variants={itemVariants}
        >
          We're Upgrading Our Systems
        </motion.h1>

        {/* Description */}
        <motion.p
          className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
          variants={itemVariants}
        >
          Our AI-powered platform is currently undergoing scheduled maintenance to bring you 
          even better digital solutions. We'll be back online shortly!
        </motion.p>

        {/* Maintenance Details */}
        <motion.div
          className={`glass-heavy rounded-2xl p-8 mb-8 max-w-2xl mx-auto ${
            isDark 
              ? 'border border-blue-400/20 bg-slate-800/30' 
              : 'border border-blue-200/50 bg-white/30'
          }`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Time */}
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className={`w-5 h-5 ${
                  isDark ? 'text-blue-400' : 'text-blue-500'
                }`} />
                <p className={`font-medium ${
                  isDark ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  Current Time
                </p>
              </div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {currentTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>

            {/* Expected Completion */}
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-500'
                }`} />
                <p className={`font-medium ${
                  isDark ? 'text-green-300' : 'text-green-600'
                }`}>
                  Back Online
                </p>
              </div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {maintenanceEndTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </p>
            </div>
          </div>

          <div className={`mt-6 pt-6 border-t ${
            isDark ? 'border-blue-400/20' : 'border-blue-200/30'
          }`}>
            <p className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              We're implementing new AI features and performance improvements. 
              Thank you for your patience!
            </p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <p className={`text-sm font-medium mb-3 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Maintenance Progress
          </p>
          <div className={`w-full max-w-md mx-auto h-2 rounded-full ${
            isDark ? 'bg-slate-700' : 'bg-slate-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
          <p className={`text-xs mt-2 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Approximately 75% complete
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
                Check Status
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
              onClick={() => window.open('http://wa.me/6285770024933', '_blank')}
            >
              <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="w-5 h-5" />
                Get Updates
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* What's New Preview */}
        <motion.div
          className={`mt-16 p-6 glass-secondary rounded-2xl max-w-2xl mx-auto ${
            isDark 
              ? 'border border-blue-400/10 bg-slate-800/20' 
              : 'border border-blue-100/50 bg-white/20'
          }`}
          variants={itemVariants}
          whileHover={{ y: -2 }}
        >
          <p className={`text-sm font-medium mb-3 ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            🚀 Coming Soon
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-blue-500/10' : 'bg-blue-50'
            }`}>
              <span className="font-medium">AI Analytics</span>
            </div>
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-blue-500/10' : 'bg-blue-50'
            }`}>
              <span className="font-medium">Enhanced UI</span>
            </div>
            <div className={`p-3 rounded-lg ${
              isDark ? 'bg-blue-500/10' : 'bg-blue-50'
            }`}>
              <span className="font-medium">Performance Boost</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}