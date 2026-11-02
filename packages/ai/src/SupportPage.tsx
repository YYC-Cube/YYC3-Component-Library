"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Clock, User, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface SupportPageProps {
  navigate: (page: string) => void;
}

export function SupportPage({ navigate }: SupportPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "< 2 minutes",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
    },
    {
      title: "Email Support",
      description: "Detailed support via email",
      icon: Mail,
      availability: "24/7",
      responseTime: "< 4 hours",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      title: "Phone Support",
      description: "Direct phone support for urgent issues",
      icon: Phone,
      availability: "Business Hours",
      responseTime: "< 1 hour",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: '',
        message: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-slate-900 dark:text-slate-100">
            Support Center
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Get the help you need with Delibix AI. Our expert support team is here to assist you 24/7.
          </motion.p>

          {/* Support Channels */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="glass card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 rounded-xl ${channel.color} flex items-center justify-center mx-auto mb-4`}>
                    <channel.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {channel.description}
                  </p>
                  <div className="flex justify-center gap-2 text-xs">
                    <Badge variant="outline">{channel.availability}</Badge>
                    <Badge variant="outline">{channel.responseTime}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Support Form */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-slate-900 dark:text-slate-100">Submit a Support Ticket</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Can't find what you're looking for? Submit a detailed support request and we'll get back to you soon.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Full Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          required
                          className="glass"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="glass"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Subject *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your issue"
                        required
                        className="glass"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Category *
                        </label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger className="glass">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api">API & Integration</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="technical">Technical Issues</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="general">General Questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Priority *
                        </label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                          <SelectTrigger className="glass">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - General inquiry</SelectItem>
                            <SelectItem value="medium">Medium - Service issue</SelectItem>
                            <SelectItem value="high">High - Business impact</SelectItem>
                            <SelectItem value="urgent">Urgent - Service down</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Message *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you expected to happen."
                        required
                        className="glass min-h-[120px]"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                          <p className="font-medium mb-1">Before submitting:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Check our FAQ and Help Center for quick answers</li>
                            <li>• Include relevant error messages or screenshots</li>
                            <li>• Provide steps to reproduce the issue</li>
                            <li>• Mention your account email if different from above</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-bg-blue text-white hover:opacity-90 transition-opacity h-12"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Support Ticket
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Ticket Submitted Successfully!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      Your support ticket has been created. You'll receive a confirmation email shortly with your ticket number.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 max-w-sm mx-auto">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        <strong>Ticket ID:</strong> #SUP-{Date.now().toString().slice(-6)}
                      </p>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        <strong>Expected Response:</strong> Within 4 hours
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-slate-900 dark:text-slate-100">
              Other Ways to Get Help
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Explore our self-service options for quick answers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass card-hover cursor-pointer" onClick={() => navigate('help-center')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Help Center
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Browse articles and guides
                </p>
              </CardContent>
            </Card>

            <Card className="glass card-hover cursor-pointer" onClick={() => navigate('faq')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  FAQ
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Find quick answers
                </p>
              </CardContent>
            </Card>

            <Card className="glass card-hover cursor-pointer" onClick={() => navigate('documentation')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Documentation
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Technical guides & API docs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}