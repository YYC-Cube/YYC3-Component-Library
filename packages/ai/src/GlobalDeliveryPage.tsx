"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Globe, TrendingUp, Zap, Target, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Monitor, Users,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, MapPin, Building,
  Compass, Anchor, Ship, Shield, Timer
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface GlobalDeliveryPageProps {
  navigate?: (page: any) => void;
}

export function GlobalDeliveryPage({ navigate }: GlobalDeliveryPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Global Delivery Statistics
  const deliveryStats = [
    {
      title: "Global Coverage",
      value: "24/7",
      description: "Follow-the-sun delivery model",
      icon: Globe,
      growth: "100% uptime"
    },
    {
      title: "Time Zones",
      value: "15+",
      description: "Global delivery centers",
      icon: Clock,
      growth: "Continuous coverage"
    },
    {
      title: "Languages",
      value: "25+",
      description: "Native language support",
      icon: Users,
      growth: "Local expertise"
    },
    {
      title: "Delivery Quality",
      value: "99.5%",
      description: "On-time delivery rate",
      icon: Target,
      growth: "World-class SLA"
    }
  ];

  // Global Delivery Centers
  const deliveryCenters = [
    {
      region: "Asia-Pacific Headquarters",
      location: "Singapore",
      timezone: "SGT (UTC+8)",
      coverage: "APAC, Middle East, Europe",
      specialization: "Innovation & Strategy",
      icon: Building,
      capabilities: [
        "Regional strategy coordination",
        "Innovation lab & R&D",
        "Financial services expertise",
        "Smart city solutions"
      ],
      team: "200+ specialists",
      languages: ["English", "Mandarin", "Japanese", "Korean", "Hindi"]
    },
    {
      region: "Southeast Asia Hub",
      location: "Jakarta, Kuala Lumpur, Bangkok",
      timezone: "WIB/MYT/ICT (UTC+7/+8)",
      coverage: "ASEAN Region",
      specialization: "Digital Transformation",
      icon: Network,
      capabilities: [
        "Government digitization",
        "E-commerce platforms",
        "Manufacturing 4.0",
        "Healthcare technology"
      ],
      team: "500+ specialists",
      languages: ["Bahasa Indonesia", "Bahasa Malaysia", "Thai", "Vietnamese", "English"]
    },
    {
      region: "South Asia Center",
      location: "Mumbai, Bangalore",
      timezone: "IST (UTC+5:30)",
      coverage: "India, South Asia, Australia",
      specialization: "Scale & Technology",
      icon: Database,
      capabilities: [
        "Large-scale implementations",
        "Technology development",
        "Data analytics & AI",
        "Mobile-first solutions"
      ],
      team: "1000+ specialists",
      languages: ["Hindi", "English", "Tamil", "Bengali", "Marathi"]
    },
    {
      region: "Oceania Operations",
      location: "Sydney, Melbourne",
      timezone: "AEST (UTC+10)",
      coverage: "Australia, New Zealand, Pacific",
      specialization: "Sustainable Technology",
      icon: Anchor,
      capabilities: [
        "Sustainable technology",
        "Mining & resources tech",
        "Financial services",
        "Government solutions"
      ],
      team: "150+ specialists",
      languages: ["English", "Mandarin", "Pacific languages"]
    }
  ];

  // Global Delivery Framework
  const deliveryFramework = [
    {
      step: "01",
      title: "Global Planning",
      description: "Comprehensive project planning with global resource allocation and timeline optimization",
      icon: Brain,
      activities: [
        "Global resource planning",
        "Timeline optimization",
        "Risk assessment",
        "Quality framework setup"
      ]
    },
    {
      step: "02",
      title: "Distributed Execution",
      description: "Follow-the-sun delivery model with seamless handoffs and continuous progress",
      icon: Globe,
      activities: [
        "Follow-the-sun coordination",
        "Seamless handoffs",
        "Continuous progress tracking",
        "Quality gate validation"
      ]
    },
    {
      step: "03",
      title: "Quality Assurance",
      description: "Multi-layer quality assurance with global standards and local compliance",
      icon: Shield,
      activities: [
        "Multi-layer QA processes",
        "Global standard compliance",
        "Local regulation adherence",
        "Continuous quality monitoring"
      ]
    },
    {
      step: "04",
      title: "Continuous Optimization",
      description: "Performance monitoring and continuous improvement with global best practices",
      icon: TrendingUp,
      activities: [
        "Performance monitoring",
        "Global best practice sharing",
        "Continuous improvement",
        "Knowledge management"
      ]
    }
  ];

  // Global Delivery Capabilities
  const deliveryCapabilities = [
    {
      title: "Follow-the-Sun Delivery",
      description: "24/7 continuous delivery model ensuring projects never stop progressing with seamless global handoffs",
      icon: Clock,
      category: "Continuous",
      benefits: [
        "24/7 project progression",
        "Faster time-to-market",
        "Seamless global handoffs",
        "Maximum resource utilization"
      ],
      coverage: "Global",
      sla: "99.5% uptime"
    },
    {
      title: "Multi-Shore Delivery Model",
      description: "Optimized delivery model combining onshore, nearshore, and offshore resources for cost and quality balance",
      icon: Network,
      category: "Distributed",
      benefits: [
        "Cost optimization",
        "Risk mitigation",
        "Local market expertise",
        "Cultural alignment"
      ],
      coverage: "15+ locations",
      sla: "97% on-time delivery"
    },
    {
      title: "Global Quality Standards",
      description: "Unified quality management system ensuring consistent delivery standards across all global locations",
      icon: Shield,
      category: "Quality",
      benefits: [
        "Consistent quality standards",
        "Global compliance",
        "Risk mitigation",
        "Predictable outcomes"
      ],
      coverage: "ISO 27001 certified",
      sla: "99% quality compliance"
    },
    {
      title: "Cultural Intelligence",
      description: "Deep cultural understanding and local expertise ensuring solutions that resonate with local markets",
      icon: Users,
      category: "Cultural",
      benefits: [
        "Cultural adaptation",
        "Local market fit",
        "Native language support",
        "Regional compliance"
      ],
      coverage: "25+ languages",
      sla: "100% cultural compliance"
    },
    {
      title: "Global Project Management",
      description: "Unified project management methodology with global visibility and standardized processes",
      icon: Monitor,
      category: "Management",
      benefits: [
        "Global visibility",
        "Standardized processes",
        "Real-time tracking",
        "Predictive analytics"
      ],
      coverage: "Enterprise PMO",
      sla: "95% on-budget delivery"
    },
    {
      title: "Knowledge Management",
      description: "Global knowledge sharing platform ensuring best practices and lessons learned are shared worldwide",
      icon: Brain,
      category: "Knowledge",
      benefits: [
        "Global best practices",
        "Accelerated learning",
        "Reduced risk",
        "Innovation sharing"
      ],
      coverage: "Global knowledge base",
      sla: "100% knowledge capture"
    }
  ];

  // Global Success Stories
  const globalSuccessStories = [
    {
      client: "Multinational Bank",
      scope: "Global Implementation",
      challenge: "Digital banking platform deployment across 12 countries in APAC within 18 months",
      solution: "Follow-the-sun delivery model with synchronized global rollout and local customization",
      results: ["12-country deployment", "18-month timeline achieved", "99.8% uptime during rollout"],
      regions: ["Singapore", "Hong Kong", "India", "Australia", "Japan", "Indonesia"],
      timeline: "18 months",
      team: "500+ global specialists"
    },
    {
      client: "Global Technology Company",
      scope: "Worldwide Platform",
      challenge: "Enterprise software platform serving 100M+ users across 20 time zones",
      solution: "Multi-shore delivery with 24/7 support and continuous deployment capabilities",
      results: ["100M+ users supported", "99.9% platform availability", "50% faster feature delivery"],
      regions: ["Singapore", "India", "Australia", "Japan"],
      timeline: "24 months",
      team: "800+ global specialists"
    },
    {
      client: "International Retailer",
      scope: "Global E-commerce",
      challenge: "Unified e-commerce platform for 15 countries with local payment and logistics integration",
      solution: "Global delivery model with local expertise and cultural adaptation for each market",
      results: ["15-country platform", "300% sales increase", "95% customer satisfaction"],
      regions: ["All APAC delivery centers"],
      timeline: "30 months",
      team: "400+ global specialists"
    }
  ];

  // Global Benefits
  const globalBenefits = [
    {
      title: "Time Zone Coverage",
      value: "24/7",
      description: "Follow-the-sun delivery",
      icon: Clock
    },
    {
      title: "Quality Delivery",
      value: "99.5%",
      description: "On-time delivery rate",
      icon: Target
    },
    {
      title: "Global Team",
      value: "2000+",
      description: "Worldwide specialists",
      icon: Users
    },
    {
      title: "Cost Efficiency",
      value: "40%",
      description: "Average cost optimization",
      icon: TrendingUp
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30"
            style={{ y: heroY, opacity: heroOpacity }}
          />
          
          {/* Global delivery themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Globe, Clock, Network, Shield, Monitor, Users];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + (i % 5) * 18}%`,
                    top: `${15 + Math.floor(i / 5) * 25}%`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                >
                  <IconComponent className="w-12 h-12 text-blue-500" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Global Delivery Excellence
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Global <span className="gradient-text-blue">Delivery</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                World-class global delivery capabilities with 24/7 follow-the-sun model. 
                Delivering digital transformation projects across 15+ countries with consistent quality and cultural intelligence.
              </motion.p>
            </div>

            {/* Delivery Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {deliveryStats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {stat.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-2`}>
                    {stat.description}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.growth}
                  </Badge>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('demo-request')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Start Global Project
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => {
                  const element = document.getElementById('delivery-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Delivery Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('project-management')}
              >
                Project Management
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Delivery Framework Section */}
      <section id="delivery-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Global Delivery <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase global delivery approach that ensures consistent quality, 
              optimal resource utilization, and successful project outcomes across all time zones.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {deliveryFramework.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg-blue flex items-center justify-center`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  {step.step}
                </div>
                
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>
                
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.activities.map((activity, activityIndex) => (
                    <li key={activityIndex} className={`text-sm ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      • {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Centers Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Global <span className="gradient-text-blue">Delivery Centers</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Strategically located delivery centers providing 24/7 coverage with specialized expertise 
              and deep local market understanding for optimal project outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deliveryCenters.map((center, index) => (
              <motion.div
                key={center.region}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <center.icon className="w-12 h-12 text-blue-500" />
                    <div>
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {center.region}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {center.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Timezone: {center.timezone}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Coverage: {center.coverage}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Specialization: {center.specialization}
                      </h4>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {center.team}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Core Capabilities:
                    </h4>
                    <ul className="space-y-1">
                      {center.capabilities.map((capability, capIndex) => (
                        <li key={capIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Languages:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {center.languages.slice(0, 3).map((language, langIndex) => (
                        <Badge key={langIndex} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                      {center.languages.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{center.languages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full gradient-bg-blue text-white rounded-xl"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      Contact Center
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Capabilities Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Global <span className="gradient-text-blue">Delivery Capabilities</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive global delivery capabilities designed to ensure consistent quality, 
              optimal resource utilization, and successful outcomes across all projects worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deliveryCapabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                      <capability.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{capability.category}</Badge>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {capability.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    {capability.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Key Benefits:
                    </h4>
                    <ul className="space-y-1">
                      {capability.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <h4 className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Coverage:
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {capability.coverage}
                      </p>
                    </div>
                    <div>
                      <h4 className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        SLA:
                      </h4>
                      <p className={`text-sm font-medium gradient-text-blue`}>
                        {capability.sla}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Global <span className="gradient-text-blue">Success Stories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Proven track record of successful global deliveries with measurable impact 
              and world-class execution across diverse industries and geographies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {globalSuccessStories.map((story, index) => (
              <motion.div
                key={story.client}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{story.scope}</Badge>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.timeline}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {story.client}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                    <Users className="w-4 h-4 inline mr-1" />
                    {story.team}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Challenge:
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.challenge}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Solution:
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Results:
                    </h4>
                    <ul className="space-y-1">
                      {story.results.map((result, resultIndex) => (
                        <li key={resultIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Delivery Centers:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {story.regions.slice(0, 3).map((region, regionIndex) => (
                        <Badge key={regionIndex} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                      {story.regions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{story.regions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background transition-colors duration-300">
        {/* Background with glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 transition-colors duration-300" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 dark:opacity-10 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden border-2 border-blue-300 dark:border-blue-600/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-3xl transition-colors duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-8 shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready for World-Class Global Delivery?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Experience 24/7 follow-the-sun delivery with 99.5% on-time delivery rate and 2000+ global specialists supporting your project success.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Global Project
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Contact Global Team
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">24/7 Coverage</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Follow-the-sun delivery model</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Quality</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">99.5% on-time delivery rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}