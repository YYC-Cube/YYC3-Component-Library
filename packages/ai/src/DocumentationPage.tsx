"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Code, Zap, Database, Globe, ChevronRight, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface DocumentationPageProps {
  navigate: (page: string) => void;
}

export function DocumentationPage({ navigate }: DocumentationPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections = [
    {
      title: "Getting Started",
      description: "Quick start guides and setup instructions",
      icon: Zap,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      docs: [
        { title: "Quick Start Guide", type: "Guide", readTime: "5 min" },
        { title: "Installation & Setup", type: "Tutorial", readTime: "10 min" },
        { title: "Your First AI Project", type: "Tutorial", readTime: "15 min" },
        { title: "API Authentication", type: "Guide", readTime: "8 min" }
      ]
    },
    {
      title: "API Reference",
      description: "Complete API documentation and examples",
      icon: Code,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      docs: [
        { title: "REST API Overview", type: "Reference", readTime: "12 min" },
        { title: "Authentication", type: "Reference", readTime: "8 min" },
        { title: "AI Models Endpoints", type: "Reference", readTime: "20 min" },
        { title: "Webhooks", type: "Reference", readTime: "10 min" }
      ]
    },
    {
      title: "AI Models",
      description: "Documentation for our AI models and capabilities",
      icon: Database,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      docs: [
        { title: "Text Generation Models", type: "Guide", readTime: "18 min" },
        { title: "Image Analysis API", type: "Guide", readTime: "15 min" },
        { title: "Natural Language Processing", type: "Guide", readTime: "22 min" },
        { title: "Custom Model Training", type: "Advanced", readTime: "30 min" }
      ]
    },
    {
      title: "Integration Guides",
      description: "Platform-specific integration tutorials",
      icon: Globe,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      docs: [
        { title: "React Integration", type: "Tutorial", readTime: "25 min" },
        { title: "Python SDK", type: "Tutorial", readTime: "20 min" },
        { title: "Node.js Integration", type: "Tutorial", readTime: "18 min" },
        { title: "WordPress Plugin", type: "Tutorial", readTime: "15 min" }
      ]
    }
  ];

  const popularDocs = [
    { title: "Quick Start Guide", category: "Getting Started", views: "15.2k" },
    { title: "REST API Overview", category: "API Reference", views: "12.8k" },
    { title: "Text Generation Models", category: "AI Models", views: "9.4k" },
    { title: "React Integration", category: "Integration", views: "8.1k" }
  ];

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

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Guide': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Tutorial': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Reference': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Advanced': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-32 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-slate-900 dark:text-slate-100">
            Documentation Hub
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Comprehensive guides, API references, and tutorials to help you integrate and leverage our AI solutions effectively.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass border-blue-200 dark:border-blue-800"
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>200+ Documentation Pages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Updated Weekly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Multi-language Support</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Documentation Sections */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-4 gap-8"
          >
            {documentationSections.map((section, index) => (
              <motion.div key={section.title} variants={itemVariants}>
                <Card className="h-full glass card-hover">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center`}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {section.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {section.docs.map((doc, docIndex) => (
                      <div key={docIndex} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {doc.title}
                          </h4>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={`text-xs ${getBadgeColor(doc.type)}`}>
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-slate-500">{doc.readTime}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Documentation */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
              Most Popular Documentation
            </h2>
            
            <div className="space-y-4">
              {popularDocs.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass card-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {doc.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {doc.views} views
                            </div>
                            <div className="text-xs text-slate-500">this month</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-slate-900 dark:text-slate-100">
              Need More Help?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('support')}
                className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90 transition-opacity"
              >
                Contact Support
              </Button>
              <Button
                onClick={() => navigate('community')}
                variant="outline"
                className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}