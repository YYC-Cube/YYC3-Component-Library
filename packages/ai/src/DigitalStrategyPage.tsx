"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Target, Lightbulb, TrendingUp, Users, BarChart3, CheckCircle, Star, 
  ArrowRight, Brain, Rocket, Building2, Database, Monitor,
  Clock, Zap, Award, Globe, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Settings, Map,
  Compass, Route, Flag, Eye, Layers, Network
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface DigitalStrategyPageProps {
  navigate?: (page: any) => void;
}

export function DigitalStrategyPage({ navigate }: DigitalStrategyPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Digital Strategy Services
  const strategyServices = [
    {
      title: "Digital Transformation Roadmap",
      description: "Comprehensive strategy development for your organization's digital journey with clear milestones and ROI targets.",
      icon: Map,
      process: [
        "Current state assessment",
        "Future state vision definition",
        "Gap analysis & prioritization",
        "Implementation roadmap creation"
      ],
      deliverables: [
        "Digital maturity assessment report",
        "3-year transformation roadmap",
        "Technology architecture blueprint",
        "Investment priorities & ROI projections"
      ],
      timeline: "6-8 weeks"
    },
    {
      title: "AI Strategy & Implementation",
      description: "Strategic planning for AI adoption across your organization with focus on business value and competitive advantage.",
      icon: Brain,
      process: [
        "AI readiness evaluation",
        "Use case identification",
        "Technology selection",
        "Implementation planning"
      ],
      deliverables: [
        "AI strategy document",
        "Use case prioritization matrix",
        "Technology recommendations",
        "Pilot project plans"
      ],
      timeline: "4-6 weeks"
    },
    {
      title: "Business Model Innovation",
      description: "Reimagining your business model for the digital age with new revenue streams and value propositions.",
      icon: Lightbulb,
      process: [
        "Current model analysis",
        "Market opportunity research",
        "New model design",
        "Validation & testing"
      ],
      deliverables: [
        "Business model canvas",
        "Revenue stream analysis",
        "Go-to-market strategy",
        "Financial projections"
      ],
      timeline: "8-10 weeks"
    },
    {
      title: "Digital Customer Experience",
      description: "Customer-centric digital strategy to enhance engagement, satisfaction, and lifetime value.",
      icon: Users,
      process: [
        "Customer journey mapping",
        "Touchpoint optimization",
        "Digital channel strategy",
        "Experience measurement"
      ],
      deliverables: [
        "Customer journey maps",
        "Digital experience strategy",
        "Channel optimization plan",
        "KPI framework"
      ],
      timeline: "5-7 weeks"
    }
  ];

  // Strategy Framework
  const frameworkSteps = [
    {
      step: "01",
      title: "Assess",
      description: "Comprehensive evaluation of current digital maturity, capabilities, and market position",
      icon: Eye,
      activities: [
        "Digital maturity assessment",
        "Technology audit",
        "Competitive analysis",
        "Market research"
      ]
    },
    {
      step: "02", 
      title: "Strategize",
      description: "Development of customized digital strategy aligned with business objectives",
      icon: Target,
      activities: [
        "Vision & objectives definition",
        "Strategy formulation",
        "Technology roadmap",
        "Investment planning"
      ]
    },
    {
      step: "03",
      title: "Plan",
      description: "Detailed implementation planning with phased approach and risk mitigation",
      icon: Calendar,
      activities: [
        "Implementation roadmap",
        "Resource planning",
        "Risk assessment",
        "Change management"
      ]
    },
    {
      step: "04",
      title: "Execute",
      description: "Guided implementation with continuous monitoring and optimization",
      icon: Rocket,
      activities: [
        "Project execution",
        "Progress monitoring",
        "Issue resolution",
        "Performance optimization"
      ]
    }
  ];

  // Industry Stats
  const industryStats = [
    { label: "Strategy Projects", value: "300+", desc: "Successful strategies delivered" },
    { label: "Digital ROI", value: "340%", desc: "Average return achieved" },
    { label: "Success Rate", value: "95%", desc: "Strategy implementation" },
    { label: "Client Satisfaction", value: "4.9/5", desc: "Strategy consulting rating" }
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
          
          {/* Animated Strategy Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Target, Compass, Map, Route, Lightbulb, Rocket];
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
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Digital Strategy Consulting
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
                Strategic <span className="gradient-text-blue">Digital Vision</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Navigate your digital transformation with AI-powered strategic planning. 
                From vision to execution, we create roadmaps that drive sustainable growth and competitive advantage.
              </motion.p>
            </div>

            {/* Industry Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {industryStats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {stat.label}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {stat.desc}
                  </div>
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
                  Start Strategy Consultation
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
                  const element = document.getElementById('strategy-services');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Strategy Services
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('digital-maturity')}
              >
                Digital Maturity Assessment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Strategy Framework Section */}
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
              Our Strategic <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A proven methodology that guides organizations through successful digital transformation 
              with measurable outcomes and sustainable results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {frameworkSteps.map((step, index) => (
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

      {/* Strategy Services Section */}
      <section id="strategy-services" className="py-16 lg:py-24">
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
              Strategy <span className="gradient-text-blue">Services</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive strategic consulting services designed to accelerate your digital transformation 
              and create lasting competitive advantages.
            </p>
          </motion.div>

          <div className="space-y-8">
            {strategyServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Service Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {service.title}
                        </h3>
                        <div className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Timeline: {service.timeline}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {service.description}
                    </p>
                  </div>

                  {/* Process */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Our Process
                    </h4>
                    <ul className="space-y-3">
                      {service.process.map((step, stepIndex) => (
                        <li key={stepIndex} className={`flex items-center gap-3 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <div className={`w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {stepIndex + 1}
                          </div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Key Deliverables
                    </h4>
                    <ul className="space-y-2">
                      {service.deliverables.map((deliverable, deliverableIndex) => (
                        <li key={deliverableIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {deliverable}
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className={`text-4xl md:text-5xl font-bold ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Ready to Define Your <span className="gradient-text-blue">Digital Strategy</span>?
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Start your strategic transformation with a comprehensive digital strategy consultation.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('demo-request')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Book Strategy Consultation
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
                onClick={() => navigate('contact')}
              >
                Contact Strategy Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}