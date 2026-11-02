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
  Layers, Network, Workflow, Cog, Cpu, MapPin, Building
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface SoutheastAsiaPageProps {
  navigate?: (page: any) => void;
}

export function SoutheastAsiaPage({ navigate }: SoutheastAsiaPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // ASEAN Digital Economy Stats
  const aseanStats = [
    {
      title: "Digital Economy Value",
      value: "$295B",
      description: "By 2025 projection",
      icon: TrendingUp,
      growth: "+20% CAGR"
    },
    {
      title: "Internet Users",
      value: "460M",
      description: "75% penetration rate",
      icon: Globe,
      growth: "+8% YoY"
    },
    {
      title: "Mobile Commerce",
      value: "$85B",
      description: "Mobile transaction volume",
      icon: Smartphone,
      growth: "+35% YoY"
    },
    {
      title: "Digital Transformation",
      value: "68%",
      description: "Companies investing in DX",
      icon: Workflow,
      growth: "+15% YoY"
    }
  ];

  // ASEAN Countries Coverage
  const aseanCountries = [
    {
      country: "Indonesia",
      capital: "Jakarta",
      population: "276M",
      digitalEconomy: "$70B",
      flagship: "Digital banking & e-commerce transformation",
      icon: Building,
      projects: "150+ active projects",
      growth: "+25% YoY",
      focus: ["Financial services", "E-commerce", "Healthcare", "Manufacturing"]
    },
    {
      country: "Singapore",
      capital: "Singapore",
      population: "5.9M",
      digitalEconomy: "$26B",
      flagship: "Regional hub & smart city initiatives",
      icon: MapPin,
      projects: "80+ active projects",
      growth: "+18% YoY",
      focus: ["Fintech", "Smart city", "Logistics", "Healthcare"]
    },
    {
      country: "Thailand",
      capital: "Bangkok",
      population: "70M",
      digitalEconomy: "$30B",
      flagship: "Industry 4.0 & agricultural technology",
      icon: Workflow,
      projects: "90+ active projects",
      growth: "+22% YoY",
      focus: ["Agriculture tech", "Manufacturing", "Tourism", "Healthcare"]
    },
    {
      country: "Malaysia",
      capital: "Kuala Lumpur",
      population: "33M",
      digitalEconomy: "$22B",
      flagship: "Government digitization & smart cities",
      icon: Globe,
      projects: "70+ active projects",
      growth: "+20% YoY",
      focus: ["Government services", "Fintech", "E-commerce", "Education"]
    },
    {
      country: "Vietnam",
      capital: "Hanoi",
      population: "98M",
      digitalEconomy: "$29B",
      flagship: "Manufacturing digitization & fintech",
      icon: Database,
      projects: "110+ active projects",
      growth: "+30% YoY",
      focus: ["Manufacturing", "Fintech", "E-commerce", "Education"]
    },
    {
      country: "Philippines",
      capital: "Manila",
      population: "111M",
      digitalEconomy: "$25B",
      flagship: "Mobile-first solutions & remittances",
      icon: Smartphone,
      projects: "60+ active projects",
      growth: "+28% YoY",
      focus: ["Mobile banking", "Remittances", "E-commerce", "Healthcare"]
    }
  ];

  // Regional Digital Framework
  const regionalFramework = [
    {
      step: "01",
      title: "Regional Analysis",
      description: "Comprehensive analysis of ASEAN market dynamics, regulatory landscape, and cultural nuances",
      icon: Search,
      activities: [
        "Multi-country market research",
        "Regulatory compliance mapping",
        "Cultural adaptation planning",
        "Regional partnership strategy"
      ]
    },
    {
      step: "02", 
      title: "Localized Solutions",
      description: "Country-specific solution adaptation with local language, payment, and regulatory compliance",
      icon: Settings,
      activities: [
        "Multi-language localization",
        "Local payment integration",
        "Regulatory compliance design",
        "Cultural UX adaptation"
      ]
    },
    {
      step: "03",
      title: "Phased Rollout",
      description: "Strategic regional deployment with hub-and-spoke model for optimal resource utilization",
      icon: MapPin,
      activities: [
        "Hub establishment",
        "Phased country rollout",
        "Local team development",
        "Cross-border integration"
      ]
    },
    {
      step: "04",
      title: "Regional Growth",
      description: "Continuous expansion and optimization with regional synergies and best practice sharing",
      icon: TrendingUp,
      activities: [
        "Regional optimization",
        "Best practice sharing",
        "Synergy maximization",
        "Continuous expansion"
      ]
    }
  ];

  // ASEAN Industry Focus Areas
  const industryFocus = [
    {
      industry: "Financial Services",
      description: "Leading digital banking, fintech innovation, and financial inclusion across ASEAN markets",
      countries: ["Indonesia", "Singapore", "Thailand", "Malaysia", "Vietnam", "Philippines"],
      projects: "200+ projects",
      value: "$45B market size",
      icon: Database,
      highlights: [
        "Digital banking platforms",
        "Mobile payment systems", 
        "Regulatory compliance automation",
        "Cross-border payment solutions"
      ]
    },
    {
      industry: "E-commerce & Retail",
      description: "Comprehensive e-commerce solutions supporting ASEAN's rapidly growing online retail ecosystem",
      countries: ["Indonesia", "Thailand", "Vietnam", "Malaysia", "Philippines"],
      projects: "180+ projects", 
      value: "$35B market size",
      icon: Users,
      highlights: [
        "Omnichannel platforms",
        "Supply chain digitization",
        "Customer analytics",
        "Cross-border commerce"
      ]
    },
    {
      industry: "Manufacturing & Industry 4.0",
      description: "Smart manufacturing transformation across ASEAN's diverse industrial landscape",
      countries: ["Thailand", "Vietnam", "Malaysia", "Indonesia", "Singapore"],
      projects: "150+ projects",
      value: "$28B market size", 
      icon: Workflow,
      highlights: [
        "Smart factory implementation",
        "IoT integration",
        "Supply chain optimization",
        "Quality management systems"
      ]
    },
    {
      industry: "Healthcare & Life Sciences",
      description: "Digital healthcare solutions addressing healthcare accessibility and quality across the region",
      countries: ["Singapore", "Thailand", "Malaysia", "Indonesia", "Philippines"],
      projects: "120+ projects",
      value: "$22B market size",
      icon: Activity,
      highlights: [
        "Telemedicine platforms",
        "Health information systems",
        "Medical device integration",
        "Health analytics platforms"
      ]
    }
  ];

  // Regional Benefits
  const regionalBenefits = [
    {
      title: "Market Coverage",
      value: "650M+",
      description: "Population reach across ASEAN",
      icon: Globe
    },
    {
      title: "Success Rate",
      value: "96%",
      description: "Project delivery success",
      icon: Target
    },
    {
      title: "Local Expertise",
      value: "500+",
      description: "Regional specialists",
      icon: Users
    },
    {
      title: "Growth Rate",
      value: "25%",
      description: "Average client growth",
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
          
          {/* ASEAN-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Globe, MapPin, Building, Users, Database, Workflow];
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
                ASEAN Digital Transformation Leader
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
                Southeast <span className="gradient-text-blue">Asia</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Driving digital transformation across Southeast Asia's diverse markets. 
                Empowering businesses with regional expertise, cultural intelligence, and proven solutions across ASEAN.
              </motion.p>
            </div>

            {/* ASEAN Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {aseanStats.map((stat, index) => (
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
                  Expand to ASEAN
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
                  const element = document.getElementById('regional-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Regional Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('singapore-hub')}
              >
                Singapore Hub
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Regional Framework Section */}
      <section id="regional-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Regional <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase approach designed for Southeast Asia's diverse markets, 
              regulatory environments, and cultural considerations for successful regional expansion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regionalFramework.map((step, index) => (
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

      {/* ASEAN Countries Coverage Section */}
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
              ASEAN <span className="gradient-text-blue">Market Presence</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive coverage across major ASEAN markets with local expertise, 
              cultural understanding, and proven track record in each country.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aseanCountries.map((country, index) => (
              <motion.div
                key={country.country}
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
                    <country.icon className="w-12 h-12 text-blue-500" />
                    <Badge variant="secondary">{country.growth}</Badge>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {country.country}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {country.capital} • {country.population} population
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Digital Economy
                      </h4>
                      <p className={`text-lg font-bold gradient-text-blue`}>
                        {country.digitalEconomy}
                      </p>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Active Projects
                      </h4>
                      <p className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        {country.projects}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Flagship Initiative:
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {country.flagship}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Key Focus Areas:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {country.focus.map((area, areaIndex) => (
                        <Badge key={areaIndex} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full gradient-bg-blue text-white rounded-xl"
                    onClick={() => {
                      const countryPages: Record<string, string> = {
                        'Indonesia': 'indonesia-digital',
                        'Singapore': 'singapore-hub',
                        'Thailand': 'thailand-hub',
                        'Malaysia': 'malaysia-hub',
                        'Vietnam': 'vietnam-hub'
                      };
                      navigate(countryPages[country.country] || 'contact');
                    }}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      Learn More
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Focus Section */}
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
              Regional <span className="gradient-text-blue">Industry Focus</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Leading digital transformation across key industries with deep sector expertise 
              and regional best practices tailored for ASEAN markets.
            </p>
          </motion.div>

          <div className="space-y-8">
            {industryFocus.map((industry, index) => (
              <motion.div
                key={industry.industry}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Industry Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <industry.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {industry.industry}
                        </h3>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {industry.value}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {industry.description}
                    </p>
                  </div>

                  {/* Market Presence */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Market Presence
                    </h4>
                    <div className="space-y-2">
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        <strong>Active Projects:</strong> {industry.projects}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {industry.countries.map((country, countryIndex) => (
                          <Badge key={countryIndex} variant="outline" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Key Highlights
                    </h4>
                    <ul className="space-y-2">
                      {industry.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {highlight}
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
                        Explore Solutions
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
                  Ready to Expand Across Southeast Asia?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Join 1000+ companies across ASEAN that have successfully transformed with our regional expertise and proven methodology.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Regional Expansion
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Contact Regional Team
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Regional Coverage</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">650M+ population reach across ASEAN</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Success</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">96% project delivery success rate</p>
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