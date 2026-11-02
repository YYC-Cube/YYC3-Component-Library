"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check, Star, Zap, Brain, Users, TrendingUp, Calendar, Bell, Settings, Shield, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface NewsletterPageProps {
  navigate: (page: string) => void;
}

interface NewsletterOption {
  id: string;
  name: string;
  description: string;
  frequency: string;
  icon: any;
  color: string;
  subscribers: number;
  featured?: boolean;
}

const newsletters: NewsletterOption[] = [
  {
    id: "ai-insights",
    name: "AI Insights Weekly",
    description: "Latest AI trends, breakthroughs, and industry analysis. Our most popular newsletter.",
    frequency: "Weekly",
    icon: Brain,
    color: "blue",
    subscribers: 15420,
    featured: true
  },
  {
    id: "product-updates",
    name: "Product Updates",
    description: "New features, tools, and platform announcements from Delibix.",
    frequency: "Bi-weekly",
    icon: Zap,
    color: "blue",
    subscribers: 12890
  },
  {
    id: "case-studies",
    name: "Success Stories",
    description: "Real client case studies, ROI insights, and implementation strategies.",
    frequency: "Monthly",
    icon: Star,
    color: "blue",
    subscribers: 8750
  },
  {
    id: "community",
    name: "Community Digest",
    description: "Events, workshops, networking opportunities, and community highlights.",
    frequency: "Monthly",
    icon: Users,
    color: "blue",
    subscribers: 6340
  },
  {
    id: "market-trends",
    name: "Market Intelligence",
    description: "Industry reports, market analysis, and competitive insights.",
    frequency: "Monthly",
    icon: TrendingUp,
    color: "blue",
    subscribers: 9820
  }
];

const benefits = [
  {
    icon: Brain,
    title: "Expert Insights",
    description: "Curated AI knowledge from industry leaders"
  },
  {
    icon: Zap,
    title: "Early Access",
    description: "Be first to know about new features and tools"
  },
  {
    icon: Star,
    title: "Success Stories",
    description: "Learn from real client implementations"
  },
  {
    icon: Users,
    title: "Community Access",
    description: "Connect with fellow AI practitioners"
  }
];

export function NewsletterPage({ navigate }: NewsletterPageProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>(["ai-insights"]);
  const [frequency, setFrequency] = useState("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterToggle = (newsletterId: string) => {
    setSelectedNewsletters(prev => 
      prev.includes(newsletterId) 
        ? prev.filter(id => id !== newsletterId)
        : [...prev, newsletterId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubscribed(true);
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="mb-6 gradient-text-blue">
              Welcome to the Community!
            </h1>
            
            <p className="text-xl text-foreground-muted mb-8">
              Thank you for subscribing! You'll receive your first newsletter within 24 hours.
            </p>
            
            <div className="glass rounded-3xl p-8 mb-8">
              <h3 className="mb-4">Your Subscription Details</h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Email:</span>
                  <span>{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Newsletters:</span>
                  <span>{selectedNewsletters.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Frequency:</span>
                  <span className="capitalize">{frequency}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('home')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('community')}
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Newsletter Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Mail, Bell, Send, Star, Zap, Users];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + (i % 4) * 20}%`,
                    top: `${15 + Math.floor(i / 4) * 25}%`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                >
                  <IconComponent className="w-12 h-12 text-blue-500" />
                </motion.div>
              );
            })}
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
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Newsletter Subscription
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Stay Ahead with <span className="gradient-text-blue">AI Insights</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Join 50,000+ AI professionals receiving curated insights, exclusive content, and early access to Delibix innovations.
              </motion.p>
            </div>

            {/* Newsletter Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">50K+</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Subscribers</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">Weekly</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Insights</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">100%</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Free</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Subscribe Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Benefits
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        {/* Newsletter Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-center mb-8">Choose Your Newsletters</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {newsletters.map((newsletter, index) => {
              const Icon = newsletter.icon;
              const isSelected = selectedNewsletters.includes(newsletter.id);
              
              return (
                <motion.div
                  key={newsletter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card 
                    className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                        : 'hover:shadow-md'
                    } ${newsletter.featured ? 'border-blue-300 dark:border-blue-700' : ''}`}
                    onClick={() => handleNewsletterToggle(newsletter.id)}
                  >
                    {newsletter.featured && (
                      <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${newsletter.color}-100 dark:bg-${newsletter.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${newsletter.color}-600 dark:text-${newsletter.color}-400`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm">{newsletter.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {newsletter.frequency}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-foreground-muted mb-3 line-clamp-2">
                          {newsletter.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground-muted">
                            {newsletter.subscribers.toLocaleString()} subscribers
                          </span>
                          
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleNewsletterToggle(newsletter.id)}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-center mb-12">Why Subscribe?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  
                  <h3 className="mb-2">{benefit.title}</h3>
                  <p className="text-sm text-foreground-muted">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Subscription Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass p-8">
            <div className="text-center mb-8">
              <h2 className="mb-2">Start Your AI Journey</h2>
              <p className="text-foreground-muted">
                Join thousands of professionals staying ahead in AI
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">First Name *</label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    required
                    className="bg-input-background"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Last Name *</label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    required
                    className="bg-input-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-input-background"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Company</label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                    className="bg-input-background"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Role</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="bg-input-background">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ceo">CEO / Founder</SelectItem>
                      <SelectItem value="cto">CTO / Tech Lead</SelectItem>
                      <SelectItem value="ai-engineer">AI Engineer</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Email Frequency</label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-foreground-muted mb-4">
                  Selected newsletters: <strong>{selectedNewsletters.length}</strong>
                </p>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedNewsletters.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-foreground-muted text-center">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}