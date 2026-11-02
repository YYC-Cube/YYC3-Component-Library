"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield,
  Lock,
  Eye,
  Database,
  Settings,
  Phone,
  Mail,
  Globe,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";

interface PrivacyPolicyPageProps {
  navigate: (page: string) => void;
}

export function PrivacyPolicyPage({ navigate }: PrivacyPolicyPageProps) {
  const [activeSection, setActiveSection] = useState('overview');

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

  const privacySections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Personal Information',
          description: 'We collect information you provide directly to us, such as when you create an account, use our services, or contact us.',
          details: [
            'Name, email address, and contact information',
            'Company name and business information',
            'Account credentials and preferences',
            'Communication history and support requests'
          ]
        },
        {
          subtitle: 'Usage Information',
          description: 'We automatically collect information about how you use our services and interact with our platform.',
          details: [
            'Device information and IP addresses',
            'Browser type and operating system',
            'Pages visited and time spent on our platform',
            'Features used and interaction patterns'
          ]
        },
        {
          subtitle: 'AI Training Data',
          description: 'With your explicit consent, we may collect data to improve our AI models and services.',
          details: [
            'Anonymized interaction data',
            'Aggregated usage patterns',
            'Performance metrics and feedback',
            'Model improvement suggestions'
          ]
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      icon: Settings,
      content: [
        {
          subtitle: 'Service Provision',
          description: 'We use your information to provide, maintain, and improve our AI consulting services.',
          details: [
            'Deliver personalized AI solutions',
            'Process transactions and billing',
            'Provide customer support',
            'Send service-related communications'
          ]
        },
        {
          subtitle: 'AI Model Development',
          description: 'With appropriate safeguards, we use data to enhance our AI capabilities.',
          details: [
            'Improve model accuracy and performance',
            'Develop new AI features and services',
            'Conduct research and development',
            'Enhance user experience and personalization'
          ]
        },
        {
          subtitle: 'Business Operations',
          description: 'We use information for legitimate business purposes and legal compliance.',
          details: [
            'Analyze usage trends and patterns',
            'Prevent fraud and ensure security',
            'Comply with legal obligations',
            'Communicate about updates and news'
          ]
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing & Disclosure',
      icon: Users,
      content: [
        {
          subtitle: 'Service Providers',
          description: 'We share data with trusted third-party service providers who assist in our operations.',
          details: [
            'Cloud hosting and infrastructure providers',
            'Payment processing services',
            'Analytics and monitoring tools',
            'Customer support platforms'
          ]
        },
        {
          subtitle: 'Legal Requirements',
          description: 'We may disclose information when required by law or to protect our rights.',
          details: [
            'Comply with legal processes and court orders',
            'Respond to government requests',
            'Protect against fraud and abuse',
            'Enforce our terms of service'
          ]
        },
        {
          subtitle: 'Business Transfers',
          description: 'Information may be transferred in connection with business transactions.',
          details: [
            'Mergers and acquisitions',
            'Asset sales or transfers',
            'Bankruptcy proceedings',
            'Corporate restructuring'
          ]
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Security Measures',
          description: 'We implement comprehensive security measures to protect your data.',
          details: [
            'Industry-standard encryption (AES-256)',
            'Secure data transmission (TLS 1.3)',
            'Multi-factor authentication',
            'Regular security audits and penetration testing'
          ]
        },
        {
          subtitle: 'Access Controls',
          description: 'We maintain strict access controls and data governance policies.',
          details: [
            'Role-based access permissions',
            'Regular access reviews and updates',
            'Employee privacy training',
            'Incident response procedures'
          ]
        },
        {
          subtitle: 'Data Retention',
          description: 'We retain data only as long as necessary for business and legal purposes.',
          details: [
            'Personal data: 7 years after account closure',
            'Transaction records: 10 years for compliance',
            'Analytics data: 3 years in aggregated form',
            'Support communications: 5 years'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Choices',
      icon: Eye,
      content: [
        {
          subtitle: 'Data Access Rights',
          description: 'You have the right to access and review your personal information.',
          details: [
            'Request a copy of your data',
            'Review data processing activities',
            'Verify data accuracy',
            'Understand data sources'
          ]
        },
        {
          subtitle: 'Data Control Rights',
          description: 'You can control how your data is used and processed.',
          details: [
            'Correct inaccurate information',
            'Delete your account and data',
            'Restrict certain processing activities',
            'Object to data processing'
          ]
        },
        {
          subtitle: 'Communication Preferences',
          description: 'You can manage your communication preferences and opt-outs.',
          details: [
            'Unsubscribe from marketing emails',
            'Adjust notification settings',
            'Control data sharing preferences',
            'Manage cookie settings'
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated privacy icons */}
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
                 i % 4 === 2 ? <Eye className="w-8 h-8" /> :
                 <Database className="w-8 h-8" />}
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
                Privacy & Data Protection
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
                <span className="gradient-text-blue">Privacy</span> Policy
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                We are committed to protecting your privacy and ensuring the security of your personal information. Learn how we collect, use, and safeguard your data.
              </motion.p>
            </div>

            {/* Privacy Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Lock, text: 'Secure by design' },
                { icon: Eye, text: 'Full transparency' },
                { icon: Settings, text: 'Your control' },
                { icon: Shield, text: 'GDPR compliant' }
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
                Contact Privacy Team
              </Button>
              <Button
                onClick={() => navigate('security')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                View Security Practices
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Our Privacy Commitment
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    At Delibix, we believe privacy is a fundamental right. This policy explains how we handle your information with transparency, security, and respect for your choices.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Secure by Design</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">End-to-end encryption and industry-leading security measures</p>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Transparency</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clear explanations of what data we collect and why</p>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Your Control</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Complete control over your data and privacy settings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Last Updated</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  This privacy policy was last updated on December 15, 2024
                </p>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  Current Version 3.1
                </Badge>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Jurisdiction</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  This policy complies with GDPR, CCPA, and Indonesian data protection laws
                </p>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Global Compliance
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Privacy Sections */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {privacySections.map((section, index) => (
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
                  <CardContent className="space-y-8">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                          {item.subtitle}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {item.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-3 p-3 rounded-xl glass-secondary">
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                        {itemIndex < section.content.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Action Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Questions About Your Privacy?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Our privacy team is here to help. Contact us with any questions about this policy or your data rights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('contact')}
                  className="gradient-bg-blue text-white hover:opacity-90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Privacy Team
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
                  Email us directly at: <span className="font-medium text-blue-600 dark:text-blue-400">privacy@delibix.com</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}