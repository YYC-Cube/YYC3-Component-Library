"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, Search, ArrowRight, Hash, Filter, Star, 
  Brain, Zap, Target, Settings, Users, TrendingUp,
  ChevronRight, ExternalLink, Copy, Check, Info,
  AlertCircle, Lightbulb, Code, Database, Globe
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface GlossaryPageProps {
  navigate: (page: string) => void;
}

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  detailedExplanation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  synonyms: string[];
  relatedTerms: string[];
  examples: string[];
  tags: string[];
  isPopular?: boolean;
  isTrending?: boolean;
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
    id: "machine-learning",
    name: "Machine Learning",
    description: "Core ML concepts, algorithms, and methodologies",
    icon: Brain,
    color: "blue",
    count: 45
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    description: "Neural networks, architectures, and deep learning concepts",
    icon: Zap,
    color: "purple",
    count: 38
  },
  {
    id: "data-science",
    name: "Data Science",
    description: "Data analysis, statistics, and data processing terms",
    icon: Database,
    color: "green",
    count: 42
  },
  {
    id: "ai-ethics",
    name: "AI Ethics",
    description: "Responsible AI, bias, fairness, and governance",
    icon: Target,
    color: "orange",
    count: 28
  },
  {
    id: "technical-implementation",
    name: "Technical Implementation",
    description: "Development, deployment, and infrastructure terms",
    icon: Settings,
    color: "red",
    count: 35
  },
  {
    id: "business-ai",
    name: "Business & AI",
    description: "ROI, strategy, and business transformation concepts",
    icon: TrendingUp,
    color: "yellow",
    count: 31
  }
];

const featuredTerms: GlossaryTerm[] = [
  {
    id: "artificial-intelligence",
    term: "Artificial Intelligence (AI)",
    definition: "The simulation of human intelligence in machines that are programmed to think and learn like humans.",
    detailedExplanation: "Artificial Intelligence is a broad field of computer science focused on creating machines capable of performing tasks that typically require human intelligence. This includes learning, reasoning, problem-solving, perception, and language understanding. AI systems can be categorized into narrow AI (designed for specific tasks) and general AI (theoretical human-level intelligence across all domains).",
    category: "Machine Learning",
    difficulty: "beginner",
    synonyms: ["AI", "Machine Intelligence", "Cognitive Computing"],
    relatedTerms: ["Machine Learning", "Deep Learning", "Neural Networks", "Automation"],
    examples: [
      "Virtual assistants like Siri and Alexa",
      "Recommendation systems on Netflix and Amazon",
      "Autonomous vehicles",
      "Medical diagnosis systems"
    ],
    tags: ["ai", "intelligence", "automation", "cognitive"],
    isPopular: true,
    isTrending: true
  },
  {
    id: "machine-learning",
    term: "Machine Learning (ML)",
    definition: "A subset of AI that enables computers to learn and improve from experience without being explicitly programmed.",
    detailedExplanation: "Machine Learning is a method of data analysis that automates analytical model building. It uses algorithms that iteratively learn from data, allowing computers to find hidden insights without being explicitly programmed where to look. ML algorithms build mathematical models based on training data to make predictions or decisions.",
    category: "Machine Learning",
    difficulty: "beginner",
    synonyms: ["ML", "Statistical Learning", "Pattern Recognition"],
    relatedTerms: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Neural Networks"],
    examples: [
      "Email spam detection",
      "Image recognition",
      "Predictive text on smartphones",
      "Fraud detection in banking"
    ],
    tags: ["ml", "learning", "algorithms", "prediction"],
    isPopular: true
  },
  {
    id: "neural-network",
    term: "Neural Network",
    definition: "A computing system inspired by biological neural networks that processes information using interconnected nodes (neurons).",
    detailedExplanation: "Neural networks are computing systems vaguely inspired by the biological neural networks in animal brains. They consist of layers of interconnected nodes (artificial neurons) that process and transmit information. Each connection has a weight that adjusts during learning, and the network learns to recognize patterns and make decisions through training on data.",
    category: "Deep Learning",
    difficulty: "intermediate",
    synonyms: ["Artificial Neural Network", "ANN", "Neural Net"],
    relatedTerms: ["Deep Learning", "Backpropagation", "Activation Function", "Perceptron"],
    examples: [
      "Image classification systems",
      "Natural language processing",
      "Speech recognition",
      "Game-playing AI like AlphaGo"
    ],
    tags: ["neural", "network", "deep-learning", "nodes"],
    isPopular: true
  },
  {
    id: "deep-learning",
    term: "Deep Learning",
    definition: "A subset of machine learning using neural networks with multiple layers to model and understand complex patterns.",
    detailedExplanation: "Deep Learning is a subset of machine learning that uses artificial neural networks with multiple hidden layers (hence 'deep') to model and understand complex patterns in data. These deep networks can automatically discover representations needed for feature detection or classification from raw data, eliminating the need for manual feature engineering.",
    category: "Deep Learning",
    difficulty: "intermediate",
    synonyms: ["Deep Neural Networks", "DNN", "Hierarchical Learning"],
    relatedTerms: ["Convolutional Neural Networks", "Recurrent Neural Networks", "Transformer", "Gradient Descent"],
    examples: [
      "Computer vision applications",
      "Natural language translation",
      "Voice assistants",
      "Medical image analysis"
    ],
    tags: ["deep", "learning", "neural", "layers"],
    isTrending: true
  },
  {
    id: "algorithm",
    term: "Algorithm",
    definition: "A set of rules or instructions given to an AI system to help it learn on its own and make decisions.",
    detailedExplanation: "An algorithm is a finite sequence of well-defined instructions for solving a problem or performing a computation. In AI and machine learning, algorithms are the mathematical procedures that process data to identify patterns, make predictions, or perform specific tasks. Different algorithms are suited for different types of problems and data.",
    category: "Machine Learning",
    difficulty: "beginner",
    synonyms: ["Procedure", "Method", "Process"],
    relatedTerms: ["Model", "Training", "Optimization", "Hyperparameters"],
    examples: [
      "Linear regression for prediction",
      "Decision trees for classification",
      "K-means for clustering",
      "Gradient descent for optimization"
    ],
    tags: ["algorithm", "rules", "instructions", "computation"],
    isPopular: true
  },
  {
    id: "bias",
    term: "Bias (in AI)",
    definition: "Systematic errors or prejudices in AI systems that can lead to unfair or discriminatory outcomes.",
    detailedExplanation: "Bias in AI refers to systematic errors that can occur when algorithms produce results that are systematically prejudiced due to erroneous assumptions in the machine learning process. This can happen due to biased training data, algorithmic design choices, or implementation decisions, leading to unfair treatment of certain groups or individuals.",
    category: "AI Ethics",
    difficulty: "intermediate",
    synonyms: ["Algorithmic Bias", "Model Bias", "Statistical Bias"],
    relatedTerms: ["Fairness", "Explainable AI", "Ethical AI", "Discrimination"],
    examples: [
      "Hiring algorithms favoring certain demographics",
      "Facial recognition performing poorly on darker skin",
      "Credit scoring algorithms with racial bias",
      "Search results showing gender stereotypes"
    ],
    tags: ["bias", "fairness", "ethics", "discrimination"],
    isTrending: true
  }
];

const alphabetSections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const glossaryStats = [
  { label: "Total Terms", value: "219", change: "+15 this month" },
  { label: "Categories", value: "6", change: "Comprehensive coverage" },
  { label: "Difficulty Levels", value: "3", change: "Beginner to Advanced" },
  { label: "Monthly Views", value: "28K+", change: "+22% growth" }
];

export function GlossaryPage({ navigate }: GlossaryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLetter, setSelectedLetter] = useState("all");
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const copyToClipboard = (text: string, termId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(termId);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Glossary Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [BookOpen, Hash, Brain, Lightbulb, Code, Globe];
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
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                219 AI Terms Defined
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
                AI <span className="gradient-text-blue">Glossary</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Comprehensive dictionary of artificial intelligence, machine learning, and data science terms explained in clear, accessible language.
              </motion.p>
            </div>

            {/* Glossary Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {glossaryStats.map((stat, index) => (
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
                onClick={() => document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Explore Terms
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Categories
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        {/* Search and Filters */}
        <motion.div
          id="search"
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
                  placeholder="Search AI terms, definitions, or concepts..."
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
                
                <Select value={selectedLetter} onValueChange={setSelectedLetter}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Letters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Letters</SelectItem>
                    {alphabetSections.map((letter) => (
                      <SelectItem key={letter} value={letter}>
                        {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Alphabet Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="glass p-4">
            <div className="flex flex-wrap justify-center gap-2">
              {alphabetSections.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className={`w-10 h-10 ${
                    selectedLetter === letter 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-blue-50 dark:hover:bg-blue-950"
                  }`}
                >
                  {letter}
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Categories Overview */}
        <motion.div
          id="categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-center mb-12">Browse by Category</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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
                          <span className="text-sm font-medium">{category.count} terms</span>
                          <ChevronRight className="w-4 h-4 text-foreground-muted group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2>Essential AI Terms</h2>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950">
              View All Terms
            </Button>
          </div>
          
          <div className="space-y-6">
            {featuredTerms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{term.term}</h3>
                      {term.isPopular && (
                        <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Popular
                        </Badge>
                      )}
                      {term.isTrending && (
                        <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Trending
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(term.difficulty)}>
                        {term.difficulty}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(term.definition, term.id)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedTerm === term.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-foreground-muted mb-4 leading-relaxed">
                    {term.definition}
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-4 mb-4">
                    <p className="text-sm leading-relaxed">
                      {term.detailedExplanation}
                    </p>
                  </div>
                  
                  {term.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Examples:
                      </h4>
                      <ul className="space-y-1">
                        {term.examples.map((example, i) => (
                          <li key={i} className="text-sm text-foreground-muted flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {term.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        <Hash className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {term.relatedTerms.length > 0 && (
                    <div className="pt-4 border-t border-border">
                      <h4 className="font-medium mb-2 text-sm">Related Terms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.map((relatedTerm, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                          >
                            {relatedTerm}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card className="glass p-6 text-center hover:shadow-lg transition-all duration-300">
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="mb-2">Beginner's Guide</h3>
            <p className="text-sm text-foreground-muted mb-4">
              Start with fundamental AI concepts and build your knowledge progressively.
            </p>
            <Button variant="outline" className="w-full">
              Start Learning
            </Button>
          </Card>
          
          <Card className="glass p-6 text-center hover:shadow-lg transition-all duration-300">
            <AlertCircle className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
            <h3 className="mb-2">Common Misconceptions</h3>
            <p className="text-sm text-foreground-muted mb-4">
              Clear up misunderstandings about AI and machine learning concepts.
            </p>
            <Button variant="outline" className="w-full">
              Learn More
            </Button>
          </Card>
          
          <Card className="glass p-6 text-center hover:shadow-lg transition-all duration-300">
            <Info className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="mb-2">Request Definition</h3>
            <p className="text-sm text-foreground-muted mb-4">
              Can't find a term? Request a new definition to be added to our glossary.
            </p>
            <Button variant="outline" className="w-full">
              Request Term
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}