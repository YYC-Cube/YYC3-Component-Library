"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { Button } from "./ui/button";
import { useState } from "react";

export function DarkModeToggle() {
  const { theme, setTheme, isDark } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      {/* Main Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          className={`
            relative p-2 w-10 h-10 rounded-xl border-2 transition-all duration-300
            ${isDark 
              ? 'border-blue-400/30 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl' 
              : 'border-blue-200/50 bg-white/50 hover:bg-blue-50/50 backdrop-blur-xl'
            }
            shadow-lg hover:shadow-xl
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <CurrentIcon 
              className={`w-4 h-4 ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`} 
            />
          </motion.div>

          {/* Subtle glow effect */}
          <motion.div
            className={`
              absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
              ${isDark 
                ? 'bg-blue-400/10 shadow-blue-400/20' 
                : 'bg-blue-500/10 shadow-blue-500/20'
              }
            `}
            whileHover={{ opacity: 1 }}
          />
        </Button>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute top-12 right-0 z-50 min-w-[140px]
                ${isDark 
                  ? 'bg-slate-800/95 border-slate-600/50' 
                  : 'bg-white/95 border-blue-200/50'
                }
                border-2 rounded-2xl shadow-2xl backdrop-blur-xl
                p-2 space-y-1
              `}
            >
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.value;
                
                return (
                  <motion.button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                      text-sm font-medium transition-all duration-200
                      ${isSelected
                        ? isDark
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                          : 'bg-blue-500/10 text-blue-700 border border-blue-300/30'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          : 'text-slate-600 hover:bg-blue-50/50 hover:text-slate-900'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      animate={isSelected ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.div>
                    <span>{themeOption.label}</span>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                          ml-auto w-2 h-2 rounded-full
                          ${isDark ? 'bg-blue-400' : 'bg-blue-600'}
                        `}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simplified version for mobile or when you want just toggle between light/dark
export function SimpleDarkModeToggle() {
  const { isDark, setTheme } = useDarkMode();

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <motion.button
      onClick={handleToggle}
      className={`
        relative p-2 w-10 h-10 rounded-xl border-2 transition-all duration-300
        ${isDark 
          ? 'border-blue-400/30 bg-slate-800/50 hover:bg-slate-700/50' 
          : 'border-blue-200/50 bg-white/50 hover:bg-blue-50/50'
        }
        backdrop-blur-xl shadow-lg hover:shadow-xl
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 text-blue-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 text-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle glow effect */}
      <motion.div
        className={`
          absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300
          ${isDark 
            ? 'bg-blue-400/10 shadow-blue-400/20' 
            : 'bg-blue-500/10 shadow-blue-500/20'
          }
        `}
        whileHover={{ opacity: 1 }}
      />
    </motion.button>
  );
}