"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  Users, 
  Gamepad2, 
  ShoppingCart, 
  GraduationCap, 
  Building2,
  Headphones,
  Smartphone,
  Monitor,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  Settings,
  Eye,
  Heart,
  Lightbulb,
  Network,
  Database,
  Shield,
  Rocket,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  Play,
  Code,
  Layers
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface MetaverseConsultingPageProps {
  navigate: (page: string) => void;
}

export function MetaverseConsultingPage({ navigate }: MetaverseConsultingPageProps) {
  const [selectedSolution, setSelectedSolution] = useState("virtual-commerce");

  const metaverseSolutions = [
    {
      id: "virtual-commerce",
      title: "Virtual Commerce",
      description: "AI-powered virtual stores and immersive shopping experiences",
      icon: ShoppingCart,
      applications: [
        "3D virtual showrooms",
        "AI shopping assistants",
        "Virtual try-on technology",
        "Immersive product demos",
        "Social commerce experiences",
        "Cross-platform integration"
      ],
      technologies: ["WebXR", "3D Modeling", "AI Avatars", "Blockchain", "NFTs"],
      roi: "250-400%",
      timeline: "8-16 weeks",
      maturity: "Production Ready",
      industries: ["Retail", "Fashion", "Real Estate", "Automotive"]
    },
    {
      id: "virtual-events",
      title: "Virtual Events & Meetings",
      description: "Next-generation virtual conferences and collaboration spaces",
      icon: Users,
      applications: [
        "Virtual conference halls",
        "AI-powered networking",
        "Interactive exhibitions",
        "Real-time collaboration",
        "Multi-platform streaming",
        "Analytics and insights"
      ],
      technologies: ["Spatial Audio", "Motion Capture", "WebRTC", "AI Translation"],
      roi: "180-300%",
      timeline: "6-12 weeks",
      maturity: "Production Ready",
      industries: ["Events", "Corporate", "Education", "Healthcare"]
    },
    {
      id: "virtual-training",
      title: "Virtual Training & Education",
      description: "Immersive learning experiences with AI-powered personalization",
      icon: GraduationCap,
      applications: [
        "VR training simulations",
        "AI tutoring systems",
        "Gamified learning",
        "Skill assessment",
        "Progress tracking",
        "Collaborative learning"
      ],
      technologies: ["VR/AR", "AI Tutors", "Learning Analytics", "Gamification"],
      roi: "200-350%",
      timeline: "10-18 weeks",
      maturity: "Emerging",
      industries: ["Education", "Healthcare", "Manufacturing", "Aviation"]
    },
    {
      id: "virtual-workspaces",
      title: "Virtual Workspaces",
      description: "AI-enhanced virtual offices and remote collaboration environments",
      icon: Building2,
      applications: [
        "Virtual office spaces",
        "AI meeting assistants",
        "Collaborative whiteboards",
        "Virtual team building",
        "Remote presence",
        "Productivity analytics"
      ],
      technologies: ["Spatial Computing", "AI Assistants", "Cloud Rendering"],
      roi: "150-280%",
      timeline: "12-20 weeks",
      maturity: "Developing",
      industries: ["Technology", "Finance", "Consulting", "Media"]
    }
  ];

  const metaversePlatforms = [
    {
      name: "Meta Horizon",
      description: "Social VR platform for immersive experiences",
      strengths: ["Large user base", "Social features", "Developer tools"],
      integration: "High",
      accessibility: "Mobile + VR",
      businessModel: "B2C focused"
    },
    {
      name: "Microsoft Mesh",
      description: "Enterprise-focused mixed reality platform",
      strengths: ["Enterprise integration", "HoloLens support", "Teams integration"],
      integration: "Very High",
      accessibility: "All devices",
      businessModel: "B2B focused"
    },
    {
      name: "NVIDIA Omniverse",
      description: "Collaborative 3D creation and simulation platform",
      strengths: ["High fidelity", "Real-time collaboration", "AI integration"],
      integration: "Medium",
      accessibility: "Desktop + VR",
      businessModel: "Enterprise/Creator"
    },
    {
      name: "Roblox",
      description: "User-generated content and gaming platform",
      strengths: ["Content creation", "Young demographics", "Monetization"],
      integration: "Medium",
      accessibility: "All devices",
      businessModel: "Creator economy"
    },
    {
      name: "Web-based Solutions",
      description: "Custom WebXR solutions accessible via browsers",
      strengths: ["No downloads", "Cross-platform", "Easy access"],
      integration: "Custom",
      accessibility: "All devices",
      businessModel: "Flexible"
    }
  ];

  const implementationPhases = [
    {
      phase: "Strategy & Design",
      duration: "3-5 weeks",
      activities: [
        "Metaverse strategy development",
        "User experience design",
        "Platform selection",
        "Technical architecture",
        "3D environment planning",
        "Content strategy"
      ],
      deliverables: [
        "Metaverse strategy document",
        "UX/UI designs",
        "Technical blueprint",
        "3D environment concepts"
      ]
    },
    {
      phase: "3D Development",
      duration: "6-10 weeks",
      activities: [
        "3D environment creation",
        "Avatar development",
        "Interactive elements",
        "Physics simulation",
        "Lighting and textures",
        "Performance optimization"
      ],
      deliverables: [
        "3D environments",
        "Avatar systems",
        "Interactive prototypes",
        "Performance reports"
      ]
    },
    {
      phase: "AI Integration",
      duration: "4-8 weeks",
      activities: [
        "AI assistant development",
        "Personalization algorithms",
        "Natural language processing",
        "Behavioral analytics",
        "Recommendation systems",
        "Automated moderation"
      ],
      deliverables: [
        "AI-powered features",
        "Personalization engine",
        "Analytics dashboard",
        "Moderation systems"
      ]
    },
    {
      phase: "Launch & Scale",
      duration: "2-4 weeks",
      activities: [
        "Platform deployment",
        "User onboarding",
        "Performance monitoring",
        "Community management",
        "Content moderation",
        "Continuous optimization"
      ],
      deliverables: [
        "Live metaverse platform",
        "User onboarding system",
        "Community guidelines",
        "Monitoring dashboard"
      ]
    }
  ];

  const metaverseMetrics = [
    { label: "User Engagement", value: "300%+", icon: Users },
    { label: "Session Duration", value: "45 min avg", icon: Clock },
    { label: "Conversion Rate", value: "85%+", icon: TrendingUp },
    { label: "Brand Recall", value: "90%+", icon: Brain },
    { label: "Cost Efficiency", value: "60%", icon: Award },
    { label: "Global Reach", value: "24/7", icon: Globe }
  ];

  const useCases = [
    {
      title: "Virtual Showroom - Automotive",
      industry: "Automotive",
      challenge: "Remote car sales and virtual test drives",
      solution: "Immersive VR showroom with AI configurator",
      results: ["400% increase in engagement", "250% boost in conversions", "50% reduction in sales cycle"],
      timeline: "12 weeks",
      client: "Premium Auto Dealer"
    },
    {
      title: "Virtual Campus - Education",
      industry: "Education",
      challenge: "Remote learning and campus tours",
      solution: "Interactive virtual campus with AI tutors",
      results: ["300% increase in virtual tours", "180% improvement in retention", "90% student satisfaction"],
      timeline: "16 weeks",
      client: "International University"
    },
    {
      title: "Virtual Training - Healthcare",
      industry: "Healthcare",
      challenge: "Medical procedure training at scale",
      solution: "VR surgery simulation with AI feedback",
      results: ["85% improvement in skill retention", "70% reduction in training costs", "95% trainee satisfaction"],
      timeline: "20 weeks",
      client: "Medical Training Institute"
    }
  ];

  const selectedSolutionData = metaverseSolutions.find(sol => sol.id === selectedSolution);

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "Production Ready": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Emerging": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Developing": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getIntegrationColor = (integration: string) => {
    switch (integration) {
      case "Very High": return "text-green-600";
      case "High": return "text-blue-600";
      case "Medium": return "text-yellow-600";
      case "Custom": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-purple-100/40 dark:from-purple-950/20 dark:via-blue-950/10 dark:to-purple-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,244,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(139,69,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.05)_1px,transparent_1px)]" />
          
          {/* Metaverse-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-400/35 dark:bg-purple-400/25 rounded-full blur-md float-delayed-2" />
          
          {/* Virtual reality visualization */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 border-2 border-purple-400 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
              <div className="absolute inset-4 border-2 border-blue-400 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
              <div className="absolute inset-8 border-2 border-purple-300 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '2s' }} />
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
                  <Globe className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Metaverse</span>{' '}
                <span className="text-purple-600">Consulting</span>{' '}
                <span className="gradient-text-blue-light">Solutions</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Build immersive virtual worlds and AI-powered experiences. Transform your business with cutting-edge metaverse technologies and virtual commerce solutions.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Headphones className="w-4 h-4 mr-2" />
                  VR/AR
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Avatars
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Layers className="w-4 h-4 mr-2" />
                  3D Worlds
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Network className="w-4 h-4 mr-2" />
                  Social Commerce
                </Badge>
              </div>

              {/* Success Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {metaverseMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-600">{metric.value}</div>
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
                <Globe className="w-5 h-5 mr-2" />
                Start Metaverse Project
              </Button>
              
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Metaverse Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="solutions">Metaverse Solutions</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          </TabsList>

          <TabsContent value="solutions" className="space-y-8 mt-8">
            {/* Metaverse Solutions */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  AI-Powered Metaverse Solutions
                </CardTitle>
                <CardDescription>
                  Comprehensive virtual world solutions for business transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {metaverseSolutions.map((solution, index) => {
                    const Icon = solution.icon;
                    const isSelected = solution.id === selectedSolution;
                    
                    return (
                      <motion.div
                        key={solution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedSolution(solution.id)}
                      >
                        <Card className={`glass h-full card-hover ${isSelected ? 'bg-purple-50/50 dark:bg-purple-950/30' : ''}`}>
                          <CardContent className="p-6 text-center">
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{solution.title}</h3>
                            <p className="text-sm text-foreground-muted mb-4">{solution.description}</p>
                            <div className="space-y-2">
                              <Badge className={getMaturityColor(solution.maturity)}>
                                {solution.maturity}
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
                  <Card className="glass bg-purple-50/50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-700">
                    <CardHeader>
                      <CardTitle className="text-purple-700 dark:text-purple-300">
                        {selectedSolutionData.title} - Implementation Details
                      </CardTitle>
                      <CardDescription>
                        Applications, technologies, and business impact
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
                          <h4 className="font-semibold">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedSolutionData.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                            <div className="text-sm font-medium mb-1">Target Industries:</div>
                            <div className="flex flex-wrap gap-1">
                              {selectedSolutionData.industries.map((industry, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {industry}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold">Project Details:</h4>
                          <div className="space-y-3">
                            <div className="glass-blue-light p-3 rounded-lg">
                              <div className="text-sm font-medium">Expected ROI:</div>
                              <div className="text-lg font-bold text-purple-600">{selectedSolutionData.roi}</div>
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

          <TabsContent value="platforms" className="space-y-6 mt-8">
            {/* Metaverse Platforms */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-purple-600" />
                  Metaverse Platform Ecosystem
                </CardTitle>
                <CardDescription>
                  Choose the right platform for your virtual world deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {metaversePlatforms.map((platform, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-blue-light p-6 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{platform.name}</h3>
                          <p className="text-sm text-foreground-muted mt-1">{platform.description}</p>
                        </div>
                        <Badge className={getIntegrationColor(platform.integration)}>
                          {platform.integration} Integration
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Strengths:</h4>
                          <div className="space-y-1">
                            {platform.strengths.map((strength, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Star className="w-3 h-3 text-yellow-600" />
                                <span>{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Details:</h4>
                          <div className="space-y-1 text-sm">
                            <div><span className="font-medium">Access:</span> {platform.accessibility}</div>
                            <div><span className="font-medium">Model:</span> {platform.businessModel}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Button variant="outline" size="sm" className="w-full">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Selection Guide */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Platform Selection Guide</CardTitle>
                <CardDescription>Choose based on your specific requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Enterprise Solutions</h3>
                    <p className="text-sm text-foreground-muted mb-4">For business meetings, training, and collaboration</p>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Microsoft Mesh, Custom WebXR
                    </Badge>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Virtual Commerce</h3>
                    <p className="text-sm text-foreground-muted mb-4">For retail, showrooms, and e-commerce experiences</p>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Custom WebXR, Meta Horizon
                    </Badge>
                  </div>
                  
                  <div className="text-center p-6 glass-blue-light rounded-lg">
                    <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Social Experiences</h3>
                    <p className="text-sm text-foreground-muted mb-4">For community building and social interaction</p>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Meta Horizon, Roblox
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
                  <Settings className="w-6 h-6 text-purple-600" />
                  Metaverse Implementation Process
                </CardTitle>
                <CardDescription>
                  Step-by-step approach to building your virtual world
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
                        <div className="absolute left-6 top-16 w-0.5 h-32 bg-purple-200 dark:bg-purple-700" />
                      )}
                      
                      <div className="flex items-start gap-6">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                          <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                                    <ArrowRight className="w-3 h-3 text-purple-600" />
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
                <CardTitle>Why Choose Metaverse Solutions?</CardTitle>
                <CardDescription>Benefits of implementing virtual world experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Enhanced Engagement</h3>
                    <p className="text-sm text-foreground-muted">3x higher user engagement and 300% longer session duration</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Global Accessibility</h3>
                    <p className="text-sm text-foreground-muted">24/7 access from anywhere, breaking geographical barriers</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Cost Efficiency</h3>
                    <p className="text-sm text-foreground-muted">60% reduction in event costs and physical infrastructure needs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6 mt-8">
            {/* Case Studies */}
            <div className="space-y-6">
              {useCases.map((useCase, index) => (
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
                          <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-foreground-muted mb-4">
                            <span>🏢 {useCase.industry}</span>
                            <span>⏱️ {useCase.timeline}</span>
                            <span>👤 {useCase.client}</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Challenge:</h4>
                              <p className="text-foreground-muted">{useCase.challenge}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Solution:</h4>
                              <p className="text-foreground-muted">{useCase.solution}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Results:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {useCase.results.map((result, resultIndex) => (
                                  <div key={resultIndex} className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-center">
                                    <div className="text-purple-600 dark:text-purple-400 font-semibold">{result}</div>
                                  </div>
                                ))}
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
                <h3 className="text-2xl font-bold mb-4">Ready to Enter the Metaverse?</h3>
                <p className="text-foreground-muted mb-6">
                  Join leading brands creating immersive virtual experiences that engage and convert.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('success-stories')}>
                    <FileText className="w-4 h-4 mr-2" />
                    More Case Studies
                  </Button>
                  <Button variant="outline" onClick={() => navigate('demo-request')}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Demo
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
          <Card className="glass w-full bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-purple-50/50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Step Into the Future of Business
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Create immersive experiences that engage customers, train employees, and transform your business model.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Launch Metaverse Project
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Virtual Consultation
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