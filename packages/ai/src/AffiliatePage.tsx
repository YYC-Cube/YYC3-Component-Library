"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, Users, TrendingUp, Star, Award, ArrowRight, CheckCircle, 
  Calculator, Target, Zap, Gift, CreditCard, BarChart3, UserPlus, 
  Share2, Copy, ExternalLink, Clock, Mail, Download
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

interface AffiliatePageProps {
  navigate: (page: string) => void;
}

interface CommissionTier {
  level: string;
  requirement: string;
  commission: string;
  bonuses: string[];
  color: string;
}

interface Benefit {
  icon: any;
  title: string;
  description: string;
}

interface Stat {
  icon: any;
  label: string;
  value: string;
  change?: string;
}

const commissionTiers: CommissionTier[] = [
  {
    level: "Starter",
    requirement: "0-10 referrals",
    commission: "15%",
    bonuses: ["Welcome bonus: $50", "Marketing materials"],
    color: "blue"
  },
  {
    level: "Growth",
    requirement: "11-25 referrals",
    commission: "20%",
    bonuses: ["Quarterly bonus: $200", "Priority support", "Co-marketing opportunities"],
    color: "green"
  },
  {
    level: "Pro",
    requirement: "26-50 referrals",
    commission: "25%",
    bonuses: ["Monthly bonus: $500", "Dedicated account manager", "Early feature access"],
    color: "purple"
  },
  {
    level: "Elite",
    requirement: "51+ referrals",
    commission: "30%",
    bonuses: ["Weekly bonus: $1000", "Revenue sharing", "Partner summit invite", "Custom solutions"],
    color: "gold"
  }
];

const benefits: Benefit[] = [
  {
    icon: DollarSign,
    title: "High Commissions",
    description: "Earn 15-30% recurring commissions on all referred clients"
  },
  {
    icon: Clock,
    title: "Lifetime Value",
    description: "Get paid for as long as your referrals remain active"
  },
  {
    icon: Target,
    title: "Performance Bonuses",
    description: "Additional rewards for hitting monthly and quarterly targets"
  },
  {
    icon: Users,
    title: "Two-Tier System",
    description: "Earn from your direct referrals and their sub-affiliates"
  },
  {
    icon: Zap,
    title: "Real-Time Tracking",
    description: "Monitor clicks, conversions, and earnings in real-time"
  },
  {
    icon: Gift,
    title: "Marketing Support",
    description: "Professional creatives, landing pages, and campaign materials"
  }
];

const stats: Stat[] = [
  {
    icon: Users,
    label: "Active Affiliates",
    value: "2,500+",
    change: "+15%"
  },
  {
    icon: DollarSign,
    label: "Total Paid Out",
    value: "$1.2M+",
    change: "+28%"
  },
  {
    icon: TrendingUp,
    label: "Avg. Monthly Earnings",
    value: "$850",
    change: "+12%"
  },
  {
    icon: Star,
    label: "Success Rate",
    value: "94%",
    change: "+3%"
  }
];

export function AffiliatePage({ navigate }: AffiliatePageProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    referrals: 10,
    avgDeal: 2500,
    commission: 20
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsApplied(true);
  };

  const monthlyEarnings = (calculatorValues.referrals * calculatorValues.avgDeal * calculatorValues.commission) / 100;
  const yearlyEarnings = monthlyEarnings * 12;

  if (isApplied) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="mb-6 gradient-text-blue">
              Application Submitted!
            </h1>
            
            <p className="text-xl text-foreground-muted mb-8">
              Welcome to the Delibix Affiliate Program! We'll review your application and get back to you within 24-48 hours.
            </p>
            
            <div className="glass rounded-3xl p-8 mb-8">
              <h3 className="mb-4">What's Next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Application review (24-48 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Account setup and onboarding</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Access to affiliate dashboard and materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Start earning commissions immediately</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('home')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('contact')}
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
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
          
          {/* Animated Affiliate Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [DollarSign, Users, TrendingUp, Star, Target, Gift];
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
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                2,500+ Active Affiliates
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
                <span className="gradient-text-blue">Affiliate Program</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Partner with us and earn up to 30% recurring commissions by referring clients to our AI solutions. Join 2,500+ successful affiliates worldwide.
              </motion.p>
            </div>

            {/* Affiliate Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">30%</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Max Commission</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">Lifetime</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Payouts</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">$1.2M+</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Paid Out</div>
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
                  Join Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Earnings
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-foreground-muted mb-2">{stat.label}</div>
                {stat.change && (
                  <Badge variant="secondary" className="text-green-600 bg-green-100 dark:bg-green-900/30">
                    {stat.change} this month
                  </Badge>
                )}
              </Card>
            );
          })}
        </motion.div>

        {/* Commission Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="mb-4">Commission Structure</h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Our tiered commission system rewards your growth with higher rates and exclusive bonuses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commissionTiers.map((tier, index) => (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className={`relative p-6 ${
                  tier.level === 'Pro' ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}>
                  {tier.level === 'Pro' && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2">{tier.level}</h3>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {tier.commission}
                    </div>
                    <p className="text-sm text-foreground-muted">{tier.requirement}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {tier.bonuses.map((bonus, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{bonus}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="mb-4">Why Choose Our Program?</h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Industry-leading benefits designed to maximize your earning potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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

        {/* Earnings Calculator */}
        <motion.div
          id="calculator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <Card className="glass p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="mb-2">Earnings Calculator</h2>
              <p className="text-foreground-muted">
                Estimate your potential monthly and yearly earnings
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2">Monthly Referrals</label>
                  <Input
                    type="number"
                    value={calculatorValues.referrals}
                    onChange={(e) => setCalculatorValues(prev => ({ ...prev, referrals: parseInt(e.target.value) || 0 }))}
                    className="bg-input-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Average Deal Size ($)</label>
                  <Input
                    type="number"
                    value={calculatorValues.avgDeal}
                    onChange={(e) => setCalculatorValues(prev => ({ ...prev, avgDeal: parseInt(e.target.value) || 0 }))}
                    className="bg-input-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Commission Rate (%)</label>
                  <Input
                    type="number"
                    value={calculatorValues.commission}
                    onChange={(e) => setCalculatorValues(prev => ({ ...prev, commission: parseInt(e.target.value) || 0 }))}
                    max="30"
                    min="15"
                    className="bg-input-background"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <div className="text-sm text-foreground-muted mb-2">Monthly Earnings</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ${monthlyEarnings.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <div className="text-sm text-foreground-muted mb-2">Yearly Earnings</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    ${yearlyEarnings.toLocaleString()}
                  </div>
                </div>
                
                <div className="text-xs text-foreground-muted text-center">
                  * Estimates based on recurring monthly commissions. Actual earnings may vary.
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Application Form */}
        <motion.div
          id="apply"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="glass p-8">
            <div className="text-center mb-8">
              <h2 className="mb-2">Join Our Affiliate Program</h2>
              <p className="text-foreground-muted">
                Start earning commissions with our AI solutions today
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
              
              <div>
                <label className="block text-sm mb-2">Website or Social Media</label>
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="bg-input-background"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Marketing Experience</label>
                <Input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Describe your marketing experience or audience"
                  className="bg-input-background"
                />
              </div>
              
              <Separator />
              
              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Apply Now
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-foreground-muted text-center">
                By applying, you agree to our Affiliate Terms and Conditions. 
                Applications are typically reviewed within 24-48 hours.
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}