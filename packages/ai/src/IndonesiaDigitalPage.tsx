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
  Layers, Network, Workflow, Cog, Cpu, MapPin, Flag
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface IndonesiaDigitalPageProps {
  navigate?: (page: any) => void;
}

export function IndonesiaDigitalPage({ navigate }: IndonesiaDigitalPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Indonesia Digital Market Statistics
  const marketStats = [
    {
      title: "Digital Economy Size",
      value: "$70B",
      description: "By 2025 projection",
      icon: TrendingUp,
      growth: "+25% YoY"
    },
    {
      title: "Internet Users",
      value: "196M",
      description: "73% penetration rate",
      icon: Globe,
      growth: "+8% YoY"
    },
    {
      title: "E-commerce Growth",
      value: "52%",
      description: "Annual growth rate",
      icon: BarChart3,
      growth: "Leading ASEAN"
    },
    {
      title: "Smartphone Users",
      value: "89%",
      description: "Mobile-first population",
      icon: Smartphone,
      growth: "+12% YoY"
    }
  ];

  // Digital Transformation Sectors in Indonesia
  const transformationSectors = [
    {
      title: "Banking & Financial Services",
      description: "Leading digital banking transformation with mobile payments, digital lending, and fintech innovation across Indonesia's diverse archipelago.",
      icon: Database,
      priority: "Critical",
      projects: [
        "Digital banking platform implementation",
        "Mobile payment system integration",
        "Regulatory compliance automation",
        "Customer onboarding digitization"
      ],
      benefits: [
        "99% uptime achievement",
        "60% cost reduction",
        "5x faster customer onboarding",
        "100% regulatory compliance"
      ],
      timeline: "6-12 months"
    },
    {
      title: "E-commerce & Retail",
      description: "Comprehensive e-commerce solutions supporting Indonesia's rapidly growing online retail market and omnichannel strategies.",
      icon: Users,
      priority: "High",
      projects: [
        "Omnichannel platform development",
        "Supply chain digitization",
        "Customer analytics implementation",
        "Mobile-first shopping experiences"
      ],
      benefits: [
        "300% online sales increase",
        "50% operational efficiency",
        "Real-time inventory management",
        "Personalized customer experiences"
      ],
      timeline: "4-8 months"
    },
    {
      title: "Manufacturing & Industry 4.0",
      description: "Smart manufacturing solutions for Indonesia's industrial sector, including IoT integration, predictive maintenance, and supply chain optimization.",
      icon: Workflow,
      priority: "High",
      projects: [
        "Smart factory implementation",
        "IoT sensor integration",
        "Predictive maintenance systems",
        "Supply chain optimization"
      ],
      benefits: [
        "40% productivity increase",
        "70% maintenance cost reduction",
        "Real-time production monitoring",
        "Quality improvement automation"
      ],
      timeline: "8-16 months"
    },
    {
      title: "Healthcare & Telemedicine",
      description: "Digital healthcare solutions addressing Indonesia's healthcare accessibility challenges through telemedicine and health tech innovations.",
      icon: Activity,
      priority: "Critical",
      projects: [
        "Telemedicine platform development",
        "Electronic health records",
        "Hospital management systems",
        "Health monitoring applications"
      ],
      benefits: [
        "Remote healthcare access",
        "50% appointment efficiency",
        "Integrated patient records",
        "24/7 health monitoring"
      ],
      timeline: "6-10 months"
    }
  ];

  // Indonesia Digital Framework
  const indonesiaFramework = [
    {
      step: "01",
      title: "Local Market Analysis",
      description: "Deep understanding of Indonesian market dynamics, regulations, and cultural considerations",
      icon: Search,
      activities: [
        "Market research & analysis",
        "Regulatory compliance review",
        "Cultural adaptation planning",
        "Local partnership identification"
      ]
    },
    {
      step: "02",
      title: "Localized Solution Design",
      description: "Custom solution development adapted for Indonesian business environment and user behavior",
      icon: Settings,
      activities: [
        "Bahasa Indonesia localization",
        "Local payment integration",
        "Cultural UX adaptation",
        "Regulatory compliance design"
      ]
    },
    {
      step: "03",
      title: "Island-wide Implementation",
      description: "Phased rollout across Indonesia's diverse archipelago with local support and training",
      icon: MapPin,
      activities: [
        "Phased regional deployment",
        "Local team training",
        "Infrastructure optimization",
        "Performance monitoring"
      ]
    },
    {
      step: "04",
      title: "Continuous Optimization",
      description: "Ongoing support and optimization with local insights and market evolution adaptation",
      icon: TrendingUp,
      activities: [
        "Performance optimization",
        "Market trend adaptation",
        "Local support enhancement",
        "Strategic expansion planning"
      ]
    }
  ];

  // Indonesia Success Stories
  const successStories = [
    {
      client: "Bank Mandiri Digital",
      industry: "Banking",
      challenge: "Digital banking transformation for 25M+ customers",
      solution: "End-to-end digital banking platform with mobile-first approach",
      results: ["95% customer adoption", "70% operational efficiency", "300% transaction volume"],
      timeline: "18 months",
      location: "Jakarta & Nationwide"
    },
    {
      client: "Tokopedia Seller Platform",
      industry: "E-commerce",
      challenge: "Seller onboarding and management platform scaling",
      solution: "Comprehensive seller ecosystem with AI-powered recommendations",
      results: ["2M+ active sellers", "60% faster onboarding", "85% seller satisfaction"],
      timeline: "12 months",
      location: "Indonesia-wide"
    },
    {
      client: "Indofood Smart Factory",
      industry: "Manufacturing",
      challenge: "Industry 4.0 transformation for food production",
      solution: "IoT-enabled smart manufacturing with predictive analytics",
      results: ["45% efficiency increase", "80% waste reduction", "Real-time quality control"],
      timeline: "24 months",
      location: "Jakarta & Surabaya"
    }
  ];

  // Indonesia Regional Benefits
  const regionalBenefits = [
    {
      title: "Local Expertise",
      value: "100%",
      description: "Indonesian market understanding",
      icon: Flag
    },
    {
      title: "Project Success",
      value: "98%",
      description: "On-time delivery rate",
      icon: Target
    },
    {
      title: "Cost Efficiency",
      value: "45%",
      description: "Average cost reduction",
      icon: TrendingUp
    },
    {
      title: "Digital Adoption",
      value: "95%",
      description: "User adoption rate",
      icon: Users
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
          
          {/* Indonesian-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Globe, MapPin, Flag, Users, Database, Workflow];
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
              <Flag className="w-5 h-5 text-red-500" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Digital Transformation Indonesia
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
                Indonesia <span className="gradient-text-blue">Digital</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Leading digital transformation across Indonesia's diverse archipelago. 
                Empowering businesses from Jakarta to Papua with culturally-adapted solutions and local expertise.
              </motion.p>
            </div>

            {/* Market Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {marketStats.map((stat, index) => (
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
                  Mulai Transformasi Digital
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
                  const element = document.getElementById('indonesia-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Indonesia Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('southeast-asia')}
              >
                Regional Overview
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Indonesia Framework Section */}
      <section id="indonesia-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Indonesia <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A specialized 4-phase approach designed for Indonesia's unique market dynamics, 
              regulatory environment, and cultural considerations for successful digital transformation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {indonesiaFramework.map((step, index) => (
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

      {/* Transformation Sectors Section */}
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
              Key <span className="gradient-text-blue">Transformation Sectors</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Leading digital transformation across Indonesia's most critical industries 
              with sector-specific expertise and proven implementation methodologies.
            </p>
          </motion.div>

          <div className="space-y-8">
            {transformationSectors.map((sector, index) => (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sector Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <sector.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2" variant={sector.priority === 'Critical' ? 'destructive' : 'secondary'}>
                          {sector.priority}
                        </Badge>
                        <h3 className={`text-xl font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {sector.title}
                        </h3>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Timeline: {sector.timeline}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {sector.description}
                    </p>
                  </div>

                  {/* Key Projects */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Key Projects
                    </h4>
                    <ul className="space-y-2">
                      {sector.projects.map((project, projectIndex) => (
                        <li key={projectIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {sector.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col justify-center">
                    <Button
                      className="gradient-bg-blue text-white rounded-xl"
                      onClick={() => navigate('demo-request')}
                    >
                      <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        Konsultasi Gratis
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
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
              Indonesia <span className="gradient-text-blue">Success Stories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Proven track record of successful digital transformations across Indonesia's leading organizations 
              with measurable business impact and sustainable growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
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
                    <Badge variant="secondary">{story.industry}</Badge>
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
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {story.location}
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
                  <Flag className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Siap Memimpin Transformasi Digital di Indonesia?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Bergabunglah dengan 500+ perusahaan Indonesia yang telah berhasil bertransformasi digital dengan expertise lokal dan solusi yang terbukti.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Konsultasi Gratis Sekarang
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Hubungi Tim Indonesia
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Local Expertise</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Tim ahli dengan pemahaman mendalam pasar Indonesia</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Results</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">98% project success rate di Indonesia</p>
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