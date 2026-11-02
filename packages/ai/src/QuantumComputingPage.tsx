"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Atom, 
  Zap, 
  Brain, 
  Cpu, 
  Database, 
  Network, 
  Rocket, 
  TrendingUp,
  Award,
  Users,
  Clock,
  Target,
  Lightbulb,
  Code,
  Shield,
  FileText,
  ExternalLink,
  Download,
  Play,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Globe,
  BookOpen,
  MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface QuantumComputingPageProps {
  navigate: (page: string) => void;
}

export function QuantumComputingPage({ navigate }: QuantumComputingPageProps) {
  const [selectedUseCase, setSelectedUseCase] = useState("optimization");

  const quantumCapabilities = [
    {
      id: "optimization",
      title: "Quantum Optimization",
      description: "Solve complex optimization problems exponentially faster than classical computers",
      icon: Target,
      applications: [
        "Supply chain optimization",
        "Portfolio management", 
        "Route planning",
        "Resource allocation"
      ],
      speedup: "100x-1000x",
      readiness: "Near-term",
      industries: ["Finance", "Logistics", "Manufacturing"]
    },
    {
      id: "machine-learning",
      title: "Quantum Machine Learning",
      description: "Enhanced AI algorithms using quantum properties for superior pattern recognition",
      icon: Brain,
      applications: [
        "Quantum neural networks",
        "Feature mapping",
        "Clustering algorithms",
        "Data classification"
      ],
      speedup: "10x-100x",
      readiness: "Mid-term",
      industries: ["Healthcare", "Finance", "Research"]
    },
    {
      id: "simulation",
      title: "Quantum Simulation",
      description: "Model complex quantum systems for drug discovery and materials science",
      icon: Atom,
      applications: [
        "Drug discovery",
        "Materials design",
        "Chemical reactions",
        "Molecular modeling"
      ],
      speedup: "1000x+",
      readiness: "Long-term",
      industries: ["Pharmaceuticals", "Chemistry", "Energy"]
    },
    {
      id: "cryptography",
      title: "Quantum Cryptography",
      description: "Ultra-secure communication and quantum-resistant security protocols",
      icon: Shield,
      applications: [
        "Quantum key distribution",
        "Post-quantum cryptography",
        "Secure communications",
        "Digital signatures"
      ],
      speedup: "Unbreakable",
      readiness: "Near-term",
      industries: ["Government", "Finance", "Defense"]
    }
  ];

  const quantumPartners = [
    {
      name: "IBM Quantum Network",
      type: "Technology Partner",
      focus: "Quantum hardware access",
      collaboration: "Research & Development",
      since: "2023"
    },
    {
      name: "Google Quantum AI",
      type: "Research Partner", 
      focus: "Quantum algorithms",
      collaboration: "Joint research projects",
      since: "2023"
    },
    {
      name: "Microsoft Azure Quantum",
      type: "Cloud Partner",
      focus: "Quantum cloud services",
      collaboration: "Implementation platform",
      since: "2024"
    },
    {
      name: "University of Oxford",
      type: "Academic Partner",
      focus: "Quantum research",
      collaboration: "Student exchange & research",
      since: "2022"
    }
  ];

  const quantumProjects = [
    {
      title: "Quantum Portfolio Optimization",
      client: "Leading Investment Bank",
      status: "Completed",
      duration: "6 months",
      results: "40% improvement in portfolio performance",
      description: "Implemented quantum algorithms for real-time portfolio optimization across multiple asset classes.",
      impact: "High",
      savings: "$2.5M annually"
    },
    {
      title: "Supply Chain Quantum Optimization", 
      client: "Global Logistics Company",
      status: "In Progress",
      duration: "8 months",
      results: "Expected 25% cost reduction",
      description: "Developing quantum-enhanced route optimization for global supply chain management.",
      impact: "Medium",
      savings: "$5M projected"
    },
    {
      title: "Drug Discovery Acceleration",
      client: "Pharmaceutical Research Institute",
      status: "Planning",
      duration: "12 months",
      results: "50% faster molecular modeling",
      description: "Using quantum simulation for accelerated drug discovery and molecular interaction analysis.",
      impact: "High",
      savings: "$10M+ projected"
    }
  ];

  const quantumReadiness = [
    { category: "Hardware Access", progress: 85, description: "Access to quantum computers via cloud" },
    { category: "Algorithm Development", progress: 70, description: "Quantum algorithm expertise and frameworks" },
    { category: "Hybrid Systems", progress: 90, description: "Classical-quantum integration capabilities" },
    { category: "Talent Pool", progress: 60, description: "Quantum computing specialists and researchers" },
    { category: "Industry Applications", progress: 75, description: "Real-world quantum use case implementation" }
  ];

  const selectedCapability = quantumCapabilities.find(cap => cap.id === selectedUseCase);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Quantum-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-indigo-400/35 dark:bg-indigo-400/25 rounded-full blur-md float-delayed-2" />
          
          {/* Quantum orbit animation */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 border border-blue-200/30 dark:border-blue-600/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2" />
            </div>
          </div>
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
                  <Atom className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Quantum</span>{' '}
                <span className="gradient-text-blue-light">Computing</span>{' '}
                <span className="text-purple-600">AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Harness the power of quantum computing to solve complex AI problems and unlock exponential performance gains for your business.
              </p>

              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 text-lg">
                  <Zap className="w-4 h-4 mr-2" />
                  Next-Generation Technology
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
                <Rocket className="w-5 h-5 mr-2" />
                Request Quantum Demo
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Quantum Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="capabilities" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="capabilities">Quantum Capabilities</TabsTrigger>
            <TabsTrigger value="projects">Case Studies</TabsTrigger>
            <TabsTrigger value="readiness">Quantum Readiness</TabsTrigger>
            <TabsTrigger value="partnerships">Strategic Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="capabilities" className="space-y-8 mt-8">
            {/* Quantum Capabilities Overview */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-blue-600" />
                  Quantum AI Capabilities
                </CardTitle>
                <CardDescription>
                  Explore how quantum computing enhances AI and machine learning capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {quantumCapabilities.map((capability, index) => {
                    const Icon = capability.icon;
                    const isSelected = capability.id === selectedUseCase;
                    
                    return (
                      <motion.div
                        key={capability.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedUseCase(capability.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}>
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{capability.title}</h3>
                            <p className="text-sm text-foreground-muted mb-4">{capability.description}</p>
                            <div className="space-y-2">
                              <Badge className={`${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                {capability.speedup} faster
                              </Badge>
                              <div className="text-xs text-foreground-muted">{capability.readiness}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Capability Details */}
                {selectedCapability && (
                  <Card className="glass bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-700">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">
                        {selectedCapability.title} - Deep Dive
                      </CardTitle>
                      <CardDescription>
                        Detailed applications and industry impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Key Applications:</h4>
                          <div className="space-y-2">
                            {selectedCapability.applications.map((app, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Target Industries:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCapability.industries.map((industry, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                            <div className="text-sm font-medium mb-1">Performance Gain:</div>
                            <div className="text-2xl font-bold text-purple-600">{selectedCapability.speedup}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Implementation Timeline:</h4>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            {selectedCapability.readiness}
                          </Badge>
                          <div className="pt-4">
                            <Button className="w-full" onClick={() => navigate('demo-request')}>
                              <Rocket className="w-4 h-4 mr-2" />
                              Start Quantum Project
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 mt-8">
            {/* Quantum Project Case Studies */}
            <div className="space-y-6">
              {quantumProjects.map((project, index) => (
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
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{project.title}</h3>
                            <Badge className={
                              project.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                              project.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <p className="text-foreground-muted mb-4">{project.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <div className="font-medium">Client:</div>
                              <div className="text-foreground-muted">{project.client}</div>
                            </div>
                            <div>
                              <div className="font-medium">Duration:</div>
                              <div className="text-foreground-muted">{project.duration}</div>
                            </div>
                            <div>
                              <div className="font-medium">Impact:</div>
                              <Badge variant="outline">{project.impact}</Badge>
                            </div>
                            <div>
                              <div className="font-medium">Savings:</div>
                              <div className="text-green-600 font-semibold">{project.savings}</div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                            <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">Key Results:</div>
                            <div className="text-blue-600 dark:text-blue-400">{project.results}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="glass bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-purple-50/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Quantum Journey?</h3>
                <p className="text-foreground-muted mb-6">
                  Join leading organizations leveraging quantum computing for competitive advantage.
                </p>
                <Button 
                  onClick={() => navigate('contact')}
                  size="lg"
                  className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300"
                >
                  <Atom className="w-5 h-5 mr-2" />
                  Discuss Your Quantum Project
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readiness" className="space-y-6 mt-8">
            {/* Quantum Readiness Assessment */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Delibix Quantum Readiness
                </CardTitle>
                <CardDescription>
                  Our capabilities and preparedness for quantum computing implementations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quantumReadiness.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-bold text-blue-600">{item.progress}%</span>
                      </div>
                      <Progress value={item.progress} className="h-3" />
                      <p className="text-sm text-foreground-muted">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantum Timeline */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Quantum Computing Timeline</CardTitle>
                <CardDescription>Expected development and implementation phases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      phase: "Near-term (2024-2025)",
                      focus: "Quantum Advantage",
                      applications: ["Optimization problems", "Quantum cryptography", "Hybrid algorithms"],
                      readiness: "Production Ready"
                    },
                    {
                      phase: "Mid-term (2025-2027)",
                      focus: "Quantum Machine Learning",
                      applications: ["Enhanced AI models", "Pattern recognition", "Feature mapping"],
                      readiness: "Pilot Programs"
                    },
                    {
                      phase: "Long-term (2027+)",
                      focus: "Fault-Tolerant Quantum",
                      applications: ["Complex simulations", "Drug discovery", "Climate modeling"],
                      readiness: "Research & Development"
                    }
                  ].map((phase, index) => (
                    <div key={index} className="relative">
                      {index < 2 && (
                        <div className="absolute left-6 top-16 w-0.5 h-16 bg-blue-200 dark:bg-blue-700" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{phase.phase}</h3>
                            <Badge variant="outline">{phase.readiness}</Badge>
                          </div>
                          
                          <h4 className="font-medium text-blue-600 mb-2">{phase.focus}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {phase.applications.map((app, appIndex) => (
                              <div key={appIndex} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                <span>{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6 mt-8">
            {/* Strategic Partnerships */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Quantum Computing Partnerships
                </CardTitle>
                <CardDescription>
                  Strategic alliances with leading quantum computing organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quantumPartners.map((partner, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-blue-light p-6 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{partner.name}</h3>
                          <Badge variant="outline" className="mt-1">{partner.type}</Badge>
                        </div>
                        <div className="text-right text-sm text-foreground-muted">
                          <div>Since {partner.since}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium">Focus Area:</div>
                          <div className="text-sm text-foreground-muted">{partner.focus}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Collaboration:</div>
                          <div className="text-sm text-foreground-muted">{partner.collaboration}</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partnership Benefits */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Partnership Advantages</CardTitle>
                <CardDescription>How our quantum partnerships benefit your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Hardware Access</h3>
                    <p className="text-sm text-foreground-muted">Direct access to cutting-edge quantum computers and simulators</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Code className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Algorithm Expertise</h3>
                    <p className="text-sm text-foreground-muted">Advanced quantum algorithms and optimization techniques</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Research Network</h3>
                    <p className="text-sm text-foreground-muted">Collaboration with leading researchers and institutions</p>
                  </div>
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
          <Card className="glass w-full bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-purple-50/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Enter the Quantum Era
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Position your organization at the forefront of quantum computing innovation. Start exploring quantum advantages today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Atom className="w-5 h-5 mr-2" />
                    Request Quantum Demo
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('ai-research-center')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Research Papers
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