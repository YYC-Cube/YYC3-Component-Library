"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Lightbulb, Monitor, Users, ArrowRight, Target, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

interface ServicesSectionProps {
  navigate?: (page: string) => void;
}

export function ServicesSection({ navigate }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const { t, isRTL } = useLanguage();

  const services = [
    {
      icon: Lightbulb,
      title: t("services.1.title"),
      description: t("services.1.description"),
      features: [t("services.1.feature1"), t("services.1.feature2"), t("services.1.feature3")],
      color: "from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700/50",
      glowColor: "rgba(59, 130, 246, 0.15)",
      deliverables: t("services.1.deliverables"),
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Monitor,
      title: t("services.2.title"),
      description: t("services.2.description"),
      features: [t("services.2.feature1"), t("services.2.feature2"), t("services.2.feature3")],
      color: "from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/30",
      borderColor: "border-blue-300 dark:border-blue-600/50",
      glowColor: "rgba(59, 130, 246, 0.2)",
      deliverables: t("services.2.deliverables"),
      iconColor: "text-blue-700 dark:text-blue-300"
    },
    {
      icon: Users,
      title: t("services.3.title"),
      description: t("services.3.description"),
      features: [t("services.3.feature1"), t("services.3.feature2"), t("services.3.feature3")],
      color: "from-blue-200 to-blue-300 dark:from-blue-800/40 dark:to-blue-700/30",
      borderColor: "border-blue-400 dark:border-blue-500/50",
      glowColor: "rgba(59, 130, 246, 0.25)",
      deliverables: t("services.3.deliverables"),
      iconColor: "text-blue-800 dark:text-blue-200"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Reduced for faster animations
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 }, // Reduced movement
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6, // Faster animation
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const handleExploreServices = () => {
    if (navigate) {
      navigate('services');
    }
  };

  return (
    <section id="services" className="py-32 relative overflow-hidden bg-background transition-colors duration-300">
      {/* Enhanced background elements with dark mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/20 transition-colors duration-300" />
      
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div 
          className={`text-center mb-20 ${isRTL ? 'rtl' : ''}`}
          initial={{ opacity: 0, y: 20 }} // Reduced movement
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }} // Faster animation
        >
          <motion.div
            className={`scale-on-hover inline-flex items-center gap-2 glass-secondary rounded-full px-4 py-2 mb-8 border border-blue-200 dark:border-blue-600/50 cursor-pointer transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">{t("services.badge")}</span>
          </motion.div>

          <h2 className={`text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}>
            {t("services.title")}{" "}
            <span className="gradient-text-blue font-bold">
              {t("services.subtitle")}
            </span>
          </h2>
          <div className={`text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light transition-colors duration-300 ${isRTL ? 'text-right' : ''}`}>
            {t("services.description")}
          </div>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              onHoverStart={() => {
                setHoveredCard(index);
                setHoveredElement(`card-${index}`);
              }}
              onHoverEnd={() => {
                setHoveredCard(null);
                setHoveredElement(null);
              }}
              className="group relative h-full"
            >
              {/* Enhanced card with dust particles and dark mode */}
              <div className={`dust-container card-hover-scale glass-heavy rounded-3xl p-8 h-full relative overflow-hidden bg-gradient-to-br ${service.color} border-2 ${service.borderColor} transition-all duration-300`}>
                {/* Dust Particles - Premium hover effect */}
                <div className="dust-particle dust-particle-1 dust-particle-blue" />
                <div className="dust-particle dust-particle-2 dust-particle-light" />
                <div className="dust-particle dust-particle-3 dust-particle-white" />

                {/* Enhanced floating particles with dark mode */}
                <div className={`absolute top-6 right-6 w-2 h-2 ${service.iconColor.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} rounded-full opacity-60 pulse-subtle`} />

                <div className={`relative z-10 ${isRTL ? 'text-right' : ''}`}>
                  {/* Enhanced Icon with dark mode support */}
                  <div className="button-hover w-16 h-16 glass rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden border border-blue-200 dark:border-blue-600/50 cursor-pointer transition-all duration-300">
                    <motion.div
                      animate={hoveredElement === `card-${index}` ? {} : (hoveredCard === index ? { rotate: 360 } : { rotate: 0 })}
                      transition={hoveredElement === `card-${index}` ? {} : { duration: 0.8 }}
                    >
                      <service.icon className={`w-8 h-8 ${service.iconColor} transition-colors duration-300`} />
                    </motion.div>

                    {/* Enhanced ripple effect with dark mode */}
                    {hoveredCard === index && (
                      <div className={`absolute inset-0 rounded-2xl border-2 ${service.iconColor.replace('text-', 'border-').replace('dark:text-', 'dark:border-')} opacity-30 animate-ping`} />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <div className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed transition-colors duration-300">
                    {service.description}
                  </div>

                  {/* Features with dark mode */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className={`flex items-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isRTL ? 10 : -10 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + featureIndex * 0.1 + 0.8 }}
                      >
                        <div className={`scale-on-hover w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-400 dark:bg-blue-500 cursor-pointer transition-colors duration-300 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Deliverables with dark mode */}
                  <div className={`card-hover glass-secondary rounded-xl p-4 border border-blue-200 dark:border-blue-600/50 transition-all duration-300 ${hoveredCard === index ? 'opacity-100' : 'opacity-90'}`}>
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 transition-colors duration-300" />
                      <div className={isRTL ? 'text-right' : ''}>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors duration-300">You get:</div>
                        <div className="text-sm text-slate-700 dark:text-slate-300 font-medium transition-colors duration-300">{service.deliverables}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section with dark mode */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 15 }} // Reduced movement
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, delay: 0.8 }} // Faster animation
        >
          <div className="scale-on-hover cursor-pointer">
            <Button 
              size="lg" 
              className="button-hover gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl group border-0 shadow-lg relative overflow-hidden transition-all duration-300"
              onClick={handleExploreServices}
            >
              <span className={`relative z-10 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t("services.cta")}
                <motion.div
                  animate={{ x: isRTL ? [-4, 0, -4] : [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.div>
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}