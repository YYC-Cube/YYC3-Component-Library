"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Building, TrendingUp, Zap, Target, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Monitor, Users,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, MapPin, Globe
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface SingaporeHubPageProps {
  navigate?: (page: any) => void;
}

export function SingaporeHubPage({ navigate }: SingaporeHubPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Singapore Hub Statistics
  const hubStats = [
    {
      title: "Regional Headquarters",
      value: "ASEAN",
      description: "Innovation & strategy center",
      icon: Building,
      growth: "Since 2019"
    },
    {
      title: "Smart Nation Rank",
      value: "#1",
      description: "Global smart city ranking",
      icon: Globe,
      growth: "3 years running"
    },
    {
      title: "Fintech Ecosystem",
      value: "$26B",
      description: "Digital economy value",
      icon: Database,
      growth: "+18% YoY"
    },
    {
      title: "Innovation Index",
      value: "#8",
      description: "Global innovation ranking",
      icon: Lightbulb,
      growth: "Top 10 globally"
    }
  ];

  // Singapore Hub Capabilities
  const hubCapabilities = [
    {
      title: "Regional Strategy Center",
      description: "Strategic planning and coordination hub for all ASEAN digital transformation initiatives with deep market intelligence.",
      icon: Brain,
      category: "Strategy",
      services: [
        "ASEAN market research & analysis",
        "Regional expansion planning",
        "Cross-border strategy development",
        "Innovation ecosystem coordination"
      ],
      benefits: [
        "Centralized regional expertise",
        "Market intelligence leadership",
        "Strategic coordination efficiency",
        "Innovation ecosystem access"
      ],
      clients: "200+ regional clients"
    },
    {
      title: "Fintech Innovation Hub",
      description: "Leading fintech transformation across Asia-Pacific with MAS sandbox participation and regulatory expertise.",
      icon: Database,
      category: "Fintech",
      services: [
        "Digital banking solutions",
        "Payment system integration", 
        "Regulatory compliance consulting",
        "Fintech product development"
      ],
      benefits: [
        "MAS sandbox certified solutions",
        "Regulatory compliance expertise",
        "Cross-border payment integration",
        "Innovation-ready architecture"
      ],
      clients: "150+ fintech clients"
    },
    {
      title: "Smart City Solutions",
      description: "Comprehensive smart city consulting and implementation leveraging Singapore's Smart Nation expertise and learnings.",
      icon: Monitor,
      category: "Smart City",
      services: [
        "IoT infrastructure design",
        "Data analytics platforms",
        "Citizen engagement systems",
        "Urban optimization solutions"
      ],
      benefits: [
        "Smart Nation best practices",
        "Proven IoT implementations",
        "Citizen-centric design",
        "Scalable urban solutions"
      ],
      clients: "80+ government clients"
    },
    {
      title: "Innovation Lab",
      description: "Cutting-edge R&D facility focusing on emerging technologies and next-generation digital solutions for the region.",
      icon: Lightbulb,
      category: "Innovation",
      services: [
        "Emerging technology research",
        "Prototype development",
        "Innovation incubation",
        "Technology transfer programs"
      ],
      benefits: [
        "Access to latest technologies",
        "Rapid prototyping capabilities",
        "University partnerships",
        "Research collaboration"
      ],
      clients: "50+ innovation projects"
    }
  ];

  // Singapore Hub Framework
  const hubFramework = [
    {
      step: "01",
      title: "Hub Coordination",
      description: "Centralized planning and coordination from Singapore hub with regional market intelligence",
      icon: Building,
      activities: [
        "Regional strategy development",
        "Market intelligence gathering",
        "Resource coordination",
        "Best practice standardization"
      ]
    },
    {
      step: "02",
      title: "Innovation Development",
      description: "Leverage Singapore's innovation ecosystem for cutting-edge solution development",
      icon: Lightbulb,
      activities: [
        "Innovation lab utilization",
        "University collaboration",
        "Regulatory sandbox participation",
        "Technology transfer execution"
      ]
    },
    {
      step: "03",
      title: "Regional Deployment",
      description: "Hub-and-spoke deployment model with Singapore expertise supporting regional implementation",
      icon: Network,
      activities: [
        "Hub-and-spoke coordination",
        "Regional team enablement",
        "Knowledge transfer programs",
        "Quality assurance oversight"
      ]
    },
    {
      step: "04",
      title: "Ecosystem Growth",
      description: "Continuous ecosystem development and regional expansion with Singapore as the anchor",
      icon: TrendingUp,
      activities: [
        "Ecosystem expansion",
        "Partnership development",
        "Innovation scaling",
        "Regional growth acceleration"
      ]
    }
  ];

  // Singapore Success Stories
  const successStories = [
    {
      client: "DBS Bank Digital Transformation",
      industry: "Banking",
      challenge: "Complete digital banking transformation for 22M+ customers across Asia",
      solution: "End-to-end digital banking platform with AI-powered services",
      results: ["90% digital adoption", "50% cost reduction", "300% faster processing"],
      timeline: "24 months",
      scope: "Regional implementation"
    },
    {
      client: "Singapore Smart Nation Initiative", 
      industry: "Government",
      challenge: "Nationwide smart city transformation and digital government services",
      solution: "Integrated smart city platform with IoT and analytics",
      results: ["100% digital government services", "60% efficiency improvement", "95% citizen satisfaction"],
      timeline: "36 months",
      scope: "National deployment"
    },
    {
      client: "Grab Regional Platform",
      industry: "Technology",
      challenge: "Multi-country super app platform scaling across Southeast Asia",
      solution: "Scalable platform architecture with regional customization",
      results: ["8 country deployment", "100M+ users", "40% operational efficiency"],
      timeline: "18 months", 
      scope: "ASEAN-wide"
    }
  ];

  // Hub Benefits
  const hubBenefits = [
    {
      title: "Innovation Access",
      value: "100%",
      description: "Latest technology access",
      icon: Lightbulb
    },
    {
      title: "Regulatory Expertise",
      value: "MAS",
      description: "Certified compliance",
      icon: Award
    },
    {
      title: "Regional Reach",
      value: "10+",
      description: "Countries served",
      icon: Globe
    },
    {
      title: "Success Rate",
      value: "98%",
      description: "Project delivery success",
      icon: Target
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
          
          {/* Singapore-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Building, Globe, Database, Lightbulb, Monitor, Network];
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
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Regional Innovation Hub
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
                Singapore <span className="gradient-text-blue">Hub</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Our regional headquarters and innovation center, leveraging Singapore's Smart Nation expertise 
                to drive digital transformation across Asia-Pacific with cutting-edge solutions and regulatory excellence.
              </motion.p>
            </div>

            {/* Hub Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {hubStats.map((stat, index) => (
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
                  Partner with Singapore Hub
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
                  const element = document.getElementById('hub-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Hub Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('innovation-lab')}
              >
                Innovation Lab
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hub Framework Section */}
      <section id="hub-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Hub <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase hub-and-spoke approach leveraging Singapore's innovation ecosystem 
              and regulatory excellence to drive regional digital transformation success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hubFramework.map((step, index) => (
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

      {/* Hub Capabilities Section */}
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
              Hub <span className="gradient-text-blue">Capabilities</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive capabilities leveraging Singapore's unique position as a global innovation hub 
              and financial center to drive regional digital transformation excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hubCapabilities.map((capability, index) => (
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
                {/* Capability Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                      <capability.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-2" variant="secondary">{capability.category}</Badge>
                      <h3 className={`text-xl font-semibold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {capability.title}
                      </h3>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {capability.clients}
                      </div>
                    </div>
                  </div>
                </div>

                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {capability.description}
                </p>

                <div className="grid grid-cols-1 gap-6">
                  {/* Services */}
                  <div>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Key Services:
                    </h4>
                    <ul className="space-y-2">
                      {capability.services.slice(0, 3).map((service, serviceIndex) => (
                        <li key={serviceIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Key Benefits:
                    </h4>
                    <ul className="space-y-2">
                      {capability.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Button
                    className="w-full gradient-bg-blue text-white rounded-xl"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      Explore Capability
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
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
              Singapore Hub <span className="gradient-text-blue">Success Stories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Flagship transformations delivered from our Singapore hub with regional impact 
              and measurable business outcomes across diverse industries.
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
                    {story.scope}
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
                  <Building className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Partner with Our Singapore Innovation Hub
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Leverage Singapore's world-class innovation ecosystem and our regional expertise to accelerate your digital transformation journey.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Connect with Singapore Hub
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Visit Innovation Lab
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Innovation Leadership</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Access to latest technologies & MAS sandbox</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Regional Reach</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">98% success rate across 10+ countries</p>
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