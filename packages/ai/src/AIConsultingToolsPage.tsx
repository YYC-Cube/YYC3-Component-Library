"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Brain, Bot, Zap, TrendingUp, CheckCircle, Star, 
  ArrowRight, Settings, Target, Globe, Monitor,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Eye,
  Layers, Network, Database, Workflow, Cog, Cpu
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface AIConsultingToolsPageProps {
  navigate?: (page: any) => void;
}

export function AIConsultingToolsPage({ navigate }: AIConsultingToolsPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // AI Consulting Tools
  const consultingTools = [
    {
      title: "AI Strategy Planner",
      description: "Comprehensive AI strategy development tool with industry-specific recommendations, implementation roadmaps, and ROI projections.",
      icon: Brain,
      category: "Strategy",
      features: [
        "Industry-specific AI strategy templates",
        "Implementation roadmap generator",
        "ROI calculation and projections",
        "Risk assessment framework"
      ],
      benefits: [
        "Accelerated strategy development",
        "Data-driven decision making",
        "Reduced implementation risks",
        "Clear business case creation"
      ],
      pricing: "Free",
      timeline: "30 minutes"
    },
    {
      title: "AI Readiness Assessment",
      description: "In-depth organizational readiness evaluation for AI adoption with personalized recommendations and capability gap analysis.",
      icon: UserCheck,
      category: "Assessment",
      features: [
        "Comprehensive readiness scoring",
        "Capability gap identification",
        "Technology infrastructure audit",
        "Team skills evaluation"
      ],
      benefits: [
        "Clear readiness baseline",
        "Prioritized improvement areas",
        "Resource requirement clarity",
        "Implementation timeline guidance"
      ],
      pricing: "Free",
      timeline: "45 minutes"
    },
    {
      title: "AI ROI Calculator",
      description: "Advanced ROI calculation tool with industry benchmarks, cost modeling, and benefit quantification for AI initiatives.",
      icon: BarChart3,
      category: "Analysis",
      features: [
        "Multi-scenario ROI modeling",
        "Industry benchmark comparisons",
        "Cost-benefit analysis",
        "Investment timeline planning"
      ],
      benefits: [
        "Accurate ROI projections",
        "Investment justification",
        "Budget planning support",
        "Performance tracking metrics"
      ],
      pricing: "Free",
      timeline: "20 minutes"
    },
    {
      title: "AI Implementation Planner",
      description: "Step-by-step implementation planning tool with resource allocation, timeline management, and milestone tracking.",
      icon: Settings,
      category: "Planning",
      features: [
        "Phase-by-phase planning",
        "Resource allocation optimizer",
        "Timeline and milestone tracking",
        "Risk mitigation strategies"
      ],
      benefits: [
        "Structured implementation approach",
        "Resource optimization",
        "Timeline predictability",
        "Risk minimization"
      ],
      pricing: "Premium",
      timeline: "60 minutes"
    },
    {
      title: "AI Vendor Selector",
      description: "Intelligent vendor comparison and selection tool with comprehensive evaluation criteria and recommendation engine.",
      icon: Search,
      category: "Selection",
      features: [
        "Vendor capability comparison",
        "Requirements matching",
        "Cost-benefit analysis",
        "Integration assessment"
      ],
      benefits: [
        "Optimal vendor selection",
        "Reduced selection time",
        "Objective decision making",
        "Integration risk reduction"
      ],
      pricing: "Premium",
      timeline: "90 minutes"
    },
    {
      title: "AI Performance Monitor",
      description: "Real-time AI system performance monitoring with KPI tracking, alert management, and optimization recommendations.",
      icon: Monitor,
      category: "Monitoring",
      features: [
        "Real-time performance tracking",
        "KPI dashboard and alerts",
        "Optimization recommendations",
        "Comparative benchmarking"
      ],
      benefits: [
        "Continuous performance optimization",
        "Proactive issue detection",
        "Data-driven improvements",
        "ROI maximization"
      ],
      pricing: "Enterprise",
      timeline: "Ongoing"
    }
  ];

  // Tools Framework
  const toolsFramework = [
    {
      step: "01",
      title: "Assess",
      description: "Evaluate current AI readiness and identify opportunities for intelligent automation",
      icon: Eye,
      activities: [
        "AI readiness assessment",
        "Opportunity identification",
        "Technology gap analysis",
        "Strategic planning"
      ]
    },
    {
      step: "02",
      title: "Plan",
      description: "Create comprehensive AI implementation strategy with clear roadmap and resource allocation",
      icon: Target,
      activities: [
        "Strategy development",
        "Implementation planning",
        "Resource allocation",
        "Timeline creation"
      ]
    },
    {
      step: "03",
      title: "Implement",
      description: "Execute AI initiatives with proper monitoring, vendor management, and performance tracking",
      icon: Bot,
      activities: [
        "Vendor selection",
        "System implementation",
        "Team training",
        "Performance monitoring"
      ]
    },
    {
      step: "04",
      title: "Optimize",
      description: "Continuously optimize AI performance and expand capabilities across the organization",
      icon: TrendingUp,
      activities: [
        "Performance optimization",
        "Capability expansion",
        "ROI maximization",
        "Strategic evolution"
      ]
    }
  ];

  // AI Tools Benefits
  const toolsBenefits = [
    {
      title: "Strategy Speed",
      value: "10x",
      description: "Faster AI strategy development",
      icon: Zap
    },
    {
      title: "Implementation Success",
      value: "95%",
      description: "Project success rate",
      icon: Target
    },
    {
      title: "ROI Improvement",
      value: "300%",
      description: "Average ROI increase",
      icon: TrendingUp
    },
    {
      title: "Risk Reduction",
      value: "80%",
      description: "Implementation risk decrease",
      icon: Award
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
          
          {/* Animated AI Tools Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Brain, Bot, Settings, BarChart3, Search, Monitor];
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
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                AI Consulting Tools Suite
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
                AI <span className="gradient-text-blue">Consulting</span> Tools
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Comprehensive suite of AI consulting tools to accelerate your digital transformation journey. 
                From strategy planning to implementation monitoring, streamline your AI adoption process.
              </motion.p>
            </div>

            {/* Tools Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {toolsBenefits.map((benefit, index) => (
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
                  Access AI Tools Suite
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
                  const element = document.getElementById('tools-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Our AI Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('ai-roi-calculator')}
              >
                Try Free ROI Calculator
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tools Framework Section */}
      <section id="tools-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              AI Tools <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A proven 4-phase AI consulting approach powered by intelligent tools 
              that accelerate strategy development and ensure implementation success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {toolsFramework.map((step, index) => (
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

      {/* AI Tools Grid Section */}
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
              AI Consulting <span className="gradient-text-blue">Tools Suite</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive collection of AI consulting tools designed to accelerate your digital transformation 
              and ensure successful AI implementation across your organization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultingTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Tool Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                    <Badge 
                      variant={tool.pricing === 'Free' ? 'default' : tool.pricing === 'Premium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {tool.pricing}
                    </Badge>
                  </div>
                </div>

                {/* Tool Info */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {tool.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {tool.description}
                  </p>

                  <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    <Clock className="w-4 h-4" />
                    Completion time: {tool.timeline}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {tool.features.slice(0, 3).map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center gap-2 text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    className={`w-full ${
                      tool.pricing === 'Free' 
                        ? 'gradient-bg-blue text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                    } rounded-xl`}
                    onClick={() => {
                      if (tool.pricing === 'Free') {
                        navigate('demo-request');
                      } else {
                        navigate('contact');
                      }
                    }}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {tool.pricing === 'Free' ? 'Try Free Tool' : 'Contact for Access'}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
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
                  <Brain className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Accelerate Your AI Journey?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Access our comprehensive AI consulting tools suite and achieve 10x faster strategy development with 95% implementation success rate.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Access Free Tools
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Schedule AI Consultation
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Free AI Tools</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Strategy & ROI calculators</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Expert Guidance</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">AI consulting specialists</p>
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