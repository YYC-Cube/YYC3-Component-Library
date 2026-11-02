"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sprout, 
  Cloud, 
  Droplets, 
  Sun, 
  Cpu, 
  Satellite,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Users,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Lightbulb,
  Settings,
  Brain,
  Database,
  Network,
  Smartphone,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  Play
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface AgricultureDigitalPageProps {
  navigate: (page: string) => void;
}

export function AgricultureDigitalPage({ navigate }: AgricultureDigitalPageProps) {
  const [selectedSolution, setSelectedSolution] = useState("precision");

  const agriTechSolutions = [
    {
      id: "precision",
      title: "Precision Agriculture",
      description: "AI-powered precision farming for optimal crop management",
      icon: Target,
      benefits: [
        "30% reduction in water usage",
        "25% increase in crop yield",
        "40% reduction in pesticide use",
        "Real-time crop monitoring",
        "Predictive disease detection",
        "Optimized nutrient management"
      ],
      technologies: ["Satellite imagery", "IoT sensors", "AI analytics", "Drone surveillance"],
      roi: "200-300%",
      timeline: "6-12 months",
      complexity: "Medium"
    },
    {
      id: "livestock",
      title: "Smart Livestock Management",
      description: "IoT and AI solutions for intelligent animal husbandry",
      icon: Users,
      benefits: [
        "20% improvement in feed efficiency",
        "Early disease detection",
        "Automated health monitoring",
        "Breeding optimization",
        "Stress level monitoring",
        "Production forecasting"
      ],
      technologies: ["Wearable sensors", "Computer vision", "Behavioral AI", "Health analytics"],
      roi: "150-250%",
      timeline: "4-8 months",
      complexity: "Medium"
    },
    {
      id: "supply",
      title: "Supply Chain Optimization",
      description: "End-to-end agricultural supply chain digitization",
      icon: Network,
      benefits: [
        "50% reduction in food waste",
        "Improved traceability",
        "Quality assurance",
        "Inventory optimization",
        "Price forecasting",
        "Logistics efficiency"
      ],
      technologies: ["Blockchain", "RFID tracking", "Cold chain monitoring", "Predictive analytics"],
      roi: "180-280%",
      timeline: "8-16 months",
      complexity: "High"
    },
    {
      id: "climate",
      title: "Climate-Smart Agriculture",
      description: "Weather prediction and climate adaptation strategies",
      icon: Cloud,
      benefits: [
        "Weather risk mitigation",
        "Climate adaptation planning",
        "Crop selection optimization",
        "Irrigation scheduling",
        "Carbon footprint reduction",
        "Sustainability reporting"
      ],
      technologies: ["Weather APIs", "Climate models", "Satellite data", "Machine learning"],
      roi: "120-200%",
      timeline: "3-6 months",
      complexity: "Low"
    }
  ];

  const agriTechCategories = [
    {
      category: "Crop Management",
      icon: Sprout,
      description: "Intelligent crop monitoring and optimization systems",
      solutions: [
        "Crop health monitoring",
        "Yield prediction models",
        "Pest and disease detection",
        "Growth stage tracking",
        "Harvest timing optimization",
        "Quality assessment"
      ],
      technology: "Computer Vision + AI",
      impact: "25-40% yield increase"
    },
    {
      category: "Water Management",
      icon: Droplets,
      description: "Smart irrigation and water conservation systems",
      solutions: [
        "Soil moisture monitoring",
        "Automated irrigation control",
        "Water usage optimization",
        "Drought prediction",
        "Irrigation scheduling",
        "Water quality monitoring"
      ],
      technology: "IoT Sensors + Analytics",
      impact: "30-50% water savings"
    },
    {
      category: "Weather Intelligence",
      icon: Sun,
      description: "Advanced weather monitoring and prediction systems",
      solutions: [
        "Microclimate monitoring",
        "Weather forecasting",
        "Frost prediction",
        "Growing degree days",
        "Evapotranspiration calculation",
        "Climate risk assessment"
      ],
      technology: "Satellite + Weather APIs",
      impact: "20-30% risk reduction"
    },
    {
      category: "Farm Automation",
      icon: Cpu,
      description: "Autonomous farming equipment and robotics",
      solutions: [
        "Autonomous tractors",
        "Robotic harvesters",
        "Drone applications",
        "Automated planting",
        "Precision spraying",
        "Livestock feeding systems"
      ],
      technology: "Robotics + AI Navigation",
      impact: "40-60% labor reduction"
    }
  ];

  const implementationSteps = [
    {
      phase: "Assessment & Planning",
      duration: "2-4 weeks",
      activities: [
        "Farm assessment and analysis",
        "Technology readiness evaluation",
        "ROI calculation and planning",
        "Custom solution design",
        "Infrastructure requirements",
        "Training needs assessment"
      ],
      deliverables: [
        "Farm digitization strategy",
        "Technology roadmap",
        "Cost-benefit analysis",
        "Implementation timeline"
      ]
    },
    {
      phase: "Infrastructure Setup",
      duration: "4-8 weeks",
      activities: [
        "IoT sensor installation",
        "Connectivity infrastructure",
        "Data collection systems",
        "Mobile app deployment",
        "Dashboard configuration",
        "Integration testing"
      ],
      deliverables: [
        "Operational sensor network",
        "Data collection platform",
        "Mobile applications",
        "Monitoring dashboards"
      ]
    },
    {
      phase: "AI Model Training",
      duration: "6-12 weeks",
      activities: [
        "Historical data analysis",
        "Custom model development",
        "Algorithm fine-tuning",
        "Validation and testing",
        "Performance optimization",
        "Accuracy verification"
      ],
      deliverables: [
        "Trained AI models",
        "Prediction algorithms",
        "Decision support systems",
        "Performance reports"
      ]
    },
    {
      phase: "Deployment & Training",
      duration: "2-4 weeks",
      activities: [
        "System go-live",
        "User training programs",
        "Process optimization",
        "Performance monitoring",
        "Feedback collection",
        "Continuous improvement"
      ],
      deliverables: [
        "Live production system",
        "Trained user base",
        "Operating procedures",
        "Support documentation"
      ]
    }
  ];

  const successMetrics = [
    { label: "Average Yield Increase", value: "32%", icon: TrendingUp },
    { label: "Water Usage Reduction", value: "35%", icon: Droplets },
    { label: "Cost Savings", value: "28%", icon: BarChart3 },
    { label: "Farm Efficiency Gain", value: "45%", icon: Zap },
    { label: "ROI Achievement", value: "240%", icon: Award },
    { label: "Farmer Satisfaction", value: "94%", icon: Star }
  ];

  const selectedSolutionData = agriTechSolutions.find(sol => sol.id === selectedSolution);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "High": return "text-red-600 bg-red-100 dark:bg-red-900/30";
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
          
          {/* Agriculture-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 dark:bg-green-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-400/35 dark:bg-green-400/25 rounded-full blur-md float-delayed-2" />
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
                  <Sprout className="w-12 h-12 text-green-600 dark:text-green-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Smart</span>{' '}
                <span className="text-green-600">Agriculture</span>{' '}
                <span className="gradient-text-blue-light">Solutions</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Transform traditional farming with AI-powered precision agriculture, IoT monitoring, and data-driven decision making for sustainable and profitable farming.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Sprout className="w-4 h-4 mr-2" />
                  Precision Farming
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Satellite className="w-4 h-4 mr-2" />
                  Satellite Monitoring
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Analytics
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Smartphone className="w-4 h-4 mr-2" />
                  IoT Sensors
                </Badge>
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {successMetrics.map((metric, index) => {
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
                <Sprout className="w-5 h-5 mr-2" />
                Start Smart Farming
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Farm Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="solutions">Smart Solutions</TabsTrigger>
            <TabsTrigger value="categories">Technology Areas</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="space-y-8 mt-8">
            {/* Smart Agriculture Solutions */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-green-600" />
                  AI-Powered Agriculture Solutions
                </CardTitle>
                <CardDescription>
                  Comprehensive smart farming solutions for modern agriculture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {agriTechSolutions.map((solution, index) => {
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
                        Benefits, technologies, and implementation approach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Key Benefits:</h4>
                          <div className="space-y-2">
                            {selectedSolutionData.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedSolutionData.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-green-200 dark:border-green-700">
                            <div className="text-sm font-medium mb-1">Implementation:</div>
                            <div className="text-2xl font-bold text-green-600">{selectedSolutionData.timeline}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Get Started:</h4>
                          <div className="space-y-3">
                            <Button className="w-full" onClick={() => navigate('demo-request')}>
                              <Play className="w-4 h-4 mr-2" />
                              Request Demo
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => navigate('contact')}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Farm Assessment
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

          <TabsContent value="categories" className="space-y-6 mt-8">
            {/* Agriculture Technology Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agriTechCategories.map((category, index) => {
                const Icon = category.icon;
                
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
                            <CardTitle className="text-lg">{category.category}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3">Solutions:</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {category.solutions.map((solution, solIndex) => (
                                <div key={solIndex} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                                  <span>{solution}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Technology:</span>
                              <Badge variant="outline">{category.technology}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Expected Impact:</span>
                              <span className="font-semibold text-green-600">{category.impact}</span>
                            </div>
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
                <CardDescription>How different technologies work together in smart farming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Satellite className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Remote Sensing</h3>
                    <p className="text-sm text-foreground-muted mb-4">Satellite and drone monitoring for large-scale crop assessment</p>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Real-time Monitoring
                    </Badge>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Database className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">IoT Sensors</h3>
                    <p className="text-sm text-foreground-muted mb-4">Ground-level sensors for precise environmental monitoring</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Precision Data
                    </Badge>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">AI Analytics</h3>
                    <p className="text-sm text-foreground-muted mb-4">Machine learning models for prediction and optimization</p>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Smart Decisions
                    </Badge>
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
                  Smart Agriculture Implementation Process
                </CardTitle>
                <CardDescription>
                  Step-by-step approach to digitizing your farming operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {implementationSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline connector */}
                      {index < implementationSteps.length - 1 && (
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
                            <h3 className="text-xl font-semibold">{step.phase}</h3>
                            <Badge variant="outline">{step.duration}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                              <h4 className="font-medium mb-3">Key Activities:</h4>
                              <div className="space-y-2">
                                {step.activities.map((activity, actIndex) => (
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
                                {step.deliverables.map((deliverable, delIndex) => (
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
                <CardTitle>Why Choose Smart Agriculture?</CardTitle>
                <CardDescription>Benefits of implementing digital farming solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Increased Productivity</h3>
                    <p className="text-sm text-foreground-muted">AI-driven insights lead to better yields and resource optimization</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Risk Mitigation</h3>
                    <p className="text-sm text-foreground-muted">Early detection of diseases, pests, and weather risks</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Sustainability</h3>
                    <p className="text-sm text-foreground-muted">Reduced environmental impact through precision farming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="success" className="space-y-6 mt-8">
            {/* Success Stories */}
            <div className="space-y-6">
              {[
                {
                  title: "Precision Rice Farming - Indonesia",
                  farmSize: "500 hectares",
                  location: "Central Java, Indonesia",
                  challenge: "Water scarcity and inconsistent yields",
                  solution: "IoT-based irrigation and AI crop monitoring",
                  results: ["40% water usage reduction", "25% yield increase", "30% cost savings"],
                  timeline: "8 months",
                  farmer: "Budi Santoso, Rice Farmer"
                },
                {
                  title: "Smart Dairy Farm - Netherlands",
                  farmSize: "200 cows",
                  location: "Friesland, Netherlands",
                  challenge: "Feed efficiency and health monitoring",
                  solution: "Wearable sensors and automated feed systems",
                  results: ["20% feed efficiency improvement", "Early disease detection", "15% milk production increase"],
                  timeline: "6 months",
                  farmer: "Jan van der Berg, Dairy Farmer"
                },
                {
                  title: "Vertical Farm Optimization - Singapore",
                  farmSize: "Urban vertical farm",
                  location: "Singapore",
                  challenge: "Energy costs and crop optimization",
                  solution: "AI-controlled environment and LED optimization",
                  results: ["35% energy reduction", "50% faster growth", "90% water savings"],
                  timeline: "4 months",
                  farmer: "Sarah Lim, Urban Farmer"
                }
              ].map((story, index) => (
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
                          <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-foreground-muted mb-4">
                            <span>📍 {story.location}</span>
                            <span>🚜 {story.farmSize}</span>
                            <span>⏱️ {story.timeline}</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Challenge:</h4>
                              <p className="text-foreground-muted">{story.challenge}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Solution:</h4>
                              <p className="text-foreground-muted">{story.solution}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Results:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {story.results.map((result, resultIndex) => (
                                  <div key={resultIndex} className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-center">
                                    <div className="text-green-600 dark:text-green-400 font-semibold">{result}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {story.farmer.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium">{story.farmer}</div>
                                  <div className="text-xs text-foreground-muted">"Smart farming transformed our operations"</div>
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
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Farm?</h3>
                <p className="text-foreground-muted mb-6">
                  Join thousands of farmers who have increased productivity and profitability with smart agriculture.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('success-stories')}>
                    <FileText className="w-4 h-4 mr-2" />
                    More Success Stories
                  </Button>
                  <Button variant="outline" onClick={() => navigate('demo-request')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Farm Visit
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
          <Card className="glass w-full bg-gradient-to-r from-green-50/50 via-blue-50/50 to-green-50/50 dark:from-green-950/30 dark:via-blue-950/30 dark:to-green-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Cultivate the Future of Farming
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Start your smart agriculture journey today. Increase yields, reduce costs, and farm sustainably with AI.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Sprout className="w-5 h-5 mr-2" />
                    Start Smart Farming
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Farm Consultation
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