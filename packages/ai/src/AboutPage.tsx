"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useLanguage } from "./LanguageProvider";
import { useDarkMode } from "./DarkModeProvider";
import { 
  Users, 
  Target, 
  Heart, 
  Lightbulb,
  Award,
  MapPin,
  Calendar,
  Rocket,
  Brain,
  Code,
  Globe,
  Star,
  TrendingUp,
  Building,
  Coffee,
  Zap,
  Shield,
  Home,
  ArrowRight,
  CheckCircle,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Clock,
  Smartphone
} from "lucide-react";

export function AboutPage() {
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

  const teamMembers = [
    {
      name: "Rizki Maulana",
      role: "Founder & CEO",
      bio: "Visionary leader with 8+ years of experience in AI and digital transformation. Former senior developer at tech unicorns.",
      skills: ["AI Strategy", "Business Development", "Product Vision"],
      image: "👨‍💼"
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-founder",
      bio: "Full-stack architect and AI specialist. MIT graduate with expertise in machine learning and scalable systems.",
      skills: ["AI/ML", "System Architecture", "Team Leadership"],
      image: "👩‍💻"
    },
    {
      name: "Ahmad Wijaya",
      role: "Lead Developer",
      bio: "Senior full-stack developer with passion for clean code and user experience. React and Node.js expert.",
      skills: ["React", "Node.js", "UI/UX"],
      image: "👨‍💻"
    },
    {
      name: "Maya Sari",
      role: "Design Director",
      bio: "Creative designer with 6+ years of experience in digital products. Specialist in user-centered design.",
      skills: ["UI/UX Design", "Brand Design", "User Research"],
      image: "👩‍🎨"
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "Started as a vision to democratize AI for Indonesian businesses",
      icon: Rocket
    },
    {
      year: "2023",
      title: "First Major Client",
      description: "Delivered our first enterprise AI transformation project",
      icon: Award
    },
    {
      year: "2024",
      title: "Team Expansion",
      description: "Grew from 2 to 12 talented professionals",
      icon: Users
    },
    {
      year: "2024",
      title: "15+ Projects",
      description: "Successfully completed projects across various industries",
      icon: TrendingUp
    }
  ];

  const values = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We leverage cutting-edge AI technology to solve real business problems"
    },
    {
      icon: Heart,
      title: "Human-Centered",
      description: "Technology should enhance human capabilities, not replace them"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and business are protected with enterprise-grade security"
    },
    {
      icon: Globe,
      title: "Global Mindset",
      description: "Local expertise with international standards and best practices"
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      description: "We stay ahead of technology trends to deliver future-proof solutions"
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description: "Success comes from working together as true partners"
    }
  ];

  const achievements = [
    {
      number: "20+",
      label: "Projects Completed",
      description: "Successful digital transformations",
      icon: CheckCircle,
      color: "blue"
    },
    {
      number: "100%",
      label: "Client Satisfaction",
      description: "5-star ratings from all clients",
      icon: Star,
      color: "yellow"
    },
    {
      number: "12",
      label: "Team Members",
      description: "Experienced professionals",
      icon: Users,
      color: "green"
    },
    {
      number: "6",
      label: "Industries Served",
      description: "From startups to enterprises",
      icon: Building,
      color: "purple"
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
                      ? 'bg-blue-900/40 text-blue-300 border-blue-700/60' 
                      : 'bg-blue-100/80 text-blue-700 border-blue-300/60'
                  } px-4 py-2 font-medium rounded-full border backdrop-blur-sm shadow-sm`}
                >
                  About Delibix
                </Badge>
              </motion.div>
              
              <motion.h1 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                We're building the future
                <br />
                <span className={`${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  one solution at a time.
                </span>
              </motion.h1>
              
              <motion.p 
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                } ${isRTL ? 'text-right' : ''}`}
                variants={fadeInUp}
              >
                Founded in Yogyakarta, we're a passionate team of developers, designers, 
                and strategists dedicated to transforming businesses through AI-native solutions.
              </motion.p>
            </motion.div>

            {/* Quick Facts */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial="initial"
              animate="animate"
              variants={staggerChildren}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      isDark 
                        ? 'bg-slate-800/50 border border-slate-700/50' 
                        : 'bg-white/70 border border-slate-200/50'
                    } backdrop-blur-sm group-hover:scale-110 transition-all duration-300`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <achievement.icon className={`w-7 h-7 ${
                      achievement.color === 'yellow' ? 'text-yellow-500' :
                      achievement.color === 'green' ? 'text-green-500' :
                      achievement.color === 'purple' ? 'text-purple-500' :
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </motion.div>
                  
                  <div className={`text-2xl md:text-3xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {achievement.number}
                  </div>
                  
                  <p className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {achievement.label}
                  </p>
                  
                  <p className={`text-xs ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    {achievement.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Our Story Section */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className={`mb-6 glass-blue ${
                  isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
                } px-3 py-1`}>
                  <Rocket className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Our Story
                </Badge>
                
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  From Vision to Reality
                </h2>
                
                <div className="space-y-6">
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Delibix was born from a simple observation: Indonesian businesses needed 
                    better access to cutting-edge technology solutions. As former developers 
                    at major tech companies, our founders saw the gap between what was possible 
                    and what was available locally.
                  </p>
                  
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Starting in a small office in Yogyakarta in 2022, we set out to build 
                    AI-native solutions that could compete globally while understanding 
                    local business needs. Today, we're proud to work with clients across 
                    Indonesia and beyond.
                  </p>
                  
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button 
                      className="gradient-bg-blue font-semibold"
                      onClick={() => {
                        const element = document.getElementById('contact');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Work With Us
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className={`glass-heavy p-8 ${
                  isDark 
                    ? 'border-blue-400/20 bg-slate-800/30' 
                    : 'border-blue-200/50 bg-white/30'
                }`}>
                  <h3 className={`text-xl font-bold mb-6 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Company Timeline
                  </h3>
                  
                  <div className="space-y-6">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <milestone.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className={`flex items-center gap-3 mb-2 ${
                            isRTL ? 'flex-row-reverse' : ''
                          }`}>
                            <Badge variant="outline" className="text-xs">
                              {milestone.year}
                            </Badge>
                            <h4 className={`font-semibold ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}>
                              {milestone.title}
                            </h4>
                          </div>
                          <p className={`text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          } ${isRTL ? 'text-right' : ''}`}>
                            {milestone.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Mission & Vision Section */}
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
                <Target className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Mission & Vision
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                Driving Digital Transformation
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                We believe technology should empower businesses to reach their full potential, 
                regardless of size or industry.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className={`glass-heavy p-8 h-full hover-lift transition-all duration-300 ${
                  isDark 
                    ? 'border-blue-400/20 bg-slate-800/30' 
                    : 'border-blue-200/50 bg-white/30'
                }`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 gradient-bg-blue`}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Our Mission
                  </h3>
                  
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    To democratize access to cutting-edge AI and digital solutions, 
                    enabling Indonesian businesses to compete globally while maintaining 
                    their local identity and values.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`glass-heavy p-8 h-full hover-lift transition-all duration-300 ${
                  isDark 
                    ? 'border-blue-400/20 bg-slate-800/30' 
                    : 'border-blue-200/50 bg-white/30'
                }`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 gradient-bg-blue`}>
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Our Vision
                  </h3>
                  
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    To become Southeast Asia's leading AI-native consulting firm, 
                    known for transforming traditional businesses into digital 
                    leaders through innovative, ethical technology solutions.
                  </p>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Values Section */}
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
                <Heart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Our Values
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                What Drives Us Forward
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Our core values shape every decision we make and every solution we deliver.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-6 h-full hover-lift transition-all duration-300 ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <value.icon className={`w-6 h-6 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-3 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {value.title}
                    </h3>
                    
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Team Section */}
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
                <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                Meet Our Team
              </Badge>
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              } ${isRTL ? 'text-right' : ''}`}>
                The People Behind Delibix
              </h2>
              
              <p className={`text-lg max-w-3xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              } ${isRTL ? 'text-right' : ''}`}>
                Our diverse team of experts brings together decades of experience 
                in technology, design, and business strategy.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
            >
              {teamMembers.map((member, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className={`glass-heavy p-6 h-full hover-lift transition-all duration-300 text-center ${
                    isDark 
                      ? 'border-blue-400/20 bg-slate-800/30' 
                      : 'border-blue-200/50 bg-white/30'
                  }`}>
                    <div className="text-4xl mb-4">
                      {member.image}
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-1 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {member.name}
                    </h3>
                    
                    <p className={`text-sm font-medium mb-4 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {member.role}
                    </p>
                    
                    <p className={`text-xs leading-relaxed mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {member.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.skills.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex}
                          variant="outline" 
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Office & Culture Section */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
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
                    <Building className="w-24 h-24 text-white z-10" />
                    {/* Animated office elements */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.7, 0.4, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-32 h-32 rounded-full bg-white/10" />
                    </motion.div>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Our Workspace
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>Yogyakarta, Indonesia</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Coffee className="w-4 h-4 text-blue-500" />
                      <span>Collaborative workspace</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span>High-speed connectivity</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className={`mb-6 glass-blue ${
                  isDark ? 'text-blue-300 border-blue-400/20' : 'text-blue-700 border-blue-200/50'
                } px-3 py-1`}>
                  <Building className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  Our Culture
                </Badge>
                
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Where Innovation Meets Collaboration
                </h2>
                
                <div className="space-y-6">
                  <p className={`text-lg leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  } ${isRTL ? 'text-right' : ''}`}>
                    Our office in Yogyakarta reflects our values: open, collaborative, 
                    and designed for creativity. We believe the best solutions come from 
                    diverse perspectives working together.
                  </p>
                  
                  <div className="space-y-4">
                    {[
                      { icon: Users, title: "Collaborative Environment", desc: "Open spaces that encourage teamwork" },
                      { icon: Lightbulb, title: "Innovation Labs", desc: "Dedicated spaces for experimentation" },
                      { icon: Coffee, title: "Work-Life Balance", desc: "Flexible hours and wellness programs" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isDark ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                          <item.icon className={`w-4 h-4 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          } ${isRTL ? 'text-right' : ''}`}>
                            {item.title}
                          </h4>
                          <p className={`text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          } ${isRTL ? 'text-right' : ''}`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
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
                  <Users className="w-20 h-20 text-blue-500 mx-auto mb-8" />
                </motion.div>
                
                <h3 className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                } ${isRTL ? 'text-right' : ''}`}>
                  Ready to Join Our Journey?
                </h3>
                
                <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                } ${isRTL ? 'text-right' : ''}`}>
                  Whether you're looking to transform your business or join our team, 
                  we'd love to hear from you.
                </p>
                
                <div className={`flex flex-col sm:flex-row gap-4 justify-center ${
                  isRTL ? 'sm:flex-row-reverse' : ''
                }`}>
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg"
                    onClick={() => window.open('https://wa.me/6285770024933', '_blank')}
                  >
                    Start Your Project
                    <Rocket className={`w-5 h-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/20 font-semibold px-8 py-6 text-lg"
                    onClick={() => {
                      // Navigate to careers page when available
                      window.open('mailto:careers@delibix.com', '_blank');
                    }}
                  >
                    Join Our Team
                    <Briefcase className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
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
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span>Free Consultation</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>24/7 Support</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Trusted by 20+ Clients</span>
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