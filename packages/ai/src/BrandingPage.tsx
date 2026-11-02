"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";
import { useDarkMode } from "./DarkModeProvider";
import { 
  Palette,
  Download,
  Eye,
  Heart,
  Star,
  Brush,
  Sparkles,
  Target,
  Home,
  ArrowRight,
  Shield,
  Award,
  Zap,
  Layers,
  Grid,
  Type,
  Image as ImageIcon,
  Hash,
  Circle,
  Square,
  Triangle
} from "lucide-react";

interface BrandingPageProps {
  navigate: (page: any) => void;
}

export function BrandingPage({ navigate }: BrandingPageProps) {
  const { t, isRTL } = useLanguage();
  const { isDark } = useDarkMode();
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const brandColors = [
    { name: "Primary Blue", hex: "#2563eb", rgb: "37, 99, 235", usage: "Primary actions, links" },
    { name: "Secondary Blue", hex: "#3b82f6", rgb: "59, 130, 246", usage: "Secondary elements" },
    { name: "Light Blue", hex: "#60a5fa", rgb: "96, 165, 250", usage: "Backgrounds, hover states" },
    { name: "Dark Blue", hex: "#1d4ed8", rgb: "29, 78, 216", usage: "Headers, emphasis" },
    { name: "Success Green", hex: "#10b981", rgb: "16, 185, 129", usage: "Success states" },
    { name: "Warning Orange", hex: "#f59e0b", rgb: "245, 158, 11", usage: "Warnings, alerts" },
    { name: "Error Red", hex: "#ef4444", rgb: "239, 68, 68", usage: "Error states" },
    { name: "Neutral Gray", hex: "#64748b", rgb: "100, 116, 139", usage: "Text, borders" }
  ];

  const brandAssets = [
    {
      category: "Logos",
      icon: Circle,
      items: [
        { name: "Primary Logo (SVG)", format: "SVG", size: "Vector", usage: "Main brand identity" },
        { name: "Logo Mark Only", format: "SVG", size: "Vector", usage: "Social media, favicons" },
        { name: "Horizontal Logo", format: "SVG", size: "Vector", usage: "Headers, letterheads" },
        { name: "Monochrome Logo", format: "SVG", size: "Vector", usage: "Single color applications" }
      ]
    },
    {
      category: "Typography",
      icon: Type,
      items: [
        { name: "Inter Font Family", format: "WOFF2", size: "Variable", usage: "Primary interface font" },
        { name: "Noto Sans", format: "WOFF2", size: "Variable", usage: "Multi-language support" },
        { name: "Typography Guide", format: "PDF", size: "2.1 MB", usage: "Implementation guide" }
      ]
    },
    {
      category: "Icons & Graphics",
      icon: Grid,
      items: [
        { name: "Icon Set (100+ icons)", format: "SVG", size: "Vector", usage: "UI elements" },
        { name: "Illustrations Pack", format: "SVG", size: "Vector", usage: "Marketing materials" },
        { name: "Pattern Library", format: "SVG", size: "Vector", usage: "Backgrounds, textures" },
        { name: "Brand Photography", format: "JPG", size: "Hi-res", usage: "Marketing, social media" }
      ]
    }
  ];

  const brandPrinciples = [
    {
      icon: Target,
      title: "Purpose-Driven",
      description: "Every design decision serves our mission to democratize AI technology for Indonesian businesses.",
      color: "blue"
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "We design with empathy, putting user needs and experiences at the center of everything we create.",
      color: "red"
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "Our brand reflects cutting-edge technology while remaining approachable and trustworthy.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Trustworthy",
      description: "Professional, reliable, and secure - our brand builds confidence in AI solutions.",
      color: "green"
    },
    {
      icon: Zap,
      title: "Dynamic",
      description: "Energetic and forward-thinking, representing the transformative power of technology.",
      color: "orange"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Premium quality in every touchpoint, from code to customer experience.",
      color: "yellow"
    }
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden pt-32 pb-20 ${isRTL ? 'rtl' : ''}`}>
      
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/30' 
            : 'bg-gradient-to-br from-blue-50/30 via-background to-blue-100/20'
        }`} />
        
        {/* Floating Design Elements */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 dark:opacity-5"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-40 left-20 w-48 h-48 rounded-full opacity-8 dark:opacity-4"
              style={{
                background: "radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.08, 0.12, 0.08],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-20"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp}>
                <Badge 
                  variant="secondary" 
                  className={`mb-8 ${
                    isDark 
                      ? 'bg-blue-900/40 text-blue-300 border-blue-700/60' 
                      : 'bg-blue-100/80 text-blue-700 border-blue-300/60'
                  } px-4 py-2 font-medium rounded-full border backdrop-blur-sm shadow-sm`}
                >
                  Brand Identity
                </Badge>
              </motion.div>
              
              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Our brand represents
                <br />
                <span className={`${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  innovation and trust.
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Discover the visual identity, design principles, and brand assets that define 
                Delibix's mission to democratize AI technology across Indonesia.
              </motion.p>
            </motion.div>

            {/* Brand Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {[
                { value: "2022", label: "Brand Established", icon: Calendar },
                { value: "100+", label: "Brand Assets", icon: Layers },
                { value: "14", label: "Language Support", icon: Globe },
                { value: "∞", label: "Creative Possibilities", icon: Sparkles }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      isDark 
                        ? 'bg-slate-800/50 border border-slate-700/50' 
                        : 'bg-white/70 border border-slate-200/50'
                    } backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <stat.icon className={`w-7 h-7 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </motion.div>
                  
                  <div className={`text-2xl md:text-3xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {stat.value}
                  </div>
                  
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Brand Colors Section */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
              } px-4 py-2`}>
                <Palette className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Color Palette
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Colors That Define Us
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Our color palette reflects professionalism, innovation, and trustworthiness while 
                maintaining accessibility across all platforms.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {brandColors.map((color, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-6 hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div 
                      className="w-full h-20 rounded-xl mb-4 shadow-lg"
                      style={{ backgroundColor: color.hex }}
                    />
                    
                    <h3 className={`text-lg font-semibold mb-2 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {color.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className={`flex justify-between text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <span>HEX:</span>
                        <span className="font-mono">{color.hex}</span>
                      </div>
                      <div className={`flex justify-between text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <span>RGB:</span>
                        <span className="font-mono">{color.rgb}</span>
                      </div>
                    </div>
                    
                    <p className={`text-xs ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {color.usage}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Brand Principles Section */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
              } px-4 py-2`}>
                <Target className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Brand Principles
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                What Drives Our Design
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Six core principles guide every design decision we make, ensuring consistency 
                and authenticity across all brand touchpoints.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {brandPrinciples.map((principle, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-6 h-full hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      principle.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      principle.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                      principle.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      principle.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                      principle.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <principle.icon className={`w-6 h-6 ${
                        principle.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        principle.color === 'red' ? 'text-red-600 dark:text-red-400' :
                        principle.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        principle.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        principle.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                        'text-yellow-600 dark:text-yellow-400'
                      }`} />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-3 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {principle.title}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {principle.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Brand Assets Section */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
              } px-4 py-2`}>
                <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Brand Assets
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Download Our Brand Kit
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Access our complete collection of brand assets including logos, typography, 
                icons, and guidelines for proper brand implementation.
              </p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {brandAssets.map((category, categoryIndex) => (
                <motion.div key={categoryIndex} variants={fadeInUp}>
                  <Card className={`glass-heavy p-8 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      } ${isRTL ? 'text-right' : ''}`}>
                        {category.category}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          className={`p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                            isDark 
                              ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50' 
                              : 'bg-white/50 hover:bg-blue-50/50 border border-slate-200/50'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className={`flex items-center justify-between mb-2 ${
                            isRTL ? 'flex-row-reverse' : ''
                          }`}>
                            <h4 className={`font-medium text-sm ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {item.name}
                            </h4>
                            <Download className={`w-4 h-4 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                          </div>
                          
                          <div className={`flex justify-between text-xs mb-2 ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            <span>{item.format}</span>
                            <span>{item.size}</span>
                          </div>
                          
                          <p className={`text-xs ${
                            isDark ? 'text-slate-500' : 'text-slate-400'
                          } ${isRTL ? 'text-right' : ''}`}>
                            {item.usage}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action */}
          <section>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className={`glass-heavy p-12 lg:p-16 max-w-4xl mx-auto ${
                isDark 
                  ? 'border-blue-400/20 bg-slate-800/30' 
                  : 'border-blue-200/50 bg-white/30'
              }`}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Brush className="w-20 h-20 text-blue-500 mx-auto mb-8" />
                </motion.div>
                
                <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Need Our Brand Assets?
                </h3>
                
                <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                } ${isRTL ? 'text-right' : ''}`}>
                  Download our complete brand kit or contact us for custom branding solutions 
                  and partnership opportunities.
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}>
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg"
                    onClick={() => {
                      // Implement brand kit download
                      window.open('mailto:brand@delibix.com?subject=Brand Kit Request', '_blank');
                    }}
                  >
                    Download Brand Kit
                    <Download className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold px-8 py-6 text-lg"
                    onClick={() => navigate('contact')}
                  >
                    Contact Brand Team
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                  </Button>
                </div>
                
                <motion.div
                  className="mt-8 pt-8 border-t border-blue-200/30 dark:border-blue-700/30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className={`flex items-center justify-center gap-6 text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Usage Guidelines Included</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>High-Resolution Files</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Premium Quality</span>
                    </div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          </section>

          {/* Back to Home */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => navigate('home')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-blue-300 hover:bg-blue-400/10' 
                  : 'text-blue-600 hover:bg-blue-50'
              } rounded-xl font-medium`}
            >
              <Home className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Back to Home
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}