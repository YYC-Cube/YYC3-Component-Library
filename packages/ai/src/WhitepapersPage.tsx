"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Download, Search, Calendar, User, ArrowRight, 
  TrendingUp, Brain, Target, Zap, Building2, BarChart3,
  Star, Eye, Filter, Tag, ExternalLink, Clock, BookOpen,
  Award, CheckCircle, Globe, Users, Settings, Shield
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface WhitepapersPageProps {
  navigate: (page: string) => void;
}

interface Whitepaper {
  id: string;
  title: string;
  description: string;
  abstract: string;
  category: string;
  industry: string[];
  authors: string[];
  publishDate: string;
  pages: number;
  downloads: number;
  views: number;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isFeatured?: boolean;
  isNew?: boolean;
  fileSize: string;
  format: 'PDF' | 'ePub' | 'Word';
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  count: number;
}

const categories: Category[] = [
  {
    id: "ai-strategy",
    name: "AI Strategy & Planning",
    description: "Strategic frameworks for AI adoption and implementation",
    icon: Target,
    color: "blue",
    count: 12
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "Technical papers on ML algorithms and methodologies",
    icon: Brain,
    color: "purple",
    count: 18
  },
  {
    id: "business-transformation",
    name: "Business Transformation",
    description: "How AI transforms business processes and operations",
    icon: TrendingUp,
    color: "green",
    count: 15
  },
  {
    id: "industry-analysis",
    name: "Industry Analysis",
    description: "Sector-specific AI adoption and impact studies",
    icon: Building2,
    color: "orange",
    count: 22
  },
  {
    id: "technical-implementation",
    name: "Technical Implementation",
    description: "Detailed technical guides for AI system deployment",
    icon: Settings,
    color: "red",
    count: 14
  },
  {
    id: "ethics-governance",
    name: "Ethics & Governance",
    description: "Responsible AI practices and regulatory compliance",
    icon: Shield,
    color: "yellow",
    count: 8
  }
];

const featuredWhitepapers: Whitepaper[] = [
  {
    id: "1",
    title: "The Complete Guide to AI ROI Measurement and Optimization",
    description: "Comprehensive framework for measuring and maximizing return on investment in AI initiatives across different industries.",
    abstract: "This whitepaper presents a systematic approach to measuring AI ROI, including key metrics, benchmarking methodologies, and optimization strategies. Based on analysis of 500+ AI implementations across various sectors.",
    category: "AI Strategy & Planning",
    industry: ["Technology", "Manufacturing", "Healthcare", "Finance"],
    authors: ["Dr. Sarah Chen", "Michael Rodriguez", "Lisa Wang"],
    publishDate: "2024-03-15",
    pages: 45,
    downloads: 12450,
    views: 28900,
    tags: ["roi", "measurement", "optimization", "strategy", "metrics"],
    difficulty: "intermediate",
    isFeatured: true,
    fileSize: "3.2 MB",
    format: "PDF"
  },
  {
    id: "2",
    title: "Future of Work: AI's Impact on Employment and Skills",
    description: "Analysis of how artificial intelligence is reshaping the job market and the skills needed for the AI-driven economy.",
    abstract: "An in-depth study examining AI's effects on employment patterns, emerging job categories, and required skill sets. Includes survey data from 10,000 professionals across 15 industries.",
    category: "Business Transformation",
    industry: ["All Industries"],
    authors: ["Prof. Ahmed Hassan", "Dr. Maria Garcia", "David Kim"],
    publishDate: "2024-02-28",
    pages: 38,
    downloads: 8930,
    views: 19450,
    tags: ["future-of-work", "employment", "skills", "workforce", "automation"],
    difficulty: "intermediate",
    isNew: true,
    fileSize: "2.8 MB",
    format: "PDF"
  },
  {
    id: "3",
    title: "Explainable AI: Building Trust in Machine Learning Systems",
    description: "Technical deep-dive into explainable AI methods and their importance for enterprise AI adoption.",
    abstract: "This paper explores various XAI techniques, their applications, and implementation strategies. Includes case studies demonstrating improved user trust and regulatory compliance through explainable AI.",
    category: "Machine Learning",
    industry: ["Healthcare", "Finance", "Legal"],
    authors: ["Dr. Priya Sharma", "Robert Johnson", "Elena Volkov"],
    publishDate: "2024-01-20",
    pages: 52,
    downloads: 15200,
    views: 34600,
    tags: ["explainable-ai", "transparency", "trust", "compliance", "xai"],
    difficulty: "advanced",
    isFeatured: true,
    fileSize: "4.1 MB",
    format: "PDF"
  },
  {
    id: "4",
    title: "AI in Manufacturing: Industry 4.0 Implementation Roadmap",
    description: "Strategic guide for implementing AI solutions in manufacturing environments with real-world case studies.",
    abstract: "Comprehensive roadmap covering predictive maintenance, quality control, and supply chain optimization using AI. Features 12 detailed case studies from leading manufacturers.",
    category: "Industry Analysis",
    industry: ["Manufacturing", "Automotive", "Aerospace"],
    authors: ["Dr. James Wilson", "Anna Schmidt", "Raj Patel"],
    publishDate: "2024-03-01",
    pages: 41,
    downloads: 7650,
    views: 16800,
    tags: ["manufacturing", "industry-4.0", "predictive-maintenance", "automation"],
    difficulty: "intermediate",
    fileSize: "3.7 MB",
    format: "PDF"
  },
  {
    id: "5",
    title: "Responsible AI: Frameworks for Ethical AI Development",
    description: "Guidelines and frameworks for developing AI systems that are fair, transparent, and socially responsible.",
    abstract: "This whitepaper outlines practical frameworks for implementing responsible AI practices, including bias detection, fairness metrics, and governance structures.",
    category: "Ethics & Governance",
    industry: ["Technology", "Healthcare", "Finance", "Government"],
    authors: ["Dr. Fatima Al-Zahra", "Michael Chen", "Sarah Thompson"],
    publishDate: "2024-02-10",
    pages: 35,
    downloads: 9840,
    views: 22100,
    tags: ["responsible-ai", "ethics", "fairness", "governance", "bias"],
    difficulty: "intermediate",
    isNew: true,
    fileSize: "2.5 MB",
    format: "PDF"
  },
  {
    id: "6",
    title: "Edge AI: Deploying Intelligence at the Network Edge",
    description: "Technical guide to deploying AI models on edge devices for real-time processing and reduced latency.",
    abstract: "Explores edge AI architectures, optimization techniques, and deployment strategies. Includes performance benchmarks and use cases across IoT, autonomous vehicles, and smart cities.",
    category: "Technical Implementation",
    industry: ["IoT", "Automotive", "Smart Cities", "Retail"],
    authors: ["Dr. Lisa Rodriguez", "Kevin Park", "Yuki Tanaka"],
    publishDate: "2024-01-05",
    pages: 48,
    downloads: 6780,
    views: 14500,
    tags: ["edge-ai", "deployment", "optimization", "iot", "real-time"],
    difficulty: "advanced",
    fileSize: "3.9 MB",
    format: "PDF"
  }
];

const researchStats = [
  { label: "Published Papers", value: "89", change: "+8 this quarter" },
  { label: "Total Downloads", value: "125K+", change: "+23% growth" },
  { label: "Research Partners", value: "34", change: "Leading institutions" },
  { label: "Citation Impact", value: "4.2", change: "Average impact factor" }
];

export function WhitepapersPage({ navigate }: WhitepapersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Research Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [FileText, Brain, BarChart3, Target, Award, Globe];
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
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                89 Research Papers
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
                Research <span className="gradient-text-blue">Whitepapers</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                In-depth research papers, industry insights, and technical analysis from leading AI experts and practitioners worldwide.
              </motion.p>
            </div>

            {/* Research Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {researchStats.map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                  <div className="text-2xl md:text-3xl font-bold gradient-text-blue mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-foreground-muted">{stat.change}</div>
                </div>
              ))}
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
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Explore Research
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Papers
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="glass p-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
                <Input
                  placeholder="Search research papers by title, author, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 text-lg py-6 bg-input-background"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Research Categories */}
        <motion.div
          id="categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-center mb-12">Research Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="glass p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.count} papers</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Whitepapers */}
        <motion.div
          id="featured"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2>Featured Research</h2>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950">
              View All Papers
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredWhitepapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <Badge variant="outline" className="text-xs">
                          {paper.format}
                        </Badge>
                        {paper.isFeatured && (
                          <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Featured
                          </Badge>
                        )}
                        {paper.isNew && (
                          <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            New
                          </Badge>
                        )}
                      </div>
                      <Badge className={getDifficultyColor(paper.difficulty)}>
                        {paper.difficulty}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {paper.title}
                    </h3>
                    
                    <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                      {paper.description}
                    </p>
                    
                    <p className="text-xs text-foreground-muted mb-4 line-clamp-3 flex-1">
                      {paper.abstract}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {paper.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-foreground-muted mb-4">
                      <div className="flex items-center gap-4">
                        <span>{paper.pages} pages</span>
                        <span>{paper.fileSize}</span>
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          <span>{paper.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{paper.views.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-foreground-muted" />
                        <span className="text-sm">{paper.authors[0]}</span>
                        {paper.authors.length > 1 && (
                          <span className="text-xs text-foreground-muted">
                            +{paper.authors.length - 1} more
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-foreground-muted" />
                        <span className="text-xs text-foreground-muted">{paper.publishDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass p-8">
            <h3 className="text-center mb-8">Research Impact & Recognition</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
                <h4 className="mb-2">Industry Recognition</h4>
                <p className="text-sm text-foreground-muted">
                  Our research has been cited in over 500 academic papers and industry reports worldwide.
                </p>
              </div>
              
              <div className="text-center">
                <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h4 className="mb-2">Global Reach</h4>
                <p className="text-sm text-foreground-muted">
                  Research papers downloaded in 120+ countries by leading organizations and institutions.
                </p>
              </div>
              
              <div className="text-center">
                <Users className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h4 className="mb-2">Expert Contributors</h4>
                <p className="text-sm text-foreground-muted">
                  Authored by PhD researchers and industry experts from top universities and companies.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}