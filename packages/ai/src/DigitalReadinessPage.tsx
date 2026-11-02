"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  CheckCircle, TrendingUp, Zap, Target, Star, 
  ArrowRight, Settings, Brain, Globe, Monitor,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, Users, Eye,
  Gauge, AlertTriangle, Shield, Rocket
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface DigitalReadinessPageProps {
  navigate?: (page: any) => void;
}

export function DigitalReadinessPage({ navigate }: DigitalReadinessPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Digital Readiness Assessment Areas
  const readinessAreas = [
    {
      title: "Technology Infrastructure",
      description: "Assessment of current technology stack, cloud readiness, and IT infrastructure capabilities.",
      icon: Database,
      category: "Technology",
      questions: [
        "Cloud adoption and migration status",
        "Legacy system modernization needs",
        "Data infrastructure scalability",
        "Cybersecurity implementation level"
      ],
      currentScore: 72,
      targetScore: 90,
      readinessLevel: "Developing",
      priority: "High"
    },
    {
      title: "Digital Skills & Workforce",
      description: "Evaluation of team digital competencies, training needs, and workforce transformation readiness.",
      icon: Users,
      category: "Workforce",
      questions: [
        "Digital literacy assessment",
        "Training and development programs",
        "Change management readiness",
        "Leadership digital vision"
      ],
      currentScore: 65,
      targetScore: 85,
      readinessLevel: "Emerging",
      priority: "Critical"
    },
    {
      title: "Process Automation",
      description: "Analysis of process automation opportunities, workflow optimization, and operational efficiency.",
      icon: Workflow,
      category: "Process",
      questions: [
        "Manual process identification",
        "Automation tool adoption",
        "Workflow optimization level",
        "Efficiency measurement systems"
      ],
      currentScore: 58,
      targetScore: 88,
      readinessLevel: "Basic",
      priority: "Critical"
    },
    {
      title: "Data & Analytics",
      description: "Assessment of data strategy, analytics capabilities, and business intelligence maturity.",
      icon: BarChart3,
      category: "Analytics",
      questions: [
        "Data collection and quality",
        "Analytics tool implementation",
        "Business intelligence usage",
        "Data-driven decision making"
      ],
      currentScore: 68,
      targetScore: 92,
      readinessLevel: "Developing",
      priority: "High"
    },
    {
      title: "Customer Experience",
      description: "Evaluation of digital customer touchpoints, omnichannel integration, and service delivery.",
      icon: UserCheck,
      category: "Experience",
      questions: [
        "Digital customer journey mapping",
        "Omnichannel experience delivery",
        "Customer self-service capabilities",
        "Digital feedback and support"
      ],
      currentScore: 75,
      targetScore: 88,
      readinessLevel: "Advancing",
      priority: "Medium"
    },
    {
      title: "Innovation & Agility",
      description: "Assessment of innovation culture, agile practices, and organizational adaptability.",
      icon: Lightbulb,
      category: "Innovation",
      questions: [
        "Innovation culture and mindset",
        "Agile methodology adoption",
        "Rapid prototyping capabilities",
        "Market responsiveness speed"
      ],
      currentScore: 62,
      targetScore: 85,
      readinessLevel: "Emerging",
      priority: "High"
    }
  ];

  // Digital Readiness Assessment Framework
  const assessmentFramework = [
    {
      step: "01",
      title: "Assess",
      description: "Comprehensive digital readiness evaluation across all business dimensions",
      icon: Gauge,
      activities: [
        "Current state evaluation",
        "Digital capability assessment",
        "Gap identification",
        "Baseline establishment"
      ]
    },
    {
      step: "02",
      title: "Analyze",
      description: "Deep analysis of readiness gaps with prioritization and impact assessment",
      icon: Search,
      activities: [
        "Readiness gap analysis",
        "Priority area identification",
        "Impact assessment",
        "Readiness scoring"
      ]
    },
    {
      step: "03",
      title: "Plan",
      description: "Strategic readiness improvement planning with clear roadmap and milestones",
      icon: Target,
      activities: [
        "Improvement roadmap creation",
        "Milestone definition",
        "Resource planning",
        "Timeline establishment"
      ]
    },
    {
      step: "04",
      title: "Transform",
      description: "Digital transformation execution with continuous readiness monitoring",
      icon: Rocket,
      activities: [
        "Transformation execution",
        "Progress monitoring",
        "Readiness re-assessment",
        "Continuous improvement"
      ]
    }
  ];

  // Readiness Assessment Benefits
  const assessmentBenefits = [
    {
      title: "Readiness Score",
      value: "100%",
      description: "Complete readiness visibility",
      icon: Eye
    },
    {
      title: "Success Rate",
      value: "85%",
      description: "Transformation success increase",
      icon: TrendingUp
    },
    {
      title: "Risk Reduction",
      value: "70%",
      description: "Implementation risk decrease",
      icon: Shield
    },
    {
      title: "Speed Boost",
      value: "3x",
      description: "Faster transformation delivery",
      icon: Zap
    }
  ];

  // Calculate overall readiness score
  const overallCurrentScore = Math.round(
    readinessAreas.reduce((acc, area) => acc + area.currentScore, 0) / readinessAreas.length
  );

  const overallTargetScore = Math.round(
    readinessAreas.reduce((acc, area) => acc + area.targetScore, 0) / readinessAreas.length
  );

  const readinessGap = overallTargetScore - overallCurrentScore;

  // Get readiness level based on score
  const getReadinessLevel = (score: number) => {
    if (score >= 80) return { level: "Advanced", color: "text-green-500" };
    if (score >= 65) return { level: "Developing", color: "text-yellow-500" };
    if (score >= 50) return { level: "Emerging", color: "text-orange-500" };
    return { level: "Basic", color: "text-red-500" };
  };

  const overallReadiness = getReadinessLevel(overallCurrentScore);

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
          
          {/* Animated Digital Readiness Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [CheckCircle, Gauge, Target, Users, Workflow, Rocket];
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
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Quick Digital Readiness Assessment
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
                Digital <span className="gradient-text-blue">Readiness</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Quick digital readiness assessment to evaluate your organization's transformation preparedness. 
                Identify gaps, prioritize improvements, and accelerate your digital journey.
              </motion.p>
            </div>

            {/* Assessment Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {assessmentBenefits.map((benefit, index) => (
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
                  Start Readiness Assessment
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
                  const element = document.getElementById('assessment-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Assessment Framework
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
                Full Maturity Assessment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Assessment Framework Section */}
      <section id="assessment-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Assessment <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase digital readiness assessment approach that provides clear insights 
              into your organization's transformation preparedness and improvement priorities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assessmentFramework.map((step, index) => (
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

      {/* Readiness Areas Section */}
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
              Digital <span className="gradient-text-blue">Readiness Areas</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive assessment across six critical readiness dimensions 
              to provide complete visibility into your digital transformation preparedness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {readinessAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Area Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                  
                  <div className="text-right">
                    <Badge 
                      variant={area.priority === 'Critical' ? 'destructive' : area.priority === 'High' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {area.priority}
                    </Badge>
                  </div>
                </div>

                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {area.description}
                </p>

                {/* Readiness Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Current Readiness
                    </span>
                    <span className={`text-sm font-bold ${
                      area.currentScore >= 80 ? 'text-green-500' : 
                      area.currentScore >= 65 ? 'text-yellow-500' : 
                      area.currentScore >= 50 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {area.currentScore}%
                    </span>
                  </div>
                  <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2`}>
                    <div 
                      className={`h-2 rounded-full ${
                        area.currentScore >= 80 ? 'bg-green-500' : 
                        area.currentScore >= 65 ? 'bg-yellow-500' : 
                        area.currentScore >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${area.currentScore}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Level: {area.readinessLevel}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Target: {area.targetScore}%
                    </span>
                  </div>
                </div>

                {/* Assessment Questions */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Key Assessment Areas:
                  </h4>
                  <ul className="space-y-2">
                    {area.questions.slice(0, 3).map((question, questionIndex) => (
                      <li key={questionIndex} className={`flex items-center gap-2 text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        {question}
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
                      Assess This Area
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Readiness Score */}
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
                Overall Digital Readiness Score
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className={`text-5xl font-bold mb-2 ${overallReadiness.color}`}>
                    {overallCurrentScore}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Current Readiness
                  </div>
                  <div className={`text-sm ${overallReadiness.color}`}>
                    {overallReadiness.level}
                  </div>
                </div>

                <div>
                  <div className={`text-5xl font-bold mb-2 text-green-500`}>
                    {overallTargetScore}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Target Readiness
                  </div>
                  <div className={`text-sm text-green-500`}>
                    Advanced Level
                  </div>
                </div>

                <div>
                  <div className={`text-5xl font-bold mb-2 text-blue-500`}>
                    {readinessGap}%
                  </div>
                  <div className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Improvement Gap
                  </div>
                  <div className={`text-sm text-blue-500`}>
                    Action Required
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="gradient-bg-blue text-white px-8 py-3 font-semibold rounded-xl"
                  onClick={() => navigate('demo-request')}
                >
                  Get Complete Readiness Assessment Report
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
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Assess Your Digital Readiness?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Start your quick digital readiness assessment and achieve 100% readiness visibility with 85% transformation success rate.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Free Assessment
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Readiness Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Quick Assessment</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">6 critical readiness areas</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Success</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">85% transformation success rate</p>
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