"use client";

import { useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  FileText,
  Download,
  Share2,
  Target,
  Users,
  Brain,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle,
  Edit3,
  Eye,
  ArrowRight,
  Copy,
  Save,
  RefreshCw,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Zap,
  Building,
  Factory,
  Stethoscope,
  GraduationCap,
  ShoppingCart,
  Briefcase,
  Truck,
  Globe,
  Cpu,
  Heart,
  Book,
  Camera,
  Music,
  Gamepad2,
  CreditCard,
  Home,
  Car,
  Plane,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  Percent,
  Award,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

interface StrategyTemplatePageProps {
  navigate: (page: string) => void;
}

interface StrategySection {
  id: string;
  title: string;
  description: string;
  content: string;
  isRequired: boolean;
  placeholder: string;
  wordCount?: number;
  estimatedTime?: string;
  tips?: string[];
}

interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: any;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  sections: StrategySection[];
  popularity: number;
  tags: string[];
}

export function StrategyTemplatePage({ navigate }: StrategyTemplatePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('templates');
  const [strategyData, setStrategyData] = useState<Record<string, string>>({});
  const [companyName, setCompanyName] = useState('');
  const [currentSection, setCurrentSection] = useState(0);
  const [showTips, setShowTips] = useState(true);

  // Comprehensive AI Strategy Templates
  const strategyTemplates: StrategyTemplate[] = [
    {
      id: 'enterprise',
      name: 'Enterprise AI Strategy',
      description: 'Comprehensive AI strategy for large enterprises with complex operations and multiple departments',
      industry: 'Enterprise',
      icon: Building,
      color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20',
      difficulty: 'Advanced',
      estimatedTime: '2-3 hours',
      popularity: 95,
      tags: ['Enterprise', 'Digital Transformation', 'Large Scale', 'Multi-Department'],
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          description: 'High-level overview of the AI strategy for C-level stakeholders',
          content: '',
          isRequired: true,
          wordCount: 300,
          estimatedTime: '15 minutes',
          placeholder: 'Provide a comprehensive overview of your AI strategy including key objectives, expected ROI, strategic alignment with business goals, and high-level implementation roadmap. This summary should be compelling for C-level executives and board members.',
          tips: [
            'Focus on business value and ROI',
            'Keep it concise but comprehensive',
            'Include specific metrics and timelines',
            'Address potential concerns upfront'
          ]
        },
        {
          id: 'vision-mission',
          title: 'AI Vision & Mission',
          description: 'Define your organization\'s AI vision and mission statement',
          content: '',
          isRequired: true,
          wordCount: 200,
          estimatedTime: '10 minutes',
          placeholder: 'Articulate your organization\'s vision for AI adoption and the mission statement that will guide all AI initiatives. Include how AI aligns with your company values and long-term strategic goals.',
          tips: [
            'Make it inspiring and memorable',
            'Align with company values',
            'Be specific about AI\'s role',
            'Consider ethical implications'
          ]
        },
        {
          id: 'current-state',
          title: 'Current State Assessment',
          description: 'Comprehensive evaluation of current AI capabilities and organizational maturity',
          content: '',
          isRequired: true,
          wordCount: 500,
          estimatedTime: '25 minutes',
          placeholder: 'Assess your current AI capabilities, data infrastructure, technical skills, organizational readiness, existing tools and systems, and competitive position. Include SWOT analysis for AI readiness.',
          tips: [
            'Be honest about current limitations',
            'Identify existing AI initiatives',
            'Assess data quality and availability',
            'Evaluate team capabilities'
          ]
        },
        {
          id: 'strategic-objectives',
          title: 'Strategic Objectives',
          description: 'Define specific, measurable AI objectives with KPIs and timelines',
          content: '',
          isRequired: true,
          wordCount: 400,
          estimatedTime: '20 minutes',
          placeholder: 'List 3-5 strategic objectives for AI implementation. Include specific KPIs, success metrics, timelines, and how each objective supports broader business goals. Use SMART criteria for each objective.',
          tips: [
            'Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)',
            'Link to business outcomes',
            'Include both short-term and long-term goals',
            'Define success metrics clearly'
          ]
        },
        {
          id: 'use-cases',
          title: 'Priority Use Cases',
          description: 'Detailed analysis of priority AI use cases with business impact assessment',
          content: '',
          isRequired: true,
          wordCount: 600,
          estimatedTime: '30 minutes',
          placeholder: 'Describe 5-8 priority AI use cases including business problem, proposed AI solution, expected benefits, implementation complexity, resource requirements, and success criteria. Prioritize by impact vs effort matrix.',
          tips: [
            'Start with high-impact, low-complexity use cases',
            'Include clear business problems',
            'Estimate implementation effort',
            'Consider pilot vs full deployment'
          ]
        }
      ]
    },
    {
      id: 'startup',
      name: 'AI-First Startup Strategy',
      description: 'Lean AI strategy template for startups building AI-native products and services',
      industry: 'Startup',
      icon: Zap,
      color: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20',
      difficulty: 'Intermediate',
      estimatedTime: '1-2 hours',
      popularity: 87,
      tags: ['Startup', 'AI-First', 'Lean', 'MVP'],
      sections: [
        {
          id: 'vision-mission',
          title: 'AI Vision & Mission',
          description: 'Core vision and mission for AI-first startup approach',
          content: '',
          isRequired: true,
          wordCount: 200,
          estimatedTime: '10 minutes',
          placeholder: 'Define your startup\'s AI-first vision and how AI will be the core differentiator in your business model. Explain how AI creates unique value for your target market.',
          tips: [
            'Focus on AI as core differentiator',
            'Be specific about value creation',
            'Consider market timing',
            'Think about competitive moats'
          ]
        },
        {
          id: 'market-opportunity',
          title: 'Market Opportunity',
          description: 'AI market opportunity analysis and competitive positioning',
          content: '',
          isRequired: true,
          wordCount: 400,
          estimatedTime: '20 minutes',
          placeholder: 'Analyze the market opportunity for AI in your domain, competitive landscape, target customer segments, and how you\'ll leverage AI for competitive advantage and market differentiation.',
          tips: [
            'Size the AI opportunity',
            'Identify early adopters',
            'Analyze AI-native competitors',
            'Define unique positioning'
          ]
        },
        {
          id: 'product-strategy',
          title: 'AI Product Strategy',
          description: 'Product development strategy leveraging AI capabilities',
          content: '',
          isRequired: true,
          wordCount: 350,
          estimatedTime: '18 minutes',
          placeholder: 'Outline your AI-powered product strategy including core AI features, development approach, MVP definition, and product-market fit validation plan.',
          tips: [
            'Start with simple AI features',
            'Plan for data collection from day one',
            'Consider model improvement cycles',
            'Think about user experience'
          ]
        }
      ]
    },
    {
      id: 'sme',
      name: 'SME AI Adoption Strategy',
      description: 'Practical AI strategy for small and medium enterprises with limited resources',
      industry: 'SME',
      icon: Briefcase,
      color: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20',
      difficulty: 'Beginner',
      estimatedTime: '45-60 minutes',
      popularity: 92,
      tags: ['SME', 'Small Business', 'Practical', 'Budget-Friendly'],
      sections: [
        {
          id: 'business-assessment',
          title: 'Business Assessment',
          description: 'Current state analysis and AI opportunity identification',
          content: '',
          isRequired: true,
          wordCount: 300,
          estimatedTime: '15 minutes',
          placeholder: 'Assess your current business processes, pain points, and areas where AI could provide immediate value. Focus on practical applications that address real business problems.',
          tips: [
            'Focus on real pain points',
            'Look for repetitive tasks',
            'Consider customer experience',
            'Think about cost savings'
          ]
        },
        {
          id: 'quick-wins',
          title: 'Quick Wins & Low-Hanging Fruit',
          description: 'Immediate AI opportunities with minimal investment',
          content: '',
          isRequired: true,
          wordCount: 250,
          estimatedTime: '12 minutes',
          placeholder: 'Identify quick wins and low-hanging fruit AI applications that can be implemented with existing tools and minimal investment. Include expected timeframes and benefits.',
          tips: [
            'Start with existing tools',
            'Look for SaaS solutions',
            'Consider chatbots and automation',
            'Think about data analysis'
          ]
        }
      ]
    },
    {
      id: 'healthcare',
      name: 'Healthcare AI Strategy',
      description: 'AI strategy template for healthcare organizations with compliance and patient safety focus',
      industry: 'Healthcare',
      icon: Stethoscope,
      color: 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20',
      difficulty: 'Advanced',
      estimatedTime: '2-3 hours',
      popularity: 78,
      tags: ['Healthcare', 'HIPAA', 'Patient Safety', 'Compliance'],
      sections: [
        {
          id: 'healthcare-vision',
          title: 'Healthcare AI Vision',
          description: 'Vision for AI in healthcare with patient-centric focus',
          content: '',
          isRequired: true,
          wordCount: 250,
          estimatedTime: '12 minutes',
          placeholder: 'Define your vision for AI in healthcare focusing on patient outcomes, safety, accessibility, and quality of care improvements.',
          tips: [
            'Put patients first',
            'Focus on safety and quality',
            'Consider accessibility',
            'Think about clinical workflows'
          ]
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial Services AI Strategy',
      description: 'AI strategy for financial institutions with risk management and regulatory focus',
      industry: 'Financial Services',
      icon: CreditCard,
      color: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20',
      difficulty: 'Advanced',
      estimatedTime: '2-3 hours',
      popularity: 85,
      tags: ['FinTech', 'Banking', 'Risk Management', 'Compliance'],
      sections: [
        {
          id: 'financial-vision',
          title: 'Financial AI Vision',
          description: 'Vision for AI in financial services',
          content: '',
          isRequired: true,
          wordCount: 200,
          estimatedTime: '10 minutes',
          placeholder: 'Define your vision for AI in financial services including customer experience enhancement, risk management, operational efficiency, and regulatory compliance.',
          tips: [
            'Focus on customer value',
            'Consider risk implications',
            'Think about compliance',
            'Plan for transparency'
          ]
        }
      ]
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing AI Strategy',
      description: 'AI strategy for manufacturing with focus on Industry 4.0 and operational excellence',
      industry: 'Manufacturing',
      icon: Factory,
      color: 'from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20',
      difficulty: 'Intermediate',
      estimatedTime: '1.5-2 hours',
      popularity: 73,
      tags: ['Manufacturing', 'Industry 4.0', 'IoT', 'Predictive Maintenance'],
      sections: [
        {
          id: 'operational-excellence',
          title: 'Operational Excellence Vision',
          description: 'AI vision for manufacturing operational excellence',
          content: '',
          isRequired: true,
          wordCount: 250,
          estimatedTime: '12 minutes',
          placeholder: 'Define how AI will drive operational excellence through predictive maintenance, quality control, supply chain optimization, and production efficiency.',
          tips: [
            'Focus on operational metrics',
            'Consider safety implications',
            'Think about quality improvements',
            'Plan for efficiency gains'
          ]
        }
      ]
    }
  ];

  // Calculate progress
  const templateProgress = useMemo(() => {
    if (!selectedTemplate) return 0;
    
    const template = strategyTemplates.find(t => t.id === selectedTemplate);
    if (!template) return 0;
    
    const requiredSections = template.sections.filter(s => s.isRequired);
    const completedSections = requiredSections.filter(s => 
      strategyData[s.id] && strategyData[s.id].trim().length > 0
    );
    
    return Math.round((completedSections.length / requiredSections.length) * 100);
  }, [selectedTemplate, strategyData]);

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getTotalEstimatedTime = () => {
    const template = getSelectedTemplate();
    if (!template) return 0;
    
    return template.sections.reduce((total, section) => {
      const time = parseInt(section.estimatedTime?.split(' ')[0] || '0');
      return total + time;
    }, 0);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = strategyTemplates.find(t => t.id === templateId);
    if (template) {
      const initialData: Record<string, string> = {};
      template.sections.forEach(section => {
        initialData[section.id] = section.content;
      });
      setStrategyData(initialData);
      setCurrentSection(0);
      setActiveTab('builder');
    }
  };

  const handleSectionUpdate = (sectionId: string, content: string) => {
    setStrategyData(prev => ({
      ...prev,
      [sectionId]: content
    }));
  };

  const getSelectedTemplate = () => {
    return strategyTemplates.find(t => t.id === selectedTemplate);
  };

  const exportStrategy = (format: 'json' | 'markdown') => {
    const template = getSelectedTemplate();
    if (!template) return;

    const timestamp = new Date().toISOString();
    const fileName = `${companyName.replace(/\s+/g, '-').toLowerCase()}-ai-strategy`;
    
    if (format === 'json') {
      const exportData = {
        companyName,
        template: template.name,
        industry: template.industry,
        sections: template.sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          content: strategyData[section.id] || '',
          isRequired: section.isRequired,
          wordCount: getWordCount(strategyData[section.id] || '')
        })),
        completionPercentage: templateProgress,
        exportedAt: timestamp,
        estimatedReadingTime: `${Math.ceil(getTotalEstimatedTime() / 5)} minutes`
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'markdown') {
      let content = `# ${companyName} AI Strategy\n\n`;
      content += `**Template:** ${template.name}\n`;
      content += `**Industry:** ${template.industry}\n`;
      content += `**Generated:** ${new Date().toLocaleDateString()}\n`;
      content += `**Completion:** ${templateProgress}%\n\n`;
      content += `---\n\n`;
      
      template.sections.forEach(section => {
        content += `## ${section.title}\n\n`;
        content += `*${section.description}*\n\n`;
        content += `${strategyData[section.id] || '*[Section not completed]*'}\n\n`;
        content += `---\n\n`;
      });
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPopularityStars = (popularity: number) => {
    const stars = Math.floor(popularity / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  const navigateSection = (direction: 'prev' | 'next') => {
    const template = getSelectedTemplate();
    if (!template) return;
    
    if (direction === 'next' && currentSection < template.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else if (direction === 'prev' && currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Simple progress bar component
  const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
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
                {i % 4 === 0 ? <FileText className="w-8 h-8" /> : 
                 i % 4 === 1 ? <Target className="w-8 h-8" /> : 
                 i % 4 === 2 ? <Brain className="w-8 h-8" /> :
                 <Lightbulb className="w-8 h-8" />}
              </motion.div>
            ))}
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
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                AI Strategy Builder
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-slate-900 dark:text-slate-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI <span className="gradient-text-blue">Strategy</span> Templates
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Create comprehensive AI strategies with our professional templates. Customize for your industry, export in multiple formats, and accelerate your AI transformation journey.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap justify-center gap-8 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: Target, text: '6 industry templates' },
                { icon: Clock, text: 'Guided workflows' },
                { icon: Download, text: 'Multiple export formats' },
                { icon: Award, text: 'Professional quality' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                onClick={() => setActiveTab('templates')}
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Choose Template
              </Button>
              <Button
                onClick={() => navigate('contact')}
                variant="outline"
                className="h-14 px-8 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Brain className="w-5 h-5 mr-2" />
                Get Strategy Consultation
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="builder" disabled={!selectedTemplate}>Builder</TabsTrigger>
              <TabsTrigger value="preview" disabled={!selectedTemplate}>Preview</TabsTrigger>
              <TabsTrigger value="export" disabled={!selectedTemplate}>Export</TabsTrigger>
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
                    Choose Your AI Strategy Template
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Select from our industry-specific templates designed by AI strategy experts. Each template includes comprehensive sections tailored to your industry's unique needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {strategyTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`card-hover glass cursor-pointer transition-all duration-200 h-full ${
                          selectedTemplate === template.id ? 'ring-2 ring-blue-500/50 bg-blue-50/50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-6 h-full flex flex-col">
                          <div className="flex items-start gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shadow-lg`}>
                              <template.icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                                  {template.industry}
                                </Badge>
                                <Badge className={`${getDifficultyColor(template.difficulty)} text-xs`}>
                                  {template.difficulty}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {template.name}
                              </h3>
                              <div className="flex items-center gap-1 mb-2">
                                {getPopularityStars(template.popularity)}
                                <span className="text-xs text-slate-500 ml-1">({template.popularity}%)</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1">
                            {template.description}
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {template.estimatedTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {template.sections.length} sections
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {selectedTemplate === template.id && (
                            <div className="mt-4 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {selectedTemplate && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setActiveTab('builder')}
                      className="gradient-bg-blue text-white hover:opacity-90"
                    >
                      Start Building Strategy
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder" className="space-y-6">
              {getSelectedTemplate() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Build Your AI Strategy
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Complete each section to create your comprehensive AI strategy document.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={showTips}
                          onChange={(e) => setShowTips(e.target.checked)}
                          id="show-tips"
                          className="rounded"
                        />
                        <Label htmlFor="show-tips" className="text-sm">Show Tips</Label>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <Card className="glass mb-8">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                          Strategy Progress
                        </h3>
                        <Badge className={`${templateProgress >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : templateProgress >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'} border-0`}>
                          {templateProgress}% Complete
                        </Badge>
                      </div>
                      <ProgressBar value={templateProgress} />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {getSelectedTemplate()?.sections.length} sections
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            ~{getTotalEstimatedTime()} min total
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {getSelectedTemplate()?.sections.filter(s => s.isRequired && strategyData[s.id]?.trim()).length || 0} completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-orange-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {Object.values(strategyData).reduce((total, content) => total + getWordCount(content), 0)} words
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Information */}
                  <Card className="glass mb-8">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Company Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Enter your company name"
                            className="glass"
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            value={getSelectedTemplate()?.industry || ''}
                            disabled
                            className="glass"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section Builder */}
                  <div className="grid lg:grid-cols-4 gap-8">
                    {/* Section Navigation */}
                    <div className="lg:col-span-1">
                      <Card className="glass sticky top-4">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-lg">Sections</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {getSelectedTemplate()?.sections.map((section, index) => (
                            <div
                              key={section.id}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                currentSection === index 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              onClick={() => setCurrentSection(index)}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                  strategyData[section.id]?.trim() 
                                    ? 'bg-green-500 text-white' 
                                    : section.isRequired 
                                    ? 'bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' 
                                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                }`}>
                                  {strategyData[section.id]?.trim() ? (
                                    <CheckCircle className="w-3 h-3" />
                                  ) : (
                                    index + 1
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium truncate">{section.title}</div>
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    {section.isRequired && (
                                      <span className="text-red-500">*</span>
                                    )}
                                    <Clock className="w-3 h-3" />
                                    <span>{section.estimatedTime}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Section Content */}
                    <div className="lg:col-span-3">
                      {getSelectedTemplate()?.sections[currentSection] && (
                        <Card className="glass">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <CardTitle className="text-xl">
                                    {getSelectedTemplate()?.sections[currentSection].title}
                                  </CardTitle>
                                  {getSelectedTemplate()?.sections[currentSection].isRequired && (
                                    <Badge variant="outline" className="text-xs border-red-300 text-red-600">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-slate-600 dark:text-slate-400">
                                  {getSelectedTemplate()?.sections[currentSection].description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-500">
                                  {currentSection + 1} of {getSelectedTemplate()?.sections.length}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {getSelectedTemplate()?.sections[currentSection].estimatedTime}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Section Content */}
                            <div>
                              <Textarea
                                value={strategyData[getSelectedTemplate()?.sections[currentSection].id || ''] || ''}
                                onChange={(e) => handleSectionUpdate(getSelectedTemplate()?.sections[currentSection].id || '', e.target.value)}
                                placeholder={getSelectedTemplate()?.sections[currentSection].placeholder}
                                className="glass min-h-[300px]"
                              />
                              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                                <span>
                                  {getWordCount(strategyData[getSelectedTemplate()?.sections[currentSection].id || ''] || '')} words
                                  {getSelectedTemplate()?.sections[currentSection].wordCount && (
                                    <span> / {getSelectedTemplate()?.sections[currentSection].wordCount} recommended</span>
                                  )}
                                </span>
                                <span>
                                  {strategyData[getSelectedTemplate()?.sections[currentSection].id || '']?.trim() ? 'Completed' : 'In Progress'}
                                </span>
                              </div>
                            </div>

                            {/* Tips */}
                            {showTips && getSelectedTemplate()?.sections[currentSection].tips && (
                              <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Lightbulb className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                      Tips for this section
                                    </span>
                                  </div>
                                  <ul className="space-y-1">
                                    {getSelectedTemplate()?.sections[currentSection].tips?.map((tip, tipIndex) => (
                                      <li key={tipIndex} className="text-sm text-blue-600 dark:text-blue-300 flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        <span>{tip}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            )}

                            {/* Navigation */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                              <Button
                                variant="outline"
                                onClick={() => navigateSection('prev')}
                                disabled={currentSection === 0}
                              >
                                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                                Previous
                              </Button>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveTab('preview')}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                                <Button
                                  onClick={() => navigateSection('next')}
                                  disabled={currentSection === (getSelectedTemplate()?.sections.length || 0) - 1}
                                  className="gradient-bg-blue text-white"
                                >
                                  Next
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              {getSelectedTemplate() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Strategy Preview
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400">
                        Review your completed strategy before exporting.
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab('export')}
                      className="gradient-bg-blue text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Strategy
                    </Button>
                  </div>

                  {/* Strategy Header */}
                  <Card className="glass mb-8">
                    <CardContent className="p-8 text-center">
                      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        {companyName || 'Your Company'} AI Strategy
                      </h1>
                      <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
                        Based on {getSelectedTemplate()?.name}
                      </p>
                      <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                        <span>Generated on {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{templateProgress}% Complete</span>
                        <span>•</span>
                        <span>{Object.values(strategyData).reduce((total, content) => total + getWordCount(content), 0)} words</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Strategy Sections */}
                  <div className="space-y-8">
                    {getSelectedTemplate()?.sections.map((section, index) => (
                      <Card key={section.id} className="glass">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-xl">{section.title}</CardTitle>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {section.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {strategyData[section.id]?.trim() ? (
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                              <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                                {strategyData[section.id]}
                              </div>
                              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                                {getWordCount(strategyData[section.id])} words
                                {section.wordCount && (
                                  <span> • Target: {section.wordCount} words</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-400 dark:text-slate-600">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                              <p>This section has not been completed yet.</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setCurrentSection(index);
                                  setActiveTab('builder');
                                }}
                              >
                                Complete Section
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              {getSelectedTemplate() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Export Your Strategy
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                      Download your completed AI strategy in your preferred format. Share with stakeholders or use as a foundation for implementation planning.
                    </p>
                  </div>

                  {/* Export Summary */}
                  <Card className="glass mb-8">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Strategy Summary
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                          <Percent className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{templateProgress}%</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Complete</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                          <FileText className="w-6 h-6 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">
                            {getSelectedTemplate()?.sections.filter(s => strategyData[s.id]?.trim()).length}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Sections Done</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <Edit3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">
                            {Object.values(strategyData).reduce((total, content) => total + getWordCount(content), 0)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Total Words</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                          <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.ceil(Object.values(strategyData).reduce((total, content) => total + getWordCount(content), 0) / 200)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Min Read</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Export Options */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        format: 'json',
                        title: 'JSON Format',
                        description: 'Machine-readable format for further processing or integration',
                        icon: BarChart3,
                        color: 'blue'
                      },
                      {
                        format: 'markdown',
                        title: 'Markdown Document',
                        description: 'Clean text format perfect for documentation and version control',
                        icon: FileText,
                        color: 'green'
                      }
                    ].map((option) => (
                      <Card 
                        key={option.format}
                        className="glass card-hover cursor-pointer"
                        onClick={() => exportStrategy(option.format as any)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-${option.color}-100 text-${option.color}-600 dark:bg-${option.color}-900/30 dark:text-${option.color}-400 flex items-center justify-center`}>
                              <option.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                {option.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {option.description}
                              </p>
                              <Button size="sm" className="gradient-bg-blue text-white">
                                <Download className="w-4 h-4 mr-2" />
                                Export as {option.title.split(' ')[0]}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Additional Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('preview')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Strategy
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('builder')}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Continue Editing
                    </Button>
                    <Button
                      onClick={() => navigate('contact')}
                      className="gradient-bg-blue text-white"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Get Expert Review
                    </Button>
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Need a Custom AI Strategy?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Let our AI strategy experts help you develop a tailored approach that aligns perfectly with your business goals and industry requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('contact')}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Get Strategy Consultation
            </Button>
            <Button 
              onClick={() => navigate('ai-readiness-checklist')}
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Check AI Readiness
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}