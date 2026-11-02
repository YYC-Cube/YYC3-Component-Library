"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Settings, 
  BookOpen, 
  Target, 
  Calendar,
  ArrowRight,
  Rocket,
  Shield,
  Zap,
  Brain,
  HeartHandshake,
  FileText,
  MessageSquare,
  Star,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface ClientOnboardingPageProps {
  navigate: (page: string) => void;
}

export function ClientOnboardingPage({ navigate }: ClientOnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const onboardingSteps = [
    {
      id: 1,
      title: "Welcome & Discovery",
      description: "Understanding your business goals and AI readiness",
      icon: HeartHandshake,
      duration: "Week 1",
      status: "completed",
      activities: [
        "Initial consultation call",
        "Business requirements analysis",
        "Current state assessment",
        "Goal alignment workshop"
      ]
    },
    {
      id: 2,
      title: "Strategic Planning",
      description: "Developing your customized AI transformation roadmap",
      icon: Target,
      duration: "Week 2",
      status: "current",
      activities: [
        "AI strategy development",
        "Technology stack planning",
        "Resource allocation",
        "Timeline establishment"
      ]
    },
    {
      id: 3,
      title: "Team Setup",
      description: "Assembling your dedicated AI consulting team",
      icon: Users,
      duration: "Week 3",
      status: "upcoming",
      activities: [
        "Team member assignment",
        "Role and responsibility mapping",
        "Communication protocols",
        "Project management setup"
      ]
    },
    {
      id: 4,
      title: "Platform Access",
      description: "Getting you set up with our AI consulting platform",
      icon: Settings,
      duration: "Week 4",
      status: "upcoming",
      activities: [
        "Platform account creation",
        "Access permissions setup",
        "Tool configuration",
        "Integration planning"
      ]
    },
    {
      id: 5,
      title: "Knowledge Transfer",
      description: "Training your team on our methodologies and tools",
      icon: BookOpen,
      duration: "Week 5",
      status: "upcoming",
      activities: [
        "Methodology training",
        "Platform orientation",
        "Best practices sharing",
        "Q&A sessions"
      ]
    },
    {
      id: 6,
      title: "Project Launch",
      description: "Officially launching your AI transformation journey",
      icon: Rocket,
      duration: "Week 6",
      status: "upcoming",
      activities: [
        "Project kickoff meeting",
        "Milestone planning",
        "Success metrics definition",
        "Regular check-in scheduling"
      ]
    }
  ];

  const clientResources = [
    {
      title: "Client Portal Access",
      description: "Your dedicated dashboard for project tracking and resources",
      icon: Shield,
      link: "client-portal"
    },
    {
      title: "Knowledge Base",
      description: "Comprehensive guides and documentation library",
      icon: BookOpen,
      link: "knowledge-base"
    },
    {
      title: "Training Materials",
      description: "Video tutorials and learning resources",
      icon: Award,
      link: "training-certification"
    },
    {
      title: "Support Center",
      description: "24/7 support and expert consultation",
      icon: MessageSquare,
      link: "support"
    }
  ];

  const successMetrics = [
    { label: "Client Satisfaction", value: 98, color: "text-green-600" },
    { label: "On-time Delivery", value: 95, color: "text-blue-600" },
    { label: "ROI Achievement", value: 87, color: "text-purple-600" },
    { label: "Knowledge Transfer", value: 92, color: "text-orange-600" }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "current": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default: return "text-gray-400 bg-gray-100 dark:bg-gray-800";
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
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
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
                  <UserCheck className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Welcome to</span>{' '}
                <span className="gradient-text-blue-light">Delibix</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Your streamlined onboarding journey to AI transformation success. We'll guide you every step of the way.
              </p>

              {/* Progress Indicator */}
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground-muted">Overall Progress</span>
                  <span className="text-sm font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
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
                onClick={() => navigate('contact')}
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              
              <Button
                onClick={() => navigate('demo-request')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="journey" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="journey">Onboarding Journey</TabsTrigger>
            <TabsTrigger value="resources">Client Resources</TabsTrigger>
            <TabsTrigger value="success">Success Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="space-y-8 mt-8">
            {/* Onboarding Timeline */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Your 6-Week Onboarding Journey
                </CardTitle>
                <CardDescription>
                  A structured approach to ensure your success with AI transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {onboardingSteps.map((step, index) => {
                    const Icon = step.icon;
                    const status = getStepStatus(step.id);
                    
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline connector */}
                        {index < onboardingSteps.length - 1 && (
                          <div className="absolute left-6 top-16 w-0.5 h-16 bg-blue-200 dark:bg-blue-700" />
                        )}
                        
                        <div className="flex items-start gap-4">
                          {/* Step Icon */}
                          <div className={`p-3 rounded-xl ${getStepColor(status)} flex-shrink-0`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          
                          {/* Step Content */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{step.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                              {status === "completed" && (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            
                            <p className="text-foreground-muted mb-4">{step.description}</p>
                            
                            {/* Activities */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {step.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-center gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                  <span>{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Current Step Details */}
            <Card className="glass w-full bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">
                  Current Step: {onboardingSteps[currentStep - 1]?.title}
                </CardTitle>
                <CardDescription>
                  What you can expect this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Duration: {onboardingSteps[currentStep - 1]?.duration}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {onboardingSteps[currentStep - 1]?.activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 glass-blue-light rounded-lg">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-8">
            {/* Client Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {clientResources.map((resource, index) => {
                const Icon = resource.icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-heavy h-full card-hover cursor-pointer" onClick={() => navigate(resource.link)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground-muted">{resource.description}</p>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="group">
                            Access Resource
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Links */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Frequently accessed resources during onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={() => navigate('faq')} className="h-auto p-4 flex flex-col items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">FAQ</span>
                  </Button>
                  <Button variant="outline" onClick={() => navigate('documentation')} className="h-auto p-4 flex flex-col items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Docs</span>
                  </Button>
                  <Button variant="outline" onClick={() => navigate('team')} className="h-auto p-4 flex flex-col items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Your Team</span>
                  </Button>
                  <Button variant="outline" onClick={() => navigate('support')} className="h-auto p-4 flex flex-col items-center gap-2">
                    <HeartHandshake className="w-5 h-5" />
                    <span className="text-sm">Support</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="success" className="space-y-6 mt-8">
            {/* Success Metrics */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Our Onboarding Success Metrics
                </CardTitle>
                <CardDescription>
                  Why 98% of our clients successfully complete onboarding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {successMetrics.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{metric.label}</span>
                        <span className={`font-bold ${metric.color}`}>{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
                <CardDescription>What our clients say about the onboarding experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 p-4 glass-blue-light rounded-lg">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic">
                      "The onboarding process was incredibly smooth and well-structured. Our team was productive from day one."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-sm">Alex Chen</p>
                        <p className="text-xs text-foreground-muted">CTO, TechCorp</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 glass-blue-light rounded-lg">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic">
                      "Delibix's systematic approach to onboarding gave us confidence and clarity about our AI journey."
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sarah Johnson</p>
                        <p className="text-xs text-foreground-muted">VP Innovation, RetailMax</p>
                      </div>
                    </div>
                  </div>
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
          className="mt-16 text-center"
        >
          <Card className="glass w-full bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Start Your AI Transformation?
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Join hundreds of successful companies who have transformed their business with our proven onboarding process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Begin Onboarding
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('demo-request')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Consultation
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