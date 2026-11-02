"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Search, BarChart3, Zap, TrendingUp, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Globe, Monitor,
  Clock, Award, Eye, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, Users, Target,
  Radar, Shield, AlertTriangle, ChevronUp, ChevronDown
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface CompetitorAnalysisPageProps {
  navigate?: (page: any) => void;
}

export function CompetitorAnalysisPage({ navigate }: CompetitorAnalysisPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Competitor Analysis Categories
  const analysisCategories = [
    {
      title: "Digital Presence Analysis",
      description: "Comprehensive analysis of competitors' digital footprint including website performance, SEO, and online visibility.",
      icon: Globe,
      category: "Digital",
      metrics: [
        "Website traffic analysis",
        "SEO keyword rankings",
        "Social media presence",
        "Content strategy evaluation"
      ],
      insights: [
        "Market share visibility",
        "Traffic source analysis",
        "Engagement metrics",
        "Content gap opportunities"
      ],
      competitorScore: 78,
      yourScore: 65,
      gap: -13
    },
    {
      title: "Technology Stack Assessment",
      description: "Deep dive into competitors' technology choices, platform usage, and digital infrastructure capabilities.",
      icon: Layers,
      category: "Technology",
      metrics: [
        "Technology stack identification",
        "Platform usage analysis",
        "API and integration mapping",
        "Innovation adoption rate"
      ],
      insights: [
        "Technology advantage gaps",
        "Innovation opportunities",
        "Integration capabilities",
        "Technical debt assessment"
      ],
      competitorScore: 82,
      yourScore: 73,
      gap: -9
    },
    {
      title: "Market Positioning Analysis",
      description: "Strategic positioning evaluation including pricing, value propositions, and market segment targeting.",
      icon: Target,
      category: "Positioning",
      metrics: [
        "Pricing strategy analysis",
        "Value proposition mapping",
        "Market segment targeting",
        "Brand positioning assessment"
      ],
      insights: [
        "Positioning opportunities",
        "Pricing optimization",
        "Market gap identification",
        "Differentiation strategies"
      ],
      competitorScore: 85,
      yourScore: 71,
      gap: -14
    },
    {
      title: "Customer Experience Benchmarking",
      description: "Customer journey analysis, user experience evaluation, and service quality benchmarking against competitors.",
      icon: Users,
      category: "Experience",
      metrics: [
        "Customer journey mapping",
        "User experience scoring",
        "Service quality assessment",
        "Customer satisfaction benchmarks"
      ],
      insights: [
        "Experience improvement areas",
        "Customer pain point analysis",
        "Service gap opportunities",
        "Satisfaction enhancement strategies"
      ],
      competitorScore: 88,
      yourScore: 79,
      gap: -9
    },
    {
      title: "Innovation & R&D Tracking",
      description: "Research and development analysis, innovation pipeline tracking, and emerging technology adoption monitoring.",
      icon: Brain,
      category: "Innovation",
      metrics: [
        "R&D investment analysis",
        "Patent portfolio review",
        "Innovation pipeline tracking",
        "Technology adoption speed"
      ],
      insights: [
        "Innovation investment gaps",
        "Technology trend opportunities",
        "R&D optimization strategies",
        "Innovation timing advantages"
      ],
      competitorScore: 76,
      yourScore: 84,
      gap: +8
    },
    {
      title: "Financial Performance Analysis",
      description: "Financial metrics comparison, revenue analysis, and investment pattern evaluation for competitive intelligence.",
      icon: BarChart3,
      category: "Financial",
      metrics: [
        "Revenue growth tracking",
        "Investment pattern analysis",
        "Profitability benchmarking",
        "Market valuation comparison"
      ],
      insights: [
        "Financial performance gaps",
        "Investment opportunity areas",
        "Revenue optimization strategies",
        "Market position strength"
      ],
      competitorScore: 80,
      yourScore: 77,
      gap: -3
    }
  ];

  // Competitor Analysis Framework
  const analysisFramework = [
    {
      step: "01",
      title: "Discover",
      description: "Comprehensive competitor identification and market landscape mapping with AI-powered reconnaissance",
      icon: Radar,
      activities: [
        "Competitor identification",
        "Market landscape mapping",
        "Digital footprint scanning",
        "Baseline data collection"
      ]
    },
    {
      step: "02",
      title: "Analyze",
      description: "Deep competitive analysis across multiple dimensions with performance benchmarking",
      icon: Search,
      activities: [
        "Multi-dimensional analysis",
        "Performance benchmarking",
        "Gap identification",
        "Strength assessment"
      ]
    },
    {
      step: "03",
      title: "Insights",
      description: "Strategic insights generation with actionable recommendations and opportunity identification",
      icon: Brain,
      activities: [
        "Strategic insights generation",
        "Opportunity identification",
        "Threat assessment",
        "Recommendation development"
      ]
    },
    {
      step: "04",
      title: "Strategy",
      description: "Competitive strategy development with continuous monitoring and adaptive planning",
      icon: TrendingUp,
      activities: [
        "Competitive strategy formulation",
        "Action plan development",
        "Continuous monitoring setup",
        "Adaptive strategy evolution"
      ]
    }
  ];

  // Analysis Benefits
  const analysisBenefits = [
    {
      title: "Market Insights",
      value: "360°",
      description: "Comprehensive market view",
      icon: Eye
    },
    {
      title: "Strategy Improvement",
      value: "250%",
      description: "Strategic decision quality",
      icon: Target
    },
    {
      title: "Competitive Edge",
      value: "85%",
      description: "Market advantage increase",
      icon: TrendingUp
    },
    {
      title: "Risk Reduction",
      value: "70%",
      description: "Strategic risk mitigation",
      icon: Shield
    }
  ];

  // Calculate overall competitive position
  const overallYourScore = Math.round(
    analysisCategories.reduce((acc, category) => acc + category.yourScore, 0) / analysisCategories.length
  );

  const overallCompetitorScore = Math.round(
    analysisCategories.reduce((acc, category) => acc + category.competitorScore, 0) / analysisCategories.length
  );

  const overallGap = overallYourScore - overallCompetitorScore;

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
          
          {/* Animated Competitor Analysis Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Search, Radar, Target, BarChart3, Brain, Globe];
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
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                AI-Powered Competitor Intelligence
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
                Competitor <span className="gradient-text-blue">Analysis</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Advanced competitive intelligence platform powered by AI. 
                Analyze competitors across multiple dimensions and gain strategic insights for market advantage.
              </motion.p>
            </div>

            {/* Analysis Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {analysisBenefits.map((benefit, index) => (
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
                  Start Competitor Analysis
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
                  const element = document.getElementById('analysis-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Analysis Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('market-research')}
              >
                Market Research Tool
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Analysis Framework Section */}
      <section id="analysis-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Analysis <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase competitive analysis approach that provides deep market insights 
              and strategic recommendations for sustainable competitive advantage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {analysisFramework.map((step, index) => (
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

      {/* Competitive Analysis Categories Section */}
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
              Competitive <span className="gradient-text-blue">Analysis Dimensions</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive competitive analysis across six critical business dimensions 
              to provide complete visibility into market position and strategic opportunities.
            </p>
          </motion.div>

          <div className="space-y-8">
            {analysisCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Category Overview */}
                  <div>
                    <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge className="mb-2" variant="secondary">{category.category}</Badge>
                        <h3 className={`text-xl font-semibold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {category.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {category.description}
                    </p>
                  </div>

                  {/* Performance Comparison */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Performance Comparison
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Your Score */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Your Performance</span>
                          <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{category.yourScore}%</span>
                        </div>
                        <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2`}>
                          <div 
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${category.yourScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Competitor Score */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Competitor Average</span>
                          <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{category.competitorScore}%</span>
                        </div>
                        <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2`}>
                          <div 
                            className="h-2 rounded-full bg-red-500"
                            style={{ width: `${category.competitorScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Gap Analysis */}
                      <div className="pt-2">
                        <div className={`flex items-center gap-2 text-sm ${
                          category.gap >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {category.gap >= 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span className="font-semibold">
                            {category.gap >= 0 ? '+' : ''}{category.gap}% gap
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Metrics */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Analysis Metrics
                    </h4>
                    <ul className="space-y-2">
                      {category.metrics.map((metric, metricIndex) => (
                        <li key={metricIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Strategic Insights */}
                  <div>
                    <h4 className={`text-lg font-semibold mb-4 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      Strategic Insights
                    </h4>
                    <ul className="space-y-2">
                      {category.insights.map((insight, insightIndex) => (
                        <li key={insightIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Brain className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Competitive Position */}
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
              <h3 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Overall Competitive Position
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className={`text-4xl font-bold mb-2 text-blue-500`}>
                    {overallYourScore}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Average Score
                  </div>
                </div>

                <div>
                  <div className={`text-4xl font-bold mb-2 text-red-500`}>
                    {overallCompetitorScore}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Competitor Average
                  </div>
                </div>

                <div>
                  <div className={`text-4xl font-bold mb-2 ${
                    overallGap >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {overallGap >= 0 ? '+' : ''}{overallGap}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Competitive Gap
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="gradient-bg-blue text-white px-8 py-3 font-semibold rounded-xl"
                  onClick={() => navigate('demo-request')}
                >
                  Get Complete Competitive Analysis Report
                </Button>
              </div>
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
                  <Search className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Gain Competitive Intelligence?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Start your comprehensive competitor analysis and gain 360° market insights with 250% better strategic decisions.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Competitor Analysis
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Intelligence Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">AI-Powered Analysis</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">360° competitive intelligence</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Strategic Advantage</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">85% market advantage increase</p>
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