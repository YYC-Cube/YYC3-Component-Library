"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Cookie,
  Settings,
  Eye,
  BarChart3,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Trash2,
  Download,
  Mail,
  ToggleLeft,
  ToggleRight,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

interface CookiesPolicyPageProps {
  navigate: (page: string) => void;
}

export function CookiesPolicyPage({ navigate }: CookiesPolicyPageProps) {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    personalization: true,
    functional: true
  });

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

  const cookieCategories = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      required: true,
      examples: [
        'Authentication tokens',
        'Security preferences',
        'Load balancing',
        'CSRF protection'
      ],
      retention: 'Session or 1 year',
      thirdParty: false
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as language preferences.',
      icon: Settings,
      required: false,
      examples: [
        'Language preferences',
        'Theme settings',
        'User interface preferences',
        'Accessibility settings'
      ],
      retention: '1 year',
      thirdParty: false
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous data.',
      icon: BarChart3,
      required: false,
      examples: [
        'Google Analytics',
        'Page view statistics',
        'User behavior analysis',
        'Performance monitoring'
      ],
      retention: '2 years',
      thirdParty: true
    },
    {
      id: 'personalization',
      name: 'Personalization Cookies',
      description: 'Allow us to remember your choices and provide enhanced, personalized features.',
      icon: Eye,
      required: false,
      examples: [
        'Content recommendations',
        'Personalized dashboards',
        'Custom AI model preferences',
        'Saved configurations'
      ],
      retention: '1 year',
      thirdParty: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      icon: Globe,
      required: false,
      examples: [
        'Social media plugins',
        'Advertisement tracking',
        'Conversion tracking',
        'Retargeting pixels'
      ],
      retention: '6 months to 2 years',
      thirdParty: true
    }
  ];

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    if (category === 'essential') return; // Cannot disable essential cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [category]: enabled
    }));
  };

  const savePreferences = () => {
    // In a real app, this would save to localStorage and update actual cookie consent
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
      functional: true
    };
    setCookiePreferences(allEnabled);
    localStorage.setItem('cookiePreferences', JSON.stringify(allEnabled));
  };

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
      functional: false
    };
    setCookiePreferences(onlyEssential);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated cookie icons */}
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
                {i % 4 === 0 ? <Cookie className="w-8 h-8" /> : 
                 i % 4 === 1 ? <Settings className="w-8 h-8" /> : 
                 i % 4 === 2 ? <Shield className="w-8 h-8" /> :
                 <BarChart3 className="w-8 h-8" />}
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
              <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Cookie Management & Preferences
              </span>
              <Settings className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="gradient-text-blue">Cookies</span> Policy
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Learn about how we use cookies and similar technologies to improve your experience on our website. Manage your preferences and understand your choices.
              </motion.p>
            </div>

            {/* Cookie Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Shield, text: 'Essential only' },
                { icon: BarChart3, text: 'Analytics tracking' },
                { icon: Eye, text: 'Personalization' },
                { icon: Settings, text: 'Full control' }
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
                onClick={acceptAll}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept All Cookies
              </Button>
              <Button
                onClick={rejectAll}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject Non-Essential
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Overview */}
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
                    What Are Cookies?
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain features.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Session Cookies</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Temporary cookies that are deleted when you close your browser</p>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Download className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Persistent Cookies</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Stored on your device for a specific period or until manually deleted</p>
                </div>
                
                <div className="text-center p-4 rounded-xl glass-secondary">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Third-Party Cookies</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Set by external services integrated into our website</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cookie Categories & Preferences */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Manage Your Cookie Preferences
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose which types of cookies you want to allow. You can change these settings at any time.
            </p>
          </div>

          <div className="space-y-8">
            {cookieCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center">
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {category.name}
                            </h3>
                            {category.required && (
                              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                Required
                              </Badge>
                            )}
                            {category.thirdParty && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Third-Party
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            {category.description}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Examples:</h4>
                              <div className="space-y-2">
                                {category.examples.map((example, exampleIndex) => (
                                  <div key={exampleIndex} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{example}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Details:</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Retention: {category.retention}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    Third-party: {category.thirdParty ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {cookiePreferences[category.id as keyof typeof cookiePreferences] ? 'Enabled' : 'Disabled'}
                        </span>
                        <Switch
                          checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                          onCheckedChange={(checked) => handlePreferenceChange(category.id, checked)}
                          disabled={category.required}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Save Preferences */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button
              onClick={savePreferences}
              className="gradient-bg-blue text-white hover:opacity-90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
            
            <Button
              onClick={acceptAll}
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept All
            </Button>
            
            <Button
              onClick={rejectAll}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject All Non-Essential
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="glass">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Managing Cookies in Your Browser
              </h2>
              
              <div className="space-y-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  You can also manage cookies directly through your browser settings. Most browsers allow you to view, delete, and control cookies. Here's how:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Desktop Browsers:</h3>
                    <div className="space-y-2">
                      {[
                        'Chrome: Settings > Privacy and security > Cookies',
                        'Firefox: Preferences > Privacy & Security',
                        'Safari: Preferences > Privacy',
                        'Edge: Settings > Cookies and site permissions'
                      ].map((instruction, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Mobile Browsers:</h3>
                    <div className="space-y-2">
                      {[
                        'iOS Safari: Settings > Safari > Privacy & Security',
                        'Android Chrome: Settings > Site settings > Cookies',
                        'Firefox Mobile: Settings > Data Management',
                        'Samsung Internet: Settings > Personal browsing data'
                      ].map((instruction, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{instruction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Important Note</h4>
                      <p className="text-orange-800 dark:text-orange-200 text-sm">
                        Disabling certain cookies may affect the functionality of our website and limit your ability to access some features.
                      </p>
                    </div>
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
                Questions About Cookies?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                If you have any questions about our use of cookies or need help managing your preferences, our support team is here to help.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('contact')}
                  className="gradient-bg-blue text-white hover:opacity-90"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                
                <Button
                  onClick={() => navigate('privacy-policy')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                >
                  View Privacy Policy
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last updated: December 15, 2024 • Email: <span className="font-medium text-blue-600 dark:text-blue-400">privacy@delibix.com</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}