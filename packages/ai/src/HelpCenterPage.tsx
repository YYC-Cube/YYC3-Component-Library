"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, HelpCircle, Book, Video, Download, Star, ChevronRight, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface HelpCenterPageProps {
  navigate: (page: string) => void;
}

export function HelpCenterPage({ navigate }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Essential guides for new users",
      icon: Book,
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      articles: 12,
      popular: true
    },
    {
      title: "API & Integration",
      description: "Technical implementation guides",
      icon: MessageCircle,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      articles: 24,
      popular: true
    },
    {
      title: "Billing & Pricing",
      description: "Payment and subscription help",
      icon: Star,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      articles: 8,
      popular: false
    },
    {
      title: "Troubleshooting",
      description: "Solve common issues quickly",
      icon: HelpCircle,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      articles: 18,
      popular: true
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Video,
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      articles: 15,
      popular: false
    },
    {
      title: "Best Practices",
      description: "Tips and optimization guides",
      icon: Download,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      articles: 10,
      popular: false
    }
  ];

  const popularArticles = [
    {
      title: "How to get started with Delibix AI",
      category: "Getting Started",
      readTime: "5 min",
      rating: 4.9,
      helpful: 284
    },
    {
      title: "API Authentication Guide",
      category: "API & Integration",
      readTime: "8 min",
      rating: 4.8,
      helpful: 192
    },
    {
      title: "Understanding pricing plans",
      category: "Billing & Pricing",
      readTime: "6 min",
      rating: 4.7,
      helpful: 156
    },
    {
      title: "Troubleshooting common API errors",
      category: "Troubleshooting",
      readTime: "10 min",
      rating: 4.8,
      helpful: 134
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our team",
      icon: MessageCircle,
      action: () => navigate('support'),
      color: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    {
      title: "Live Chat",
      description: "Chat with us now",
      icon: Users,
      action: () => {},
      color: "bg-green-600 hover:bg-green-700 text-white"
    },
    {
      title: "Schedule Call",
      description: "Book a consultation",
      icon: Clock,
      action: () => navigate('contact'),
      color: "bg-purple-600 hover:bg-purple-700 text-white"
    }
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
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-slate-900 dark:text-slate-100">
            How can we help you?
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Find answers, get support, and learn how to make the most of Delibix AI solutions.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass border-blue-200 dark:border-blue-800"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-12 px-6 ${action.color} transition-all duration-200 hover:scale-105`}
              >
                <action.icon className="w-4 h-4 mr-2" />
                {action.title}
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Help Categories */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-slate-900 dark:text-slate-100">Browse Help Topics</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find the information you need organized by topic
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {helpCategories.map((category, index) => (
              <motion.div key={category.title} variants={itemVariants}>
                <Card className="h-full glass card-hover cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                        <category.icon className="w-6 h-6" />
                      </div>
                      {category.popular && (
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {category.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        {category.articles} articles
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
              Popular Help Articles
            </h2>
            
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
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
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <span>{article.category}</span>
                            <span>•</span>
                            <span>{article.readTime} read</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{article.rating}</span>
                            </div>
                            <span>•</span>
                            <span>{article.helpful} found helpful</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-slate-900 dark:text-slate-100">
              Still need help?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Our support team is available 24/7 to help you with any questions or issues.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass text-center p-6">
                <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Get instant help from our support team
                </p>
                <Button className="w-full gradient-bg-blue text-white">
                  Start Chat
                </Button>
              </Card>

              <Card className="glass text-center p-6">
                <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Connect with other users and experts
                </p>
                <Button 
                  onClick={() => navigate('community')}
                  variant="outline" 
                  className="w-full border-green-300 text-green-600 hover:bg-green-50"
                >
                  Join Community
                </Button>
              </Card>

              <Card className="glass text-center p-6">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Support Ticket</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Submit a detailed support request
                </p>
                <Button 
                  onClick={() => navigate('support')}
                  variant="outline" 
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  Create Ticket
                </Button>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}