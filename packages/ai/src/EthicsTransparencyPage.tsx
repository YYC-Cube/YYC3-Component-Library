"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Heart, Eye, Scale, Leaf, Users, CheckCircle, AlertTriangle,
  Lock, Globe, Brain, Code, Lightbulb, Target, TrendingUp, Award,
  FileText, MessageCircle, BookOpen, Search, Filter, Star, ArrowRight,
  Building2, Handshake, Zap, Database, Server, Cloud, Network,
  UserCheck, ShieldCheck, EyeOff, Gavel, HelpCircle, Info,
  Trees, Recycle, Sun, Battery, Cpu, Monitor, Phone, Mail,
  ExternalLink, Download, Share2, ChevronRight, Clock, Calendar,
  BadgeCheck, AlertCircle, ThumbsUp, Flag, Balance, Compass
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface EthicsTransparencyPageProps {
  navigate: (page: string) => void;
}

interface EthicsFramework {
  id: string;
  title: string;
  description: string;
  icon: any;
  principles: string[];
  status: 'implemented' | 'in-progress' | 'planned';
  progress: number;
}

interface TransparencyMetric {
  label: string;
  value: string;
  description: string;
  icon: any;
  trend: 'up' | 'stable' | 'improving';
}

interface Commitment {
  category: string;
  title: string;
  description: string;
  actions: string[];
  timeline: string;
  status: 'active' | 'completed' | 'ongoing';
  impact: string;
}

const ethicsFrameworks: EthicsFramework[] = [
  {
    id: "responsible-ai",
    title: "Responsible AI Development",
    description: "Comprehensive framework ensuring AI systems are developed and deployed ethically",
    icon: Brain,
    principles: [
      "Fairness and non-discrimination",
      "Transparency and explainability", 
      "Human oversight and control",
      "Privacy and data protection",
      "Robustness and reliability"
    ],
    status: "implemented",
    progress: 95
  },
  {
    id: "data-ethics",
    title: "Data Ethics & Privacy",
    description: "Strict guidelines for data collection, processing, and protection",
    icon: Shield,
    principles: [
      "Minimal data collection",
      "Purpose limitation",
      "Data subject rights",
      "Security by design",
      "Consent and transparency"
    ],
    status: "implemented",
    progress: 98
  },
  {
    id: "algorithmic-transparency",
    title: "Algorithmic Transparency",
    description: "Clear documentation and explanation of AI decision-making processes",
    icon: Eye,
    principles: [
      "Algorithm documentation",
      "Decision explanation",
      "Bias monitoring",
      "Performance metrics",
      "Regular audits"
    ],
    status: "implemented",
    progress: 92
  },
  {
    id: "social-impact",
    title: "Social Impact Assessment",
    description: "Evaluating and optimizing the societal effects of our AI solutions",
    icon: Users,
    principles: [
      "Impact assessment",
      "Stakeholder engagement",
      "Community feedback",
      "Benefit distribution",
      "Harm mitigation"
    ],
    status: "in-progress",
    progress: 78
  },
  {
    id: "environmental-responsibility",
    title: "Environmental Responsibility",
    description: "Minimizing environmental impact through sustainable AI practices",
    icon: Leaf,
    principles: [
      "Energy efficiency",
      "Carbon footprint reduction",
      "Green computing",
      "Sustainable infrastructure",
      "Circular economy"
    ],
    status: "in-progress",
    progress: 85
  },
  {
    id: "governance-accountability",
    title: "Governance & Accountability",
    description: "Clear governance structures and accountability mechanisms",
    icon: Scale,
    principles: [
      "Clear governance structure",
      "Regular ethics reviews",
      "Incident response",
      "Continuous monitoring",
      "Public reporting"
    ],
    status: "implemented",
    progress: 90
  }
];

const transparencyMetrics: TransparencyMetric[] = [
  {
    label: "Open Source Contributions",
    value: "24",
    description: "Public repositories and tools",
    icon: Code,
    trend: "up"
  },
  {
    label: "Data Processing Transparency",
    value: "100%",
    description: "Documented data flows",
    icon: Database,
    trend: "stable"
  },
  {
    label: "Algorithm Explainability",
    value: "92%",
    description: "Explainable AI implementations",
    icon: Brain,
    trend: "improving"
  },
  {
    label: "Privacy Compliance",
    value: "99.8%",
    description: "Privacy regulation compliance",
    icon: Shield,
    trend: "stable"
  },
  {
    label: "Ethics Review Coverage",
    value: "100%",
    description: "Projects with ethics review",
    icon: CheckCircle,
    trend: "stable"
  },
  {
    label: "Community Feedback Response",
    value: "48h",
    description: "Average response time",
    icon: MessageCircle,
    trend: "improving"
  }
];

const commitments: Commitment[] = [
  {
    category: "AI Ethics",
    title: "Bias-Free AI Systems",
    description: "Developing and maintaining AI systems free from harmful biases",
    actions: [
      "Regular bias testing and monitoring",
      "Diverse training datasets",
      "Inclusive development teams",
      "Community feedback integration"
    ],
    timeline: "Ongoing",
    status: "active",
    impact: "Ensures fair and equitable AI outcomes for all users"
  },
  {
    category: "Data Protection",
    title: "Zero Data Breach Policy",
    description: "Maintaining the highest standards of data security and privacy",
    actions: [
      "End-to-end encryption",
      "Regular security audits",
      "Employee security training",
      "Incident response protocols"
    ],
    timeline: "Ongoing",
    status: "active",
    impact: "Protects user data and maintains trust"
  },
  {
    category: "Environmental",
    title: "Carbon Neutral Operations",
    description: "Achieving carbon neutrality in all business operations by 2025",
    actions: [
      "Renewable energy adoption",
      "Efficient algorithm optimization",
      "Carbon offset programs",
      "Sustainable infrastructure"
    ],
    timeline: "By 2025",
    status: "ongoing",
    impact: "Reduces environmental footprint of AI operations"
  },
  {
    category: "Transparency",
    title: "Open Algorithm Initiative",
    description: "Making core AI algorithms transparent and auditable",
    actions: [
      "Algorithm documentation",
      "Public code repositories",
      "Research paper publication",
      "Community review process"
    ],
    timeline: "Q2 2024",
    status: "ongoing",
    impact: "Enables public scrutiny and builds trust"
  },
  {
    category: "Social Impact",
    title: "AI for Good Program",
    description: "Dedicating resources to solve social and environmental challenges",
    actions: [
      "Pro-bono AI solutions",
      "NGO partnerships",
      "Educational initiatives",
      "Community development"
    ],
    timeline: "Ongoing",
    status: "active",
    impact: "Leverages AI for positive social change"
  },
  {
    category: "Governance",
    title: "Independent Ethics Board",
    description: "Establishing external oversight for ethical AI development",
    actions: [
      "Ethics board formation",
      "External expert recruitment",
      "Regular review processes",
      "Public reporting"
    ],
    timeline: "Q3 2024",
    status: "ongoing",
    impact: "Provides independent oversight and accountability"
  }
];

const certifications = [
  { name: "ISO 27001", description: "Information Security Management", status: "Certified" },
  { name: "GDPR Compliant", description: "European Data Protection", status: "Certified" },
  { name: "SOC 2 Type II", description: "Security & Availability", status: "In Progress" },
  { name: "IEEE 2857", description: "Privacy Engineering", status: "In Progress" },
  { name: "AI Ethics Certification", description: "Responsible AI Development", status: "Planned" }
];

const sustainabilityStats = [
  { metric: "Energy Efficiency", value: "85%", improvement: "+12% this year" },
  { metric: "Carbon Footprint", value: "-40%", improvement: "vs 2022 baseline" },
  { metric: "Renewable Energy", value: "78%", improvement: "of total consumption" },
  { metric: "E-waste Reduction", value: "-60%", improvement: "through optimization" }
];

export function EthicsTransparencyPage({ navigate }: EthicsTransparencyPageProps) {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("frameworks");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
      case 'active':
      case 'completed':
      case 'Certified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
      case 'ongoing':
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'planned':
      case 'Planned':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'improving':
        return <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Ethics Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Shield, Scale, Heart, Eye, Leaf, Users];
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
              className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Ethics & Transparency
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Ethics & <span className="gradient-text-blue">Transparency</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Our commitment to responsible AI development, ethical practices, and complete transparency in everything we do. Building trust through openness and accountability.
              </motion.p>
            </div>

            {/* Key Metrics */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {transparencyMetrics.slice(0, 4).map((metric, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                  <div className="flex items-center justify-center mb-2">
                    <metric.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="text-2xl md:text-3xl font-bold gradient-text-blue mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{metric.label}</div>
                  <div className="text-xs text-foreground-muted">{metric.description}</div>
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
                onClick={() => document.getElementById('frameworks')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Explore Our Ethics
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => window.open('/ethics-report.pdf', '_blank')}
              >
                <Download className="w-5 h-5 mr-2" />
                Ethics Report
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
              <TabsTrigger value="frameworks" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Ethics</span>
              </TabsTrigger>
              <TabsTrigger value="transparency" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Transparency</span>
              </TabsTrigger>
              <TabsTrigger value="commitments" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Commitments</span>
              </TabsTrigger>
              <TabsTrigger value="sustainability" className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                <span className="hidden sm:inline">Sustainability</span>
              </TabsTrigger>
              <TabsTrigger value="governance" className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">Governance</span>
              </TabsTrigger>
            </TabsList>

            {/* Ethics Frameworks Tab */}
            <TabsContent value="frameworks" id="frameworks">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Ethics Frameworks</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Comprehensive frameworks guiding our ethical AI development and deployment practices.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ethicsFrameworks.map((framework, index) => (
                    <motion.div
                      key={framework.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card 
                        className="glass p-6 hover:shadow-lg transition-all duration-300 h-full cursor-pointer"
                        onClick={() => setSelectedFramework(selectedFramework === framework.id ? null : framework.id)}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <framework.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge className={getStatusColor(framework.status)}>
                              {framework.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          
                          <div>
                            <h3 className="mb-2">{framework.title}</h3>
                            <p className="text-foreground-muted text-sm mb-4">
                              {framework.description}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Implementation Progress</span>
                              <span className="font-medium">{framework.progress}%</span>
                            </div>
                            <Progress value={framework.progress} className="h-2" />
                          </div>

                          {selectedFramework === framework.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t pt-4 mt-4"
                            >
                              <h4 className="font-semibold mb-2">Key Principles:</h4>
                              <ul className="space-y-1">
                                {framework.principles.map((principle, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    {principle}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          <div className="flex justify-end">
                            <ChevronRight className={`w-5 h-5 text-foreground-muted transition-transform duration-200 ${
                              selectedFramework === framework.id ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Transparency Tab */}
            <TabsContent value="transparency">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Transparency Metrics</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Real-time metrics demonstrating our commitment to openness and accountability.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transparencyMetrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-6 hover:shadow-lg transition-all duration-300 text-center">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <metric.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="text-3xl font-bold gradient-text-blue mb-2">
                          {metric.value}
                        </div>
                        
                        <h3 className="mb-2">{metric.label}</h3>
                        
                        <p className="text-foreground-muted text-sm mb-4">
                          {metric.description}
                        </p>
                        
                        <div className="flex items-center justify-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm text-foreground-muted capitalize">
                            {metric.trend === 'up' ? 'Increasing' : 
                             metric.trend === 'improving' ? 'Improving' : 'Stable'}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Certifications */}
                <div className="mt-16">
                  <h3 className="text-center mb-8">Certifications & Compliance</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {certifications.map((cert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Card className="glass p-4 text-center hover:shadow-lg transition-all duration-300">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <BadgeCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h4 className="font-semibold mb-1">{cert.name}</h4>
                          <p className="text-xs text-foreground-muted mb-2">{cert.description}</p>
                          <Badge className={getStatusColor(cert.status)} size="sm">
                            {cert.status}
                          </Badge>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Commitments Tab */}
            <TabsContent value="commitments">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Our Commitments</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Specific commitments with measurable actions and timelines for ethical AI development.
                  </p>
                </div>

                <div className="space-y-6">
                  {commitments.map((commitment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge variant="outline" className="text-xs">
                                {commitment.category}
                              </Badge>
                              <Badge className={getStatusColor(commitment.status)}>
                                {commitment.status}
                              </Badge>
                            </div>
                            
                            <h3 className="mb-3">{commitment.title}</h3>
                            <p className="text-foreground-muted mb-4">{commitment.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Key Actions:</h4>
                                <ul className="space-y-1">
                                  {commitment.actions.map((action, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                                    <Clock className="w-4 h-4" />
                                    Timeline
                                  </div>
                                  <p className="font-medium">{commitment.timeline}</p>
                                </div>
                                
                                <div>
                                  <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                                    <Target className="w-4 h-4" />
                                    Expected Impact
                                  </div>
                                  <p className="text-sm">{commitment.impact}</p>
                                </div>
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

            {/* Sustainability Tab */}
            <TabsContent value="sustainability">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Environmental Responsibility</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Our commitment to sustainable AI development and carbon-neutral operations.
                  </p>
                </div>

                {/* Sustainability Stats */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  {sustainabilityStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="text-2xl font-bold gradient-text-blue mb-2">
                          {stat.value}
                        </div>
                        <h4 className="mb-2">{stat.metric}</h4>
                        <p className="text-sm text-foreground-muted">{stat.improvement}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Sustainability Initiatives */}
                <Card className="glass p-8">
                  <h3 className="mb-6 flex items-center gap-2">
                    <Trees className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Sustainability Initiatives
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Renewable Energy</h4>
                          <p className="text-sm text-foreground-muted">
                            78% of our operations powered by renewable energy sources
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Efficient Computing</h4>
                          <p className="text-sm text-foreground-muted">
                            Algorithm optimization reducing computational energy by 40%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Recycle className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Circular Economy</h4>
                          <p className="text-sm text-foreground-muted">
                            Hardware lifecycle extension and responsible e-waste management
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Green Cloud</h4>
                          <p className="text-sm text-foreground-muted">
                            Carbon-neutral cloud infrastructure and data centers
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Battery className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Energy Storage</h4>
                          <p className="text-sm text-foreground-muted">
                            Advanced battery systems for energy efficiency optimization
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Carbon Monitoring</h4>
                          <p className="text-sm text-foreground-muted">
                            Real-time carbon footprint tracking and reporting
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Governance Tab */}
            <TabsContent value="governance">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Governance & Accountability</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Robust governance structures ensuring accountability and ethical oversight.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Ethics Committee */}
                  <Card className="glass p-8">
                    <h3 className="mb-6 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Ethics Committee
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span>Independent external experts</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Monthly review meetings</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span>Public transparency reports</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Flag className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span>Issue escalation protocols</span>
                      </div>
                    </div>
                  </Card>

                  {/* Audit Processes */}
                  <Card className="glass p-8">
                    <h3 className="mb-6 flex items-center gap-2">
                      <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Audit Processes
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span>Quarterly security audits</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span>AI bias testing protocols</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Data governance reviews</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Compass className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span>Compliance assessments</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Incident Response */}
                <Card className="glass p-8">
                  <h3 className="mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Incident Response & Transparency
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Response Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Initial Response</span>
                          <span className="text-sm font-medium">&lt; 1 hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Investigation</span>
                          <span className="text-sm font-medium">&lt; 24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Public Update</span>
                          <span className="text-sm font-medium">&lt; 48 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Resolution Report</span>
                          <span className="text-sm font-medium">&lt; 7 days</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Transparency Measures</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          Public incident disclosure
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          Root cause analysis sharing
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          Preventive measure updates
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          Community feedback integration
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contact & Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <Card className="glass p-8 text-center">
            <h3 className="mb-6">Questions or Concerns?</h3>
            <p className="text-lg text-foreground-muted mb-8">
              We welcome feedback and questions about our ethics and transparency practices. Your input helps us improve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:ethics@delibix.com', '_blank')}
                className="gradient-bg-blue text-white px-8 py-3"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Ethics Team
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('submit-idea')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('/ethics-report.pdf', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}