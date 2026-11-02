"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Globe, TrendingUp, Zap, Target, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Monitor, Users,
  Clock, Award, BarChart3, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Layers, Network, Workflow, Cog, Cpu, MapPin, Building,
  Link, Code, Shield, Boxes
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface TechnologyPartnersPageProps {
  navigate?: (page: any) => void;
}

export function TechnologyPartnersPage({ navigate }: TechnologyPartnersPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Technology Partnership Statistics
  const partnershipStats = [
    {
      title: "Technology Partners",
      value: "250+",
      description: "Integrated platform partners",
      icon: Network,
      growth: "Global ecosystem"
    },
    {
      title: "API Integrations",
      value: "500+",
      description: "Seamless integrations available",
      icon: Code,
      growth: "Real-time connectivity"
    },
    {
      title: "Combined Reach",
      value: "50M+",
      description: "Users across partner platforms",
      icon: Users,
      growth: "Expanding network"
    },
    {
      title: "Integration Time",
      value: "< 24h",
      description: "Average deployment time",
      icon: Clock,
      growth: "Rapid deployment"
    }
  ];

  // Technology Partner Categories
  const partnerCategories = [
    {
      category: "Cloud & Infrastructure",
      description: "Leading cloud platforms and infrastructure providers enabling scalable digital transformation solutions",
      icon: Database,
      partnerCount: "50+ partners",
      integrations: "200+ integrations",
      partners: [
        {
          name: "Amazon Web Services",
          type: "Cloud Platform",
          integration: "Advanced Partner",
          capabilities: ["Auto-scaling infrastructure", "AI/ML services", "Global deployment", "Security compliance"],
          regions: "Global",
          certifications: ["AWS Advanced Consulting Partner", "Well-Architected Partner"]
        },
        {
          name: "Microsoft Azure",
          type: "Cloud Platform", 
          integration: "Gold Partner",
          capabilities: ["Enterprise integration", "Hybrid cloud solutions", "AI cognitive services", "DevOps automation"],
          regions: "Global",
          certifications: ["Azure Gold Partner", "Azure Expert MSP"]
        },
        {
          name: "Google Cloud Platform",
          type: "Cloud Platform",
          integration: "Premier Partner",
          capabilities: ["Data analytics", "Machine learning", "Kubernetes orchestration", "API management"],
          regions: "Global",
          certifications: ["GCP Premier Partner", "Google Cloud Authorized Trainer"]
        }
      ]
    },
    {
      category: "Enterprise Software",
      description: "Mission-critical enterprise software platforms for seamless business process integration",
      icon: Building,
      partnerCount: "80+ partners",
      integrations: "150+ integrations",
      partners: [
        {
          name: "Salesforce",
          type: "CRM Platform",
          integration: "AppExchange Partner",
          capabilities: ["Customer 360 integration", "Process automation", "Analytics dashboards", "Mobile solutions"],
          regions: "Global",
          certifications: ["Salesforce AppExchange Partner", "Salesforce Certified"]
        },
        {
          name: "Microsoft 365",
          type: "Productivity Suite",
          integration: "ISV Partner",
          capabilities: ["Workflow automation", "Document management", "Teams integration", "Power Platform"],
          regions: "Global", 
          certifications: ["Microsoft ISV Partner", "Teams App Certified"]
        },
        {
          name: "SAP",
          type: "ERP Platform",
          integration: "Certified Partner",
          capabilities: ["ERP integration", "Business process automation", "Real-time analytics", "S/4HANA connectivity"],
          regions: "Global",
          certifications: ["SAP Certified Solution", "SAP PartnerEdge"]
        }
      ]
    },
    {
      category: "Data & Analytics",
      description: "Advanced data platforms and analytics tools for intelligent business insights and decision making",
      icon: BarChart3,
      partnerCount: "60+ partners",
      integrations: "120+ integrations",
      partners: [
        {
          name: "Snowflake",
          type: "Data Cloud",
          integration: "Select Partner",
          capabilities: ["Data warehousing", "Real-time analytics", "ML integration", "Cross-cloud connectivity"],
          regions: "Global",
          certifications: ["Snowflake Select Partner", "Snowflake Certified"]
        },
        {
          name: "Tableau",
          type: "Analytics Platform",
          integration: "Technology Partner",
          capabilities: ["Visual analytics", "Self-service BI", "Embedded analytics", "Mobile dashboards"],
          regions: "Global",
          certifications: ["Tableau Technology Partner", "Tableau Certified"]
        },
        {
          name: "Power BI",
          type: "Business Intelligence",
          integration: "Certified Partner",
          capabilities: ["Interactive dashboards", "Real-time monitoring", "Custom visuals", "Embedded analytics"],
          regions: "Global",
          certifications: ["Microsoft Power BI Certified", "Power BI Embedded Partner"]
        }
      ]
    },
    {
      category: "Security & Compliance",
      description: "Enterprise-grade security and compliance platforms ensuring data protection and regulatory adherence",
      icon: Shield,
      partnerCount: "40+ partners",
      integrations: "80+ integrations",
      partners: [
        {
          name: "Okta",
          type: "Identity Management",
          integration: "Technology Partner",
          capabilities: ["Single sign-on", "Multi-factor authentication", "Identity governance", "API security"],
          regions: "Global",
          certifications: ["Okta Technology Partner", "Okta Certified"]
        },
        {
          name: "CyberArk",
          type: "Privileged Access",
          integration: "Alliance Partner",
          capabilities: ["Privileged access management", "Secrets management", "Threat analytics", "Zero trust security"],
          regions: "Global",
          certifications: ["CyberArk Alliance Partner", "CyberArk Certified"]
        },
        {
          name: "Splunk",
          type: "Security Analytics",
          integration: "Technology Partner",
          capabilities: ["Security monitoring", "Threat detection", "Incident response", "Compliance reporting"],
          regions: "Global",
          certifications: ["Splunk Technology Partner", "Splunk Certified"]
        }
      ]
    }
  ];

  // Partnership Benefits
  const partnershipBenefits = [
    {
      title: "Accelerated Implementation",
      description: "Pre-built integrations and certified connectors reduce implementation time by up to 70%",
      icon: Zap,
      metrics: ["70% faster deployment", "Pre-certified integrations", "Automated workflows", "Reduced complexity"]
    },
    {
      title: "Enhanced Capabilities",
      description: "Access to cutting-edge technologies and platforms through our extensive partner ecosystem",
      icon: Lightbulb,
      metrics: ["500+ API integrations", "Latest technology access", "Continuous innovation", "Future-ready solutions"]
    },
    {
      title: "Global Scale & Reach",
      description: "Leverage partner networks to achieve global scale with local expertise and support",
      icon: Globe,
      metrics: ["50M+ combined users", "Global infrastructure", "24/7 support", "Multi-region deployment"]
    },
    {
      title: "Cost Optimization",
      description: "Optimized licensing and resource utilization through strategic partner relationships",
      icon: TrendingUp,
      metrics: ["40% cost reduction", "Optimized licensing", "Resource efficiency", "ROI maximization"]
    }
  ];

  // Partnership Success Stories
  const successStories = [
    {
      client: "Global Financial Services Firm",
      challenge: "Integrate 15+ technology platforms for unified customer experience",
      solution: "Leveraged AWS, Salesforce, and Snowflake partnerships for seamless integration",
      results: ["360° customer view", "50% faster processing", "Real-time analytics", "Compliance automation"],
      technologies: ["AWS", "Salesforce", "Snowflake", "Tableau"],
      timeline: "6 months",
      region: "North America & APAC"
    },
    {
      client: "Manufacturing Conglomerate",
      challenge: "Modernize legacy ERP with cloud-native analytics and IoT integration",
      solution: "SAP S/4HANA migration with Azure IoT and Power BI integration",
      results: ["Real-time operations view", "Predictive maintenance", "40% efficiency gain", "Global rollout"],
      technologies: ["SAP S/4HANA", "Microsoft Azure", "Power BI", "IoT Hub"],
      timeline: "12 months",
      region: "Global"
    },
    {
      client: "Healthcare Network",
      challenge: "Secure patient data integration across multiple systems and locations",
      solution: "Okta-secured integration with Epic, Salesforce Health Cloud, and AWS HIPAA",
      results: ["HIPAA compliance", "Unified patient records", "Secure access", "Operational efficiency"],
      technologies: ["Okta", "Epic", "Salesforce Health Cloud", "AWS"],
      timeline: "8 months",
      region: "United States"
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
          
          {/* Technology-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Network, Code, Database, Shield, Building, BarChart3];
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
              <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Technology Partnership Ecosystem
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
                Technology <span className="gradient-text-blue">Partners</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Unlock the power of 250+ technology partnerships. 
                Seamless integrations, accelerated deployments, and enterprise-grade solutions through our certified partner ecosystem.
              </motion.p>
            </div>

            {/* Partnership Stats Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {partnershipStats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {stat.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-2`}>
                    {stat.description}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.growth}
                  </Badge>
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
                  Explore Partnerships
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
                onClick={() => navigate('api-exchange')}
              >
                API Exchange
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('integration-hub')}
              >
                Integration Hub
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Categories Section */}
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
              Partner <span className="gradient-text-blue">Categories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive technology ecosystem spanning cloud infrastructure, enterprise software, 
              data analytics, and security platforms for complete digital transformation.
            </p>
          </motion.div>

          <div className="space-y-12">
            {partnerCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Category Header */}
                <div className="mb-8">
                  <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {category.category}
                      </h3>
                      <div className="flex gap-4 text-sm text-slate-500">
                        <span>{category.partnerCount}</span>
                        <span>•</span>
                        <span>{category.integrations}</span>
                      </div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {category.description}
                  </p>
                </div>

                {/* Featured Partners */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.partners.map((partner, partnerIndex) => (
                    <div
                      key={partner.name}
                      className={`glass-secondary rounded-xl p-6 hover:scale-105 transition-transform duration-300 ${
                        isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                      }`}
                    >
                      <div className="mb-4">
                        <h4 className={`text-lg font-semibold mb-1 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {partner.name}
                        </h4>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{partner.type}</Badge>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            {partner.integration}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className={`text-sm font-semibold mb-2 ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            Key Capabilities:
                          </h5>
                          <ul className="space-y-1">
                            {partner.capabilities.slice(0, 3).map((capability, capIndex) => (
                              <li key={capIndex} className={`flex items-center gap-2 text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                {capability}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Coverage: {partner.regions}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
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
              Partnership <span className="gradient-text-blue">Benefits</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Maximize your digital transformation ROI through our strategic technology partnerships 
              and pre-integrated solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center mb-4`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {benefit.title}
                  </h3>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                    {benefit.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {benefit.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className={`glass-secondary rounded-lg p-3 text-center ${
                        isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {metric}
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
              Partnership <span className="gradient-text-blue">Success Stories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Real transformations achieved through strategic technology partnerships 
              and integrated solutions delivering measurable business value.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.client}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{story.region}</Badge>
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.timeline}
                    </span>
                  </div>
                  <h3 className={`text-xl font-semibold mb-4 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {story.client}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Challenge:
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.challenge}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Solution:
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {story.solution}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Results:
                    </h4>
                    <ul className="space-y-1">
                      {story.results.map((result, resultIndex) => (
                        <li key={resultIndex} className={`flex items-center gap-2 text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Technologies:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {story.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
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
                  <Network className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Leverage Our Technology Partnership Ecosystem?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Connect with 250+ technology partners and accelerate your digital transformation with pre-integrated solutions and expert guidance.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Explore Partnerships
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Partnership Inquiry
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Technology Partners</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">250+ integrated platforms & solutions</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Fast Integration</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">&lt; 24h deployment with certified connectors</p>
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