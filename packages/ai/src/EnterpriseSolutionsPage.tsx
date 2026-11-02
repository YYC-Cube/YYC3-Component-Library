"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, Shield, Zap, Users, Globe, TrendingUp, BarChart3,
  CheckCircle, ArrowRight, Star, Award, Target, Rocket, Database,
  Cloud, Network, Lock, Code, Cpu, Monitor, Brain, Bot,
  Handshake, Eye, MessageCircle, Phone, Mail, Download,
  Clock, Calendar, FileText, PieChart, Activity, Settings
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface EnterpriseSolutionsPageProps {
  navigate: (page: string) => void;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  icon: any;
  features: string[];
  benefits: string[];
  useCases: string[];
  pricing: string;
  popular?: boolean;
}

interface CaseStudy {
  company: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  roi: string;
  timeline: string;
}

const enterpriseSolutions: Solution[] = [
  {
    id: "ai-automation-suite",
    title: "AI Automation Suite",
    description: "Comprehensive AI-powered automation platform for enterprise workflows",
    icon: Zap,
    features: [
      "Intelligent process automation",
      "Multi-system integration",
      "Custom workflow builder",
      "Real-time monitoring",
      "Advanced analytics"
    ],
    benefits: [
      "80% reduction in manual tasks",
      "99.9% uptime guarantee",
      "ROI within 6 months",
      "24/7 expert support"
    ],
    useCases: [
      "Document processing",
      "Customer service automation",
      "Supply chain optimization",
      "Financial reporting"
    ],
    pricing: "Custom pricing",
    popular: true
  },
  {
    id: "enterprise-ai-platform",
    title: "Enterprise AI Platform",
    description: "Scalable AI infrastructure for large-scale deployments",
    icon: Cloud,
    features: [
      "Multi-cloud deployment",
      "Auto-scaling infrastructure",
      "Enterprise security",
      "API management",
      "Model versioning"
    ],
    benefits: [
      "Unlimited scalability",
      "Enterprise-grade security",
      "Global deployment",
      "Cost optimization"
    ],
    useCases: [
      "AI model deployment",
      "Data lake management",
      "Real-time analytics",
      "Machine learning pipelines"
    ],
    pricing: "Starting at $50,000/year"
  },
  {
    id: "custom-ai-development",
    title: "Custom AI Development",
    description: "Bespoke AI solutions tailored to your specific enterprise needs",
    icon: Code,
    features: [
      "Custom model development",
      "Domain-specific training",
      "Integration services",
      "Maintenance & support",
      "Knowledge transfer"
    ],
    benefits: [
      "Perfect fit for your needs",
      "Competitive advantage",
      "Full ownership",
      "Ongoing optimization"
    ],
    useCases: [
      "Industry-specific models",
      "Proprietary algorithms",
      "Legacy system integration",
      "Specialized workflows"
    ],
    pricing: "Project-based pricing"
  }
];

const caseStudies: CaseStudy[] = [
  {
    company: "PT Mega Manufacturing",
    industry: "Manufacturing",
    challenge: "Manual quality control processes causing delays and inconsistencies",
    solution: "AI-powered computer vision system for automated quality inspection",
    results: [
      "95% improvement in defect detection accuracy",
      "60% reduction in inspection time",
      "50% decrease in human error",
      "$2.3M annual cost savings"
    ],
    roi: "340%",
    timeline: "3 months implementation"
  },
  {
    company: "Bank Nusantara Digital",
    industry: "Financial Services",
    challenge: "Rising fraud cases and slow transaction processing",
    solution: "Real-time AI fraud detection and automated transaction processing",
    results: [
      "99.8% fraud detection accuracy",
      "85% faster transaction processing",
      "90% reduction in false positives",
      "$5.2M prevented fraud losses"
    ],
    roi: "520%",
    timeline: "4 months implementation"
  },
  {
    company: "HealthCare Plus Network",
    industry: "Healthcare",
    challenge: "Overwhelming patient data analysis and diagnosis support needs",
    solution: "AI-assisted diagnostic platform with predictive analytics",
    results: [
      "92% diagnostic accuracy improvement",
      "40% faster patient processing",
      "30% reduction in readmissions",
      "15,000+ patients helped monthly"
    ],
    roi: "280%",
    timeline: "6 months implementation"
  }
];

const enterpriseFeatures = [
  {
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 compliance",
    icon: Shield,
    details: [
      "End-to-end encryption",
      "Multi-factor authentication",
      "Regular security audits",
      "Compliance certifications"
    ]
  },
  {
    title: "Scalable Architecture",
    description: "Handle millions of requests with auto-scaling",
    icon: TrendingUp,
    details: [
      "Auto-scaling infrastructure",
      "Load balancing",
      "Global CDN",
      "99.9% uptime SLA"
    ]
  },
  {
    title: "Advanced Analytics",
    description: "Real-time insights and comprehensive reporting",
    icon: BarChart3,
    details: [
      "Real-time dashboards",
      "Custom reporting",
      "Predictive analytics",
      "Data visualization"
    ]
  },
  {
    title: "24/7 Support",
    description: "Dedicated enterprise support team",
    icon: Users,
    details: [
      "Dedicated account manager",
      "Priority support queue",
      "On-site training",
      "Regular health checks"
    ]
  }
];

const implementationSteps = [
  {
    step: 1,
    title: "Discovery & Planning",
    description: "Deep dive into your business requirements and current systems",
    duration: "2-4 weeks",
    deliverables: ["Requirements analysis", "Architecture design", "Implementation roadmap"]
  },
  {
    step: 2,
    title: "Custom Development",
    description: "Build and configure AI solutions specific to your needs",
    duration: "6-12 weeks",
    deliverables: ["Custom AI models", "Integration modules", "Testing suite"]
  },
  {
    step: 3,
    title: "Integration & Testing",
    description: "Seamless integration with your existing systems",
    duration: "2-4 weeks",
    deliverables: ["System integration", "Performance testing", "Security validation"]
  },
  {
    step: 4,
    title: "Deployment & Training",
    description: "Go-live support and comprehensive team training",
    duration: "1-2 weeks",
    deliverables: ["Production deployment", "User training", "Documentation"]
  },
  {
    step: 5,
    title: "Optimization & Support",
    description: "Ongoing optimization and enterprise support",
    duration: "Ongoing",
    deliverables: ["Performance monitoring", "Regular updates", "24/7 support"]
  }
];

export function EnterpriseSolutionsPage({ navigate }: EnterpriseSolutionsPageProps) {
  const [selectedSolution, setSelectedSolution] = useState(enterpriseSolutions[0]);
  const [activeTab, setActiveTab] = useState("solutions");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Enterprise Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Building2, Cloud, Network, Database, Shield, Globe];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + (i % 4) * 20}%`,
                    top: `${15 + Math.floor(i / 4) * 25}%`,
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Enterprise Solutions
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Enterprise <span className="gradient-text-blue">AI Solutions</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Scalable, secure, and intelligent AI solutions designed for large enterprises. Transform your organization with cutting-edge AI technology.
              </motion.p>
            </div>

            {/* Enterprise Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { label: "Enterprise Clients", value: "100+", desc: "Global companies" },
                { label: "Average ROI", value: "340%", desc: "Within 12 months" },
                { label: "Uptime SLA", value: "99.9%", desc: "Guaranteed availability" },
                { label: "Implementation", value: "90 days", desc: "Average timeline" }
              ].map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                  <div className="text-2xl md:text-3xl font-bold gradient-text-blue mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-foreground-muted">{stat.desc}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => navigate('demo-request')}
              >
                <span className="flex items-center gap-3">
                  Request Enterprise Demo
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => window.open('/enterprise-brochure.pdf', '_blank')}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Brochure
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-12">
              <TabsTrigger value="solutions" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                <span className="hidden sm:inline">Solutions</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Features</span>
              </TabsTrigger>
              <TabsTrigger value="case-studies" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Case Studies</span>
              </TabsTrigger>
              <TabsTrigger value="implementation" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Implementation</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
            </TabsList>

            {/* Solutions Tab */}
            <TabsContent value="solutions">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Enterprise AI Solutions</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Comprehensive AI solutions designed to scale with your enterprise needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {enterpriseSolutions.map((solution, index) => (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-8 h-full hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <solution.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          {solution.popular && (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              Popular
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="mb-3">{solution.title}</h3>
                        <p className="text-foreground-muted mb-6">{solution.description}</p>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <h4 className="font-semibold mb-2">Key Features:</h4>
                            <ul className="space-y-1">
                              {solution.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Benefits:</h4>
                            <ul className="space-y-1">
                              {solution.benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <Star className="w-3 h-3 text-amber-500" />
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="text-sm text-foreground-muted mb-4">
                            <strong>Pricing:</strong> {solution.pricing}
                          </div>
                          <Button 
                            className="w-full gradient-bg-blue text-white"
                            onClick={() => navigate('demo-request')}
                          >
                            Request Demo
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Enterprise Features</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Built for enterprise scale with security, reliability, and performance at the core.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {enterpriseFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-8 h-full">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                          <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <h3 className="mb-3">{feature.title}</h3>
                        <p className="text-foreground-muted mb-6">{feature.description}</p>
                        
                        <ul className="space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Case Studies Tab */}
            <TabsContent value="case-studies">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Enterprise Success Stories</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Real results from enterprises that transformed their operations with our AI solutions.
                  </p>
                </div>

                <div className="space-y-8">
                  {caseStudies.map((study, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                          <div>
                            <h3 className="mb-2">{study.company}</h3>
                            <Badge variant="outline" className="mb-4">{study.industry}</Badge>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Challenge:</h4>
                                <p className="text-sm text-foreground-muted">{study.challenge}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-sm mb-1">Solution:</h4>
                                <p className="text-sm text-foreground-muted">{study.solution}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="lg:col-span-2">
                            <h4 className="font-semibold mb-4">Results Achieved:</h4>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                              {study.results.map((result, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm">{result}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex gap-8">
                              <div className="text-center">
                                <div className="text-2xl font-bold gradient-text-blue">{study.roi}</div>
                                <div className="text-sm text-foreground-muted">ROI</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold gradient-text-blue">{study.timeline}</div>
                                <div className="text-sm text-foreground-muted">Implementation</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Implementation Process</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Our proven 5-step process ensures successful AI implementation at enterprise scale.
                  </p>
                </div>

                <div className="space-y-6">
                  {implementationSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-8">
                        <div className="flex gap-6">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{step.step}</span>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <h3>{step.title}</h3>
                              <Badge variant="outline" className="self-start md:self-center mt-2 md:mt-0">
                                {step.duration}
                              </Badge>
                            </div>
                            
                            <p className="text-foreground-muted mb-4">{step.description}</p>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Key Deliverables:</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.deliverables.map((deliverable, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {deliverable}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Enterprise Pricing</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Flexible pricing models designed to scale with your enterprise needs.
                  </p>
                </div>

                <Card className="glass p-8 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="mb-4">Custom Enterprise Solutions</h3>
                    <p className="text-foreground-muted">
                      Our enterprise solutions are tailored to your specific needs. Pricing varies based on:
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { icon: Users, title: "Team Size", desc: "Number of users and administrators" },
                      { icon: Database, title: "Data Volume", desc: "Amount of data processed monthly" },
                      { icon: Cloud, title: "Infrastructure", desc: "Cloud resources and deployment scope" },
                      { icon: Clock, title: "Support Level", desc: "SLA requirements and support tier" }
                    ].map((factor, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <factor.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="mb-2">{factor.title}</h4>
                        <p className="text-sm text-foreground-muted">{factor.desc}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg mb-6">
                      <strong>Starting from $50,000/year</strong> for enterprise deployments
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        className="gradient-bg-blue text-white"
                        onClick={() => navigate('demo-request')}
                      >
                        Get Custom Quote
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <Card className="glass p-8 text-center">
            <h2 className="mb-6">Ready to Transform Your Enterprise?</h2>
            <p className="text-lg text-foreground-muted mb-8 max-w-2xl mx-auto">
              Join 100+ enterprises that have already transformed their operations with our AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="gradient-bg-blue text-white px-8 py-4"
                onClick={() => navigate('demo-request')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Enterprise Demo
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.open('mailto:enterprise@delibix.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Enterprise Team
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}