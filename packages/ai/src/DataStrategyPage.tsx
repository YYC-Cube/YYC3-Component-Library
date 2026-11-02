"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Database, BarChart3, Brain, TrendingUp, CheckCircle, Star, 
  ArrowRight, Target, Shield, Zap, Award, Globe, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Settings, Lightbulb,
  Rocket, Eye, Activity, Network, Layers, FileText, Lock, Users
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface DataStrategyPageProps {
  navigate?: (page: any) => void;
}

export function DataStrategyPage({ navigate }: DataStrategyPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Data Strategy Services
  const dataServices = [
    {
      title: "Data Architecture & Governance",
      description: "Design comprehensive data architecture with governance frameworks, ensuring data quality, security, and compliance.",
      icon: Database,
      phase: "Foundation",
      deliverables: [
        "Data architecture blueprint",
        "Data governance framework",
        "Data quality standards",
        "Compliance & security protocols"
      ],
      benefits: [
        "Unified data ecosystem",
        "Improved data quality",
        "Regulatory compliance",
        "Enhanced data security"
      ],
      timeline: "8-12 weeks"
    },
    {
      title: "Analytics & Business Intelligence",
      description: "Advanced analytics solutions with AI-powered insights, real-time dashboards, and predictive modeling capabilities.",
      icon: BarChart3,
      phase: "Intelligence",
      deliverables: [
        "Business intelligence platform",
        "Predictive analytics models",
        "Real-time dashboards",
        "Automated reporting systems"
      ],
      benefits: [
        "Data-driven decision making",
        "Real-time business insights",
        "Predictive capabilities",
        "Automated reporting"
      ],
      timeline: "6-10 weeks"
    },
    {
      title: "Machine Learning & AI",
      description: "AI model development and deployment with MLOps best practices, enabling intelligent automation and predictions.",
      icon: Brain,
      phase: "Intelligence",
      deliverables: [
        "Custom ML models",
        "AI deployment pipeline",
        "Model monitoring system",
        "Performance optimization"
      ],
      benefits: [
        "Intelligent automation",
        "Predictive insights",
        "Operational efficiency",
        "Competitive advantage"
      ],
      timeline: "10-16 weeks"
    },
    {
      title: "Data Integration & Migration",
      description: "Seamless data integration across systems with modern ETL/ELT pipelines and cloud migration strategies.",
      icon: Network,
      phase: "Integration",
      deliverables: [
        "Data integration architecture",
        "ETL/ELT pipeline implementation",
        "Cloud migration strategy",
        "Data synchronization systems"
      ],
      benefits: [
        "Unified data access",
        "Real-time data flow",
        "Scalable infrastructure",
        "Reduced data silos"
      ],
      timeline: "6-12 weeks"
    }
  ];

  // Data Strategy Framework
  const strategyFramework = [
    {
      step: "01",
      title: "Assess",
      description: "Comprehensive evaluation of current data landscape, systems, and business requirements",
      icon: Eye,
      activities: [
        "Data audit & assessment",
        "Current state analysis",
        "Business requirements gathering",
        "Technology stack evaluation"
      ]
    },
    {
      step: "02",
      title: "Design",
      description: "Strategic data architecture design with governance, security, and scalability",
      icon: Layers,
      activities: [
        "Data architecture design",
        "Governance framework creation",
        "Security & compliance planning",
        "Technology roadmap development"
      ]
    },
    {
      step: "03",
      title: "Implement",
      description: "Phased implementation of data infrastructure, pipelines, and analytics solutions",
      icon: Settings,
      activities: [
        "Infrastructure deployment",
        "Data pipeline development",
        "Analytics platform setup",
        "Integration & testing"
      ]
    },
    {
      step: "04",
      title: "Optimize",
      description: "Continuous optimization, monitoring, and improvement of data systems and processes",
      icon: TrendingUp,
      activities: [
        "Performance monitoring",
        "Continuous optimization",
        "User training & adoption",
        "ROI measurement"
      ]
    }
  ];

  // Data Strategy Benefits
  const strategyBenefits = [
    {
      title: "Decision Speed",
      value: "5x",
      description: "Faster decision making with real-time data",
      icon: Zap
    },
    {
      title: "Data Quality",
      value: "95%",
      description: "Improved data accuracy and reliability",
      icon: Target
    },
    {
      title: "Cost Reduction",
      value: "40%",
      description: "Lower data management costs",
      icon: TrendingUp
    },
    {
      title: "Insights Generation",
      value: "10x",
      description: "More actionable business insights",
      icon: Brain
    }
  ];

  // Industry Stats
  const industryStats = [
    { label: "Data Projects", value: "200+", desc: "Successfully delivered" },
    { label: "Data Quality Improvement", value: "95%", desc: "Average achievement" },
    { label: "ROI Achievement", value: "450%", desc: "Average within 18 months" },
    { label: "Client Satisfaction", value: "4.9/5", desc: "Data strategy rating" }
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
          
          {/* Animated Data Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Database, BarChart3, Brain, Network, Activity, Target];
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
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Data Strategy & Analytics
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
                Data-Driven <span className="gradient-text-blue">Excellence</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Transform your business with strategic data initiatives. From data architecture to AI implementation, 
                we create comprehensive data strategies that drive intelligent decision-making and competitive advantage.
              </motion.p>
            </div>

            {/* Strategy Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {strategyBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <benefit.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {benefit.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {benefit.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {benefit.description}
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
                  Start Data Strategy Consultation
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
                  const element = document.getElementById('data-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Our Data Framework
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
                Data Maturity Assessment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Data Strategy Framework Section */}
      <section id="data-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Our Data Strategy <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase approach to data strategy that ensures successful implementation 
              and measurable business outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strategyFramework.map((step, index) => (
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

      {/* Data Services Section */}
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
              Data Strategy <span className="gradient-text-blue">Services</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive data consulting services designed to transform your organization 
              into a data-driven enterprise with measurable business impact.
            </p>
          </motion.div>

          <div className="space-y-8">
            {dataServices.map((service, index) => (
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Service Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2" variant="secondary">{service.phase}</Badge>
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

                  {/* Benefits */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Expected Benefits
                    </h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
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
                        Get Started
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
              Ready to Unlock Your <span className="gradient-text-blue">Data Potential</span>?
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Start your data transformation journey with a comprehensive data strategy consultation.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('demo-request')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Start Data Strategy Consultation
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
                Contact Data Experts
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}