"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, Quote, ArrowRight, Building, TrendingUp } from "lucide-react";

export function CaseStudiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCase, setActiveCase] = useState(0);

  const caseStudies = [
    {
      client: "Asivest",
      industry: "Investment Education",
      challenge: "Manual content creation and investment analysis taking weeks",
      solution: "AI-powered educational content generator and market analysis system",
      result: "10x faster content creation, 85% more accurate market insights",
      testimonial: "Delibix transformed our educational content pipeline. What used to take our team weeks now happens in hours, and the AI insights are incredibly accurate.",
      author: "Sarah Chen",
      role: "Head of Education",
      metrics: [
        { label: "Content Speed", value: "10x" },
        { label: "Accuracy", value: "85%" },
        { label: "Growth", value: "300%" }
      ],
      color: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700/50",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      client: "Tupang",
      industry: "Living Sanctuary",
      challenge: "Complex resident service management and energy optimization",
      solution: "Smart sanctuary management with AI-driven energy optimization",
      result: "40% reduction in energy costs, 95% resident satisfaction",
      testimonial: "The AI system doesn't just manage our facilities - it creates a truly intelligent living environment. Our residents love the seamless experience.",
      author: "Michael Tan",
      role: "Operations Director", 
      metrics: [
        { label: "Energy Savings", value: "40%" },
        { label: "Satisfaction", value: "95%" },
        { label: "Response Time", value: "2min" }
      ],
      color: "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30",
      borderColor: "border-blue-300 dark:border-blue-600/50",
      glowColor: "rgba(59, 130, 246, 0.2)"
    },
    {
      client: "Delipix",
      industry: "Modern Farming",
      challenge: "Unpredictable crop yields and manual monitoring processes",
      solution: "AI crop monitoring and predictive yield optimization system",
      result: "35% increase in yield, 60% reduction in crop loss",
      testimonial: "Delibix's AI system revolutionized our farming operations. We can now predict and prevent issues before they happen, leading to our best harvests ever.",
      author: "Lisa Wang",
      role: "Farm Operations Manager",
      metrics: [
        { label: "Yield Increase", value: "+35%" },
        { label: "Crop Loss", value: "-60%" },
        { label: "Efficiency", value: "4x" }
      ],
      color: "from-blue-200 to-blue-300 dark:from-blue-800/40 dark:to-blue-700/30",
      borderColor: "border-blue-400 dark:border-blue-500/50",
      glowColor: "rgba(59, 130, 246, 0.25)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section id="work" className="py-32 relative overflow-hidden bg-background transition-colors duration-300">
      {/* Enhanced background with dark mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/20 transition-colors duration-300" />
      
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-secondary rounded-full px-4 py-2 mb-8 border border-blue-200 dark:border-blue-600/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">Case Studies</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight transition-colors duration-300">
            Real results from{" "}
            <span className="gradient-text-blue font-bold">
              real clients
            </span>
          </h2>
        </motion.div>

        {/* Case Studies Grid - Enhanced with comprehensive dark mode */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              onHoverStart={() => setActiveCase(index)}
              whileHover={{ 
                y: -10,
                scale: 1.02
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`glass-heavy rounded-3xl p-8 h-full relative overflow-hidden bg-gradient-to-br ${study.color} border-2 ${study.borderColor} transition-all duration-300`}
                whileHover={{
                  boxShadow: `0 30px 60px ${study.glowColor}`
                }}
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Header with dark mode */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{study.industry}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">{study.client}</h3>
                  </div>

                  {/* Challenge & Solution with dark mode */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">Challenge</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">{study.challenge}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium transition-colors duration-300">Solution</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">{study.solution}</div>
                    </div>
                  </div>

                  {/* Metrics with enhanced dark mode */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {study.metrics.map((metric, metricIndex) => (
                      <motion.div
                        key={metricIndex}
                        className="text-center p-3 glass-secondary rounded-xl border border-blue-200 dark:border-blue-600/50 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={activeCase === index ? { opacity: 1, scale: 1 } : { opacity: 0.9, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: metricIndex * 0.1 }}
                      >
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{metric.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{metric.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial with comprehensive dark mode */}
                  <motion.div
                    className="glass-secondary rounded-xl p-4 border border-blue-200 dark:border-blue-600/50 transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={activeCase === index ? { opacity: 1, y: 0 } : { opacity: 0.95, y: 0 }}
                  >
                    <Quote className="w-4 h-4 text-blue-400 dark:text-blue-300 mb-2 transition-colors duration-300" />
                    <div className="text-sm text-slate-700 dark:text-slate-300 mb-3 italic leading-relaxed transition-colors duration-300">
                      "{study.testimonial}"
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">{study.author}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">{study.role}</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Enhanced floating elements with dark mode */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full opacity-60 transition-colors duration-300"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section - Comprehensive dark mode enhancement */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-700/50 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 glass rounded-2xl mb-8 border border-blue-200 dark:border-blue-600/50 transition-all duration-300"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                whileHover={{ 
                  rotate: 0,
                  transition: { duration: 0.3 }
                }}
              >
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </motion.div>

              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                Average client results
              </h3>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {[
                  { label: "Efficiency Increase", value: "45%" },
                  { label: "Cost Reduction", value: "30%" },
                  { label: "Time to Market", value: "60% faster" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold gradient-text-blue mb-2">
                      {stat.value}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4 fill-current text-blue-500 dark:text-blue-400" />
                <span>Based on 20+ successful projects</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}