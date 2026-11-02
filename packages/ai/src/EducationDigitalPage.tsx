"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  GraduationCap, Users, Brain, BookOpen, CheckCircle, Star, 
  ArrowRight, Monitor, Laptop, Building2, Database, Globe,
  Clock, Target, Zap, Award, TrendingUp, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Settings, Lightbulb,
  Rocket, Eye, BarChart3, Tablet, Smartphone, Play
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface EducationDigitalPageProps {
  navigate?: (page: any) => void;
}

export function EducationDigitalPage({ navigate }: EducationDigitalPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Education Digital Solutions
  const educationSolutions = [
    {
      title: "Learning Management System",
      description: "Comprehensive AI-powered LMS with personalized learning paths, automated assessments, and student progress tracking.",
      icon: GraduationCap,
      features: [
        "Personalized learning paths",
        "Automated assessment & grading",
        "Student progress analytics",
        "Interactive content delivery"
      ],
      metrics: {
        engagement: "85% higher student engagement",
        completion: "70% better course completion",
        efficiency: "60% admin time savings"
      }
    },
    {
      title: "Virtual Classroom Platform",
      description: "Interactive online learning environment with real-time collaboration, AI tutoring, and immersive learning experiences.",
      icon: Monitor,
      features: [
        "HD video conferencing",
        "Interactive whiteboard",
        "Real-time collaboration tools",
        "AI-powered teaching assistant"
      ],
      metrics: {
        accessibility: "24/7 learning access",
        interaction: "3x more interaction",
        satisfaction: "4.8/5 teacher rating"
      }
    },
    {
      title: "Student Information System",
      description: "Complete student lifecycle management from admission to graduation with AI-powered insights and automated workflows.",
      icon: Users,
      features: [
        "Student lifecycle management",
        "Automated administrative tasks",
        "Parent-teacher communication",
        "Performance analytics dashboard"
      ],
      metrics: {
        efficiency: "50% faster processing",
        accuracy: "95% data accuracy",
        communication: "80% better parent engagement"
      }
    },
    {
      title: "AI Tutoring & Assessment",
      description: "Intelligent tutoring system with adaptive learning, personalized feedback, and automated assessment generation.",
      icon: Brain,
      features: [
        "Adaptive learning algorithms",
        "Personalized feedback system",
        "Automated question generation",
        "Learning outcome prediction"
      ],
      metrics: {
        performance: "45% learning improvement",
        retention: "60% better knowledge retention",
        support: "24/7 intelligent tutoring"
      }
    }
  ];

  // Education Industry Stats
  const industryStats = [
    { label: "Educational Institutions", value: "150+", desc: "Successfully digitized" },
    { label: "Students Impacted", value: "500K+", desc: "Enhanced learning experience" },
    { label: "Learning Efficiency", value: "70%", desc: "Average improvement" },
    { label: "Teacher Satisfaction", value: "4.9/5", desc: "Platform rating" }
  ];

  // Digital Learning Benefits
  const learningBenefits = [
    {
      title: "Student Engagement",
      value: "85%",
      description: "Higher engagement with digital tools",
      icon: Users
    },
    {
      title: "Learning Outcomes",
      value: "70%",
      description: "Better learning outcome achievement",
      icon: Target
    },
    {
      title: "Administrative Efficiency",
      value: "60%",
      description: "Time savings in admin tasks",
      icon: Zap
    },
    {
      title: "Cost Reduction",
      value: "40%",
      description: "Lower operational costs",
      icon: TrendingUp
    }
  ];

  // Success Stories
  const successStories = [
    {
      organization: "Indonesian International University",
      type: "Higher Education",
      students: "25,000 students",
      challenge: "Fragmented learning systems and poor student engagement in online classes",
      solution: "Complete LMS implementation with AI-powered personalization and virtual classroom integration",
      results: [
        "85% increase in student engagement",
        "70% improvement in course completion rates",
        "50% reduction in administrative workload",
        "4.8/5 student satisfaction score"
      ]
    },
    {
      organization: "Smart School Network Jakarta",
      type: "K-12 Education",
      students: "15,000 students across 20 schools",
      challenge: "Inconsistent teaching quality and difficulty tracking student progress across multiple campuses",
      solution: "Unified digital education platform with AI tutoring and comprehensive student information system",
      results: [
        "60% improvement in learning outcomes",
        "90% better parent-teacher communication",
        "45% increase in teacher efficiency",
        "Unified management across all campuses"
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
          
          {/* Animated Education Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [GraduationCap, BookOpen, Brain, Monitor, Laptop, Lightbulb];
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
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Education Digital Transformation
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
                Future of <span className="gradient-text-blue">Learning</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Transform education with AI-powered learning platforms. From personalized learning experiences 
                to intelligent tutoring systems, we digitize education for better outcomes and engagement.
              </motion.p>
            </div>

            {/* Learning Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {learningBenefits.map((benefit, index) => (
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
                  Start Education Transformation
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
                  const element = document.getElementById('education-solutions');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Education Solutions
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('success-stories')}
              >
                Education Success Stories
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Education Solutions Section */}
      <section id="education-solutions" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Education <span className="gradient-text-blue">Solutions</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive digital education solutions designed to enhance learning outcomes, 
              improve student engagement, and streamline educational operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educationSolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`flex items-start gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center flex-shrink-0`}>
                    <solution.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {solution.title}
                    </h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                      {solution.description}
                    </p>
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
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(solution.metrics).map(([key, value]) => (
                    <div key={key} className={`p-3 rounded-xl ${
                      isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className={`text-sm font-semibold ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
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
              Education <span className="gradient-text-blue">Success Stories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Real transformations from educational institutions that revolutionized learning with Delibix.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.organization}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {story.organization}
                    </h3>
                    <div className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {story.type} • {story.students}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Challenge:
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {story.challenge}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Solution:
                    </h4>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {story.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Results Achieved:
                    </h4>
                    <ul className="space-y-2">
                      {story.results.map((result, resultIndex) => (
                        <li key={resultIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
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
              Ready to Transform Your <span className="gradient-text-blue">Educational Institution</span>?
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Join 150+ educational institutions that have successfully digitized their learning with Delibix.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('demo-request')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Get Free Education Assessment
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
                Contact Education Experts
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}