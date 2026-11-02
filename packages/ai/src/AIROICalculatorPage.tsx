"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Target, 
  BarChart3, 
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Brain,
  Eye,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface AIROICalculatorPageProps {
  navigate: (page: string) => void;
}

interface CalculationInputs {
  // Business Metrics
  annualRevenue: number;
  employeeCount: number;
  avgHourlyWage: number;
  currentProcessTime: number;
  errorRate: number;
  
  // AI Implementation
  implementationType: string;
  implementationCost: number;
  trainingCost: number;
  maintenanceCost: number;
  licenseYearlyCost: number;
  
  // Expected Benefits
  timeReduction: number;
  errorReduction: number;
  productivityIncrease: number;
  revenueIncrease: number;
  
  // Timeline
  implementationTimeMonths: number;
  analysisYears: number;
}

export function AIROICalculatorPage({ navigate }: AIROICalculatorPageProps) {
  const [inputs, setInputs] = useState<CalculationInputs>({
    // Business Metrics
    annualRevenue: 5000000,
    employeeCount: 50,
    avgHourlyWage: 35,
    currentProcessTime: 8,
    errorRate: 5,
    
    // AI Implementation
    implementationType: 'nlp',
    implementationCost: 150000,
    trainingCost: 25000,
    maintenanceCost: 30000,
    licenseYearlyCost: 50000,
    
    // Expected Benefits
    timeReduction: 40,
    errorReduction: 70,
    productivityIncrease: 25,
    revenueIncrease: 15,
    
    // Timeline
    implementationTimeMonths: 6,
    analysisYears: 3
  });

  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [activeTab, setActiveTab] = useState('inputs');

  const aiTemplates = [
    {
      id: 'custom',
      name: 'Custom Configuration',
      description: 'Configure your own AI implementation parameters'
    },
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      description: 'Document processing, chatbots, content analysis',
      defaults: {
        implementationType: 'nlp',
        implementationCost: 120000,
        trainingCost: 20000,
        maintenanceCost: 25000,
        licenseYearlyCost: 40000,
        timeReduction: 50,
        errorReduction: 60,
        productivityIncrease: 30,
        revenueIncrease: 12
      }
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      description: 'Image recognition, quality control, automated inspection',
      defaults: {
        implementationType: 'computer-vision',
        implementationCost: 200000,
        trainingCost: 35000,
        maintenanceCost: 40000,
        licenseYearlyCost: 60000,
        timeReduction: 60,
        errorReduction: 80,
        productivityIncrease: 35,
        revenueIncrease: 18
      }
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      description: 'Demand forecasting, risk assessment, optimization',
      defaults: {
        implementationType: 'predictive-analytics',
        implementationCost: 180000,
        trainingCost: 30000,
        maintenanceCost: 35000,
        licenseYearlyCost: 45000,
        timeReduction: 35,
        errorReduction: 50,
        productivityIncrease: 28,
        revenueIncrease: 20
      }
    },
    {
      id: 'automation',
      name: 'Process Automation',
      description: 'RPA, workflow automation, decision making',
      defaults: {
        implementationType: 'automation',
        implementationCost: 100000,
        trainingCost: 15000,
        maintenanceCost: 20000,
        licenseYearlyCost: 30000,
        timeReduction: 70,
        errorReduction: 75,
        productivityIncrease: 40,
        revenueIncrease: 10
      }
    }
  ];

  // Calculate ROI metrics
  const calculations = useMemo(() => {
    const yearsArray = Array.from({ length: inputs.analysisYears }, (_, i) => i + 1);
    
    // Annual costs
    const totalImplementationCost = inputs.implementationCost + inputs.trainingCost;
    const annualOperatingCost = inputs.maintenanceCost + inputs.licenseYearlyCost;
    
    // Annual benefits
    const timeSavingsValue = (inputs.currentProcessTime * (inputs.timeReduction / 100) * inputs.employeeCount * inputs.avgHourlyWage * 250); // 250 working days
    const errorReductionValue = (inputs.annualRevenue * (inputs.errorRate / 100) * (inputs.errorReduction / 100));
    const productivityValue = (inputs.annualRevenue * (inputs.productivityIncrease / 100));
    const revenueIncreaseValue = (inputs.annualRevenue * (inputs.revenueIncrease / 100));
    
    const totalAnnualBenefits = timeSavingsValue + errorReductionValue + productivityValue + revenueIncreaseValue;
    
    // Calculate cumulative values
    let cumulativeCosts = totalImplementationCost;
    let cumulativeBenefits = 0;
    let roiBreakeven = null;
    
    const yearlyData = yearsArray.map(year => {
      const yearCosts = year === 1 ? totalImplementationCost + annualOperatingCost : annualOperatingCost;
      const yearBenefits = year <= (inputs.implementationTimeMonths / 12) ? totalAnnualBenefits * (year / (inputs.implementationTimeMonths / 12)) : totalAnnualBenefits;
      
      cumulativeCosts += year === 1 ? 0 : annualOperatingCost;
      cumulativeBenefits += yearBenefits;
      
      const netValue = cumulativeBenefits - cumulativeCosts;
      const roi = ((cumulativeBenefits - cumulativeCosts) / cumulativeCosts) * 100;
      
      if (netValue >= 0 && roiBreakeven === null) {
        roiBreakeven = year;
      }
      
      return {
        year: `Year ${year}`,
        yearNumber: year,
        costs: yearCosts,
        benefits: yearBenefits,
        cumulativeCosts,
        cumulativeBenefits,
        netValue,
        roi: roi > -100 ? roi : -100 // Cap at -100% for display
      };
    });
    
    const finalROI = yearlyData[yearlyData.length - 1]?.roi || 0;
    const totalNetValue = cumulativeBenefits - cumulativeCosts;
    
    // Benefit breakdown for pie chart
    const benefitBreakdown = [
      { name: 'Time Savings', value: timeSavingsValue, color: '#3b82f6' },
      { name: 'Error Reduction', value: errorReductionValue, color: '#10b981' },
      { name: 'Productivity Gain', value: productivityValue, color: '#f59e0b' },
      { name: 'Revenue Increase', value: revenueIncreaseValue, color: '#ef4444' }
    ];
    
    return {
      yearlyData,
      finalROI,
      totalNetValue,
      totalImplementationCost,
      totalAnnualBenefits,
      annualOperatingCost,
      roiBreakeven,
      benefitBreakdown,
      timeSavingsValue,
      errorReductionValue,
      productivityValue,
      revenueIncreaseValue
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculationInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = aiTemplates.find(t => t.id === templateId);
    if (template && template.defaults) {
      setInputs(prev => ({
        ...prev,
        ...template.defaults
      }));
    }
  };

  const resetCalculator = () => {
    setInputs({
      annualRevenue: 5000000,
      employeeCount: 50,
      avgHourlyWage: 35,
      currentProcessTime: 8,
      errorRate: 5,
      implementationType: 'nlp',
      implementationCost: 150000,
      trainingCost: 25000,
      maintenanceCost: 30000,
      licenseYearlyCost: 50000,
      timeReduction: 40,
      errorReduction: 70,
      productivityIncrease: 25,
      revenueIncrease: 15,
      implementationTimeMonths: 6,
      analysisYears: 3
    });
    setSelectedTemplate('custom');
  };

  const exportResults = () => {
    const results = {
      inputs,
      calculations: {
        finalROI: calculations.finalROI,
        totalNetValue: calculations.totalNetValue,
        roiBreakeven: calculations.roiBreakeven,
        yearlyData: calculations.yearlyData
      },
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-roi-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI ROI Calculator Results',
          text: `AI Implementation ROI: ${calculations.finalROI.toFixed(1)}% over ${inputs.analysisYears} years`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      const shareText = `AI Implementation ROI: ${calculations.finalROI.toFixed(1)}% over ${inputs.analysisYears} years\nBreakeven: ${calculations.roiBreakeven ? `Year ${calculations.roiBreakeven}` : 'Beyond analysis period'}\nNet Value: $${calculations.totalNetValue.toLocaleString()}`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getROIColor = (roi: number) => {
    if (roi >= 50) return 'text-green-600 dark:text-green-400';
    if (roi >= 20) return 'text-blue-600 dark:text-blue-400';
    if (roi >= 0) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getROIBadgeColor = (roi: number) => {
    if (roi >= 50) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (roi >= 20) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (roi >= 0) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
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
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated calculation icons */}
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
                {i % 4 === 0 ? <Calculator className="w-8 h-8" /> : 
                 i % 4 === 1 ? <TrendingUp className="w-8 h-8" /> : 
                 i % 4 === 2 ? <DollarSign className="w-8 h-8" /> :
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
              <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                AI Investment Analysis
              </span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI <span className="gradient-text-blue">ROI</span> Calculator
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Calculate the return on investment for your AI implementation. Get detailed projections, break-even analysis, and comprehensive insights to make informed decisions.
              </motion.p>
            </div>

            {/* ROI Features */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: DollarSign, text: 'Cost analysis' },
                { icon: TrendingUp, text: 'ROI projections' },
                { icon: BarChart3, text: 'Break-even timeline' },
                { icon: Target, text: 'Expert insights' }
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
                onClick={() => setActiveTab('results')}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Results
              </Button>
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Target className="w-5 h-5 mr-2" />
                Get Expert Consultation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Calculator */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="inputs">Business Inputs</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="analysis" className="hidden lg:block">Analysis</TabsTrigger>
            </TabsList>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Choose an AI Implementation Template
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Start with a pre-configured template based on common AI use cases, or create a custom configuration.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiTemplates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`glass card-hover cursor-pointer transition-all duration-200 ${
                        selectedTemplate === template.id ? 'ring-2 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleTemplateChange(template.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                            {template.id === 'nlp' && <MessageSquare className="w-5 h-5" />}
                            {template.id === 'computer-vision' && <Eye className="w-5 h-5" />}
                            {template.id === 'predictive-analytics' && <BarChart3 className="w-5 h-5" />}
                            {template.id === 'automation' && <Zap className="w-5 h-5" />}
                            {template.id === 'custom' && <Brain className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              {template.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {template.description}
                            </p>
                          </div>
                          {selectedTemplate === template.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        
                        {template.defaults && (
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                              <div className="text-slate-500 dark:text-slate-400">Time Reduction</div>
                              <div className="font-medium">{template.defaults.timeReduction}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                              <div className="text-slate-500 dark:text-slate-400">Error Reduction</div>
                              <div className="font-medium">{template.defaults.errorReduction}%</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                              <div className="text-slate-500 dark:text-slate-400">Implementation</div>
                              <div className="font-medium">{formatCurrency(template.defaults.implementationCost)}</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                              <div className="text-slate-500 dark:text-slate-400">Annual License</div>
                              <div className="font-medium">{formatCurrency(template.defaults.licenseYearlyCost)}</div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={() => setActiveTab('inputs')}
                    className="gradient-bg-blue text-white hover:opacity-90"
                  >
                    Configure Parameters
                    <Target className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Business Inputs Tab */}
            <TabsContent value="inputs" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Business Metrics */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Business Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="annualRevenue">Annual Revenue</Label>
                        <Input
                          id="annualRevenue"
                          type="number"
                          value={inputs.annualRevenue}
                          onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Total company revenue per year</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="employeeCount">Number of Employees</Label>
                        <Input
                          id="employeeCount"
                          type="number"
                          value={inputs.employeeCount}
                          onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Employees affected by AI implementation</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avgHourlyWage">Average Hourly Wage ($)</Label>
                        <Input
                          id="avgHourlyWage"
                          type="number"
                          value={inputs.avgHourlyWage}
                          onChange={(e) => handleInputChange('avgHourlyWage', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Including benefits and overhead</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentProcessTime">Current Process Time (hours/day)</Label>
                        <Input
                          id="currentProcessTime"
                          type="number"
                          step="0.5"
                          value={inputs.currentProcessTime}
                          onChange={(e) => handleInputChange('currentProcessTime', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Hours spent on processes to be automated</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="errorRate">Current Error Rate (%)</Label>
                        <Input
                          id="errorRate"
                          type="number"
                          step="0.1"
                          value={inputs.errorRate}
                          onChange={(e) => handleInputChange('errorRate', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Percentage of work requiring correction</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Implementation Costs */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Implementation Costs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="implementationCost">Implementation Cost ($)</Label>
                        <Input
                          id="implementationCost"
                          type="number"
                          value={inputs.implementationCost}
                          onChange={(e) => handleInputChange('implementationCost', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">One-time setup and integration costs</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trainingCost">Training Cost ($)</Label>
                        <Input
                          id="trainingCost"
                          type="number"
                          value={inputs.trainingCost}
                          onChange={(e) => handleInputChange('trainingCost', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Staff training and change management</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseYearlyCost">Annual License Cost ($)</Label>
                        <Input
                          id="licenseYearlyCost"
                          type="number"
                          value={inputs.licenseYearlyCost}
                          onChange={(e) => handleInputChange('licenseYearlyCost', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Software licenses and subscriptions</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maintenanceCost">Annual Maintenance ($)</Label>
                        <Input
                          id="maintenanceCost"
                          type="number"
                          value={inputs.maintenanceCost}
                          onChange={(e) => handleInputChange('maintenanceCost', e.target.value)}
                          className="glass"
                        />
                        <p className="text-xs text-slate-500">Support, updates, and maintenance</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="implementationTimeMonths">Implementation Timeline (months)</Label>
                        <div className="px-3">
                          <Slider
                            value={[inputs.implementationTimeMonths]}
                            onValueChange={(value) => handleInputChange('implementationTimeMonths', value[0])}
                            max={24}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>1 month</span>
                            <span className="font-medium">{inputs.implementationTimeMonths} months</span>
                            <span>24 months</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Expected Benefits */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Expected Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Time Reduction: {inputs.timeReduction}%</Label>
                        <div className="px-3">
                          <Slider
                            value={[inputs.timeReduction]}
                            onValueChange={(value) => handleInputChange('timeReduction', value[0])}
                            max={90}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0%</span>
                            <span>90%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Reduction in time spent on manual tasks</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Error Reduction: {inputs.errorReduction}%</Label>
                        <div className="px-3">
                          <Slider
                            value={[inputs.errorReduction]}
                            onValueChange={(value) => handleInputChange('errorReduction', value[0])}
                            max={95}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0%</span>
                            <span>95%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Reduction in errors and rework</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Productivity Increase: {inputs.productivityIncrease}%</Label>
                        <div className="px-3">
                          <Slider
                            value={[inputs.productivityIncrease]}
                            onValueChange={(value) => handleInputChange('productivityIncrease', value[0])}
                            max={50}
                            min={0}
                            step={5}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Overall productivity improvement</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Revenue Increase: {inputs.revenueIncrease}%</Label>
                        <div className="px-3">
                          <Slider
                            value={[inputs.revenueIncrease]}
                            onValueChange={(value) => handleInputChange('revenueIncrease', value[0])}
                            max={50}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Additional revenue from AI capabilities</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="analysisYears">Analysis Period (years)</Label>
                        <Select value={inputs.analysisYears.toString()} onValueChange={(value) => handleInputChange('analysisYears', parseInt(value))}>
                          <SelectTrigger className="glass">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Year</SelectItem>
                            <SelectItem value="2">2 Years</SelectItem>
                            <SelectItem value="3">3 Years</SelectItem>
                            <SelectItem value="4">4 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <Button onClick={resetCalculator} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    onClick={() => setActiveTab('results')}
                    className="gradient-bg-blue text-white hover:opacity-90"
                  >
                    Calculate ROI
                    <Calculator className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${getROIColor(calculations.finalROI)}`}>
                        {formatPercentage(calculations.finalROI)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {inputs.analysisYears}-Year ROI
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {formatCurrency(calculations.totalNetValue)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Net Value
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {calculations.roiBreakeven ? `Year ${calculations.roiBreakeven}` : 'Beyond'}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Breakeven Point
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Target className="w-6 h-6" />
                      </div>
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {formatCurrency(calculations.totalAnnualBenefits)}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Annual Benefits
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ROI Over Time Chart */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        ROI Projection Over Time
                      </span>
                      <Badge className={getROIBadgeColor(calculations.finalROI)}>
                        {calculations.finalROI >= 0 ? 'Positive ROI' : 'Negative ROI'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={calculations.yearlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" stroke="#64748b" />
                          <YAxis stroke="#64748b" tickFormatter={(value) => `${value}%`} />
                          <Tooltip
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
                            labelStyle={{ color: '#334155' }}
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="roi"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Cumulative Benefits vs Costs */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Cumulative Benefits vs Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={calculations.yearlyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="year" stroke="#64748b" />
                          <YAxis stroke="#64748b" tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip
                            formatter={(value: number, name: string) => [formatCurrency(value), name === 'cumulativeBenefits' ? 'Benefits' : 'Costs']}
                            labelStyle={{ color: '#334155' }}
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="cumulativeCosts"
                            stackId="1"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.3}
                          />
                          <Area
                            type="monotone"
                            dataKey="cumulativeBenefits"
                            stackId="2"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefit Breakdown */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Annual Benefit Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={calculations.benefitBreakdown}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                            >
                              {calculations.benefitBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          {calculations.finalROI >= 20 ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          ) : calculations.finalROI >= 0 ? (
                            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {calculations.finalROI >= 20 ? 'Excellent ROI' : calculations.finalROI >= 0 ? 'Positive ROI' : 'Negative ROI'}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {calculations.finalROI >= 20 
                                ? 'This AI implementation shows strong financial returns.'
                                : calculations.finalROI >= 0
                                ? 'This implementation will be profitable.'
                                : 'Consider adjusting parameters or timeline.'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              Payback Period
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {calculations.roiBreakeven 
                                ? `Investment will pay back in ${calculations.roiBreakeven} year${calculations.roiBreakeven > 1 ? 's' : ''}.`
                                : 'Payback extends beyond the analysis period.'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              Primary Benefit
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {calculations.benefitBreakdown.reduce((max, current) => 
                                current.value > max.value ? current : max
                              ).name} contributes the most value.
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={exportResults} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button onClick={shareResults} variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                  <Button
                    onClick={() => navigate('contact')}
                    className="gradient-bg-blue text-white hover:opacity-90"
                  >
                    Get Expert Review
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Detailed Analysis & Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Financial Analysis</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Total Investment</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {formatCurrency(calculations.totalImplementationCost)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Initial + Training costs</div>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Annual Operating Cost</div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              {formatCurrency(calculations.annualOperatingCost)}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">License + Maintenance</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Benefit Analysis</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-sm font-medium text-green-800 dark:text-green-300">Time Savings</div>
                            <div className="text-2xl font-bold text-green-800 dark:text-green-300">
                              {formatCurrency(calculations.timeSavingsValue)}
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">Per year</div>
                          </div>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-300">Error Reduction</div>
                            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                              {formatCurrency(calculations.errorReductionValue)}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Per year</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommendations</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {calculations.finalROI < 0 && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="font-medium text-red-800 dark:text-red-300 mb-2">Consider Optimization</div>
                            <div className="text-sm text-red-600 dark:text-red-400">
                              The current parameters show negative ROI. Consider reducing costs or increasing expected benefits.
                            </div>
                          </div>
                        )}
                        
                        {calculations.roiBreakeven && calculations.roiBreakeven <= 2 && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="font-medium text-green-800 dark:text-green-300 mb-2">Fast Payback</div>
                            <div className="text-sm text-green-600 dark:text-green-400">
                              Quick return on investment makes this a low-risk implementation.
                            </div>
                          </div>
                        )}

                        {calculations.finalROI >= 50 && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">Excellent Returns</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">
                              High ROI indicates strong business case for AI implementation.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Ready to Implement AI in Your Business?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Our AI experts can help you validate these projections and create a customized implementation plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('contact')}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Schedule Consultation
            </Button>
            <Button 
              onClick={() => navigate('services')}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              View Our Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}