"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText,
  Scale,
  AlertTriangle,
  Shield,
  CreditCard,
  Users,
  Globe,
  Calendar,
  CheckCircle,
  XCircle,
  Info,
  Mail,
  Phone,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface TermsServicePageProps {
  navigate: (page: string) => void;
}

export function TermsServicePage({ navigate }: TermsServicePageProps) {
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

  const termsSections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: {
        description: 'By accessing and using Delibix services, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
        points: [
          'These terms constitute a legally binding agreement between you and Delibix',
          'You must be at least 18 years old to use our services',
          'If you disagree with any part of these terms, you may not use our services',
          'We may update these terms periodically with notice to users'
        ]
      }
    },
    {
      id: 'services',
      title: 'Description of Services',
      icon: FileText,
      content: {
        description: 'Delibix provides AI consulting, implementation, and related technology services to businesses and organizations.',
        points: [
          'AI strategy development and consulting',
          'Custom AI model development and deployment',
          'AI training and educational services',
          'Technical support and maintenance for AI systems',
          'Data analysis and insights generation',
          'AI readiness assessments and audits'
        ]
      }
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: Users,
      content: {
        description: 'Users are responsible for their conduct and compliance with applicable laws while using our services.',
        points: [
          'Provide accurate and complete information',
          'Maintain the confidentiality of account credentials',
          'Use services in compliance with all applicable laws',
          'Respect intellectual property rights',
          'Not engage in harmful or disruptive activities',
          'Report security vulnerabilities or abuse'
        ]
      }
    },
    {
      id: 'payment-billing',
      title: 'Payment & Billing',
      icon: CreditCard,
      content: {
        description: 'Payment terms and billing procedures for Delibix services.',
        points: [
          'Payments are due according to agreed terms in service contracts',
          'Late payments may incur interest charges and service suspension',
          'All fees are non-refundable unless otherwise specified',
          'Price changes require 30 days advance notice',
          'Disputed charges must be reported within 60 days',
          'Automatic billing applies to recurring services'
        ]
      }
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Shield,
      content: {
        description: 'Rights and restrictions regarding intellectual property and proprietary information.',
        points: [
          'Delibix retains ownership of all proprietary methodologies and frameworks',
          'Custom AI models developed for clients remain client property',
          'Client data and information remain client property',
          'Licensed software and tools are subject to third-party terms',
          'Improvements to our general methodologies remain our property',
          'Client may not reverse engineer or copy our proprietary systems'
        ]
      }
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality & Data Protection',
      icon: Scale,
      content: {
        description: 'Our commitment to protecting confidential information and data security.',
        points: [
          'All client data is treated as confidential information',
          'Non-disclosure agreements govern sensitive information sharing',
          'Data is processed according to our Privacy Policy',
          'Security measures protect against unauthorized access',
          'Data retention policies ensure appropriate disposal',
          'Breach notification procedures are in place'
        ]
      }
    },
    {
      id: 'limitations',
      title: 'Limitations & Disclaimers',
      icon: AlertTriangle,
      content: {
        description: 'Important limitations on liability and service warranties.',
        points: [
          'Services are provided "as is" without warranties',
          'We do not guarantee specific outcomes or results',
          'Liability is limited to the amount paid for services',
          'We are not liable for indirect or consequential damages',
          'Force majeure events excuse performance delays',
          'Some jurisdictions may not allow certain limitations'
        ]
      }
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: XCircle,
      content: {
        description: 'Conditions under which services may be terminated by either party.',
        points: [
          'Either party may terminate with written notice as specified in contracts',
          'Immediate termination for material breach or non-payment',
          'Data return and destruction procedures upon termination',
          'Survival of certain terms after termination',
          'No refunds for prepaid services after termination',
          'Transition assistance may be available for a fee'
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated legal icons */}
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
                {i % 4 === 0 ? <Scale className="w-8 h-8" /> : 
                 i % 4 === 1 ? <FileText className="w-8 h-8" /> : 
                 i % 4 === 2 ? <Shield className="w-8 h-8" /> :
                 <Users className="w-8 h-8" />}
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
              <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Legal Terms & Conditions
              </span>
              <FileText className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Terms of <span className="gradient-text-blue">Service</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Please read these terms carefully. They govern your use of Delibix services and establish the legal framework for our professional relationship.
              </motion.p>
            </div>

            {/* Legal Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Scale, text: 'Legally binding' },
                { icon: Globe, text: 'Global compliance' },
                { icon: Shield, text: 'Client protection' },
                { icon: Users, text: 'Fair terms' }
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
                onClick={() => navigate('contact')}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Legal Team
              </Button>
              <Button
                onClick={() => navigate('privacy-policy')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                View Privacy Policy
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Terms Overview */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Important Information
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    These Terms of Service govern your relationship with Delibix and our AI consulting services. Please review them carefully before using our services.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Effective Date</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">December 15, 2024</p>
                  <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Version 2.3
                  </Badge>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Jurisdiction</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Indonesia & International</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Global Services
                  </Badge>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Agreement Type</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Legally Binding Contract</p>
                  <Badge className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    Enforceable
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Terms Sections */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {termsSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center">
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">
                        {section.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                      {section.content.description}
                    </p>
                    
                    <div className="grid gap-4">
                      {section.content.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-start gap-3 p-4 rounded-xl glass-secondary">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notices */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass border-orange-200 dark:border-orange-800">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Important Legal Notices
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      <strong>Changes to Terms:</strong> We may modify these terms at any time. Material changes will be communicated with 30 days advance notice.
                    </p>
                    <p>
                      <strong>Severability:</strong> If any provision of these terms is found unenforceable, the remaining provisions will continue in full force.
                    </p>
                    <p>
                      <strong>Governing Law:</strong> These terms are governed by Indonesian law and international commercial law principles.
                    </p>
                    <p>
                      <strong>Dispute Resolution:</strong> Disputes will be resolved through binding arbitration in Yogyakarta, Indonesia.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Our legal team is available to help clarify any questions about these terms of service.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('contact')}
                  className="gradient-bg-blue text-white hover:opacity-90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Legal Team
                </Button>
                
                <Button
                  onClick={() => navigate('support')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get Support
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Email us directly at: <span className="font-medium text-blue-600 dark:text-blue-400">legal@delibix.com</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}