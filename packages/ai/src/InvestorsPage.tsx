"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { useLanguage } from "./LanguageProvider";
import { useDarkMode } from "./DarkModeProvider";
import { 
  TrendingUp,
  Target,
  Users,
  Globe,
  Zap,
  Shield,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Rocket,
  Building,
  Mail,
  Phone,
  Download,
  ExternalLink,
  ChevronRight,
  Star,
  Home,
  Heart,
  Brain,
  Lightbulb,
  Handshake,
  Lock,
  CheckCircle,
  Circle,
  Clock
} from "lucide-react";

interface InvestorsPageProps {
  navigate: (page: any) => void;
}

export function InvestorsPage({ navigate }: InvestorsPageProps) {
  const { t, isRTL } = useLanguage();
  const { isDark } = useDarkMode();
  const shouldReduceMotion = useReducedMotion();

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Key metrics data
  const keyMetrics = [
    { label: "Market Size", value: "$2.8B", growth: "+45%", description: "Indonesia AI Market 2024", icon: Globe },
    { label: "Revenue Growth", value: "320%", growth: "YoY", description: "Annual recurring revenue", icon: TrendingUp },
    { label: "Client Retention", value: "95%", growth: "+12%", description: "Customer satisfaction rate", icon: Heart },
    { label: "Team Size", value: "28", growth: "+180%", description: "Technical experts", icon: Users }
  ];

  // Investment highlights
  const investmentHighlights = [
    {
      icon: Target,
      title: "Market Leadership",
      description: "First-mover advantage in Indonesia's AI consulting market with proven track record.",
      value: "#1",
      subtitle: "AI Consultancy in Yogyakarta"
    },
    {
      icon: Rocket,
      title: "Rapid Growth",
      description: "320% revenue growth with expanding client base across multiple industries.",
      value: "320%",
      subtitle: "Annual Growth Rate"
    },
    {
      icon: Globe,
      title: "Market Opportunity",
      description: "Indonesia's AI market projected to reach $7.2B by 2030 with 35% CAGR.",
      value: "$7.2B",
      subtitle: "Market Size by 2030"
    },
    {
      icon: Award,
      title: "Client Success",
      description: "95% client retention rate with proven ROI improvements across all projects.",
      value: "95%",
      subtitle: "Client Retention"
    }
  ];

  // Revenue streams
  const revenueStreams = [
    { name: "AI Consulting", percentage: 45, color: "from-blue-500 to-blue-600", revenue: "$450K" },
    { name: "Custom Development", percentage: 30, color: "from-green-500 to-green-600", revenue: "$300K" },
    { name: "Training & Workshops", percentage: 15, color: "from-purple-500 to-purple-600", revenue: "$150K" },
    { name: "SaaS Products", percentage: 10, color: "from-orange-500 to-orange-600", revenue: "$100K" }
  ];

  // Competitive advantages
  const competitiveAdvantages = [
    {
      icon: Brain,
      title: "AI Expertise",
      description: "Deep technical knowledge in machine learning, NLP, and computer vision with proven implementations.",
      points: ["10+ AI specializations", "Advanced ML algorithms", "Custom model development"]
    },
    {
      icon: MapPin,
      title: "Local Market Understanding",
      description: "Native understanding of Indonesian business culture and regulatory environment.",
      points: ["Cultural expertise", "Local partnerships", "Government relations"]
    },
    {
      icon: Zap,
      title: "Rapid Implementation",
      description: "Proprietary frameworks and methodologies for faster AI solution deployment.",
      points: ["30% faster delivery", "Proven methodologies", "Agile development"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security standards with compliance to Indonesian data protection laws.",
      points: ["ISO 27001 compliant", "Data sovereignty", "End-to-end encryption"]
    }
  ];

  // Investment opportunities
  const investmentRounds = [
    {
      round: "Series A",
      status: "Open",
      target: "$2M",
      raised: "$1.2M",
      progress: 60,
      investors: 8,
      leadInvestor: "Jakarta Ventures",
      usage: ["Product Development", "Market Expansion", "Team Growth"],
      timeline: "Q2 2024",
      valuation: "$12M"
    },
    {
      round: "Seed Extension",
      status: "Completed",
      target: "$500K",
      raised: "$500K",
      progress: 100,
      investors: 12,
      leadInvestor: "Yogya Angel Network",
      usage: ["Technology Development", "Initial Team", "Market Validation"],
      timeline: "Q4 2023",
      valuation: "$5M"
    }
  ];

  // Team highlights
  const teamHighlights = [
    {
      role: "CEO & Co-Founder",
      name: "Ahmad Rizky",
      experience: "15+ years",
      background: "Former Google, MIT Graduate",
      expertise: "AI Strategy, Business Development"
    },
    {
      role: "CTO & Co-Founder", 
      name: "Sari Melati",
      experience: "12+ years",
      background: "Ex-Microsoft, Stanford PhD",
      expertise: "Machine Learning, Architecture"
    },
    {
      role: "Head of AI",
      name: "Budi Santoso",
      experience: "10+ years",
      background: "Research Scientist, Carnegie Mellon",
      expertise: "Deep Learning, NLP"
    }
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden pt-32 pb-20 ${isRTL ? 'rtl' : ''}`}>
      
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950/30' 
            : 'bg-gradient-to-br from-blue-50/30 via-background to-blue-100/20'
        }`} />
        
        {/* Floating Investment Elements */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 dark:opacity-5"
              style={{
                background: "radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-40 left-20 w-48 h-48 rounded-full opacity-8 dark:opacity-4"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.08, 0.12, 0.08],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-20"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp}>
                <Badge 
                  variant="secondary" 
                  className={`mb-8 ${
                    isDark 
                      ? 'bg-green-900/40 text-green-300 border-green-700/60' 
                      : 'bg-green-100/80 text-green-700 border-green-300/60'
                  } px-6 py-3 font-medium rounded-full border backdrop-blur-sm shadow-sm text-lg`}
                >
                  <TrendingUp className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Investment Opportunity
                </Badge>
              </motion.div>
              
              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Invest in the Future of
                <br />
                <span className="gradient-text-blue">
                  AI in Indonesia
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Join us in democratizing AI technology across Indonesia's $2.8B market. 
                Be part of the transformation that's helping businesses unlock the power of artificial intelligence.
              </motion.p>

              <motion.div
                className={`flex flex-col sm:flex-row gap-6 justify-center mt-12 ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  className="gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold px-10 py-6 text-lg rounded-2xl"
                  onClick={() => {
                    const element = document.getElementById('investment-opportunities');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Investment Opportunities
                  <TrendingUp className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`border-2 font-semibold px-10 py-6 text-lg rounded-2xl ${
                    isDark 
                      ? 'border-blue-400/30 hover:bg-blue-400/10 text-blue-300' 
                      : 'border-blue-200 hover:bg-blue-50 text-blue-700'
                  }`}
                  onClick={() => {
                    window.open('mailto:investors@delibix.com?subject=Investment Inquiry', '_blank');
                  }}
                >
                  Contact Investor Relations
                  <Mail className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              </motion.div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {keyMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      isDark 
                        ? 'bg-slate-800/50 border border-slate-700/50' 
                        : 'bg-white/70 border border-slate-200/50'
                    } backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <metric.icon className={`w-7 h-7 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </motion.div>
                  
                  <div className={`text-3xl md:text-4xl font-bold mb-1 gradient-text-blue`}>
                    {metric.value}
                  </div>
                  
                  <div className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {metric.growth}
                  </div>
                  
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {metric.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Investment Highlights */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
              } px-4 py-2`}>
                <Award className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Investment Highlights
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Why Invest in Delibix
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Strategic advantages that position us for exceptional growth in Indonesia's expanding AI market.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {investmentHighlights.map((highlight, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-8 h-full hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <highlight.icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h3 className={`text-xl font-bold ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {highlight.title}
                          </h3>
                          <Badge className="gradient-bg-blue text-white font-bold px-3 py-1">
                            {highlight.value}
                          </Badge>
                        </div>
                        
                        <p className={`text-base leading-relaxed mb-3 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {highlight.description}
                        </p>
                        
                        <p className={`text-sm font-medium ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {highlight.subtitle}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Investment Opportunities */}
          <section id="investment-opportunities" className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-green-300 border-green-400/20' : 'text-green-700 border-green-200/50'
              } px-4 py-2`}>
                <DollarSign className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Investment Rounds
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Current Funding Opportunities
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Join our growth journey with strategic investment opportunities designed for maximum impact.
              </p>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {investmentRounds.map((round, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-8 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Round Info */}
                      <div className={`lg:col-span-1 ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h3 className={`text-2xl font-bold ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}>
                            {round.round}
                          </h3>
                          <Badge className={`${
                            round.status === 'Open' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {round.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.target}</span>
                          </div>
                          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Raised:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.raised}</span>
                          </div>
                          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Valuation:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.valuation}</span>
                          </div>
                          <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Timeline:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.timeline}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress & Details */}
                      <div className="lg:col-span-2">
                        <div className="mb-6">
                          <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                              Funding Progress
                            </span>
                            <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              {round.progress}%
                            </span>
                          </div>
                          <Progress value={round.progress} className="h-3" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className={`font-semibold mb-3 ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            } ${isRTL ? 'text-right' : ''}`}>
                              Use of Funds
                            </h4>
                            <ul className="space-y-2">
                              {round.usage.map((use, useIndex) => (
                                <li key={useIndex} className={`flex items-center gap-2 text-sm ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                } ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  {use}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className={`font-semibold mb-3 ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            } ${isRTL ? 'text-right' : ''}`}>
                              Investment Details
                            </h4>
                            <div className="space-y-2">
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Investors:</span>
                                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.investors}</span>
                              </div>
                              <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Lead Investor:</span>
                                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{round.leadInvestor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Revenue Streams */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
              } px-4 py-2`}>
                <BarChart3 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Business Model
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Diversified Revenue Streams
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Multiple revenue channels ensuring stable growth and reduced market risk.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {revenueStreams.map((stream, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-6 h-full hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stream.color} flex items-center justify-center shadow-lg`}>
                        <div className={`text-2xl font-bold text-white`}>
                          {stream.percentage}%
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-bold mb-2 ${
                        isDark ? 'text-slate-200' : 'text-slate-800'
                      } ${isRTL ? 'text-right' : ''}`}>
                        {stream.name}
                      </h3>
                      
                      <p className={`text-sm mb-3 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {stream.revenue} ARR
                      </p>
                      
                      <Progress value={stream.percentage} className="h-2" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Competitive Advantages */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-purple-300 border-purple-400/20' : 'text-purple-700 border-purple-200/50'
              } px-4 py-2`}>
                <Zap className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Competitive Advantages
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                What Sets Us Apart
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Strategic advantages that create sustainable moats in the competitive AI landscape.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {competitiveAdvantages.map((advantage, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-8 h-full hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <advantage.icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      
                      <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                        <h3 className={`text-xl font-bold mb-3 ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {advantage.title}
                        </h3>
                        
                        <p className={`text-base leading-relaxed mb-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {advantage.description}
                        </p>
                        
                        <ul className="space-y-2">
                          {advantage.points.map((point, pointIndex) => (
                            <li key={pointIndex} className={`flex items-center gap-2 text-sm ${
                              isDark ? 'text-slate-300' : 'text-slate-600'
                            } ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Team Highlights */}
          <section className="mb-32">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className={`mb-6 glass-blue ${
                isDark ? 'text-orange-300 border-orange-400/20' : 'text-orange-700 border-orange-200/50'
              } px-4 py-2`}>
                <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Leadership Team
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                World-Class Team
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Experienced leaders from top global tech companies driving our vision forward.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {teamHighlights.map((member, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-8 h-full hover-lift transition-all duration-300 text-center ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {member.name}
                    </h3>
                    
                    <p className={`text-base font-semibold mb-3 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {member.role}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        <strong>Experience:</strong> {member.experience}
                      </p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        <strong>Background:</strong> {member.background}
                      </p>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        <strong>Expertise:</strong> {member.expertise}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action */}
          <section>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className={`glass-heavy p-12 lg:p-16 max-w-5xl mx-auto ${
                isDark 
                  ? 'border-blue-400/20 bg-slate-800/30' 
                  : 'border-blue-200/50 bg-white/30'
              }`}>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <TrendingUp className="w-24 h-24 text-green-500 mx-auto mb-8" />
                </motion.div>
                
                <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Ready to Invest in the Future?
                </h3>
                
                <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                } ${isRTL ? 'text-right' : ''}`}>
                  Join us in transforming Indonesia's digital landscape. Get access to our investor 
                  materials and schedule a meeting with our leadership team.
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-6 justify-center ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}>
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold px-10 py-6 text-lg"
                    onClick={() => {
                      window.open('mailto:investors@delibix.com?subject=Investment Inquiry&body=I am interested in learning more about investment opportunities at Delibix.', '_blank');
                    }}
                  >
                    Schedule Investor Meeting
                    <Calendar className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold px-10 py-6 text-lg"
                    onClick={() => {
                      // Simulate downloading investor deck
                      window.open('mailto:investors@delibix.com?subject=Investor Deck Request', '_blank');
                    }}
                  >
                    Download Investor Deck
                    <Download className={`w-6 h-6 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </div>
                
                <motion.div
                  className="mt-8 pt-8 border-t border-blue-200/30 dark:border-blue-700/30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  } ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="w-4 h-4 text-blue-500" />
                      <span>investors@delibix.com</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Phone className="w-4 h-4 text-blue-500" />
                      <span>+62 857-7002-4933</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Yogyakarta, Indonesia</span>
                    </div>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          </section>

          {/* Back to Home */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              onClick={() => navigate('home')}
              variant="ghost"
              className={`${
                isDark 
                  ? 'text-blue-300 hover:bg-blue-400/10' 
                  : 'text-blue-600 hover:bg-blue-50'
              } rounded-xl font-medium`}
            >
              <Home className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              Back to Home
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}