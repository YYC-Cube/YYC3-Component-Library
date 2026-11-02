"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Shield, 
  Users, 
  TrendingUp, 
  Award, 
  Globe, 
  Zap,
  Target,
  Database,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Lock,
  Briefcase,
  Network,
  Code,
  Brain,
  Rocket,
  HeartHandshake,
  MessageSquare,
  FileText,
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface EnterprisePortalPageProps {
  navigate: (page: string) => void;
}

export function EnterprisePortalPage({ navigate }: EnterprisePortalPageProps) {
  const [selectedTier, setSelectedTier] = useState("enterprise");

  const enterpriseTiers = [
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with complex AI needs",
      minEmployees: "1,000+",
      price: "Custom",
      features: [
        "Dedicated AI consulting team",
        "Custom AI strategy development",
        "Enterprise-grade security",
        "24/7 priority support",
        "Quarterly business reviews",
        "Custom integration solutions"
      ],
      highlight: false
    },
    {
      id: "fortune500",
      name: "Fortune 500",
      description: "Tailored for Fortune 500 companies",
      minEmployees: "10,000+",
      price: "Premium",
      features: [
        "C-suite executive advisory",
        "Global deployment support",
        "Regulatory compliance consulting",
        "Advanced analytics & reporting",
        "Multi-region implementation",
        "Strategic partnership opportunities"
      ],
      highlight: true
    },
    {
      id: "global",
      name: "Global Enterprise",
      description: "For multinational corporations",
      minEmployees: "50,000+",
      price: "Enterprise",
      features: [
        "Global account management",
        "Cross-cultural AI implementation",
        "Multiple language support",
        "Regional compliance expertise",
        "Worldwide 24/7 support",
        "Board-level reporting"
      ],
      highlight: false
    }
  ];

  const enterpriseFeatures = [
    {
      category: "AI Strategy & Consulting",
      icon: Brain,
      capabilities: [
        "Enterprise AI readiness assessment",
        "Digital transformation roadmap",
        "AI governance framework",
        "ROI optimization strategy",
        "Change management consulting",
        "Executive training programs"
      ]
    },
    {
      category: "Security & Compliance",
      icon: Shield,
      capabilities: [
        "Enterprise-grade data security",
        "Regulatory compliance (GDPR, HIPAA, SOX)",
        "AI ethics and bias mitigation",
        "Audit trail and monitoring",
        "Risk assessment frameworks",
        "Incident response protocols"
      ]
    },
    {
      category: "Implementation & Integration",
      icon: Settings,
      capabilities: [
        "Legacy system integration",
        "API development and management",
        "Cloud and hybrid deployments",
        "Scalable architecture design",
        "Performance optimization",
        "Quality assurance testing"
      ]
    },
    {
      category: "Support & Maintenance",
      icon: HeartHandshake,
      capabilities: [
        "24/7 dedicated support team",
        "Proactive monitoring and alerts",
        "Regular performance reviews",
        "Continuous optimization",
        "Training and knowledge transfer",
        "Strategic guidance and updates"
      ]
    }
  ];

  const enterpriseClients = [
    {
      name: "Global Banking Corp",
      industry: "Financial Services",
      employees: "120,000+",
      implementation: "AI-powered fraud detection",
      results: "85% reduction in false positives",
      duration: "18 months",
      satisfaction: 4.9
    },
    {
      name: "International Manufacturing",
      industry: "Manufacturing",
      employees: "80,000+",
      implementation: "Predictive maintenance system",
      results: "40% reduction in downtime",
      duration: "12 months",
      satisfaction: 4.8
    },
    {
      name: "Healthcare Network",
      industry: "Healthcare",
      employees: "50,000+",
      implementation: "AI diagnostic assistance",
      results: "30% improvement in accuracy",
      duration: "24 months",
      satisfaction: 4.9
    },
    {
      name: "Retail Chain International",
      industry: "Retail",
      employees: "200,000+",
      implementation: "Customer behavior analytics",
      results: "25% increase in conversion",
      duration: "15 months",
      satisfaction: 4.7
    }
  ];

  const implementationPhases = [
    {
      phase: "Discovery & Assessment",
      duration: "4-6 weeks",
      activities: [
        "Enterprise readiness evaluation",
        "Current state analysis",
        "Stakeholder interviews",
        "Technical architecture review",
        "Risk and compliance assessment"
      ]
    },
    {
      phase: "Strategy & Planning",
      duration: "6-8 weeks", 
      activities: [
        "AI strategy development",
        "Roadmap creation",
        "Resource planning",
        "Governance framework design",
        "Success metrics definition"
      ]
    },
    {
      phase: "Pilot Implementation",
      duration: "12-16 weeks",
      activities: [
        "Proof of concept development",
        "Pilot deployment",
        "User training and adoption",
        "Performance monitoring",
        "Feedback collection and iteration"
      ]
    },
    {
      phase: "Scale & Optimization",
      duration: "Ongoing",
      activities: [
        "Enterprise-wide rollout",
        "Continuous optimization",
        "Advanced feature implementation",
        "Performance tuning",
        "Strategic expansion planning"
      ]
    }
  ];

  const enterpriseMetrics = [
    { label: "Enterprise Clients", value: "50+", icon: Building2 },
    { label: "Fortune 500 Companies", value: "15+", icon: Award },
    { label: "Average Implementation Success", value: "97%", icon: CheckCircle2 },
    { label: "Client Satisfaction Score", value: "4.8/5", icon: Star },
    { label: "Average ROI Achievement", value: "340%", icon: TrendingUp },
    { label: "Global Deployments", value: "25+", icon: Globe }
  ];

  const selectedTierData = enterpriseTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Enterprise-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-indigo-300/40 dark:bg-indigo-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-400/35 dark:bg-blue-400/25 rounded-full blur-md float-delayed-2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="glass p-4 rounded-2xl glow-blue-light dust-container">
                  <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Enterprise</span>{' '}
                <span className="gradient-text-blue-light">AI Portal</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Dedicated AI consulting solutions for Fortune 500 companies and global enterprises. Transform your organization at scale.
              </p>

              {/* Trust Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Enterprise Security
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Fortune 500 Trusted
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Globe className="w-4 h-4 mr-2" />
                  Global Scale
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {enterpriseMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                      <div className="text-xs text-foreground-muted">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => navigate('demo-request')}
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Enterprise Consultation
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="solutions">Enterprise Solutions</TabsTrigger>
            <TabsTrigger value="tiers">Service Tiers</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="space-y-8 mt-8">
            {/* Enterprise Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enterpriseFeatures.map((feature, index) => {
                const Icon = feature.icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-heavy h-full">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{feature.category}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {feature.capabilities.map((capability, capIndex) => (
                            <div key={capIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{capability}</span>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6">
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Enterprise Value Proposition */}
            <Card className="glass bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/30">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Why Fortune 500 Companies Choose Delibix</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    We understand the unique challenges of large-scale AI implementations and provide enterprise-grade solutions.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Enterprise Security</h3>
                    <p className="text-foreground-muted">
                      Bank-grade security with compliance to all major regulations including GDPR, HIPAA, and SOX.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Proven ROI</h3>
                    <p className="text-foreground-muted">
                      Average 340% ROI within 18 months, with measurable improvements across all key metrics.
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Network className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Global Scale</h3>
                    <p className="text-foreground-muted">
                      Multi-region deployments with 24/7 support and local expertise in key markets worldwide.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-8 mt-8">
            {/* Service Tiers */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  Enterprise Service Tiers
                </CardTitle>
                <CardDescription>
                  Choose the right service level for your organization's size and complexity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {enterpriseTiers.map((tier, index) => {
                    const isSelected = tier.id === selectedTier;
                    
                    return (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''} ${tier.highlight ? 'ring-2 ring-yellow-400' : ''}`}
                        onClick={() => setSelectedTier(tier.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''} ${tier.highlight ? 'bg-yellow-50/50 dark:bg-yellow-950/30' : ''}`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">{tier.name}</CardTitle>
                              {tier.highlight && (
                                <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="font-medium">Minimum Size:</span> {tier.minEmployees} employees
                              </div>
                              <div className="text-2xl font-bold text-blue-600">{tier.price}</div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {tier.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Tier Details */}
                {selectedTierData && (
                  <Card className="glass bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700">
                    <CardHeader>
                      <CardTitle className="text-blue-700 dark:text-blue-300">
                        {selectedTierData.name} - Detailed Benefits
                      </CardTitle>
                      <CardDescription>
                        What's included in your {selectedTierData.name.toLowerCase()} engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Service Highlights:</h4>
                          <div className="space-y-3">
                            {selectedTierData.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 glass-blue-light rounded-lg">
                                <Star className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-4">Additional Benefits:</h4>
                          <div className="space-y-3">
                            {selectedTierData.features.slice(3).map((feature, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 glass-blue-light rounded-lg">
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-700">
                        <Button 
                          className="w-full"
                          onClick={() => navigate('demo-request')}
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          Request {selectedTierData.name} Consultation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-8">
            {/* Implementation Timeline */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-blue-600" />
                  Enterprise Implementation Process
                </CardTitle>
                <CardDescription>
                  Our proven methodology for large-scale AI transformations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {implementationPhases.map((phase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      {index < implementationPhases.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-24 bg-blue-200 dark:bg-blue-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{phase.phase}</h3>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {phase.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                <span>{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Implementation Benefits */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Implementation Advantages</CardTitle>
                <CardDescription>Why our enterprise implementation approach delivers results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Risk Mitigation</h3>
                    <p className="text-sm text-foreground-muted">Phased approach minimizes risk and ensures continuous value delivery</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Change Management</h3>
                    <p className="text-sm text-foreground-muted">Comprehensive training and adoption programs for smooth transitions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Measurable Results</h3>
                    <p className="text-sm text-foreground-muted">Clear metrics and KPIs to track progress and demonstrate value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="success" className="space-y-6 mt-8">
            {/* Client Success Stories */}
            <div className="space-y-6">
              {enterpriseClients.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-4 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback className="bg-blue-600 text-white font-bold">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-semibold">{client.name}</h3>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{client.industry}</Badge>
                                <span className="text-sm text-foreground-muted">{client.employees} employees</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Implementation:</h4>
                              <p className="text-foreground-muted">{client.implementation}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                                <h5 className="font-medium text-green-700 dark:text-green-300">Results</h5>
                                <p className="text-green-600 dark:text-green-400 font-semibold">{client.results}</p>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                                <h5 className="font-medium text-blue-700 dark:text-blue-300">Duration</h5>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold">{client.duration}</p>
                              </div>
                              <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-lg">
                                <h5 className="font-medium text-yellow-700 dark:text-yellow-300">Satisfaction</h5>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{client.satisfaction}/5.0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA for More Case Studies */}
            <Card className="glass text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Explore More Success Stories</h3>
                <p className="text-foreground-muted mb-6">
                  Discover how other Fortune 500 companies have transformed their operations with Delibix.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('success-stories')}>
                    <FileText className="w-4 h-4 mr-2" />
                    View All Case Studies
                  </Button>
                  <Button variant="outline" onClick={() => navigate('client-testimonials')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Client Testimonials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Enterprise?
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Join the Fortune 500 companies already leveraging AI for competitive advantage. Let's discuss your transformation journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Start Enterprise Journey
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Executive Briefing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}