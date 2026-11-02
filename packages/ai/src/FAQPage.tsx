"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, HelpCircle, MessageCircle, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FAQPageProps {
  navigate: (page: string) => void;
}

export function FAQPage({ navigate }: FAQPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Questions', count: 24 },
    { id: 'getting-started', name: 'Getting Started', count: 8 },
    { id: 'api', name: 'API & Integration', count: 6 },
    { id: 'billing', name: 'Billing & Pricing', count: 4 },
    { id: 'technical', name: 'Technical Issues', count: 6 }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I get started with Delibix AI?',
      answer: 'Getting started is simple! Sign up for an account, choose your plan, and follow our quick start guide. You\'ll be up and running with AI-powered solutions in minutes. Our onboarding process includes step-by-step tutorials and sample projects to help you understand the platform.',
      popular: true,
      helpful: 145
    },
    {
      category: 'api',
      question: 'How do I authenticate with the Delibix API?',
      answer: 'Authentication is done using API keys. After creating your account, navigate to the API section in your dashboard to generate your unique API key. Include this key in the Authorization header of your requests using the format: "Bearer YOUR_API_KEY".',
      popular: true,
      helpful: 89
    },
    {
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our payment partners.',
      popular: false,
      helpful: 67
    },
    {
      category: 'getting-started',
      question: 'What AI models do you offer?',
      answer: 'We offer a comprehensive suite of AI models including text generation, image analysis, natural language processing, sentiment analysis, and custom model training. Each model is optimized for different use cases and can be accessed through our unified API.',
      popular: true,
      helpful: 112
    },
    {
      category: 'technical',
      question: 'What are the API rate limits?',
      answer: 'Rate limits vary by plan. Starter plans include 1,000 requests per hour, Professional plans include 10,000 requests per hour, and Enterprise plans have custom limits. You can monitor your usage in real-time through your dashboard.',
      popular: false,
      helpful: 78
    },
    {
      category: 'billing',
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, while downgrades take effect at the start of your next billing cycle. No cancellation fees apply.',
      popular: false,
      helpful: 92
    },
    {
      category: 'api',
      question: 'Do you provide SDKs for different programming languages?',
      answer: 'Yes, we provide official SDKs for Python, JavaScript/Node.js, PHP, and Java. We also have community-maintained SDKs for other languages. All SDKs include comprehensive documentation and examples.',
      popular: true,
      helpful: 134
    },
    {
      category: 'technical',
      question: 'How do I handle errors in API responses?',
      answer: 'Our API returns standard HTTP status codes. 200-299 indicate success, 400-499 indicate client errors, and 500-599 indicate server errors. Each error response includes a detailed error message and error code to help you troubleshoot.',
      popular: false,
      helpful: 45
    },
    {
      category: 'getting-started',
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial with access to all features and 1,000 API requests. No credit card required to start. You can upgrade to a paid plan at any time during or after your trial.',
      popular: true,
      helpful: 178
    },
    {
      category: 'technical',
      question: 'What data formats do you support?',
      answer: 'We support JSON for API requests and responses, with additional support for CSV, XML, and various image formats (JPEG, PNG, WebP) depending on the AI model being used. All data is processed securely and not stored beyond the processing period.',
      popular: false,
      helpful: 56
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

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
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Find quick answers to common questions about Delibix AI platform, features, and services.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg glass border-blue-200 dark:border-blue-800"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="px-6 py-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {filteredFAQs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="glass overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                              {faq.question}
                            </h3>
                            {faq.popular && (
                              <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Star className="w-4 h-4" />
                            <span>{faq.helpful} people found this helpful</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {expandedFAQ === index ? (
                            <Minus className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Plus className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="pl-0 border-l-0 border-slate-200 dark:border-slate-700">
                              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {faq.answer}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <span>Was this helpful?</span>
                                  <button className="text-green-600 hover:text-green-700 font-medium">
                                    Yes
                                  </button>
                                  <button className="text-red-600 hover:text-red-700 font-medium">
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No FAQs found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try adjusting your search terms or category filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-6 text-slate-900 dark:text-slate-100">
              Didn't find what you're looking for?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('support')}
                className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button
                onClick={() => navigate('help-center')}
                variant="outline"
                className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                Browse Help Center
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}