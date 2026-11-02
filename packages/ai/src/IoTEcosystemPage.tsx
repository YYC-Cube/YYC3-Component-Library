"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Wifi, 
  Database, 
  Cloud, 
  Cpu, 
  Radio,
  Car,
  Home,
  Factory,
  Heart,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Network,
  Settings,
  Brain,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Globe,
  Users,
  Lightbulb,
  Lock,
  Activity,
  Thermometer,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  Play,
  Layers
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface IoTEcosystemPageProps {
  navigate: (page: string) => void;
}

export function IoTEcosystemPage({ navigate }: IoTEcosystemPageProps) {
  const [selectedSolution, setSelectedSolution] = useState("smart-manufacturing");

  const iotSolutions = [
    {
      id: "smart-manufacturing",
      title: "Smart Manufacturing",
      description: "AI-driven Industrial IoT for Industry 4.0 transformation",
      icon: Factory,
      applications: [
        "Predictive maintenance",
        "Quality control automation",
        "Production optimization",
        "Energy management",
        "Supply chain tracking",
        "Worker safety monitoring"
      ],
      technologies: ["Industrial sensors", "Edge computing", "AI analytics", "Digital twins"],
      roi: "300-500%",
      timeline: "12-24 weeks",
      complexity: "High",
      connectivity: ["5G", "LoRaWAN", "Industrial Ethernet"]
    },
    {
      id: "smart-cities",
      title: "Smart Cities",
      description: "Comprehensive IoT infrastructure for urban intelligence",
      icon: Globe,
      applications: [
        "Traffic flow optimization",
        "Environmental monitoring",
        "Smart lighting systems",
        "Waste management",
        "Public safety networks",
        "Energy grid optimization"
      ],
      technologies: ["Smart sensors", "Edge AI", "City-wide networks", "Data analytics"],
      roi: "200-400%",
      timeline: "16-32 weeks",
      complexity: "Very High",
      connectivity: ["5G", "NB-IoT", "WiFi 6", "Mesh networks"]
    },
    {
      id: "smart-agriculture",
      title: "Smart Agriculture",
      description: "IoT-powered precision farming and crop optimization",
      icon: Lightbulb,
      applications: [
        "Soil monitoring",
        "Weather station networks",
        "Irrigation automation",
        "Livestock tracking",
        "Crop health monitoring",
        "Equipment management"
      ],
      technologies: ["Environmental sensors", "Satellite connectivity", "AI models", "Drones"],
      roi: "250-400%",
      timeline: "8-16 weeks",
      complexity: "Medium",
      connectivity: ["LoRaWAN", "Satellite", "Cellular", "WiFi"]
    },
    {
      id: "smart-healthcare",
      title: "Smart Healthcare",
      description: "Connected health monitoring and AI-powered diagnostics",
      icon: Heart,
      applications: [
        "Patient monitoring",
        "Medical asset tracking",
        "Environmental controls",
        "Medication management",
        "Emergency response",
        "Telemedicine support"
      ],
      technologies: ["Wearable devices", "Medical IoT", "AI diagnostics", "Cloud platforms"],
      roi: "180-350%",
      timeline: "10-20 weeks",
      complexity: "High",
      connectivity: ["Bluetooth", "WiFi", "Cellular", "RFID"]
    }
  ];

  const iotArchitecture = [
    {
      layer: "Device Layer",
      description: "Smart sensors, actuators, and connected devices",
      components: [
        "Environmental sensors",
        "Smart actuators",
        "Wearable devices",
        "Industrial equipment",
        "Camera systems",
        "RFID/NFC tags"
      ],
      technologies: ["ARM processors", "Low-power MCUs", "Sensor fusion", "Edge AI chips"]
    },
    {
      layer: "Connectivity Layer",
      description: "Communication protocols and network infrastructure",
      components: [
        "5G networks",
        "WiFi 6/6E",
        "LoRaWAN",
        "NB-IoT",
        "Bluetooth 5.0",
        "Mesh networks"
      ],
      technologies: ["Protocol gateways", "Network management", "QoS optimization", "Security protocols"]
    },
    {
      layer: "Edge Computing Layer",
      description: "Local processing and intelligent decision making",
      components: [
        "Edge servers",
        "AI inference engines",
        "Data preprocessing",
        "Local analytics",
        "Caching systems",
        "Protocol conversion"
      ],
      technologies: ["Edge AI", "Real-time processing", "Fog computing", "Micro-services"]
    },
    {
      layer: "Cloud Platform Layer",
      description: "Scalable data processing and AI analytics",
      components: [
        "Data lakes",
        "AI/ML platforms",
        "Analytics engines",
        "API gateways",
        "Device management",
        "Security services"
      ],
      technologies: ["Cloud AI", "Big data", "Microservices", "Container orchestration"]
    },
    {
      layer: "Application Layer",
      description: "Business applications and user interfaces",
      components: [
        "Dashboards",
        "Mobile apps",
        "Web portals",
        "APIs",
        "Reporting tools",
        "Alert systems"
      ],
      technologies: ["React/Vue.js", "Native apps", "Progressive Web Apps", "Business intelligence"]
    }
  ];

  const implementationPhases = [
    {
      phase: "Assessment & Strategy",
      duration: "2-4 weeks",
      activities: [
        "IoT readiness assessment",
        "Use case identification",
        "Architecture design",
        "Technology selection",
        "ROI modeling",
        "Security planning"
      ],
      deliverables: [
        "IoT strategy document",
        "Architecture blueprint",
        "Technology roadmap",
        "Security framework"
      ]
    },
    {
      phase: "Pilot Development",
      duration: "6-10 weeks",
      activities: [
        "Device procurement",
        "Connectivity setup",
        "Platform development",
        "Data pipeline creation",
        "Dashboard development",
        "Security implementation"
      ],
      deliverables: [
        "Pilot IoT system",
        "Data analytics platform",
        "Mobile/web applications",
        "Security controls"
      ]
    },
    {
      phase: "AI Integration",
      duration: "4-8 weeks",
      activities: [
        "AI model development",
        "Edge computing setup",
        "Predictive analytics",
        "Automation workflows",
        "Performance optimization",
        "Testing and validation"
      ],
      deliverables: [
        "AI-powered analytics",
        "Automated workflows",
        "Predictive models",
        "Performance reports"
      ]
    },
    {
      phase: "Scale & Optimize",
      duration: "4-6 weeks",
      activities: [
        "Full-scale deployment",
        "Performance monitoring",
        "System optimization",
        "User training",
        "Maintenance setup",
        "Continuous improvement"
      ],
      deliverables: [
        "Production IoT ecosystem",
        "Monitoring systems",
        "Training programs",
        "Maintenance procedures"
      ]
    }
  ];

  const iotMetrics = [
    { label: "Connected Devices", value: "50B+", icon: Smartphone },
    { label: "Data Processing Speed", value: "Real-time", icon: Zap },
    { label: "Operational Efficiency", value: "40%+", icon: TrendingUp },
    { label: "Cost Reduction", value: "35%", icon: BarChart3 },
    { label: "Predictive Accuracy", value: "95%+", icon: Brain },
    { label: "System Uptime", value: "99.9%", icon: Shield }
  ];

  const selectedSolutionData = iotSolutions.find(sol => sol.id === selectedSolution);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Very High": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "High": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "Medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
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
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-blue-50/30 to-green-100/40 dark:from-green-950/20 dark:via-blue-950/10 dark:to-green-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)]" />
          
          {/* IoT network visualization */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 dark:bg-green-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-400/35 dark:bg-green-400/25 rounded-full blur-md float-delayed-2" />
          
          {/* Connected devices visualization */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <div className="relative w-64 h-64">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 bg-green-400 rounded-full animate-pulse"
                  style={{
                    top: `${30 + Math.sin((i * Math.PI) / 4) * 30}%`,
                    left: `${50 + Math.cos((i * Math.PI) / 4) * 30}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full animate-ping" />
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
                  <Network className="w-12 h-12 text-green-600 dark:text-green-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">IoT</span>{' '}
                <span className="text-green-600">Ecosystem</span>{' '}
                <span className="gradient-text-blue-light">Platform</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Build intelligent connected systems with AI-powered IoT solutions. Transform operations with real-time data, predictive analytics, and automated decision making.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Radio className="w-4 h-4 mr-2" />
                  Smart Sensors
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Wifi className="w-4 h-4 mr-2" />
                  5G/WiFi 6
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  Edge AI
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Cloud className="w-4 h-4 mr-2" />
                  Cloud Analytics
                </Badge>
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {iotMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-600">{metric.value}</div>
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
                <Network className="w-5 h-5 mr-2" />
                Start IoT Project
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                IoT Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="solutions">IoT Solutions</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="space-y-8 mt-8">
            {/* IoT Solutions */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-green-600" />
                  AI-Powered IoT Solutions
                </CardTitle>
                <CardDescription>
                  Comprehensive IoT ecosystems for intelligent operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {iotSolutions.map((solution, index) => {
                    const Icon = solution.icon;
                    const isSelected = solution.id === selectedSolution;
                    
                    return (
                      <motion.div
                        key={solution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => setSelectedSolution(solution.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-green-50/50 dark:bg-green-950/30' : ''}`}>
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                            <p className="text-sm text-foreground-muted mb-4">{solution.description}</p>
                            <div className="space-y-2">
                              <Badge className={getComplexityColor(solution.complexity)}>
                                {solution.complexity} Complexity
                              </Badge>
                              <div className="text-xs text-foreground-muted">
                                ROI: {solution.roi}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Selected Solution Details */}
                {selectedSolutionData && (
                  <Card className="glass bg-green-50/50 dark:bg-green-950/30 border-green-200 dark:border-green-700">
                    <CardHeader>
                      <CardTitle className="text-green-700 dark:text-green-300">
                        {selectedSolutionData.title} - Implementation Details
                      </CardTitle>
                      <CardDescription>
                        Applications, technologies, and connectivity options
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Key Applications:</h4>
                          <div className="space-y-2">
                            {selectedSolutionData.applications.map((app, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Core Technologies:</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedSolutionData.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <h4 className="font-semibold">Connectivity:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedSolutionData.connectivity.map((conn, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                                {conn}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Project Metrics:</h4>
                          <div className="space-y-3">
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Expected ROI:</div>
                              <div className="text-lg font-bold text-green-600">{selectedSolutionData.roi}</div>
                            </div>
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Timeline:</div>
                              <div className="text-lg font-bold text-blue-600">{selectedSolutionData.timeline}</div>
                            </div>
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
            {/* IoT Architecture Layers */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-green-600" />
                  IoT Architecture Stack
                </CardTitle>
                <CardDescription>
                  Five-layer architecture for scalable IoT ecosystems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {iotArchitecture.map((layer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Architecture connector */}
                      {index < iotArchitecture.length - 1 && (
                        <div className="absolute left-6 top-16 w-0.5 h-24 bg-green-200 dark:bg-green-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {5 - index}
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold mb-2">{layer.layer}</h3>
                          <p className="text-foreground-muted mb-4">{layer.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Components:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {layer.components.map((component, compIndex) => (
                                  <div key={compIndex} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-green-400 rounded-full" />
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
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Architecture Benefits */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Architecture Advantages</CardTitle>
                <CardDescription>Benefits of our layered IoT architecture approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Scalable Performance</h3>
                    <p className="text-sm text-foreground-muted">Edge processing reduces latency and improves real-time responsiveness</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Enhanced Security</h3>
                    <p className="text-sm text-foreground-muted">Multi-layer security with encryption, authentication, and monitoring</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Cost Efficiency</h3>
                    <p className="text-sm text-foreground-muted">Optimized data processing reduces bandwidth and cloud costs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-6 mt-8">
            {/* Implementation Process */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6 text-green-600" />
                  IoT Implementation Process
                </CardTitle>
                <CardDescription>
                  Structured approach to building your IoT ecosystem
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
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-green-200 dark:bg-green-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                                    <ArrowRight className="w-3 h-3 text-green-600" />
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
          </TabsContent>

          <TabsContent value="technologies" className="space-y-6 mt-8">
            {/* IoT Technologies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  category: "Connectivity",
                  icon: Wifi,
                  technologies: ["5G/4G", "WiFi 6/6E", "LoRaWAN", "NB-IoT", "Bluetooth 5.0", "Zigbee"],
                  description: "Advanced wireless protocols for reliable device connectivity"
                },
                {
                  category: "Edge Computing",
                  icon: Cpu,
                  technologies: ["Edge AI chips", "GPU acceleration", "Real-time OS", "Container runtime"],
                  description: "Local processing power for immediate decision making"
                },
                {
                  category: "Sensors & Hardware",
                  icon: Radio,
                  technologies: ["Environmental sensors", "Computer vision", "LIDAR", "RFID/NFC", "Actuators"],
                  description: "Smart devices for comprehensive environmental monitoring"
                },
                {
                  category: "Cloud Platforms",
                  icon: Cloud,
                  technologies: ["AWS IoT", "Azure IoT", "Google Cloud IoT", "Custom platforms"],
                  description: "Scalable cloud infrastructure for data processing and storage"
                },
                {
                  category: "Security",
                  icon: Lock,
                  technologies: ["Device certificates", "Encryption", "Secure boot", "OTA updates"],
                  description: "End-to-end security for IoT devices and communications"
                },
                {
                  category: "Analytics & AI",
                  icon: BarChart3,
                  technologies: ["Machine learning", "Predictive analytics", "Computer vision", "NLP"],
                  description: "AI-powered insights from IoT data streams"
                }
              ].map((tech, index) => {
                const Icon = tech.icon;
                
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
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                            <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{tech.category}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground-muted mb-4">{tech.description}</p>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {tech.technologies.map((technology, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {technology}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Technology Integration */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Integrated Technology Stack</CardTitle>
                <CardDescription>How different IoT technologies work together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Device Layer</h3>
                    <p className="text-sm text-foreground-muted">Smart sensors, actuators, and connected devices</p>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Network className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Connectivity</h3>
                    <p className="text-sm text-foreground-muted">Reliable wireless communication protocols</p>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Cpu className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Edge Processing</h3>
                    <p className="text-sm text-foreground-muted">Local AI processing for real-time decisions</p>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Cloud className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Cloud Analytics</h3>
                    <p className="text-sm text-foreground-muted">Scalable data processing and insights</p>
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
          <Card className="glass w-full bg-gradient-to-r from-green-50/50 via-blue-50/50 to-green-50/50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-green-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Connect Everything with Intelligence
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Build smarter operations with our comprehensive IoT ecosystem. Real-time insights, predictive analytics, and automated decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Network className="w-5 h-5 mr-2" />
                    Launch IoT Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    IoT Consultation
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