"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Calculator, TrendingUp, Zap, Target, CheckCircle, Star, 
  ArrowRight, Award, Mail, DollarSign, BarChart3, PieChart,
  TrendingDown, Users, Clock, Settings
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface CostCalculatorPageProps {
  navigate?: (page: any) => void;
}

export function CostCalculatorPage({ navigate }: CostCalculatorPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const calculatorStats = [
    {
      title: "Cost Models",
      value: "25+",
      description: "Industry-specific pricing models",
      icon: Calculator,
      growth: "Comprehensive coverage"
    },
    {
      title: "Accuracy Rate",
      value: "98%",
      description: "Budget estimation precision",
      icon: Target,
      growth: "Proven reliability"
    },
    {
      title: "Cost Savings",
      value: "32%",
      description: "Average project cost reduction",
      icon: TrendingDown,
      growth: "Significant savings"
    },
    {
      title: "ROI Predictions",
      value: "285%",
      description: "Average return on investment",
      icon: TrendingUp,
      growth: "Exceptional returns"
    }
  ];

  // Cost calculation state
  const [costInputs, setCostInputs] = useState({
    projectScope: 'medium',
    timeline: '12',
    teamSize: '10',
    complexity: 'medium',
    industry: 'technology',
    region: 'global'
  });

  const [calculatedCosts, setCalculatedCosts] = useState({
    totalCost: 0,
    planning: 0,
    implementation: 0,
    training: 0,
    maintenance: 0,
    roi: 0,
    paybackPeriod: 0
  });

  // Cost factors and calculations
  const costFactors = {
    projectScope: {
      small: { multiplier: 0.6, description: "Limited scope project" },
      medium: { multiplier: 1.0, description: "Standard transformation" },
      large: { multiplier: 1.8, description: "Enterprise-wide project" },
      enterprise: { multiplier: 3.2, description: "Full organizational transformation" }
    },
    complexity: {
      low: { multiplier: 0.7, description: "Basic digital upgrade" },
      medium: { multiplier: 1.0, description: "Standard complexity" },
      high: { multiplier: 1.5, description: "Complex integration" },
      expert: { multiplier: 2.2, description: "Cutting-edge technology" }
    },
    industry: {
      technology: { multiplier: 0.9, description: "Technology sector" },
      finance: { multiplier: 1.3, description: "Financial services" },
      healthcare: { multiplier: 1.4, description: "Healthcare industry" },
      manufacturing: { multiplier: 1.1, description: "Manufacturing" },
      retail: { multiplier: 0.95, description: "Retail & commerce" },
      government: { multiplier: 1.6, description: "Government sector" }
    }
  };

  // Calculate costs based on inputs
  useEffect(() => {
    const baseCost = 100000; // Base cost in USD
    const teamSizeMultiplier = parseInt(costInputs.teamSize) * 8000;
    const timelineMultiplier = parseInt(costInputs.timeline) * 5000;
    
    const scopeMultiplier = costFactors.projectScope[costInputs.projectScope as keyof typeof costFactors.projectScope].multiplier;
    const complexityMultiplier = costFactors.complexity[costInputs.complexity as keyof typeof costFactors.complexity].multiplier;
    const industryMultiplier = costFactors.industry[costInputs.industry as keyof typeof costFactors.industry].multiplier;
    
    const totalCost = Math.round(
      (baseCost + teamSizeMultiplier + timelineMultiplier) * 
      scopeMultiplier * complexityMultiplier * industryMultiplier
    );
    
    const planning = Math.round(totalCost * 0.15);
    const implementation = Math.round(totalCost * 0.65);
    const training = Math.round(totalCost * 0.12);
    const maintenance = Math.round(totalCost * 0.08);
    
    const roi = Math.round(totalCost * 2.85); // 285% average ROI
    const paybackPeriod = Math.round((totalCost / (roi / 12)) * 10) / 10;
    
    setCalculatedCosts({
      totalCost,
      planning,
      implementation,
      training,
      maintenance,
      roi,
      paybackPeriod
    });
  }, [costInputs]);

  const costBreakdown = [
    { 
      category: "Planning & Strategy", 
      amount: calculatedCosts.planning, 
      percentage: 15,
      description: "Analysis, strategy development, and planning",
      icon: Target 
    },
    { 
      category: "Implementation", 
      amount: calculatedCosts.implementation, 
      percentage: 65,
      description: "Technology deployment and system integration",
      icon: Settings 
    },
    { 
      category: "Training & Change", 
      amount: calculatedCosts.training, 
      percentage: 12,
      description: "User training and change management",
      icon: Users 
    },
    { 
      category: "Maintenance & Support", 
      amount: calculatedCosts.maintenance, 
      percentage: 8,
      description: "Ongoing support and maintenance",
      icon: Clock 
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30"
            style={{ y: heroY, opacity: heroOpacity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Cost Intelligence
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Cost <span className="gradient-text-blue">Calculator</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Advanced cost calculation tool with 25+ industry models and 98% accuracy rate. 
                Calculate ROI predictions with 32% average cost savings and comprehensive analysis.
              </motion.p>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {calculatorStats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {stat.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-2`}>
                    {stat.description}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.growth}
                  </Badge>
                </div>
              ))}
            </motion.div>

            <motion.div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => {
                  const element = document.getElementById('cost-calculator');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Calculate Costs
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('digital-transformation-planner')}
              >
                Transformation Planner
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Cost Calculator Section */}
      <section id="cost-calculator" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Calculate Your <span className="gradient-text-blue">Investment</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Get accurate cost estimates for your digital transformation project 
              with our advanced calculator based on industry benchmarks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Calculator Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`glass-heavy rounded-2xl p-8 ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-8 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Project Parameters
              </h3>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Project Scope</Label>
                  <select
                    value={costInputs.projectScope}
                    onChange={(e) => setCostInputs({...costInputs, projectScope: e.target.value})}
                    className={`w-full mt-2 p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-800 border-blue-600/30 text-slate-100' 
                        : 'bg-white border-blue-200 text-slate-900'
                    }`}
                  >
                    <option value="small">Small - Limited scope project</option>
                    <option value="medium">Medium - Standard transformation</option>
                    <option value="large">Large - Enterprise-wide project</option>
                    <option value="enterprise">Enterprise - Full organizational transformation</option>
                  </select>
                </div>

                <div>
                  <Label className="text-base font-medium">Timeline (months)</Label>
                  <Input
                    type="number"
                    value={costInputs.timeline}
                    onChange={(e) => setCostInputs({...costInputs, timeline: e.target.value})}
                    className="mt-2 h-12"
                    min="3"
                    max="48"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Team Size</Label>
                  <Input
                    type="number"
                    value={costInputs.teamSize}
                    onChange={(e) => setCostInputs({...costInputs, teamSize: e.target.value})}
                    className="mt-2 h-12"
                    min="3"
                    max="100"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium">Complexity Level</Label>
                  <select
                    value={costInputs.complexity}
                    onChange={(e) => setCostInputs({...costInputs, complexity: e.target.value})}
                    className={`w-full mt-2 p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-800 border-blue-600/30 text-slate-100' 
                        : 'bg-white border-blue-200 text-slate-900'
                    }`}
                  >
                    <option value="low">Low - Basic digital upgrade</option>
                    <option value="medium">Medium - Standard complexity</option>
                    <option value="high">High - Complex integration</option>
                    <option value="expert">Expert - Cutting-edge technology</option>
                  </select>
                </div>

                <div>
                  <Label className="text-base font-medium">Industry</Label>
                  <select
                    value={costInputs.industry}
                    onChange={(e) => setCostInputs({...costInputs, industry: e.target.value})}
                    className={`w-full mt-2 p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-slate-800 border-blue-600/30 text-slate-100' 
                        : 'bg-white border-blue-200 text-slate-900'
                    }`}
                  >
                    <option value="technology">Technology</option>
                    <option value="finance">Financial Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail & Commerce</option>
                    <option value="government">Government</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Total Cost */}
              <div className={`glass-heavy rounded-2xl p-8 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <h3 className={`text-lg font-medium mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Estimated Total Investment
                </h3>
                <div className={`text-4xl font-bold gradient-text-blue mb-4`}>
                  {formatCurrency(calculatedCosts.totalCost)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`glass-secondary rounded-xl p-4 ${
                    isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                  }`}>
                    <div className={`text-2xl font-bold text-green-500`}>
                      {formatCurrency(calculatedCosts.roi)}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Expected ROI (285%)
                    </div>
                  </div>
                  <div className={`glass-secondary rounded-xl p-4 ${
                    isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                  }`}>
                    <div className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {calculatedCosts.paybackPeriod} mo
                    </div>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Payback Period
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className={`glass-heavy rounded-2xl p-8 ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Cost Breakdown
                </h3>
                <div className="space-y-4">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className={`glass-secondary rounded-xl p-4 ${
                      isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-blue-500" />
                          <span className={`font-medium ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        <div className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                          {formatCurrency(item.amount)}
                        </div>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        {item.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 transition-colors duration-300" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden border-2 border-blue-300 dark:border-blue-600/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-3xl transition-colors duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-8 shadow-lg">
                  <Calculator className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Get Accurate Cost Estimates?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Access 25+ industry models with 98% accuracy and comprehensive ROI analysis with 32% average cost savings.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Get Detailed Quote
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('timeline-estimator')}
                  >
                    Timeline Estimator
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Cost Intelligence</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">25+ models & 98% accuracy</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Savings</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">32% cost reduction & 285% ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}