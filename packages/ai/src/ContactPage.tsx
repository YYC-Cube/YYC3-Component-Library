"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "./LanguageProvider";
import { useDarkMode } from "./DarkModeProvider";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  Calendar,
  Globe,
  Users,
  ArrowRight,
  MessageSquare,
  Video,
  Coffee,
  Star,
  Zap,
  Shield,
  Award,
  Headphones,
  Home,
  Building2,
  Timer,
  ChevronDown,
  ExternalLink,
  Smartphone
} from "lucide-react";

export function ContactPage() {
  const { t, isRTL } = useLanguage();
  const { isDark } = useDarkMode();
  const shouldReduceMotion = useReducedMotion();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    budget: '',
    phone: '',
    timeline: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        service: '',
        message: '',
        budget: '',
        phone: '',
        timeline: ''
      });
    }, 5000);
  };

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

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp Business",
      description: "Instant messaging for quick responses and real-time project updates",
      action: "Chat on WhatsApp",
      href: "https://wa.me/6285770024933",
      color: "green",
      availability: "24/7 Available",
      response: "< 5 min"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed project discussions and comprehensive documentation",
      action: "Send Email",
      href: "mailto:hello@delibix.com",
      color: "blue",
      availability: "Always Open",
      response: "< 2 hours"
    },
    {
      icon: Phone,
      title: "Phone Consultation",
      description: "Direct voice consultation for complex project requirements",
      action: "Schedule Call",
      href: "tel:+6285770024933",
      color: "purple",
      availability: "9 AM - 6 PM WIB",
      response: "Immediate"
    },
    {
      icon: Video,
      title: "Video Meeting",
      description: "Face-to-face project planning and detailed technical discussions",
      action: "Book Meeting",
      href: "#",
      color: "orange",
      availability: "By Appointment",
      response: "Scheduled"
    }
  ];

  const quickStats = [
    { icon: Timer, label: "Response Time", value: "< 2 Hours", color: "blue" },
    { icon: Users, label: "Client Satisfaction", value: "100%", color: "green" },
    { icon: Globe, label: "Languages Supported", value: "14+", color: "purple" },
    { icon: Award, label: "Projects Completed", value: "20+", color: "orange" },
    { icon: Coffee, label: "Free Consultation", value: "Always", color: "blue" },
    { icon: Shield, label: "Data Security", value: "Enterprise", color: "green" }
  ];

  const officeInfo = [
    {
      icon: Building2,
      title: "Main Office",
      details: [
        "Jl. Kaliurang KM 14.5",
        "Yogyakarta, DIY 55584",
        "Indonesia"
      ]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
        "Sunday: Emergency Only"
      ]
    },
    {
      icon: Smartphone,
      title: "Emergency Contact",
      details: [
        "24/7 WhatsApp Support",
        "Critical Issue Hotline",
        "Emergency Response Team"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Our projects typically range from 3-28 days depending on complexity. Simple landing pages can be completed in 3-7 days, while comprehensive web applications may take 2-4 weeks. We provide detailed timelines during our initial consultation."
    },
    {
      question: "How do you price your services?",
      answer: "We offer transparent, project-based pricing starting from $2,500 for basic websites. Our pricing depends on project scope, features required, and timeline. We provide detailed quotes with no hidden fees after understanding your requirements."
    },
    {
      question: "Do you provide ongoing support and maintenance?",
      answer: "Yes! All projects include 1-6 months of free support depending on the package. We also offer ongoing maintenance plans for updates, security patches, and feature enhancements. Our support team is available via WhatsApp for quick assistance."
    },
    {
      question: "Can you work with international clients?",
      answer: "Absolutely! We serve clients globally and support 14+ languages. We're experienced in working across different time zones and use modern collaboration tools to ensure seamless communication regardless of location."
    },
    {
      question: "What technologies do you specialize in?",
      answer: "We specialize in modern web technologies including React, Next.js, Node.js, and AI integration. Our team stays updated with the latest trends and uses cutting-edge tools to deliver future-proof solutions."
    },
    {
      question: "How do you ensure project security and data protection?",
      answer: "We implement enterprise-grade security measures including encrypted communications, secure development practices, and comprehensive data protection protocols. All client data is handled with strict confidentiality agreements."
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
        
        {/* Floating Orbs */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10 dark:opacity-5"
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <motion.div
              className="absolute bottom-40 left-20 w-48 h-48 rounded-full opacity-8 dark:opacity-4"
              style={{
                background: "radial-gradient(circle, rgba(147, 197, 253, 0.1) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.08, 0.12, 0.08],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section - Enhanced */}
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
                      ? 'bg-blue-900/40 text-blue-300 border-blue-700/60' 
                      : 'bg-blue-100/80 text-blue-700 border-blue-300/60'
                  } px-4 py-2 font-medium rounded-full border backdrop-blur-sm shadow-sm`}
                >
                  Contact
                </Badge>
              </motion.div>
              
              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Let's create something
                <br />
                <span className={`${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  incredible together.
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Great ideas deserve exceptional execution.
                <br />
                Tell us about your vision.
              </motion.p>
            </motion.div>

            {/* Apple-style Stats */}
            <motion.div
              className="max-w-4xl mx-auto"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                variants={fadeInUp}
              >
                {[
                  { 
                    value: "< 2h", 
                    label: "Response time",
                    icon: Timer
                  },
                  { 
                    value: "100%", 
                    label: "Client satisfaction",
                    icon: Star
                  },
                  { 
                    value: "24/7", 
                    label: "Support available",
                    icon: Shield
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -2 }}
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                        isDark 
                          ? 'bg-slate-800/50 border border-slate-700/50' 
                          : 'bg-white/70 border border-slate-200/50'
                      } backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <stat.icon className={`w-7 h-7 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </motion.div>
                    
                    <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stat.value}
                    </div>
                    
                    <p className={`text-lg font-normal ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Contact Methods & Form Section - Improved Layout */}
          <section className="mb-24">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
              
              {/* Contact Methods - Takes 2/5 of space */}
              <motion.div
                className="xl:col-span-2"
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className={`mb-6 glass-blue ${
                  isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
                } px-3 py-1`}>
                  <MessageCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Contact Methods
                </Badge>
                
                <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Choose Your Preferred Way to Connect
                </h2>
                
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className={`glass-heavy p-6 hover-lift transition-all duration-300 cursor-pointer ${
                        isDark 
                          ? 'border-blue-400/20 bg-slate-800/30 hover:bg-slate-700/40' 
                          : 'border-blue-200/50 bg-white/30 hover:bg-blue-50/30'
                      }`}
                      onClick={() => window.open(method.href, '_blank')}
                      >
                        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            method.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                            method.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            method.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            'bg-orange-100 dark:bg-orange-900/30'
                          }`}>
                            <method.icon className={`w-7 h-7 ${
                              method.color === 'green' ? 'text-green-600 dark:text-green-400' :
                              method.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                              method.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                              'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className={`flex items-center justify-between mb-2 ${
                              isRTL ? 'flex-row-reverse' : ''
                            }`}>
                              <h3 className={`font-semibold ${
                                isDark ? 'text-slate-200' : 'text-slate-800'
                              } ${isRTL ? 'text-right' : ''}`}>
                                {method.title}
                              </h3>
                              <Badge variant="outline" className={`text-xs ${
                                method.color === 'green' ? 'border-green-300 text-green-600 dark:border-green-600 dark:text-green-400' :
                                method.color === 'blue' ? 'border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400' :
                                method.color === 'purple' ? 'border-purple-300 text-purple-600 dark:border-purple-600 dark:text-purple-400' :
                                'border-orange-300 text-orange-600 dark:border-orange-600 dark:text-orange-400'
                              }`}>
                                {method.response}
                              </Badge>
                            </div>
                            <p className={`text-sm mb-3 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            } ${isRTL ? 'text-right' : ''}`}>
                              {method.description}
                            </p>
                            <div className={`flex items-center justify-between ${
                              isRTL ? 'flex-row-reverse' : ''
                            }`}>
                              <span className={`text-xs ${
                                isDark ? 'text-slate-500' : 'text-slate-400'
                              }`}>
                                {method.availability}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`text-xs h-auto p-2 ${
                                  method.color === 'green' ? 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20' :
                                  method.color === 'blue' ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20' :
                                  method.color === 'purple' ? 'text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20' :
                                  'text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20'
                                }`}
                              >
                                {method.action}
                                <ExternalLink className={`w-3 h-3 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form - Takes 3/5 of space */}
              <motion.div
                className="xl:col-span-3"
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className={`mb-6 glass-blue ${
                  isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
                } px-3 py-1`}>
                  <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Project Inquiry Form
                </Badge>
                
                <h2 className={`text-2xl md:text-3xl font-bold mb-8 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Tell Us About Your Project
                </h2>
                
                <Card className={`glass-heavy p-8 ${
                  isDark 
                    ? 'border-blue-400/20 bg-slate-800/30' 
                    : 'border-blue-200/50 bg-white/30'
                }`}>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Full Name *
                          </label>
                          <Input
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter your full name"
                            required
                            className={`glass-secondary transition-all duration-200 ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50 focus:border-blue-400/40' 
                                : 'border-blue-200/50 bg-white/50 focus:border-blue-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your.email@company.com"
                            required
                            className={`glass-secondary transition-all duration-200 ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50 focus:border-blue-400/40' 
                                : 'border-blue-200/50 bg-white/50 focus:border-blue-300'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Company/Organization
                          </label>
                          <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Your company name"
                            className={`glass-secondary transition-all duration-200 ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50 focus:border-blue-400/40' 
                                : 'border-blue-200/50 bg-white/50 focus:border-blue-300'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+62 xxx xxxx xxxx"
                            className={`glass-secondary transition-all duration-200 ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50 focus:border-blue-400/40' 
                                : 'border-blue-200/50 bg-white/50 focus:border-blue-300'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Service Needed *
                          </label>
                          <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                            <SelectTrigger className={`glass-secondary ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50' 
                                : 'border-blue-200/50 bg-white/50'
                            }`}>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ai-consulting">AI Consulting & Strategy</SelectItem>
                              <SelectItem value="web-development">Web Development</SelectItem>
                              <SelectItem value="mobile-apps">Mobile App Development</SelectItem>
                              <SelectItem value="digital-transformation">Digital Transformation</SelectItem>
                              <SelectItem value="data-analytics">Data Analytics & BI</SelectItem>
                              <SelectItem value="ecommerce">E-commerce Solutions</SelectItem>
                              <SelectItem value="other">Other (Please specify)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            isDark ? 'text-slate-200' : 'text-slate-700'
                          } ${isRTL ? 'text-right' : ''}`}>
                            Project Timeline
                          </label>
                          <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                            <SelectTrigger className={`glass-secondary ${
                              isDark 
                                ? 'border-blue-400/20 bg-slate-800/50' 
                                : 'border-blue-200/50 bg-white/50'
                            }`}>
                              <SelectValue placeholder="When do you need it?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">ASAP (Rush Project)</SelectItem>
                              <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                              <SelectItem value="3-4-weeks">3-4 Weeks</SelectItem>
                              <SelectItem value="1-2-months">1-2 Months</SelectItem>
                              <SelectItem value="3-6-months">3-6 Months</SelectItem>
                              <SelectItem value="flexible">Flexible Timeline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        } ${isRTL ? 'text-right' : ''}`}>
                          Project Budget Range
                        </label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                          <SelectTrigger className={`glass-secondary ${
                            isDark 
                              ? 'border-blue-400/20 bg-slate-800/50' 
                              : 'border-blue-200/50 bg-white/50'
                          }`}>
                            <SelectValue placeholder="Select your budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-2500">&lt; $2,500</SelectItem>
                            <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                            <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                            <SelectItem value="over-50000">&gt; $50,000</SelectItem>
                            <SelectItem value="discuss">Let's Discuss</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-200' : 'text-slate-700'
                        } ${isRTL ? 'text-right' : ''}`}>
                          Project Description *
                        </label>
                        <Textarea
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell us about your project requirements, goals, and any specific features you need..."
                          rows={6}
                          required
                          className={`glass-secondary transition-all duration-200 ${
                            isDark 
                              ? 'border-blue-400/20 bg-slate-800/50 focus:border-blue-400/40' 
                              : 'border-blue-200/50 bg-white/50 focus:border-blue-300'
                          }`}
                        />
                      </div>
                      
                      <div className={`flex flex-col sm:flex-row gap-4 ${
                        isRTL ? 'sm:flex-row-reverse' : ''
                      }`}>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={isSubmitting}
                          className="flex-1 gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <motion.div
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              Send Project Inquiry
                              <Send className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className={`border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold ${
                            isRTL ? 'sm:mr-auto' : 'sm:ml-auto'
                          }`}
                          onClick={() => window.open('https://wa.me/6285770024933', '_blank')}
                        >
                          Quick WhatsApp
                          <MessageCircle className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <motion.div
                      className="text-center py-16"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                      </motion.div>
                      <h3 className={`text-2xl font-bold mb-4 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      } ${isRTL ? 'text-right' : ''}`}>
                        Message Sent Successfully! 🎉
                      </h3>
                      <p className={`text-lg mb-6 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      } ${isRTL ? 'text-right' : ''}`}>
                        Thank you for reaching out! We'll get back to you within 2 hours.
                      </p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                        isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        <Timer className="w-4 h-4" />
                        Expected response: &lt; 2 hours
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Office Information Section - Enhanced */}
          <section className="mb-24">
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
                <MapPin className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Our Location
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Visit Our Office in Yogyakarta
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Located in the heart of Indonesia's tech hub, our modern office is equipped with 
                state-of-the-art facilities for collaborative project development.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Office Details */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {officeInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`glass-heavy p-6 hover-lift transition-all duration-300 ${
                      isDark 
                        ? 'border-blue-400/20 bg-slate-800/30' 
                        : 'border-blue-200/50 bg-white/30'
                    }`}>
                      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-3 ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          } ${isRTL ? 'text-right' : ''}`}>
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className={`text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              } ${isRTL ? 'text-right' : ''}`}>
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className={`flex flex-col sm:flex-row gap-4 ${
                    isRTL ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  <Button 
                    variant="outline" 
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold"
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                  >
                    Get Directions
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                  </Button>
                  <Button 
                    className="gradient-bg-blue font-semibold"
                    onClick={() => window.open('https://wa.me/6285770024933', '_blank')}
                  >
                    Schedule Visit
                    <Calendar className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Interactive Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className={`glass-heavy p-8 h-full ${
                  isDark 
                    ? 'border-blue-400/20 bg-slate-800/30' 
                    : 'border-blue-200/50 bg-white/30'
                }`}>
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <MapPin className="w-24 h-24 text-white z-10" />
                    {/* Animated location pulse */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-32 h-32 rounded-full bg-white/20" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="w-40 h-40 rounded-full bg-white/10" />
                    </motion.div>
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Delibix Office Location
                  </h3>
                  <p className={`mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Strategically located in Yogyakarta's growing tech district, easily accessible 
                    by public transportation and major highways.
                  </p>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>High-speed fiber internet</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Coffee className="w-4 h-4 text-blue-500" />
                      <span>Client meeting rooms available</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Secure and professional environment</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Enhanced FAQ Section */}
          <section className="mb-24">
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
                <HelpCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Frequently Asked Questions
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Everything You Need to Know
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Quick answers to common questions about our services, processes, and partnerships.
              </p>
            </motion.div>

            <motion.div
              className="max-w-4xl mx-auto space-y-4"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy overflow-hidden transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <button
                      className={`w-full p-6 text-left transition-all duration-200 ${
                        expandedFaq === index 
                          ? isDark ? 'bg-blue-900/20' : 'bg-blue-50/50'
                          : 'hover:bg-blue-50/30 dark:hover:bg-blue-900/10'
                      } ${isRTL ? 'text-right' : ''}`}
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <div className={`flex items-center justify-between ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}>
                        <h3 className={`font-semibold pr-4 ${
                          isDark ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className={`w-5 h-5 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          } flex-shrink-0`} />
                        </motion.div>
                      </div>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{
                        height: expandedFaq === index ? 'auto' : 0,
                        opacity: expandedFaq === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className={`px-6 pb-6 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      } leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action - Enhanced */}
          <section>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className={`glass-heavy p-12 lg:p-16 max-w-4xl mx-auto ${
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
                  <Calendar className="w-20 h-20 text-blue-500 mx-auto mb-8" />
                </motion.div>
                
                <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Ready to Start Your Project?
                </h3>
                
                <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                } ${isRTL ? 'text-right' : ''}`}>
                  Let's schedule a free consultation to discuss your requirements and create 
                  a custom solution that exceeds your expectations.
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}>
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg"
                    onClick={() => window.open('https://wa.me/6285770024933', '_blank')}
                  >
                    Schedule Free Consultation
                    <Calendar className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold px-8 py-6 text-lg"
                    onClick={() => {
                      const element = document.getElementById('work');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    View Our Portfolio
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                  </Button>
                </div>
                
                <motion.div
                  className="mt-8 pt-8 border-t border-blue-200/30 dark:border-blue-700/30"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className={`flex items-center justify-center gap-6 text-sm ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  } ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>100% Client Satisfaction</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Timer className="w-4 h-4 text-blue-500" />
                      <span>&lt; 2 Hour Response</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>NDA Protected</span>
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
              onClick={() => window.location.href = '#home'}
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