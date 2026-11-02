"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useLanguage, languages, Language } from "./LanguageProvider";
import { useDarkMode } from "./DarkModeProvider";

export function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isDark } = useDarkMode();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  const currentLanguage = languages[language];

  // Custom language order: English & Indonesian highlighted first, then Chinese, Batak, Javanese, others
  const languageOrder: Language[] = [
    'en',   // English - highlighted
    'id',   // Indonesian - highlighted
    'zh',   // Chinese
    'bbc',  // Batak
    'jv',   // Javanese
    'hi',   // Hindi
    'es',   // Spanish
    'fr',   // French
    'ar',   // Arabic
    'bn',   // Bengali
    'pt',   // Portuguese
    'ru',   // Russian
    'ur',   // Urdu
    'gaul', // Bahasa Gaul
  ];

  // Priority languages for highlighting
  const priorityLanguages = ['en', 'id'];

  return (
    <div className="relative">
      {/* Main Toggle Button - IDENTICAL to Search/Menu buttons */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative p-2 w-10 h-10 rounded-xl border-2 transition-all duration-300
            ${isDark 
              ? 'border-blue-400/30 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-xl' 
              : 'border-blue-200/50 bg-white/50 hover:bg-blue-50/50 backdrop-blur-xl'
            }
            shadow-lg hover:shadow-xl
          `}
        >
          {/* Country Code - positioned like icon */}
          <span className={`text-xs font-medium ${
            isDark ? 'text-blue-300' : 'text-blue-600'
          }`}>
            {currentLanguage.code}
          </span>
          
          {/* Subtle glow effect - IDENTICAL to Search/Menu */}
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
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className={`absolute top-full mt-2 z-50 w-[280px] max-w-[90vw] ${
                isRTL ? 'left-0' : 'right-0'
              }`}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className={`glass-heavy rounded-2xl p-2 shadow-2xl border overflow-hidden ${
                isDark
                  ? 'border-blue-400/20 bg-slate-800/90'
                  : 'border-blue-200/50 bg-white/90'
              } backdrop-blur-xl`}>
                
                {/* Header */}
                <div className={`px-3 py-2 border-b ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/30'
                } mb-2`}>
                  <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm font-semibold ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {t("common.selectLanguage")}
                    </span>
                  </div>
                </div>

                {/* Language List */}
                <div className="max-h-80 overflow-y-auto overflow-x-hidden language-scrollbar">
                  <div className="grid grid-cols-1 gap-1">
                    {languageOrder.map((langCode, index) => {
                      const langInfo = languages[langCode];
                      const isSelected = language === langCode;
                      const isPriority = priorityLanguages.includes(langCode);
                      const showSeparator = index === 2; // After Indonesian (index 1), show separator before Chinese (index 2)
                      
                      return (
                        <div key={langCode}>
                          {/* Separator after priority languages */}
                          {showSeparator && (
                            <div className={`mx-3 my-2 border-t ${
                              isDark ? 'border-blue-400/20' : 'border-blue-200/30'
                            }`} />
                          )}
                          
                          <motion.button
                            onClick={() => handleLanguageChange(langCode as Language)}
                            className={`relative w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                              isSelected
                                ? isDark
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                                : isPriority
                                  ? isDark
                                    ? 'hover:bg-blue-500/10 text-blue-200 hover:text-blue-100 bg-blue-500/5'
                                    : 'hover:bg-blue-50 text-blue-800 hover:text-blue-900 bg-blue-25'
                                  : isDark
                                    ? 'hover:bg-slate-700/50 text-slate-300 hover:text-blue-300'
                                    : 'hover:bg-blue-25 text-slate-700 hover:text-blue-600'
                            } ${isRTL ? 'text-right' : ''}`}
                            whileHover={{ x: isRTL ? -2 : 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Background Animation */}
                            {isSelected && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl"
                                layoutId="selectedLanguage"
                                transition={{ duration: 0.2 }}
                              />
                            )}

                            {/* Priority Language Glow Effect */}
                            {isPriority && !isSelected && (
                              <motion.div
                                className={`absolute inset-0 rounded-xl ${
                                  isDark
                                    ? 'bg-gradient-to-r from-blue-500/5 to-blue-400/5'
                                    : 'bg-gradient-to-r from-blue-100/30 to-blue-50/30'
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              />
                            )}

                            {/* Content */}
                            <div className={`relative z-10 flex items-center justify-between ${
                              isRTL ? 'flex-row-reverse' : ''
                            }`}>
                              {/* Flag and Language Name */}
                              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-lg leading-none">
                                  {langInfo.flag}
                                </span>
                                <span className={`text-sm flex-1 truncate ${
                                  isPriority ? 'font-semibold' : 'font-medium'
                                } ${isRTL ? 'text-right' : ''}`}>
                                  {langInfo.name}
                                </span>
                                
                                {/* Priority Badge */}
                                {isPriority && (
                                  <motion.div
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      isDark
                                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                                    } font-medium`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    {langCode === 'en' ? 'Primary' : 'Local'}
                                  </motion.div>
                                )}
                              </div>

                              {/* Right side indicators */}
                              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {/* RTL Indicator */}
                                {langInfo.rtl && (
                                  <motion.div
                                    className={`text-xs px-1.5 py-0.5 rounded-md ${
                                      isDark
                                        ? 'bg-orange-500/20 text-orange-300'
                                        : 'bg-orange-100 text-orange-600'
                                    } font-medium`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    RTL
                                  </motion.div>
                                )}

                                {/* Selection Indicator */}
                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      className="w-2 h-2 rounded-full bg-blue-500"
                                    />
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className={`px-3 py-2 border-t ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/30'
                } mt-2`}>
                  <div className={`text-xs opacity-60 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  } ${isRTL ? 'text-right' : ''}`}>
                    14 {t("common.languagesSupported")}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}