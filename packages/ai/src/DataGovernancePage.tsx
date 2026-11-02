"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Shield, 
  Lock, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  FileText,
  Settings,
  BarChart3,
  TrendingUp,
  Globe,
  Clock,
  Target,
  Zap,
  Brain,
  Network,
  Code,
  Search,
  Filter,
  Download,
  Upload,
  Key,
  Bookmark,
  ArrowRight,
  ChevronRight,
  Star,
  Award,
  Briefcase,
  MessageSquare,
  Calendar
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface DataGovernancePageProps {
  navigate: (page: string) => void;
}

export function DataGovernancePage({ navigate }: DataGovernancePageProps) {
  const [selectedFramework, setSelectedFramework] = useState("gdpr");

  const governanceFrameworks = [
    {
      id: "gdpr",
      name: "GDPR Compliance",
      description: "European General Data Protection Regulation framework",
      region: "Europe",
      complexity: "High",
      requirements: [
        "Data subject rights implementation",
        "Privacy by design principles",
        "Data breach notification procedures",
        "Data protection impact assessments",
        "Consent management systems",
        "Right to erasure implementation"
      ],
      timeline: "6-12 months",
      penalty: "Up to 4% of annual revenue",
      coverage: "28 EU countries"
    },
    {
      id: "ccpa",
      name: "CCPA Compliance",
      description: "California Consumer Privacy Act requirements",
      region: "California, USA",
      complexity: "Medium",
      requirements: [
        "Consumer rights disclosure",
        "Opt-out mechanisms",
        "Data category transparency",
        "Third-party data sharing disclosure",
        "Non-discrimination policies",
        "Privacy policy requirements"
      ],
      timeline: "3-6 months",
      penalty: "$2,500-$7,500 per violation",
      coverage: "California residents"
    },
    {
      id: "pdpa",
      name: "PDPA Singapore",
      description: "Personal Data Protection Act Singapore",
      region: "Singapore",
      complexity: "Medium",
      requirements: [
        "Consent requirements",
        "Data breach notification",
        "Data protection officers",
        "Data retention policies",
        "Cross-border data transfers",
        "Individual access rights"
      ],
      timeline: "4-8 months",
      penalty: "Up to S$1 million",
      coverage: "Singapore jurisdiction"
    },
    {
      id: "pipeda",
      name: "PIPEDA Canada",
      description: "Personal Information Protection and Electronic Documents Act",
      region: "Canada",
      complexity: "Medium",
      requirements: [
        "Fair information principles",
        "Privacy policies",
        "Breach reporting requirements",
        "Individual access rights",
        "Safeguarding measures",
        "Accountability measures"
      ],
      timeline: "3-6 months",
      penalty: "Up to CAD $100,000",
      coverage: "Canadian federal jurisdiction"
    }
  ];

  const dataGovernanceComponents = [
    {
      category: "Data Classification",
      icon: Database,
      description: "Systematic categorization and labeling of data assets",
      components: [
        "Automated data discovery",
        "Sensitivity classification",
        "Business value assessment",
        "Regulatory mapping",
        "Lifecycle management",
        "Metadata cataloging"
      ],
      maturityLevels: {
        basic: "Manual classification processes",
        intermediate: "Semi-automated classification with rules",
        advanced: "AI-powered dynamic classification",
        optimal: "Real-time intelligent classification"
      }
    },
    {
      category: "Privacy Management",
      icon: Eye,
      description: "End-to-end privacy protection and compliance monitoring",
      components: [
        "Privacy impact assessments",
        "Consent management",
        "Data subject rights automation",
        "Privacy by design integration",
        "Cross-border transfer controls",
        "Incident response automation"
      ],
      maturityLevels: {
        basic: "Manual privacy processes",
        intermediate: "Standardized privacy workflows",
        advanced: "Automated privacy controls",
        optimal: "Intelligent privacy orchestration"
      }
    },
    {
      category: "Security Controls",
      icon: Shield,
      description: "Comprehensive data security and access management",
      components: [
        "Multi-factor authentication",
        "Role-based access control",
        "Data encryption at rest/transit",
        "Network security monitoring",
        "Vulnerability assessments",
        "Zero-trust architecture"
      ],
      maturityLevels: {
        basic: "Basic security measures",
        intermediate: "Layered security controls",
        advanced: "Adaptive security policies",
        optimal: "AI-driven threat protection"
      }
    },
    {
      category: "Compliance Monitoring",
      icon: BarChart3,
      description: "Continuous compliance tracking and reporting",
      components: [
        "Real-time compliance dashboards",
        "Automated audit trails",
        "Regulatory change tracking",
        "Risk assessment automation",
        "Compliance scoring",
        "Executive reporting"
      ],
      maturityLevels: {
        basic: "Manual compliance checks",
        intermediate: "Scheduled compliance reports",
        advanced: "Real-time compliance monitoring",
        optimal: "Predictive compliance analytics"
      }
    }
  ];

  const implementationPhases = [
    {
      phase: "Assessment & Planning",
      duration: "4-6 weeks",
      activities: [
        "Current state data audit",
        "Regulatory requirements analysis",
        "Gap assessment",
        "Stakeholder alignment",
        "Implementation roadmap",
        "Resource allocation"
      ],
      deliverables: [
        "Data governance assessment report",
        "Compliance gap analysis",
        "Implementation roadmap",
        "Risk mitigation plan"
      ]
    },
    {
      phase: "Framework Design",
      duration: "6-8 weeks",
      activities: [
        "Governance framework design",
        "Policy development",
        "Procedure documentation",
        "Role and responsibility definition",
        "Technology architecture",
        "Training curriculum design"
      ],
      deliverables: [
        "Data governance framework",
        "Policy and procedure documents",
        "Technical architecture blueprint",
        "Training materials"
      ]
    },
    {
      phase: "Technology Implementation",
      duration: "8-12 weeks",
      activities: [
        "Data discovery and classification",
        "Privacy management system setup",
        "Security controls implementation",
        "Monitoring and reporting tools",
        "Integration with existing systems",
        "Testing and validation"
      ],
      deliverables: [
        "Implemented technology stack",
        "Integrated governance platform",
        "Testing and validation reports",
        "System documentation"
      ]
    },
    {
      phase: "Rollout & Optimization",
      duration: "4-6 weeks",
      activities: [
        "Phased deployment",
        "User training and adoption",
        "Process refinement",
        "Performance monitoring",
        "Continuous improvement",
        "Compliance validation"
      ],
      deliverables: [
        "Deployed governance platform",
        "Trained user base",
        "Operational procedures",
        "Compliance certification"
      ]
    }
  ];

  const complianceMetrics = [
    { label: "Data Discovery Coverage", value: 95, target: 100, status: "good" },
    { label: "Policy Compliance Rate", value: 87, target: 95, status: "warning" },
    { label: "Incident Response Time", value: 92, target: 90, status: "excellent" },
    { label: "User Training Completion", value: 78, target: 85, status: "warning" },
    { label: "Audit Readiness Score", value: 88, target: 90, status: "good" },
    { label: "Data Quality Index", value: 91, target: 95, status: "good" }
  ];

  const governanceTools = [
    {
      name: "Data Discovery Engine",
      description: "AI-powered data discovery across all systems",
      features: ["Automated scanning", "Pattern recognition", "Sensitivity detection", "Metadata extraction"],
      category: "Discovery"
    },
    {
      name: "Privacy Compliance Hub",
      description: "Centralized privacy management and compliance",
      features: ["Consent management", "Rights automation", "Impact assessments", "Breach response"],
      category: "Privacy"
    },
    {
      name: "Security Control Center",
      description: "Comprehensive security monitoring and control",
      features: ["Access monitoring", "Threat detection", "Encryption management", "Audit logging"],
      category: "Security"
    },
    {
      name: "Compliance Dashboard",
      description: "Real-time compliance monitoring and reporting",
      features: ["Live monitoring", "Risk scoring", "Executive reports", "Regulatory alerts"],
      category: "Monitoring"
    }
  ];

  const selectedFrameworkData = governanceFrameworks.find(fw => fw.id === selectedFramework);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "good": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "warning": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "High": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "Medium": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "Low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Data-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-green-300/40 dark:bg-green-500/30 rounded-full blur-lg float-delayed" />
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
                  <Database className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Data</span>{' '}
                <span className="gradient-text-blue-light">Governance</span>{' '}
                <span className="text-green-600">Framework</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Comprehensive data governance and compliance management. Ensure regulatory compliance, data security, and privacy protection across your enterprise.
              </p>

              {/* Compliance Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  GDPR Ready
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  SOX Compliant
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  ISO 27001
                </Badge>
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
                <Database className="w-5 h-5 mr-2" />
                Request Assessment
              </Button>
              
              <Button
                onClick={() => navigate('compliance-checker')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Compliance Check
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="frameworks" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
            <TabsTrigger value="components">Governance Components</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring & Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="frameworks" className="space-y-8 mt-8">
            {/* Regulatory Frameworks Overview */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Global Compliance Frameworks
                </CardTitle>
                <CardDescription>
                  Navigate complex regulatory requirements with our comprehensive compliance frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {governanceFrameworks.map((framework, index) => {
                    const isSelected = framework.id === selectedFramework;
                    
                    return (
                      <motion.div
                        key={framework.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedFramework(framework.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}>
                          <CardContent className="p-6">
                            <div className="text-center mb-4">
                              <h3 className="font-semibold text-lg mb-2">{framework.name}</h3>
                              <p className="text-sm text-foreground-muted mb-3">{framework.description}</p>
                              <div className="space-y-2">
                                <Badge variant="outline">{framework.region}</Badge>
                                <Badge className={getComplexityColor(framework.complexity)}>
                                  {framework.complexity}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Timeline:</span>
                                <span className="font-medium">{framework.timeline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Coverage:</span>
                                <span className="font-medium">{framework.coverage}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Framework Details */}
                {selectedFrameworkData && (
                  <Card className="glass bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700">
                    <CardHeader>
                      <CardTitle className="text-blue-700 dark:text-blue-300">
                        {selectedFrameworkData.name} - Implementation Requirements
                      </CardTitle>
                      <CardDescription>
                        Detailed requirements and compliance obligations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-4">Key Requirements:</h4>
                          <div className="space-y-3">
                            {selectedFrameworkData.requirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 glass-blue-light rounded-lg">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="glass-blue-light p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Compliance Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Implementation Timeline:</span>
                                <span className="font-medium">{selectedFrameworkData.timeline}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Maximum Penalty:</span>
                                <span className="font-medium text-red-600">{selectedFrameworkData.penalty}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Coverage Area:</span>
                                <span className="font-medium">{selectedFrameworkData.coverage}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full"
                            onClick={() => navigate('compliance-checker')}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Start Compliance Assessment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="components" className="space-y-6 mt-8">
            {/* Data Governance Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dataGovernanceComponents.map((component, index) => {
                const Icon = component.icon;
                
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
                            <CardTitle className="text-xl">{component.category}</CardTitle>
                            <CardDescription>{component.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3">Key Components:</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {component.components.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-semibold mb-3">Maturity Levels:</h4>
                            <div className="space-y-2 text-sm">
                              {Object.entries(component.maturityLevels).map(([level, description], levelIndex) => (
                                <div key={levelIndex} className="flex items-start gap-2">
                                  <Badge variant="outline" className="text-xs capitalize min-w-fit">
                                    {level}
                                  </Badge>
                                  <span className="text-foreground-muted">{description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-8">
            {/* Implementation Roadmap */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Implementation Roadmap
                </CardTitle>
                <CardDescription>
                  Structured approach to data governance implementation
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
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-blue-200 dark:bg-blue-700" />
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
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <h4 className="font-medium mb-3">Key Activities:</h4>
                              <div className="space-y-2">
                                {phase.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="w-3 h-3 text-blue-600" />
                                    <span>{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Deliverables:</h4>
                              <div className="space-y-2">
                                {phase.deliverables.map((deliverable, delIndex) => (
                                  <div key={delIndex} className="flex items-center gap-2 text-sm">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                    <span>{deliverable}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                <CardTitle>Implementation Benefits</CardTitle>
                <CardDescription>Expected outcomes and business value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Risk Reduction</h3>
                    <p className="text-sm text-foreground-muted">Up to 80% reduction in compliance risk and data breach incidents</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Efficiency Gains</h3>
                    <p className="text-sm text-foreground-muted">60% faster compliance reporting and 50% reduction in manual processes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Trust & Reputation</h3>
                    <p className="text-sm text-foreground-muted">Enhanced customer trust and competitive advantage through compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-8">
            {/* Compliance Metrics Dashboard */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Compliance Metrics Dashboard
                </CardTitle>
                <CardDescription>
                  Real-time monitoring of data governance and compliance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {complianceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{metric.value}%</span>
                          <Badge className={getStatusColor(metric.status)} variant="secondary">
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                      <div className="text-xs text-foreground-muted">
                        Target: {metric.target}% | Current: {metric.value}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Governance Tools */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Data Governance Tools</CardTitle>
                <CardDescription>Comprehensive toolset for data governance and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {governanceTools.map((tool, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-blue-light p-6 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <Badge variant="outline" className="mt-1">{tool.category}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground-muted mb-4">{tool.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Features:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {tool.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-1 text-xs">
                              <div className="w-1 h-1 bg-blue-400 rounded-full" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Search className="w-3 h-3 mr-1" />
                        Explore Tool
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
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
                  Ready to Implement Data Governance?
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Start your data governance journey with our comprehensive assessment and implementation services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Database className="w-5 h-5 mr-2" />
                    Start Assessment
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Speak with Expert
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