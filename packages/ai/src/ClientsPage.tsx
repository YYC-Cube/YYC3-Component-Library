"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Building2, Globe, TrendingUp, Award, Users, Star, 
  ArrowRight, ExternalLink, Calendar, Target, Zap,
  BarChart3, Rocket, CheckCircle, Quote, Filter,
  MessageSquare, Phone, Mail, Briefcase
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ClientsPageProps {
  navigate?: (page: any) => void;
}

export function ClientsPage({ navigate }: ClientsPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Client Portfolio Data
  const clients = [
    {
      id: 'tech-startup-a',
      name: 'TechFlow Solutions',
      industry: 'Technology',
      region: 'Southeast Asia',
      size: 'Mid-size (200-500 employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://techflow.example.com',
      description: 'Leading SaaS platform for workflow automation',
      challenge: 'Needed AI-powered analytics to improve user engagement and reduce churn',
      solution: 'Implemented ML-driven user behavior analysis and predictive retention models',
      results: [
        { metric: 'User Engagement', improvement: '+45%', icon: TrendingUp },
        { metric: 'Churn Reduction', improvement: '-32%', icon: Target },
        { metric: 'Revenue Growth', improvement: '+28%', icon: BarChart3 }
      ],
      testimonial: {
        quote: "Delibix transformed our understanding of user behavior. Their AI solutions helped us reduce churn by 32% and significantly improved our product engagement.",
        author: "Sarah Chen",
        position: "CEO, TechFlow Solutions"
      },
      projectDuration: '6 months',
      technologies: ['Machine Learning', 'Predictive Analytics', 'Real-time Data Processing'],
      caseStudyUrl: '#case-study-techflow',
      featured: true,
      completedDate: '2024-03-15'
    },
    {
      id: 'ecommerce-b',
      name: 'ShopSmart Indonesia',
      industry: 'E-commerce',
      region: 'Indonesia',
      size: 'Large (500+ employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://shopsmart.example.com',
      description: 'Indonesia\'s fastest-growing e-commerce platform',
      challenge: 'Required AI recommendation engine to increase sales and improve customer experience',
      solution: 'Built personalized recommendation system using collaborative filtering and deep learning',
      results: [
        { metric: 'Sales Conversion', improvement: '+52%', icon: TrendingUp },
        { metric: 'Average Order Value', improvement: '+38%', icon: BarChart3 },
        { metric: 'Customer Satisfaction', improvement: '+41%', icon: Star }
      ],
      testimonial: {
        quote: "The AI recommendation system from Delibix increased our conversion rates by over 50%. It's been a game-changer for our business.",
        author: "Budi Santoso",
        position: "CTO, ShopSmart Indonesia"
      },
      projectDuration: '8 months',
      technologies: ['Recommendation Systems', 'Deep Learning', 'Real-time Personalization'],
      caseStudyUrl: '#case-study-shopsmart',
      featured: true,
      completedDate: '2024-01-20'
    },
    {
      id: 'healthcare-c',
      name: 'MedCare Digital',
      industry: 'Healthcare',
      region: 'Global',
      size: 'Large (500+ employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://medcare.example.com',
      description: 'Digital healthcare platform serving patients worldwide',
      challenge: 'Needed AI diagnostic assistance to improve accuracy and reduce diagnosis time',
      solution: 'Developed computer vision models for medical image analysis and symptom prediction',
      results: [
        { metric: 'Diagnostic Accuracy', improvement: '+35%', icon: Target },
        { metric: 'Diagnosis Time', improvement: '-40%', icon: Zap },
        { metric: 'Patient Satisfaction', improvement: '+48%', icon: Star }
      ],
      testimonial: {
        quote: "Delibix's AI diagnostic tools have revolutionized our patient care. We're seeing significantly faster and more accurate diagnoses.",
        author: "Dr. Amanda Foster",
        position: "Chief Medical Officer, MedCare Digital"
      },
      projectDuration: '12 months',
      technologies: ['Computer Vision', 'Medical AI', 'Natural Language Processing'],
      caseStudyUrl: '#case-study-medcare',
      featured: true,
      completedDate: '2023-11-10'
    },
    {
      id: 'fintech-d',
      name: 'PaySecure',
      industry: 'Financial Services',
      region: 'Asia Pacific',
      size: 'Mid-size (200-500 employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://paysecure.example.com',
      description: 'Digital payment platform with advanced security features',
      challenge: 'Required fraud detection system to protect users and reduce financial losses',
      solution: 'Implemented ML-based fraud detection with real-time transaction monitoring',
      results: [
        { metric: 'Fraud Detection', improvement: '+67%', icon: Target },
        { metric: 'False Positives', improvement: '-45%', icon: CheckCircle },
        { metric: 'Processing Speed', improvement: '+55%', icon: Zap }
      ],
      testimonial: {
        quote: "The fraud detection system from Delibix has saved us millions. It's incredibly accurate and fast.",
        author: "Michael Wang",
        position: "Head of Security, PaySecure"
      },
      projectDuration: '4 months',
      technologies: ['Fraud Detection', 'Real-time Analytics', 'Anomaly Detection'],
      caseStudyUrl: '#case-study-paysecure',
      featured: false,
      completedDate: '2024-02-28'
    },
    {
      id: 'manufacturing-e',
      name: 'IndustryOpt',
      industry: 'Manufacturing',
      region: 'Southeast Asia',
      size: 'Large (500+ employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://industryopt.example.com',
      description: 'Smart manufacturing solutions for industrial automation',
      challenge: 'Needed predictive maintenance to reduce downtime and optimize operations',
      solution: 'Built IoT-integrated predictive maintenance system using sensor data and ML',
      results: [
        { metric: 'Equipment Downtime', improvement: '-58%', icon: Target },
        { metric: 'Maintenance Costs', improvement: '-42%', icon: BarChart3 },
        { metric: 'Production Efficiency', improvement: '+36%', icon: TrendingUp }
      ],
      testimonial: {
        quote: "Delibix's predictive maintenance solution has dramatically reduced our downtime and maintenance costs.",
        author: "Lisa Chen",
        position: "Operations Director, IndustryOpt"
      },
      projectDuration: '10 months',
      technologies: ['IoT Integration', 'Predictive Analytics', 'Industrial AI'],
      caseStudyUrl: '#case-study-industryopt',
      featured: false,
      completedDate: '2023-12-05'
    },
    {
      id: 'education-f',
      name: 'EduTech Global',
      industry: 'Education',
      region: 'Global',
      size: 'Mid-size (200-500 employees)',
      logo: '/api/placeholder/200/80',
      website: 'https://edutech.example.com',
      description: 'Online learning platform with adaptive AI tutoring',
      challenge: 'Required personalized learning system to improve student outcomes',
      solution: 'Developed adaptive learning AI that personalizes content based on student progress',
      results: [
        { metric: 'Learning Outcomes', improvement: '+43%', icon: Target },
        { metric: 'Student Engagement', improvement: '+51%', icon: TrendingUp },
        { metric: 'Course Completion', improvement: '+39%', icon: CheckCircle }
      ],
      testimonial: {
        quote: "The adaptive learning system has transformed how our students learn. Engagement and outcomes have improved dramatically.",
        author: "Dr. Robert Thompson",
        position: "Chief Academic Officer, EduTech Global"
      },
      projectDuration: '7 months',
      technologies: ['Adaptive Learning', 'Natural Language Processing', 'Educational AI'],
      caseStudyUrl: '#case-study-edutech',
      featured: false,
      completedDate: '2024-04-10'
    }
  ];

  // Industry filters
  const industries = [
    { id: 'all', name: 'All Industries', count: clients.length },
    { id: 'Technology', name: 'Technology', count: clients.filter(c => c.industry === 'Technology').length },
    { id: 'E-commerce', name: 'E-commerce', count: clients.filter(c => c.industry === 'E-commerce').length },
    { id: 'Healthcare', name: 'Healthcare', count: clients.filter(c => c.industry === 'Healthcare').length },
    { id: 'Financial Services', name: 'Financial Services', count: clients.filter(c => c.industry === 'Financial Services').length },
    { id: 'Manufacturing', name: 'Manufacturing', count: clients.filter(c => c.industry === 'Manufacturing').length },
    { id: 'Education', name: 'Education', count: clients.filter(c => c.industry === 'Education').length }
  ];

  // Region filters
  const regions = [
    { id: 'all', name: 'All Regions', count: clients.length },
    { id: 'Indonesia', name: 'Indonesia', count: clients.filter(c => c.region === 'Indonesia').length },
    { id: 'Southeast Asia', name: 'Southeast Asia', count: clients.filter(c => c.region === 'Southeast Asia').length },
    { id: 'Asia Pacific', name: 'Asia Pacific', count: clients.filter(c => c.region === 'Asia Pacific').length },
    { id: 'Global', name: 'Global', count: clients.filter(c => c.region === 'Global').length }
  ];

  // Client stats
  const clientStats = [
    { label: 'Happy Clients', value: clients.length, icon: Building2 },
    { label: 'Industries Served', value: industries.length - 1, icon: Target },
    { label: 'Countries', value: '12+', icon: Globe },
    { label: 'Success Rate', value: '98%', icon: Award }
  ];

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesIndustry = selectedIndustry === 'all' || client.industry === selectedIndustry;
    const matchesRegion = selectedRegion === 'all' || client.region === selectedRegion;
    return matchesIndustry && matchesRegion;
  });

  // Get industry icon
  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'Technology': return Rocket;
      case 'E-commerce': return BarChart3;
      case 'Healthcare': return Target;
      case 'Financial Services': return TrendingUp;
      case 'Manufacturing': return Building2;
      case 'Education': return Users;
      default: return Building2;
    }
  };

  // Get industry color
  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'Technology': return 'from-blue-500 to-blue-600';
      case 'E-commerce': return 'from-green-500 to-green-600';
      case 'Healthcare': return 'from-red-500 to-red-600';
      case 'Financial Services': return 'from-purple-500 to-purple-600';
      case 'Manufacturing': return 'from-orange-500 to-orange-600';
      case 'Education': return 'from-teal-500 to-teal-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Client Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Building2, Target, TrendingUp, BarChart3, Rocket, Globe];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + (i % 4) * 25}%`,
                    top: `${10 + Math.floor(i / 4) * 30}%`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                >
                  <IconComponent className="w-14 h-14 text-blue-500" />
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
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {clients.length}+ Successful Projects
              </span>
              <Award className="w-4 h-4 text-amber-500" />
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
                Our <span className="gradient-text-blue">Clients</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Trusted by innovative companies worldwide to transform their businesses with AI. 
                From startups to enterprises, we deliver results that matter.
              </motion.p>
            </div>

            {/* Client Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {clientStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-blue-500" />
                    <div className={`text-3xl font-bold gradient-text-blue`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
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
                onClick={() => navigate('contact')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Start Your Project
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
                  const element = document.getElementById('client-portfolio');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View Portfolio
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Client Portfolio Section */}
      <section id="client-portfolio" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Client <span className="gradient-text-blue">Portfolio</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Explore our successful AI implementations across various industries and regions.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-12 space-y-6">
            {/* Industry Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <motion.button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedIndustry === industry.id
                      ? 'gradient-bg-blue text-white shadow-lg'
                      : isDark
                        ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                        : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{industry.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedIndustry === industry.id
                      ? 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {industry.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {regions.map((region) => (
                <motion.button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedRegion === region.id
                      ? 'gradient-bg-blue text-white shadow-lg'
                      : isDark
                        ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                        : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className="w-4 h-4" />
                  <span>{region.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedRegion === region.id
                      ? 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {region.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Client Grid */}
          <div className="space-y-8">
            {filteredClients.map((client, index) => {
              const IndustryIcon = getIndustryIcon(client.industry);
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  } ${client.featured ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="p-8">
                    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRTL ? 'lg:grid-flow-col-reverse' : ''}`}>
                      {/* Client Info */}
                      <div className="lg:col-span-2">
                        <div className={`flex items-start gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getIndustryColor(client.industry)} flex items-center justify-center flex-shrink-0`}>
                            <IndustryIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className={`flex items-center gap-4 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <h3 className={`text-2xl font-bold ${
                                isDark ? 'text-slate-100' : 'text-slate-900'
                              }`}>
                                {client.name}
                              </h3>
                              {client.featured && (
                                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className={`text-base mb-2 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {client.description}
                            </p>
                            <div className={`flex items-center gap-4 text-sm ${
                              isDark ? 'text-slate-500' : 'text-slate-500'
                            }`}>
                              <span>{client.industry}</span>
                              <span>•</span>
                              <span>{client.region}</span>
                              <span>•</span>
                              <span>{client.size}</span>
                            </div>
                          </div>
                        </div>

                        {/* Challenge & Solution */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              Challenge
                            </h4>
                            <p className={`text-sm ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {client.challenge}
                            </p>
                          </div>
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              Solution
                            </h4>
                            <p className={`text-sm ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {client.solution}
                            </p>
                          </div>
                        </div>

                        {/* Results */}
                        <div className="mb-6">
                          <h4 className={`text-lg font-semibold mb-4 ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            Results Achieved
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {client.results.map((result, resultIndex) => (
                              <div
                                key={resultIndex}
                                className={`p-4 rounded-xl ${
                                  isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
                                }`}
                              >
                                <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <result.icon className="w-5 h-5 text-blue-500" />
                                  <span className={`text-2xl font-bold ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}>
                                    {result.improvement}
                                  </span>
                                </div>
                                <p className={`text-sm font-medium ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  {result.metric}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-6">
                          <h4 className={`text-lg font-semibold mb-3 ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {client.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Testimonial & Actions */}
                      <div className="lg:col-span-1">
                        {/* Testimonial */}
                        <div className={`p-6 rounded-2xl mb-6 ${
                          isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
                        }`}>
                          <Quote className="w-8 h-8 text-blue-500 mb-4" />
                          <p className={`text-sm italic mb-4 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            "{client.testimonial.quote}"
                          </p>
                          <div className={`border-t pt-4 ${
                            isDark ? 'border-slate-700' : 'border-slate-200'
                          }`}>
                            <p className={`font-semibold ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              {client.testimonial.author}
                            </p>
                            <p className={`text-sm ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {client.testimonial.position}
                            </p>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className={`p-6 rounded-2xl mb-6 ${
                          isDark ? 'bg-slate-800/30 border border-slate-700' : 'bg-blue-50 border border-blue-200'
                        }`}>
                          <div className="space-y-3 text-sm">
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Duration:</span>
                              <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>{client.projectDuration}</span>
                            </div>
                            <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Completed:</span>
                              <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>
                                {new Date(client.completedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                          <Button
                            className="w-full gradient-bg-blue text-white"
                            onClick={() => window.open(client.caseStudyUrl, '_blank')}
                          >
                            <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              View Case Study
                              <ExternalLink className="w-4 h-4" />
                            </span>
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(client.website, '_blank')}
                          >
                            <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              Visit Website
                              <ExternalLink className="w-4 h-4" />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Building2 className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No clients found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="text-blue-200">Join Our Success Stories</span>?
            </h2>
            
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              Transform your business with AI solutions that deliver real results. 
              Join hundreds of companies worldwide who trust Delibix to drive their digital transformation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('contact')}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                Start Your Project
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('services')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                View Our Services
              </Button>
            </div>

            {/* Contact Info */}
            <motion.div
              className="pt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-blue-200 mb-4">
                Ready to discuss your project? Let's explore how we can help you succeed.
              </p>
              <div className="flex items-center justify-center gap-6">
                <span className="text-blue-100">hello@delibix.com</span>
                <span className="text-blue-100">+62 857 7002 4933</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}