"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Workflow, Zap, TrendingUp, Target, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Globe, Monitor,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Cog, Cpu, Users, Eye, RefreshCw,
  GitBranch, Repeat, RotateCw
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ProcessOptimizerPageProps {
  navigate?: (page: any) => void;
}

export function ProcessOptimizerPage({ navigate }: ProcessOptimizerPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Process Optimization Areas
  const optimizationAreas = [
    {
      title: "Workflow Automation",
      description: "Intelligent workflow design and automation with AI-powered optimization and continuous improvement.",
      icon: Workflow,
      category: "Automation",
      processes: [
        "End-to-end workflow mapping",
        "Automation opportunity identification",
        "Intelligent decision routing",
        "Exception handling automation"
      ],
      improvements: [
        "80% task automation rate",
        "90% reduction in manual effort",
        "75% faster process completion",
        "99% accuracy improvement"
      ],
      currentEfficiency: 85,
      targetEfficiency: 95
    },
    {
      title: "Performance Analytics",
      description: "Real-time process performance monitoring with bottleneck identification and optimization recommendations.",
      icon: BarChart3,
      category: "Analytics",
      processes: [
        "Real-time performance tracking",
        "Bottleneck identification",
        "KPI dashboard monitoring",
        "Predictive analytics"
      ],
      improvements: [
        "100% process visibility",
        "60% faster issue resolution",
        "85% prediction accuracy",
        "50% reduction in delays"
      ],
      currentEfficiency: 78,
      targetEfficiency: 92
    },
    {
      title: "Resource Optimization",
      description: "Smart resource allocation and capacity planning with predictive modeling and efficiency maximization.",
      icon: Users,
      category: "Resources",
      processes: [
        "Resource allocation optimization",
        "Capacity planning automation",
        "Skill-based task assignment",
        "Workload balancing"
      ],
      improvements: [
        "70% better resource utilization",
        "40% cost reduction",
        "95% optimal task assignment",
        "60% improved productivity"
      ],
      currentEfficiency: 72,
      targetEfficiency: 88
    },
    {
      title: "Quality Management",
      description: "Automated quality control with continuous monitoring, defect prevention, and compliance assurance.",
      icon: Award,
      category: "Quality",
      processes: [
        "Automated quality checks",
        "Defect prevention systems",
        "Compliance monitoring",
        "Continuous improvement loops"
      ],
      improvements: [
        "95% defect reduction",
        "100% compliance adherence",
        "80% faster quality checks",
        "90% customer satisfaction"
      ],
      currentEfficiency: 82,
      targetEfficiency: 96
    }
  ];

  // Process Optimization Framework
  const optimizationFramework = [
    {
      step: "01",
      title: "Analyze",
      description: "Comprehensive process analysis with current state mapping and performance assessment",
      icon: Search,
      activities: [
        "Current state process mapping",
        "Performance baseline measurement",
        "Bottleneck identification",
        "Efficiency gap analysis"
      ]
    },
    {
      step: "02",
      title: "Design",
      description: "Optimal process design with automation integration and performance optimization",
      icon: GitBranch,
      activities: [
        "Future state process design",
        "Automation integration planning",
        "Resource optimization strategy",
        "Quality improvement framework"
      ]
    },
    {
      step: "03",
      title: "Implement",
      description: "Phased implementation with change management and continuous monitoring",
      icon: RefreshCw,
      activities: [
        "Phased implementation plan",
        "Change management execution",
        "Performance monitoring setup",
        "Training and enablement"
      ]
    },
    {
      step: "04",
      title: "Optimize",
      description: "Continuous optimization with AI-powered insights and performance enhancement",
      icon: TrendingUp,
      activities: [
        "Continuous performance monitoring",
        "AI-powered optimization",
        "Process refinement",
        "Best practice evolution"
      ]
    }
  ];

  // Optimization Benefits
  const optimizationBenefits = [
    {
      title: "Efficiency Gain",
      value: "400%",
      description: "Process efficiency improvement",
      icon: Zap
    },
    {
      title: "Cost Reduction",
      value: "60%",
      description: "Operational cost savings",
      icon: Target
    },
    {
      title: "Time Savings",
      value: "75%",
      description: "Process completion time reduction",
      icon: Clock
    },
    {
      title: "Quality Score",
      value: "95%",
      description: "Process quality improvement",
      icon: Award
    }
  ];

  // Calculate overall optimization potential
  const overallOptimizationPotential = Math.round(
    optimizationAreas.reduce((acc, area) => acc + (area.targetEfficiency - area.currentEfficiency), 0) / optimizationAreas.length
  );

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
          
          {/* Animated Process Optimization Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Workflow, BarChart3, Users, Award, RefreshCw, GitBranch];
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
              <Workflow className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                AI-Powered Process Optimizer
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
                Process <span className="gradient-text-blue">Optimizer</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Intelligent business process optimization platform powered by AI. 
                Analyze, redesign, and optimize your workflows for maximum efficiency and performance.
              </motion.p>
            </div>

            {/* Optimization Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {optimizationBenefits.map((benefit, index) => (
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
                  Optimize My Processes
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
                  const element = document.getElementById('optimization-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Optimization Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('business-process')}
              >
                Free Process Assessment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Optimization Framework Section */}
      <section id="optimization-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Optimization <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase process optimization approach that analyzes, redesigns, 
              and continuously improves your business workflows for maximum efficiency and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {optimizationFramework.map((step, index) => (
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

      {/* Process Optimization Areas Section */}
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
              Process <span className="gradient-text-blue">Optimization Areas</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive process optimization across four critical business areas 
              to maximize efficiency, reduce costs, and improve overall performance.
            </p>
          </motion.div>

          <div className="space-y-8">
            {optimizationAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Area Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <area.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2" variant="secondary">{area.category}</Badge>
                        <h3 className={`text-xl font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {area.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                      {area.description}
                    </p>

                    {/* Efficiency Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Current</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{area.currentEfficiency}%</span>
                      </div>
                      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2`}>
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${area.currentEfficiency}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Target</span>
                        <span className="text-green-500">{area.targetEfficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Process Areas */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Process Areas
                    </h4>
                    <ul className="space-y-2">
                      {area.processes.map((process, processIndex) => (
                        <li key={processIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          {process}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expected Improvements */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Expected Improvements
                    </h4>
                    <ul className="space-y-2">
                      {area.improvements.map((improvement, improvementIndex) => (
                        <li key={improvementIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {improvement}
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
                        Optimize Area
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Optimization Potential */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <div className={`glass-heavy rounded-2xl p-8 text-center ${
              isDark ? 'border-blue-400/20' : 'border-blue-200/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Overall Process Optimization Potential
              </h3>
              
              <div className={`text-6xl font-bold mb-4 gradient-text-blue`}>
                +{overallOptimizationPotential}%
              </div>

              <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Average efficiency improvement across all process areas
              </p>

              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-3 font-semibold rounded-xl"
                onClick={() => navigate('demo-request')}
              >
                Get Complete Process Optimization Plan
              </Button>
            </div>
          </motion.div>
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
                  <Workflow className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Optimize Your Business Processes?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Start your comprehensive process optimization and achieve 400% efficiency improvement with 60% cost reduction.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Process Optimization
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Process Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">AI-Powered Optimization</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Intelligent process automation</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Results</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">400% efficiency improvement</p>
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