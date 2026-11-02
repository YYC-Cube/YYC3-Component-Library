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
  PieChart, LineChart, Radar, Filter, Map
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface MarketResearchPageProps {
  navigate?: (page: any) => void;
}

export function MarketResearchPage({ navigate }: MarketResearchPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Market Research Categories
  const researchCategories = [
    {
      title: "Market Size & Opportunity Analysis",
      description: "Comprehensive market sizing with TAM, SAM, SOM analysis and growth opportunity identification.",
      icon: PieChart,
      category: "Market Sizing",
      methodologies: [
        "Total Addressable Market (TAM)",
        "Serviceable Available Market (SAM)",
        "Serviceable Obtainable Market (SOM)",
        "Market growth projection modeling"
      ],
      insights: [
        "Market opportunity quantification",
        "Growth trend analysis",
        "Revenue potential assessment",
        "Investment requirement estimation"
      ],
      timeline: "2-4 weeks",
      confidence: 92
    },
    {
      title: "Customer Behavior & Segmentation",
      description: "Deep customer research with behavioral analysis, preference mapping, and demographic segmentation.",
      icon: Users,
      category: "Customer",
      methodologies: [
        "Customer journey mapping",
        "Behavioral pattern analysis",
        "Psychographic segmentation",
        "Purchase decision modeling"
      ],
      insights: [
        "Customer persona development",
        "Behavior-driven strategies",
        "Preference optimization",
        "Targeting precision enhancement"
      ],
      timeline: "3-5 weeks",
      confidence: 88
    },
    {
      title: "Industry & Competitive Landscape",
      description: "Comprehensive industry analysis with competitive positioning, market structure, and dynamics evaluation.",
      icon: Radar,
      category: "Industry",
      methodologies: [
        "Industry structure analysis",
        "Competitive landscape mapping",
        "Value chain examination",
        "Market dynamics assessment"
      ],
      insights: [
        "Industry trend identification",
        "Competitive advantage areas",
        "Market entry strategies",
        "Partnership opportunities"
      ],
      timeline: "4-6 weeks",
      confidence: 90
    },
    {
      title: "Geographic & Regional Analysis",
      description: "Regional market analysis with geographic expansion opportunities and localization requirements.",
      icon: Map,
      category: "Geographic",
      methodologies: [
        "Regional market assessment",
        "Geographic expansion analysis",
        "Cultural adaptation requirements",
        "Regulatory landscape mapping"
      ],
      insights: [
        "Expansion priority markets",
        "Localization strategies",
        "Regulatory compliance plans",
        "Cultural adaptation frameworks"
      ],
      timeline: "3-4 weeks",
      confidence: 85
    },
    {
      title: "Technology & Innovation Trends",
      description: "Technology landscape analysis with innovation tracking, disruption assessment, and adoption patterns.",
      icon: Brain,
      category: "Technology",
      methodologies: [
        "Technology trend analysis",
        "Innovation pipeline tracking",
        "Disruption impact assessment",
        "Adoption curve modeling"
      ],
      insights: [
        "Technology opportunity identification",
        "Innovation investment priorities",
        "Disruption preparedness plans",
        "Technology roadmap alignment"
      ],
      timeline: "2-3 weeks",
      confidence: 87
    },
    {
      title: "Regulatory & Policy Impact",
      description: "Regulatory environment analysis with policy impact assessment and compliance requirement mapping.",
      icon: Database,
      category: "Regulatory",
      methodologies: [
        "Regulatory landscape analysis",
        "Policy impact assessment",
        "Compliance requirement mapping",
        "Regulatory risk evaluation"
      ],
      insights: [
        "Compliance strategy development",
        "Regulatory risk mitigation",
        "Policy opportunity identification",
        "Strategic adaptation plans"
      ],
      timeline: "2-4 weeks",
      confidence: 94
    }
  ];

  // Market Research Framework
  const researchFramework = [
    {
      step: "01",
      title: "Define",
      description: "Research objective definition with scope clarification and methodology selection",
      icon: Target,
      activities: [
        "Research objective setting",
        "Scope and boundary definition",
        "Methodology selection",
        "Success criteria establishment"
      ]
    },
    {
      step: "02",
      title: "Collect",
      description: "Comprehensive data collection using multiple sources and research methodologies",
      icon: Search,
      activities: [
        "Primary research execution",
        "Secondary data collection",
        "Expert interview conduction",
        "Survey and data gathering"
      ]
    },
    {
      step: "03",
      title: "Analyze",
      description: "Advanced data analysis with pattern recognition and insight generation",
      icon: BarChart3,
      activities: [
        "Statistical analysis",
        "Pattern identification",
        "Trend analysis",
        "Insight synthesis"
      ]
    },
    {
      step: "04",
      title: "Recommend",
      description: "Strategic recommendation development with actionable insights and implementation plans",
      icon: TrendingUp,
      activities: [
        "Strategic recommendation formulation",
        "Implementation roadmap creation",
        "Risk assessment",
        "Success measurement framework"
      ]
    }
  ];

  // Research Benefits
  const researchBenefits = [
    {
      title: "Market Insights",
      value: "95%",
      description: "Research accuracy rate",
      icon: Eye
    },
    {
      title: "Decision Quality",
      value: "300%",
      description: "Strategic decision improvement",
      icon: Target
    },
    {
      title: "Risk Reduction",
      value: "75%",
      description: "Market entry risk decrease",
      icon: Award
    },
    {
      title: "ROI Improvement",
      value: "250%",
      description: "Investment return enhancement",
      icon: TrendingUp
    }
  ];

  // Calculate overall research confidence
  const overallConfidence = Math.round(
    researchCategories.reduce((acc, category) => acc + category.confidence, 0) / researchCategories.length
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
          
          {/* Animated Market Research Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [BarChart3, PieChart, LineChart, Radar, Map, Brain];
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
                Advanced Market Research Platform
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
                Market <span className="gradient-text-blue">Research</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Comprehensive market research and insights platform powered by AI. 
                Uncover market opportunities, understand customer behavior, and make data-driven strategic decisions.
              </motion.p>
            </div>

            {/* Research Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {researchBenefits.map((benefit, index) => (
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
                  Start Market Research
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
                  const element = document.getElementById('research-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Research Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('competitor-analysis')}
              >
                Competitor Analysis Tool
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Research Framework Section */}
      <section id="research-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Research <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase market research approach that delivers actionable insights 
              and strategic recommendations for informed business decision making.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchFramework.map((step, index) => (
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

      {/* Market Research Categories Section */}
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
              Market Research <span className="gradient-text-blue">Categories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive market research across six critical business dimensions 
              to provide complete market intelligence and strategic insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                  
                  <div className="text-right">
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Timeline: {category.timeline}
                    </div>
                    <div className={`text-sm font-bold ${
                      category.confidence >= 90 ? 'text-green-500' : 
                      category.confidence >= 85 ? 'text-yellow-500' : 'text-blue-500'
                    }`}>
                      {category.confidence}% confidence
                    </div>
                  </div>
                </div>

                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {category.description}
                </p>

                {/* Research Methodologies */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Research Methodologies:
                  </h4>
                  <ul className="space-y-2">
                    {category.methodologies.map((methodology, methodIndex) => (
                      <li key={methodIndex} className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        {methodology}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategic Insights */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Strategic Insights:
                  </h4>
                  <ul className="space-y-2">
                    {category.insights.slice(0, 3).map((insight, insightIndex) => (
                      <li key={insightIndex} className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <Brain className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    className="w-full gradient-bg-blue text-white rounded-xl"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      Start Research
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Research Confidence */}
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
                Overall Research Confidence Level
              </h3>
              
              <div className={`text-6xl font-bold mb-4 ${
                overallConfidence >= 90 ? 'text-green-500' : 
                overallConfidence >= 85 ? 'text-yellow-500' : 'text-blue-500'
              }`}>
                {overallConfidence}%
              </div>

              <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {overallConfidence >= 90 ? 'Exceptional Research Accuracy' : 
                 overallConfidence >= 85 ? 'High-Quality Research Standards' : 'Reliable Research Foundation'}
              </p>

              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-3 font-semibold rounded-xl"
                onClick={() => navigate('demo-request')}
              >
                Get Complete Market Research Report
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
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Unlock Market Insights?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Start your comprehensive market research and achieve 95% research accuracy with 300% better strategic decisions.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Market Research
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Research Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Comprehensive Research</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">6 critical market dimensions</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Accuracy</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">95% research reliability</p>
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