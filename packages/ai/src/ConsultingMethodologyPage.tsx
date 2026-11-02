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
  Compass, BookOpen, FileText, Shield
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ConsultingMethodologyPageProps {
  navigate?: (page: any) => void;
}

export function ConsultingMethodologyPage({ navigate }: ConsultingMethodologyPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Consulting Methodology Statistics
  const methodologyStats = [
    {
      title: "Proven Methodology",
      value: "8-Phase",
      description: "Comprehensive consulting approach",
      icon: Compass,
      growth: "Battle-tested"
    },
    {
      title: "Success Rate",
      value: "96%",
      description: "Project delivery success",
      icon: Target,
      growth: "Proven excellence"
    },
    {
      title: "Time to Value",
      value: "40%",
      description: "Faster than traditional approaches",
      icon: Clock,
      growth: "Accelerated delivery"
    },
    {
      title: "Client Satisfaction",
      value: "98%",
      description: "Client satisfaction score",
      icon: Award,
      growth: "World-class service"
    }
  ];

  // 8-Phase Consulting Methodology
  const consultingPhases = [
    {
      phase: "01",
      title: "Discovery & Assessment",
      description: "Comprehensive analysis of current state, challenges, and opportunities with stakeholder alignment",
      icon: Search,
      duration: "2-4 weeks",
      deliverables: [
        "Current state assessment",
        "Stakeholder analysis",
        "Gap analysis report",
        "Opportunity identification"
      ],
      activities: [
        "Stakeholder interviews",
        "Process documentation",
        "Technology audit",
        "Organizational assessment"
      ],
      outcome: "Clear understanding of transformation scope"
    },
    {
      phase: "02", 
      title: "Strategy Development",
      description: "Strategic roadmap creation with prioritized initiatives and measurable business outcomes",
      icon: Brain,
      duration: "3-6 weeks",
      deliverables: [
        "Digital transformation strategy",
        "Implementation roadmap",
        "Success metrics definition",
        "Risk mitigation plan"
      ],
      activities: [
        "Strategic planning workshops",
        "Roadmap development",
        "Metrics framework design",
        "Risk assessment"
      ],
      outcome: "Comprehensive transformation strategy"
    },
    {
      phase: "03",
      title: "Solution Design",
      description: "Detailed solution architecture and design with technology selection and integration planning",
      icon: Settings,
      duration: "4-8 weeks",
      deliverables: [
        "Solution architecture",
        "Technology specifications",
        "Integration design",
        "Implementation plan"
      ],
      activities: [
        "Architecture workshops",
        "Technology evaluation",
        "Design validation",
        "Prototype development"
      ],
      outcome: "Ready-to-implement solution design"
    },
    {
      phase: "04",
      title: "Change Management",
      description: "Organizational change strategy with communication, training, and adoption frameworks",
      icon: Users,
      duration: "Ongoing",
      deliverables: [
        "Change management strategy",
        "Communication plan",
        "Training curriculum",
        "Adoption metrics"
      ],
      activities: [
        "Change readiness assessment",
        "Communication planning",
        "Training development",
        "Resistance management"
      ],
      outcome: "Organization ready for transformation"
    },
    {
      phase: "05",
      title: "Implementation",
      description: "Phased solution deployment with agile methodology and continuous stakeholder engagement",
      icon: Workflow,
      duration: "3-12 months",
      deliverables: [
        "Working solution",
        "Deployment documentation",
        "User training materials",
        "Go-live support"
      ],
      activities: [
        "Agile development",
        "User acceptance testing",
        "Deployment execution",
        "Go-live support"
      ],
      outcome: "Fully operational solution"
    },
    {
      phase: "06",
      title: "Testing & Validation",
      description: "Comprehensive testing and validation with performance optimization and quality assurance",
      icon: Shield,
      duration: "2-4 weeks",
      deliverables: [
        "Test results report",
        "Performance benchmarks",
        "Quality assurance certificate",
        "Optimization recommendations"
      ],
      activities: [
        "System testing",
        "Performance testing",
        "Security validation",
        "User acceptance testing"
      ],
      outcome: "Validated and optimized solution"
    },
    {
      phase: "07",
      title: "Knowledge Transfer",
      description: "Comprehensive knowledge transfer with documentation, training, and capability building",
      icon: BookOpen,
      duration: "2-6 weeks",
      deliverables: [
        "Knowledge base",
        "Training completion",
        "Support documentation",
        "Capability assessment"
      ],
      activities: [
        "Documentation creation",
        "Training delivery",
        "Skills assessment",
        "Support handover"
      ],
      outcome: "Self-sufficient client organization"
    },
    {
      phase: "08",
      title: "Continuous Optimization",
      description: "Ongoing optimization and support with performance monitoring and strategic enhancement",
      icon: TrendingUp,
      duration: "Ongoing",
      deliverables: [
        "Performance reports",
        "Optimization recommendations",
        "Enhancement roadmap",
        "Success metrics tracking"
      ],
      activities: [
        "Performance monitoring",
        "Optimization identification",
        "Strategic planning",
        "Continuous improvement"
      ],
      outcome: "Continuously improving solution"
    }
  ];

  // Methodology Principles
  const methodologyPrinciples = [
    {
      title: "Client-Centric Approach",
      description: "Every decision and recommendation is made with client success and business value as the primary focus",
      icon: Users,
      benefits: [
        "Aligned with business objectives",
        "Stakeholder-driven decisions",
        "Value-focused outcomes",
        "Long-term partnership"
      ]
    },
    {
      title: "Evidence-Based Consulting",
      description: "All recommendations backed by data, research, and proven best practices from successful implementations",
      icon: BarChart3,
      benefits: [
        "Data-driven decisions",
        "Proven methodologies",
        "Measurable outcomes",
        "Risk mitigation"
      ]
    },
    {
      title: "Agile & Iterative",
      description: "Flexible approach with regular feedback loops, continuous improvement, and adaptive planning",
      icon: Zap,
      benefits: [
        "Rapid value delivery",
        "Continuous feedback",
        "Adaptive planning",
        "Risk reduction"
      ]
    },
    {
      title: "Knowledge Transfer",
      description: "Building internal capabilities to ensure sustainable success and organizational independence",
      icon: Lightbulb,
      benefits: [
        "Internal capability building",
        "Sustainable outcomes",
        "Organizational learning",
        "Future readiness"
      ]
    }
  ];

  // Success Metrics
  const successMetrics = [
    {
      category: "Project Delivery",
      metrics: [
        { metric: "On-time delivery", value: "96%", benchmark: "Industry: 67%" },
        { metric: "Budget adherence", value: "94%", benchmark: "Industry: 71%" },
        { metric: "Scope completion", value: "98%", benchmark: "Industry: 78%" },
        { metric: "Quality standards", value: "99%", benchmark: "Industry: 82%" }
      ]
    },
    {
      category: "Business Impact",
      metrics: [
        { metric: "ROI achievement", value: "280%", benchmark: "Target: 200%" },
        { metric: "Efficiency gains", value: "45%", benchmark: "Target: 30%" },
        { metric: "Cost reduction", value: "35%", benchmark: "Target: 25%" },
        { metric: "Revenue growth", value: "25%", benchmark: "Target: 15%" }
      ]
    },
    {
      category: "Client Satisfaction",
      metrics: [
        { metric: "Overall satisfaction", value: "98%", benchmark: "Industry: 78%" },
        { metric: "Recommendation rate", value: "97%", benchmark: "Industry: 72%" },
        { metric: "Repeat engagement", value: "85%", benchmark: "Industry: 54%" },
        { metric: "Long-term partnership", value: "78%", benchmark: "Industry: 45%" }
      ]
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
          
          {/* Methodology-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Compass, Brain, Settings, Users, Workflow, Shield];
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
              <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Proven Consulting Excellence
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
                Consulting <span className="gradient-text-blue">Methodology</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Our proven 8-phase consulting methodology delivering 96% success rate. 
                Evidence-based approach with measurable outcomes and sustainable transformation for lasting business impact.
              </motion.p>
            </div>

            {/* Methodology Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {methodologyStats.map((stat, index) => (
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
                  Experience Our Methodology
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
                  const element = document.getElementById('methodology-phases');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                8-Phase Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('consulting-frameworks')}
              >
                Consulting Frameworks
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 8-Phase Methodology Section */}
      <section id="methodology-phases" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              8-Phase <span className="gradient-text-blue">Methodology</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Our comprehensive 8-phase approach ensures systematic transformation 
              with measurable outcomes and sustainable success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {consultingPhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center mb-4`}>
                    <phase.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                    {phase.phase}
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {phase.title}
                  </h3>

                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    Duration: {phase.duration}
                  </div>
                  
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                    {phase.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Key Deliverables:
                    </h4>
                    <ul className="space-y-1">
                      {phase.deliverables.slice(0, 3).map((deliverable, delIndex) => (
                        <li key={delIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`pt-3 border-t border-slate-200 dark:border-slate-700`}>
                    <div className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Outcome: {phase.outcome}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Principles Section */}
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
              Methodology <span className="gradient-text-blue">Principles</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Four core principles that guide every engagement and ensure 
              consistent delivery of exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {methodologyPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center mb-4`}>
                    <principle.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {principle.title}
                  </h3>
                  
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                    {principle.description}
                  </p>
                </div>

                <div>
                  <h4 className={`text-lg font-semibold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    Key Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {principle.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
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
              Proven <span className="gradient-text-blue">Success Metrics</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Measurable outcomes that demonstrate the effectiveness of our consulting methodology 
              across all engagement dimensions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successMetrics.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 text-center ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {category.category}
                </h3>

                <div className="space-y-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className={`glass-secondary rounded-xl p-4 ${
                        isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className={`text-sm font-medium ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {metric.metric}
                        </div>
                        <div className={`text-lg font-bold gradient-text-blue`}>
                          {metric.value}
                        </div>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                        {metric.benchmark}
                      </div>
                    </div>
                  ))}
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
                  <Compass className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Experience Our Proven Methodology?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Join 1000+ organizations that have achieved transformational success with our 8-phase consulting methodology and 96% success rate.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Your Transformation
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Our Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Success</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">96% success rate with 8-phase methodology</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Client Satisfaction</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">98% client satisfaction & 280% ROI</p>
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