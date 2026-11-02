"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield,
  Lock,
  Key,
  Server,
  Eye,
  FileCheck,
  Users,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Award,
  Clock,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface SecurityPageProps {
  navigate: (page: string) => void;
}

export function SecurityPage({ navigate }: SecurityPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using AES-256 encryption both in transit and at rest',
      icon: Lock,
      level: 'Advanced',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Enhanced security with TOTP, SMS, and hardware key support',
      icon: Key,
      level: 'Standard',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    },
    {
      title: 'Zero Trust Architecture',
      description: 'Network security based on never trust, always verify principle',
      icon: Shield,
      level: 'Enterprise',
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    },
    {
      title: 'Regular Security Audits',
      description: 'Third-party penetration testing and vulnerability assessments',
      icon: FileCheck,
      level: 'Ongoing',
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    },
    {
      title: 'Secure Infrastructure',
      description: 'Cloud infrastructure with enterprise-grade security controls',
      icon: Server,
      level: 'Advanced',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    },
    {
      title: 'Privacy by Design',
      description: 'Data minimization and privacy-first approach to system design',
      icon: Eye,
      level: 'Core',
      color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
    }
  ];

  const complianceStandards = [
    {
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 compliance for security and availability',
      status: 'Certified',
      icon: Award,
      progress: 100
    },
    {
      name: 'ISO 27001',
      description: 'Information Security Management System certification',
      status: 'In Progress',
      icon: Shield,
      progress: 85
    },
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation compliance',
      status: 'Compliant',
      icon: Globe,
      progress: 100
    },
    {
      name: 'CCPA',
      description: 'California Consumer Privacy Act compliance',
      status: 'Compliant',
      icon: FileCheck,
      progress: 100
    }
  ];

  const securityMetrics = [
    { label: 'Uptime SLA', value: '99.9%', icon: Zap },
    { label: 'Security Incidents (2024)', value: '0', icon: Shield },
    { label: 'Average Response Time', value: '<2hrs', icon: Clock },
    { label: 'Data Breach History', value: 'None', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated security icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-500"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0.5, 1, 0.5],
                  opacity: [0, 0.3, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                {i % 4 === 0 ? <Shield className="w-8 h-8" /> : 
                 i % 4 === 1 ? <Lock className="w-8 h-8" /> : 
                 i % 4 === 2 ? <Key className="w-8 h-8" /> :
                 <Server className="w-8 h-8" />}
              </motion.div>
            ))}
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
                Enterprise Security & Trust
              </span>
              <Lock className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Security & <span className="gradient-text-blue">Trust</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Your security is our top priority. Learn about our comprehensive security measures, compliance standards, and commitment to protecting your data.
              </motion.p>
            </div>

            {/* Security Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Lock, text: 'End-to-end encryption' },
                { icon: Key, text: 'Multi-factor auth' },
                { icon: Award, text: 'SOC 2 certified' },
                { icon: CheckCircle, text: 'Zero incidents' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                onClick={() => setActiveTab('measures')}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <Shield className="w-5 h-5 mr-2" />
                View Security Measures
              </Button>
              <Button
                onClick={() => navigate('privacy-policy')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Privacy Policy
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Security Metrics */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Security at a Glance
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Key metrics demonstrating our commitment to security and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass text-center card-hover">
                  <CardContent className="p-6">
                    <metric.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <div className="text-3xl font-bold gradient-text-blue mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {metric.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="measures">Security Measures</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="incident-response">Incident Response</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                      Our Security Philosophy
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">
                      At Delibix, security isn't an afterthought—it's built into everything we do. We employ a defense-in-depth strategy with multiple layers of protection to ensure your data and AI systems remain secure.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-6 rounded-xl glass-secondary">
                        <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Proactive Security</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Continuous monitoring and threat detection to prevent security incidents before they occur
                        </p>
                      </div>
                      
                      <div className="text-center p-6 rounded-xl glass-secondary">
                        <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Human-Centered</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Security awareness training and processes that empower our team to be security champions
                        </p>
                      </div>
                      
                      <div className="text-center p-6 rounded-xl glass-secondary">
                        <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Transparent</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Open communication about our security practices and any incidents that may occur
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Security Measures Tab */}
            <TabsContent value="measures" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="glass card-hover h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center">
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                  {feature.title}
                                </h3>
                                <Badge className={feature.color}>
                                  {feature.level}
                                </Badge>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Compliance & Certifications
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    We maintain compliance with industry standards and regulations to ensure the highest level of security and trust.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {complianceStandards.map((standard, index) => (
                    <motion.div
                      key={standard.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="glass">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                              <standard.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                  {standard.name}
                                </h3>
                                <Badge 
                                  className={
                                    standard.status === 'Certified' || standard.status === 'Compliant'
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                  }
                                >
                                  {standard.status}
                                </Badge>
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 mb-4">
                                {standard.description}
                              </p>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                                  <span className="text-slate-900 dark:text-slate-100 font-medium">{standard.progress}%</span>
                                </div>
                                <Progress value={standard.progress} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Incident Response Tab */}
            <TabsContent value="incident-response" className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                      Incident Response Plan
                    </h2>
                    
                    <div className="space-y-8">
                      <div className="grid md:grid-cols-4 gap-6">
                        {[
                          { step: '1', title: 'Detection', description: 'Automated monitoring systems detect potential security incidents', time: '< 5 min' },
                          { step: '2', title: 'Assessment', description: 'Security team evaluates threat level and impact', time: '< 30 min' },
                          { step: '3', title: 'Response', description: 'Immediate containment and mitigation actions', time: '< 2 hrs' },
                          { step: '4', title: 'Recovery', description: 'System restoration and post-incident analysis', time: '< 24 hrs' }
                        ].map((phase, index) => (
                          <div key={phase.step} className="text-center">
                            <div className="w-12 h-12 rounded-full gradient-bg-blue text-white font-bold flex items-center justify-center mx-auto mb-3">
                              {phase.step}
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{phase.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{phase.description}</p>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {phase.time}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1" />
                          <div>
                            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                              Report a Security Issue
                            </h3>
                            <p className="text-orange-800 dark:text-orange-200 mb-4">
                              If you discover a security vulnerability, please report it immediately to our security team.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button
                                onClick={() => navigate('contact')}
                                className="bg-orange-600 text-white hover:bg-orange-700"
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                security@delibix.com
                              </Button>
                              <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                24/7 Response Team
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Security Questions or Concerns?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Our security team is available 24/7 to address any security-related questions or concerns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('contact')}
                  className="gradient-bg-blue text-white hover:opacity-90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Security Team
                </Button>
                
                <Button
                  onClick={() => navigate('support')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Support
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email: <span className="font-medium text-blue-600 dark:text-blue-400">security@delibix.com</span> • 
                  Emergency: <span className="font-medium text-red-600 dark:text-red-400">+62-XXX-XXXX-XXXX</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}