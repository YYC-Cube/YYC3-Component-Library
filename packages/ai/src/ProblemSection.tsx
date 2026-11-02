"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { X, Clock, DollarSign, Users, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const problems = [
    {
      icon: Clock,
      text: t("problem.1.text"),
      stat: t("problem.1.stat"),
      label: t("problem.1.label"),
      color: "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20",
      borderColor: "border-red-200 dark:border-red-700/50",
      iconColor: "text-red-600 dark:text-red-400",
      statColor: "text-red-700 dark:text-red-300"
    },
    {
      icon: Users,
      text: t("problem.2.text"),
      stat: t("problem.2.stat"),
      label: t("problem.2.label"),
      color: "from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-700/50",
      iconColor: "text-orange-600 dark:text-orange-400",
      statColor: "text-orange-700 dark:text-orange-300"
    },
    {
      icon: DollarSign,
      text: t("problem.3.text"),
      stat: t("problem.3.stat"),
      label: t("problem.3.label"),
      color: "from-red-50 to-pink-100 dark:from-red-950/30 dark:to-pink-900/20",
      borderColor: "border-red-200 dark:border-red-700/50",
      iconColor: "text-red-600 dark:text-red-400",
      statColor: "text-red-700 dark:text-red-300"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Reduced stagger for faster animations
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 }, // Reduced movement
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5, // Faster animation
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className="py-32 relative overflow-hidden bg-background transition-colors duration-300">
      {/* Enhanced background elements with dark mode support */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-50/15 to-transparent dark:via-red-950/10 transition-colors duration-300" />
      
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className={`inline-flex items-center gap-2 glass-secondary rounded-full px-4 py-2 mb-8 border border-red-200/50 dark:border-red-700/30 transition-colors duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
            variants={cardVariants}
          >
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">{t("problem.badge")}</span>
          </motion.div>

          <motion.h2 
            className={`text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}
            variants={cardVariants}
          >
            {t("problem.title.line1")}{" "}
            <span className="relative">
              <span className="text-red-600 dark:text-red-400 font-bold transition-colors duration-300">
                {t("problem.title.slow")}
              </span>
              <motion.div
                className={`absolute -bottom-2 ${isRTL ? 'right-0' : 'left-0'} w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 rounded-full`}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
            <br />
            {t("problem.title.line2")}{" "}
            <span className="relative">
              <span className="text-orange-600 dark:text-orange-400 font-bold transition-colors duration-300">
                {t("problem.title.talk")}
              </span>
              <motion.div
                className={`absolute -bottom-2 ${isRTL ? 'right-0' : 'left-0'} w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400 rounded-full`}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h2>
        </motion.div>
        
        {/* Problem Cards - Enhanced with dark mode */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={cardVariants}
            >
              {/* Enhanced card with proper dark mode styling */}
              <div className={`card-hover glass-heavy rounded-3xl p-8 h-full relative overflow-hidden bg-gradient-to-br ${problem.color} border-2 ${problem.borderColor} transition-all duration-300`}>
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-2 glass-secondary rounded-xl border border-red-200/50 dark:border-red-700/30 transition-colors duration-300">
                      <X className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="p-2 glass-secondary rounded-xl border border-slate-200 dark:border-slate-600 transition-colors duration-300">
                      <problem.icon className={`w-5 h-5 ${problem.iconColor} transition-colors duration-300`} />
                    </div>
                  </div>
                  
                  <div className={`text-slate-700 dark:text-slate-300 mb-6 leading-relaxed font-medium transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}>
                    {problem.text}
                  </div>
                  
                  <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
                    <div className={`text-3xl font-bold ${problem.statColor} transition-colors duration-300`}>
                      {problem.stat}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{problem.label}</div>
                  </div>
                </div>

                {/* Enhanced floating element with dark mode */}
                <div className={`absolute top-4 right-4 w-2 h-2 ${problem.iconColor.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} rounded-full opacity-60 pulse-subtle`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Solution Card - Enhanced with comprehensive dark mode */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card-hover-scale glass-heavy rounded-3xl p-12 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-700/50 transition-all duration-300">
            {/* Enhanced floating orb with dark mode */}
            <div className="absolute top-8 right-8 w-20 h-20 rounded-full opacity-15 dark:opacity-10 bg-blue-400/20 dark:bg-blue-400/30 blur-xl" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 glass-secondary rounded-2xl mb-8 border border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className={`text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}>
                {t("problem.solution.title")}
              </h3>
              
              <div className={`text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}>
                {t("problem.solution.description")}{" "}
                <span className="gradient-text-blue font-semibold">
                  {t("problem.solution.highlight")}
                </span>
              </div>

              <div className={`scale-on-hover inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 border border-blue-200 dark:border-blue-600/50 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 cursor-pointer transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold transition-colors duration-300">{t("problem.solution.timeline")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}