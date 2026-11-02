"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  BarChart3, TrendingUp, Zap, Target, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Globe, Monitor,
  Clock, Award, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, Users, Eye,
  DollarSign, PieChart, LineChart, Gauge
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ROIDashboardPageProps {
  navigate?: (page: any) => void;
}

export function ROIDashboardPage({ navigate }: ROIDashboardPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // ROI Metrics & KPIs
  const roiMetrics = [
    {
      title: "Revenue Impact Analysis",
      description: "Comprehensive revenue tracking with attribution analysis, growth forecasting, and impact measurement.",
      icon: DollarSign,
      category: "Revenue",
      kpis: [
        "Revenue growth rate",
        "Customer acquisition cost",
        "Customer lifetime value",
        "Revenue attribution tracking"
      ],
      currentValue: "$2.5M",
      growth: "+340%",
      trend: "up"
    },
    {
      title: "Cost Optimization Tracking",
      description: "Real-time cost monitoring with optimization recommendations and savings identification.",
      icon: PieChart,
      category: "Costs",
      kpis: [
        "Operational cost reduction",
        "Infrastructure savings",
        "Process efficiency gains",
        "Resource optimization"
      ],
      currentValue: "$800K",
      growth: "-45%",
      trend: "down"
    },
    {
      title: "Performance Metrics",
      description: "Key performance indicators tracking with benchmarking and continuous improvement monitoring.",
      icon: Gauge,
      category: "Performance",
      kpis: [
        "System performance scores",
        "User experience metrics",
        "Process efficiency rates",
        "Quality improvement metrics"
      ],
      currentValue: "95%",
      growth: "+85%",
      trend: "up"
    },
    {
      title: "Investment Returns",
      description: "Detailed investment tracking with ROI calculations, payback periods, and value realization.",
      icon: LineChart,
      category: "Investment",
      kpis: [
        "Return on investment",
        "Payback period analysis",
        "Net present value",
        "Internal rate of return"
      ],
      currentValue: "385%",
      growth: "+125%",
      trend: "up"
    }
  ];

  // Dashboard Features
  const dashboardFeatures = [
    {
      title: "Real-time Analytics",
      description: "Live data processing and real-time visualization with instant insights and alerts",
      icon: Activity,
      benefits: [
        "Live data streaming",
        "Instant alert notifications",
        "Real-time decision making",
        "Continuous monitoring"
      ]
    },
    {
      title: "Advanced Visualization",
      description: "Interactive charts, graphs, and custom dashboards with drill-down capabilities",
      icon: BarChart3,
      benefits: [
        "Interactive charts & graphs",
        "Custom dashboard creation",
        "Drill-down analytics",
        "Multi-dimensional views"
      ]
    },
    {
      title: "Predictive Modeling",
      description: "AI-powered forecasting and trend analysis with scenario planning capabilities",
      icon: Brain,
      benefits: [
        "AI-powered forecasting",
        "Trend analysis & predictions",
        "Scenario planning tools",
        "Risk assessment models"
      ]
    },
    {
      title: "Automated Reporting",
      description: "Scheduled report generation with customizable templates and stakeholder distribution",
      icon: Bell,
      benefits: [
        "Automated report generation",
        "Customizable templates",
        "Stakeholder distribution",
        "Executive summaries"
      ]
    }
  ];

  // ROI Dashboard Framework
  const dashboardFramework = [
    {
      step: "01",
      title: "Setup",
      description: "Configure ROI tracking framework with KPIs, metrics, and data integration",
      icon: Settings,
      activities: [
        "KPI framework setup",
        "Data source integration",
        "Baseline establishment",
        "Dashboard configuration"
      ]
    },
    {
      step: "02",
      title: "Monitor",
      description: "Continuous monitoring with real-time data collection and performance tracking",
      icon: Monitor,
      activities: [
        "Real-time data collection",
        "Performance monitoring",
        "Alert configuration",
        "Trend analysis"
      ]
    },
    {
      step: "03",
      title: "Analyze",
      description: "Deep analytics with insights generation, pattern recognition, and optimization opportunities",
      icon: Search,
      activities: [
        "Data analysis & insights",
        "Pattern recognition",
        "Optimization identification",
        "Performance correlation"
      ]
    },
    {
      step: "04",
      title: "Optimize",
      description: "Continuous optimization with action recommendations and performance improvements",
      icon: TrendingUp,
      activities: [
        "Performance optimization",
        "Action recommendations",
        "Strategy adjustments",
        "ROI maximization"
      ]
    }
  ];

  // ROI Dashboard Benefits
  const dashboardBenefits = [
    {
      title: "ROI Visibility",
      value: "100%",
      description: "Complete ROI transparency",
      icon: Eye
    },
    {
      title: "Decision Speed",
      value: "10x",
      description: "Faster decision making",
      icon: Zap
    },
    {
      title: "Cost Savings",
      value: "45%",
      description: "Operational cost reduction",
      icon: Target
    },
    {
      title: "Revenue Growth",
      value: "340%",
      description: "Average revenue increase",
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
          
          {/* Animated ROI Dashboard Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [BarChart3, DollarSign, LineChart, PieChart, Gauge, TrendingUp];
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
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Advanced ROI Dashboard Platform
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
                ROI <span className="gradient-text-blue">Dashboard</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Real-time ROI monitoring and analytics platform that provides complete visibility into investment returns, 
                cost optimization, and performance metrics with AI-powered insights and predictions.
              </motion.p>
            </div>

            {/* Dashboard Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {dashboardBenefits.map((benefit, index) => (
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
                  Launch ROI Dashboard
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
                  const element = document.getElementById('dashboard-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Dashboard Framework
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
                Try ROI Calculator
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Framework Section */}
      <section id="dashboard-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Dashboard <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase ROI dashboard approach that provides complete visibility into investment returns 
              and enables data-driven decision making for maximum business impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dashboardFramework.map((step, index) => (
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

      {/* ROI Metrics Section */}
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
              ROI <span className="gradient-text-blue">Metrics & KPIs</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive ROI tracking across four critical business dimensions 
              with real-time monitoring and predictive analytics for maximum value realization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roiMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-2" variant="secondary">{metric.category}</Badge>
                      <h3 className={`text-xl font-semibold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {metric.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {metric.currentValue}
                    </div>
                    <div className={`text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.growth}
                    </div>
                  </div>
                </div>

                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {metric.description}
                </p>

                <div className="space-y-3">
                  <h4 className={`text-sm font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Key Performance Indicators:
                  </h4>
                  <ul className="space-y-2">
                    {metric.kpis.map((kpi, kpiIndex) => (
                      <li key={kpiIndex} className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {kpi}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Features Section */}
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
              Advanced <span className="gradient-text-blue">Dashboard Features</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Powerful features designed to provide comprehensive ROI visibility 
              and enable intelligent decision making through advanced analytics and automation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dashboardFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {feature.title}
                  </h3>
                </div>

                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {feature.description}
                </p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className={`flex items-center gap-2 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      <Star className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
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
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Track Your ROI in Real-time?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Launch your comprehensive ROI dashboard and achieve 100% ROI visibility with 10x faster decision making.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Launch ROI Dashboard
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult ROI Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Real-time Analytics</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Live ROI monitoring & insights</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Results</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">340% average revenue growth</p>
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