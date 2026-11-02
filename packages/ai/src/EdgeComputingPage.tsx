"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Zap, 
  Network, 
  Clock, 
  Database, 
  Brain,
  Smartphone,
  Car,
  Factory,
  Shield,
  TrendingUp,
  BarChart3,
  Target,
  Globe,
  Users,
  Settings,
  Layers,
  Activity,
  Gauge,
  Server,
  Cloud,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  Rocket,
  MessageSquare,
  Calendar,
  FileText,
  Download,
  Play,
  Monitor
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface EdgeComputingPageProps {
  navigate: (page: string) => void;
}

export function EdgeComputingPage({ navigate }: EdgeComputingPageProps) {
  const [selectedUseCaseId, setSelectedUseCaseId] = useState("autonomous-vehicles");

  const edgeUseCases = [
    {
      id: "autonomous-vehicles",
      title: "Autonomous Vehicles",
      description: "Real-time AI processing for self-driving vehicles and smart transportation",
      icon: Car,
      applications: [
        "Real-time object detection",
        "Traffic pattern analysis",
        "Collision avoidance systems",
        "Route optimization",
        "Vehicle-to-vehicle communication",
        "Predictive maintenance"
      ],
      latency: "< 1ms",
      bandwidth: "90% reduction",
      reliability: "99.99%",
      processing: "Local AI inference",
      industries: ["Automotive", "Logistics", "Public Transport", "Smart Cities"]
    },
    {
      id: "smart-manufacturing",
      title: "Smart Manufacturing",
      description: "Edge AI for Industry 4.0 and real-time production optimization",
      icon: Factory,
      applications: [
        "Quality control automation",
        "Predictive maintenance",
        "Real-time monitoring",
        "Worker safety systems",
        "Production optimization",
        "Supply chain integration"
      ],
      latency: "< 5ms",
      bandwidth: "80% reduction",
      reliability: "99.9%",
      processing: "Edge inference engines",
      industries: ["Manufacturing", "Energy", "Mining", "Aerospace"]
    },
    {
      id: "smart-retail",
      title: "Smart Retail",
      description: "Edge AI for enhanced customer experiences and operational efficiency",
      icon: Smartphone,
      applications: [
        "Computer vision analytics",
        "Inventory management",
        "Customer behavior analysis",
        "Personalized recommendations",
        "Loss prevention",
        "Queue optimization"
      ],
      latency: "< 10ms",
      bandwidth: "70% reduction",
      reliability: "99.5%",
      processing: "Edge analytics",
      industries: ["Retail", "Hospitality", "Entertainment", "Sports"]
    },
    {
      id: "healthcare-edge",
      title: "Healthcare Edge",
      description: "Real-time medical AI for critical healthcare applications",
      icon: Activity,
      applications: [
        "Real-time patient monitoring",
        "Medical image analysis",
        "Emergency response systems",
        "Drug discovery acceleration",
        "Wearable health analytics",
        "Surgical assistance"
      ],
      latency: "< 2ms",
      bandwidth: "85% reduction",
      reliability: "99.99%",
      processing: "Medical edge AI",
      industries: ["Healthcare", "Pharmaceuticals", "Medical Devices", "Telemedicine"]
    }
  ];

  const edgeArchitecture = [
    {
      layer: "Edge Devices",
      description: "Smart sensors, cameras, and IoT devices with built-in AI chips",
      components: [
        "AI-enabled cameras",
        "Smart sensors",
        "Edge gateways",
        "Industrial controllers",
        "Mobile devices",
        "Autonomous systems"
      ],
      technologies: ["ARM processors", "GPU acceleration", "FPGA", "TPU", "Neural Processing Units"],
      latency: "< 1ms",
      capabilities: "Real-time inference"
    },
    {
      layer: "Edge Infrastructure",
      description: "Local computing resources for data processing and AI inference",
      components: [
        "Edge servers",
        "Mini data centers",
        "5G base stations",
        "Local storage",
        "Network switches",
        "Load balancers"
      ],
      technologies: ["Edge computing platforms", "Container orchestration", "Microservices", "Local databases"],
      latency: "< 5ms",
      capabilities: "Local processing"
    },
    {
      layer: "Edge-Cloud Hybrid",
      description: "Seamless integration between edge computing and cloud services",
      components: [
        "Hybrid orchestration",
        "Data synchronization",
        "Workload distribution",
        "Failover systems",
        "Security gateways",
        "API management"
      ],
      technologies: ["Multi-cloud platforms", "Edge-cloud APIs", "Data pipelines", "Security protocols"],
      latency: "< 50ms",
      capabilities: "Hybrid processing"
    },
    {
      layer: "Cloud Backend",
      description: "Centralized AI training, model updates, and long-term analytics",
      components: [
        "AI training platforms",
        "Model repositories",
        "Big data analytics",
        "Business intelligence",
        "Global orchestration",
        "Compliance monitoring"
      ],
      technologies: ["Cloud AI platforms", "MLOps", "Data lakes", "Global CDN"],
      latency: "50ms+",
      capabilities: "Global intelligence"
    }
  ];

  const edgebenefits = [
    {
      category: "Ultra-Low Latency",
      icon: Zap,
      description: "Process data at the source for instant response times",
      metrics: [
        { label: "Response Time", value: "< 1ms", improvement: "100x faster" },
        { label: "Real-time Processing", value: "99.9%", improvement: "Near-instant" },
        { label: "Network Hops", value: "0", improvement: "Direct processing" }
      ]
    },
    {
      category: "Bandwidth Optimization",
      icon: Network,
      description: "Reduce data transmission costs and improve efficiency",
      metrics: [
        { label: "Bandwidth Usage", value: "90% less", improvement: "Massive savings" },
        { label: "Data Transfer", value: "Local only", improvement: "Zero cloud transfer" },
        { label: "Cost Reduction", value: "80%", improvement: "Significant savings" }
      ]
    },
    {
      category: "Enhanced Security",
      icon: Shield,
      description: "Keep sensitive data local and improve privacy protection",
      metrics: [
        { label: "Data Privacy", value: "100%", improvement: "Local processing" },
        { label: "Attack Surface", value: "75% less", improvement: "Reduced exposure" },
        { label: "Compliance", value: "Enhanced", improvement: "Local data governance" }
      ]
    },
    {
      category: "Improved Reliability",
      icon: CheckCircle2,
      description: "Maintain operations even when cloud connectivity is poor",
      metrics: [
        { label: "Uptime", value: "99.99%", improvement: "Cloud-independent" },
        { label: "Offline Capability", value: "Full", improvement: "Always operational" },
        { label: "Fault Tolerance", value: "High", improvement: "Distributed resilience" }
      ]
    }
  ];

  const implementationPhases = [
    {
      phase: "Assessment & Strategy",
      duration: "2-3 weeks",
      activities: [
        "Edge computing readiness assessment",
        "Use case identification and prioritization",
        "Infrastructure analysis",
        "Network architecture design",
        "Performance requirements definition",
        "Security and compliance planning"
      ],
      deliverables: [
        "Edge strategy document",
        "Infrastructure requirements",
        "Performance benchmarks",
        "Security framework"
      ]
    },
    {
      phase: "Infrastructure Setup",
      duration: "4-6 weeks",
      activities: [
        "Edge hardware deployment",
        "Network configuration",
        "Security implementation",
        "Platform installation",
        "Connectivity establishment",
        "Performance testing"
      ],
      deliverables: [
        "Edge infrastructure",
        "Network connectivity",
        "Security controls",
        "Performance reports"
      ]
    },
    {
      phase: "AI Model Deployment",
      duration: "3-5 weeks",
      activities: [
        "Model optimization for edge",
        "Edge inference deployment",
        "Real-time testing",
        "Performance optimization",
        "Monitoring setup",
        "Validation and certification"
      ],
      deliverables: [
        "Optimized AI models",
        "Edge inference engines",
        "Monitoring systems",
        "Validation reports"
      ]
    },
    {
      phase: "Production & Scale",
      duration: "2-4 weeks",
      activities: [
        "Production deployment",
        "Performance monitoring",
        "Continuous optimization",
        "Scale-out planning",
        "Maintenance procedures",
        "Team training"
      ],
      deliverables: [
        "Production system",
        "Monitoring dashboards",
        "Scaling procedures",
        "Training materials"
      ]
    }
  ];

  const edgeMetrics = [
    { label: "Latency Reduction", value: "100x", icon: Zap },
    { label: "Bandwidth Savings", value: "90%", icon: Network },
    { label: "Uptime Guarantee", value: "99.99%", icon: Shield },
    { label: "Processing Speed", value: "Real-time", icon: Cpu },
    { label: "Cost Reduction", value: "80%", icon: TrendingUp },
    { label: "Response Time", value: "< 1ms", icon: Clock }
  ];

  const selectedUseCaseData = edgeUseCases.find(uc => uc.id === selectedUseCaseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-blue-50/30 to-orange-100/40 dark:from-orange-950/20 dark:via-blue-950/10 dark:to-orange-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(251,146,60,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(251,146,60,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.05)_1px,transparent_1px)]" />
          
          {/* Edge computing visualization */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 dark:bg-orange-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-orange-400/35 dark:bg-orange-400/25 rounded-full blur-md float-delayed-2" />
          
          {/* Processing nodes visualization */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <div className="relative w-64 h-64">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-6 bg-orange-400 rounded-lg animate-pulse"
                  style={{
                    top: `${30 + Math.sin((i * Math.PI * 2) / 5) * 30}%`,
                    left: `${50 + Math.cos((i * Math.PI * 2) / 5) * 30}%`,
                    animationDelay: `${i * 0.4}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-lg animate-ping" />
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
                  <Cpu className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Edge</span>{' '}
                <span className="text-orange-600">Computing</span>{' '}
                <span className="gradient-text-blue-light">AI</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Ultra-low latency AI processing at the edge. Deploy intelligent systems that process data locally for real-time decision making and enhanced privacy.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Real-time AI
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Cpu className="w-4 h-4 mr-2" />
                  Edge Inference
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Local Processing
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Network className="w-4 h-4 mr-2" />
                  5G Ready
                </Badge>
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {edgeMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-600">{metric.value}</div>
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
                <Rocket className="w-5 h-5 mr-2" />
                Start Edge Project
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Edge Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="usecases" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="usecases">Use Cases</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>

          <TabsContent value="usecases" className="space-y-8 mt-8">
            {/* Edge Computing Use Cases */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-orange-600" />
                  Edge AI Use Cases
                </CardTitle>
                <CardDescription>
                  Real-world applications of edge computing and AI at the source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {edgeUseCases.map((usecase, index) => {
                    const Icon = usecase.icon;
                    const isSelected = usecase.id === selectedUseCaseId;
                    
                    return (
                      <motion.div
                        key={usecase.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-orange-500' : ''}`}
                        onClick={() => setSelectedUseCaseId(usecase.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-orange-50/50 dark:bg-orange-950/30' : ''}`}>
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{usecase.title}</h3>
                            <p className="text-sm text-foreground-muted mb-4">{usecase.description}</p>
                            <div className="space-y-2">
                              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                {usecase.latency} latency
                              </Badge>
                              <div className="text-xs text-foreground-muted">
                                {usecase.bandwidth} bandwidth
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Use Case Details */}
                {selectedUseCaseData && (
                  <Card className="glass bg-orange-50/50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-700">
                    <CardHeader>
                      <CardTitle className="text-orange-700 dark:text-orange-300">
                        {selectedUseCaseData.title} - Implementation Details
                      </CardTitle>
                      <CardDescription>
                        Technical specifications and performance characteristics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">AI Applications:</h4>
                          <div className="space-y-2">
                            {selectedUseCaseData.applications.map((app, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Performance Metrics:</h4>
                          <div className="space-y-3">
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Latency:</div>
                              <div className="text-lg font-bold text-orange-600">{selectedUseCaseData.latency}</div>
                            </div>
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Bandwidth Reduction:</div>
                              <div className="text-lg font-bold text-green-600">{selectedUseCaseData.bandwidth}</div>
                            </div>
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Reliability:</div>
                              <div className="text-lg font-bold text-blue-600">{selectedUseCaseData.reliability}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Target Industries:</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedUseCaseData.industries.map((industry, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-orange-200 dark:border-orange-700">
                            <div className="text-sm font-medium mb-1">Processing Type:</div>
                            <div className="text-orange-600 font-semibold">{selectedUseCaseData.processing}</div>
                          </div>
                          <Button className="w-full" onClick={() => navigate('demo-request')}>
                            <Play className="w-4 h-4 mr-2" />
                            Request Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6 mt-8">
            {/* Edge Computing Architecture */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-orange-600" />
                  Edge Computing Architecture
                </CardTitle>
                <CardDescription>
                  Four-layer architecture for distributed AI processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {edgeArchitecture.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Architecture connector */}
                      {index < edgeArchitecture.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-orange-200 dark:bg-orange-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{layer.layer}</h3>
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                              {layer.latency}
                            </Badge>
                          </div>
                          <p className="text-foreground-muted mb-4">{layer.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Components:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {layer.components.map((component, compIndex) => (
                                  <div key={compIndex} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                                    <span>{component}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Technologies:</h4>
                              <div className="flex flex-wrap gap-2">
                                {layer.technologies.map((tech, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Capabilities:</h4>
                              <div className="glass-blue-light p-3 rounded-lg text-center">
                                <div className="text-sm font-medium text-orange-600">{layer.capabilities}</div>
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
          </TabsContent>

          <TabsContent value="benefits" className="space-y-6 mt-8">
            {/* Edge Computing Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {edgebenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                
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
                          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{benefit.category}</CardTitle>
                            <CardDescription>{benefit.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {benefit.metrics.map((metric, metricIndex) => (
                            <div key={metricIndex} className="glass-blue-light p-4 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{metric.label}</span>
                                <span className="text-xl font-bold text-orange-600">{metric.value}</span>
                              </div>
                              <div className="text-sm text-foreground-muted">{metric.improvement}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Comparison with Cloud Computing */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Edge vs Cloud Computing</CardTitle>
                <CardDescription>Performance comparison across key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { metric: "Latency", edge: "< 1ms", cloud: "50-200ms", winner: "edge" },
                    { metric: "Bandwidth Usage", edge: "90% less", cloud: "Full upload", winner: "edge" },
                    { metric: "Privacy", edge: "Local processing", cloud: "Data in cloud", winner: "edge" },
                    { metric: "Reliability", edge: "Offline capable", cloud: "Network dependent", winner: "edge" },
                    { metric: "Scalability", edge: "Local scaling", cloud: "Unlimited scale", winner: "cloud" },
                    { metric: "Maintenance", edge: "Distributed", cloud: "Centralized", winner: "cloud" }
                  ].map((comparison, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 glass-blue-light rounded-lg">
                      <div className="font-medium">{comparison.metric}</div>
                      <div className={`text-center p-2 rounded ${comparison.winner === 'edge' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {comparison.edge}
                      </div>
                      <div className={`text-center p-2 rounded ${comparison.winner === 'cloud' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {comparison.cloud}
                      </div>
                      <div className="text-center">
                        {comparison.winner === 'edge' ? (
                          <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Edge Wins</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Cloud Wins</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-8">
            {/* Implementation Process */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-orange-600" />
                  Edge Computing Implementation
                </CardTitle>
                <CardDescription>
                  Structured approach to deploying edge AI solutions
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
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-orange-200 dark:bg-orange-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                                    <ArrowRight className="w-3 h-3 text-orange-600" />
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

            {/* Implementation Best Practices */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Edge Implementation Best Practices</CardTitle>
                <CardDescription>Key considerations for successful edge deployments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gauge className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Performance First</h3>
                    <p className="text-sm text-foreground-muted">Optimize for ultra-low latency and real-time processing requirements</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Security by Design</h3>
                    <p className="text-sm text-foreground-muted">Implement comprehensive security measures for distributed environments</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Scalable Architecture</h3>
                    <p className="text-sm text-foreground-muted">Design for horizontal scaling and distributed management</p>
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
          <Card className="glass w-full bg-gradient-to-r from-orange-50/50 via-blue-50/50 to-orange-50/50 dark:from-orange-950/30 dark:via-blue-950/30 dark:to-orange-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Deploy AI at the Speed of Thought
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Transform your operations with ultra-low latency edge computing solutions. Process data locally, protect privacy, and enable real-time intelligence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Cpu className="w-5 h-5 mr-2" />
                    Deploy Edge AI
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Edge Consultation
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