"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, Users, Zap, CheckCircle, ArrowRight, Star,
  Video, Monitor, Bot, Brain, Target, TrendingUp, Award,
  Building2, Mail, Phone, Globe, MessageCircle, Download,
  Play, Pause, Volume2, FileText, BarChart3, Shield,
  Lightbulb, Rocket, Handshake, Eye, Lock, Code
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

interface DemoRequestPageProps {
  navigate: (page: string) => void;
}

interface DemoType {
  id: string;
  title: string;
  description: string;
  duration: string;
  features: string[];
  icon: any;
  recommended?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  industry: string;
  companySize: string;
  demoType: string;
  preferredDate: string;
  preferredTime: string;
  goals: string;
  currentChallenges: string;
  budget: string;
  timeline: string;
  additionalInfo: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

const demoTypes: DemoType[] = [
  {
    id: "ai-playground",
    title: "AI Playground Demo",
    description: "Interactive demonstration of our AI tools and capabilities",
    duration: "30 minutes",
    features: [
      "Live AI model testing",
      "Interactive tool exploration", 
      "Real-time result visualization",
      "Q&A session"
    ],
    icon: Bot,
    recommended: true
  },
  {
    id: "enterprise-solutions",
    title: "Enterprise Solutions",
    description: "Comprehensive overview for large-scale implementations",
    duration: "60 minutes",
    features: [
      "Custom AI solution design",
      "Integration possibilities",
      "Scalability planning",
      "ROI analysis"
    ],
    icon: Building2
  },
  {
    id: "industry-specific",
    title: "Industry-Specific Demo",
    description: "Tailored demonstration for your specific industry needs",
    duration: "45 minutes",
    features: [
      "Industry use cases",
      "Specific solution demos",
      "Compliance considerations",
      "Implementation roadmap"
    ],
    icon: Target
  },
  {
    id: "technical-deep-dive",
    title: "Technical Deep Dive",
    description: "In-depth technical exploration for developers and IT teams",
    duration: "90 minutes",
    features: [
      "API demonstrations",
      "Technical architecture",
      "Integration examples",
      "Development resources"
    ],
    icon: Code
  }
];

const industries = [
  "Healthcare", "Finance & Banking", "E-commerce", "Manufacturing",
  "Education", "Government", "Retail", "Technology", "Media & Entertainment",
  "Real Estate", "Transportation", "Energy", "Consulting", "Other"
];

const companySizes = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-1000 employees", "1000+ employees"
];

const roles = [
  "CEO/Founder", "CTO/Technical Lead", "Product Manager", "Developer",
  "Data Scientist", "Business Analyst", "Marketing Manager", "Operations Manager", "Other"
];

const timeSlots = [
  "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
  "11:00 - 11:30", "11:30 - 12:00", "13:00 - 13:30", "13:30 - 14:00",
  "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00"
];

const demoStats = [
  { label: "Average Demo Rating", value: "4.9/5", description: "From 500+ demos" },
  { label: "Conversion Rate", value: "78%", description: "Demo to pilot program" },
  { label: "Time to Value", value: "< 30 days", description: "Implementation timeline" },
  { label: "ROI Improvement", value: "340%", description: "Average client ROI" }
];

export function DemoRequestPage({ navigate }: DemoRequestPageProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    industry: "",
    companySize: "",
    demoType: "",
    preferredDate: "",
    preferredTime: "",
    goals: "",
    currentChallenges: "",
    budget: "",
    timeline: "",
    additionalInfo: "",
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccessMessage(true);
  };

  const getNextAvailableDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center p-8"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Demo Request Submitted!</h1>
          <p className="text-xl text-foreground-muted mb-8">
            Thank you for your interest! Our team will contact you within 24 hours to schedule your personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('home')} className="gradient-bg-blue text-white">
              Return to Homepage
            </Button>
            <Button variant="outline" onClick={() => navigate('ai-playground')}>
              Explore AI Playground
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Demo Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Video, Monitor, Bot, Brain, Target, Building2];
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Personalized Demo
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                See AI in <span className="gradient-text-blue">Action</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Experience how Delibix AI can transform your business with a personalized demonstration tailored to your specific needs and industry.
              </motion.p>
            </div>

            {/* Demo Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {demoStats.map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                  <div className="text-2xl md:text-3xl font-bold gradient-text-blue mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-foreground-muted">{stat.description}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Demo Types Sidebar */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <h2 className="mb-6">Choose Your Demo Type</h2>
              <div className="space-y-4">
                {demoTypes.map((demo, index) => (
                  <motion.div
                    key={demo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card 
                      className={`glass p-6 cursor-pointer transition-all duration-300 ${
                        formData.demoType === demo.id 
                          ? 'ring-2 ring-blue-400 bg-blue-50/50 dark:bg-blue-900/20' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handleInputChange('demoType', demo.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <demo.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{demo.title}</h3>
                            {demo.recommended && (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground-muted text-sm mb-3">{demo.description}</p>
                          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-3">
                            <Clock className="w-4 h-4" />
                            {demo.duration}
                          </div>
                          <ul className="space-y-1">
                            {demo.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Demo Request Form */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-8">
                <h2 className="mb-6">Request Your Personal Demo</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <Input
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <Input
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Work Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Name *
                      </label>
                      <Input
                        required
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Role *
                      </label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Industry *
                      </label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Company Size *
                      </label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {companySizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Preferred Date *
                      </label>
                      <Input
                        type="date"
                        required
                        min={getNextAvailableDate()}
                        value={formData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        className="bg-input-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Preferred Time (WIB) *
                      </label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What are your main goals with AI? *
                    </label>
                    <Textarea
                      required
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      placeholder="e.g., Automate customer service, improve data analysis, enhance decision making..."
                      className="bg-input-background"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      What are your current challenges?
                    </label>
                    <Textarea
                      value={formData.currentChallenges}
                      onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                      placeholder="e.g., Manual processes, data silos, lack of AI expertise..."
                      className="bg-input-background"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Estimated Budget Range
                      </label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-10k">Under $10,000</SelectItem>
                          <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                          <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                          <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                          <SelectItem value="500k-plus">$500,000+</SelectItem>
                          <SelectItem value="not-sure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Timeline for Implementation
                      </label>
                      <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                          <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                          <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                          <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                          <SelectItem value="exploring">Just exploring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Information
                    </label>
                    <Textarea
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Any specific questions or requirements you'd like us to address during the demo?"
                      className="bg-input-background"
                      rows={3}
                    />
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm leading-relaxed">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => navigate('terms-service')}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Terms of Service
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => navigate('privacy-policy')}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Privacy Policy
                        </button>
                        . *
                      </label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="newsletter"
                        checked={formData.subscribeNewsletter}
                        onCheckedChange={(checked) => handleInputChange('subscribeNewsletter', !!checked)}
                        className="mt-1"
                      />
                      <label htmlFor="newsletter" className="text-sm leading-relaxed">
                        Subscribe to our newsletter for AI insights and updates
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.agreeToTerms}
                      className="w-full gradient-bg-blue text-white py-4 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Submitting Request...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Schedule Demo
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* What to Expect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <Card className="glass p-8">
            <h2 className="text-center mb-8">What to Expect from Your Demo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-3">Personalized Experience</h3>
                <p className="text-foreground-muted">
                  Our AI experts will tailor the demo specifically to your industry, use cases, and business goals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-3">Live Demonstrations</h3>
                <p className="text-foreground-muted">
                  See our AI tools in action with real data and scenarios relevant to your business challenges.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-3">Strategic Insights</h3>
                <p className="text-foreground-muted">
                  Get expert recommendations on implementation strategy, timeline, and potential ROI for your organization.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}