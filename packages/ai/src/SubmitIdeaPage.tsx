"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Send, Star, TrendingUp, Users, Zap, Heart, MessageSquare, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";

interface SubmitIdeaPageProps {
  navigate: (page: string) => void;
}

interface IdeaCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  count: number;
}

const categories: IdeaCategory[] = [
  {
    id: "ai-tools",
    name: "AI Tools & Features",
    description: "New AI capabilities, models, or automation tools",
    icon: Zap,
    color: "blue",
    count: 124
  },
  {
    id: "user-experience",
    name: "User Experience",
    description: "Interface improvements, navigation, and usability",
    icon: Heart,
    color: "pink",
    count: 89
  },
  {
    id: "integrations",
    name: "Integrations",
    description: "Third-party connections and API improvements",
    icon: TrendingUp,
    color: "green",
    count: 67
  },
  {
    id: "community",
    name: "Community Features",
    description: "Collaboration, sharing, and social features",
    icon: Users,
    color: "purple",
    count: 45
  },
  {
    id: "performance",
    name: "Performance",
    description: "Speed, reliability, and optimization improvements",
    icon: Star,
    color: "yellow",
    count: 78
  },
  {
    id: "other",
    name: "Other Ideas",
    description: "General suggestions and feedback",
    icon: MessageSquare,
    color: "gray",
    count: 56
  }
];

const recentIdeas = [
  {
    title: "AI Code Review Assistant",
    description: "Automated code review with AI suggestions for improvements",
    category: "AI Tools",
    votes: 34,
    status: "Under Review"
  },
  {
    title: "Dark Mode for Mobile",
    description: "Add dark theme support for mobile applications",
    category: "User Experience",
    votes: 28,
    status: "In Progress"
  },
  {
    title: "Slack Integration",
    description: "Native Slack bot for project notifications and updates",
    category: "Integrations",
    votes: 22,
    status: "Planned"
  }
];

export function SubmitIdeaPage({ navigate }: SubmitIdeaPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState([5]);
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [impact, setImpact] = useState("");
  const [isSubscribeUpdates, setIsSubscribeUpdates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const getPriorityLabel = (value: number) => {
    if (value <= 2) return "Low Priority";
    if (value <= 4) return "Nice to Have";
    if (value <= 6) return "Important";
    if (value <= 8) return "High Priority";
    return "Critical";
  };

  const getPriorityColor = (value: number) => {
    if (value <= 2) return "text-gray-600";
    if (value <= 4) return "text-blue-600";
    if (value <= 6) return "text-yellow-600";
    if (value <= 8) return "text-orange-600";
    return "text-red-600";
  };

  if (isSubmitted) {
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
              Idea Submitted Successfully!
            </h1>
            
            <p className="text-xl text-foreground-muted mb-8">
              Thank you for your suggestion! Our product team will review your idea and provide updates on its progress.
            </p>
            
            <div className="glass rounded-3xl p-8 mb-8">
              <h3 className="mb-4">What happens next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Your idea will be reviewed within 5-7 business days</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>You'll receive email updates on the status</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Community voting will help prioritize development</span>
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
                onClick={() => window.location.reload()}
                className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Submit Another Idea
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
          
          {/* Animated Idea Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Lightbulb, Star, TrendingUp, Users, Zap, Heart];
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
              <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Product Feedback
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
                Share Your <span className="gradient-text-blue">Ideas</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Help us build the future of AI solutions. Your feedback drives our innovation and helps create tools that truly matter.
              </motion.p>
            </div>

            {/* Idea Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">500+</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Ideas Submitted</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">85+</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Features Built</div>
              </div>
              
              <div className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div className="text-3xl font-bold gradient-text-blue">100%</div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Community Driven</div>
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
                  Submit Idea
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('recent-ideas')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Ideas
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto" id="recent-ideas">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass p-8">
                <div className="mb-8">
                  <h2 className="mb-2">Submit Your Idea</h2>
                  <p className="text-foreground-muted">
                    Tell us about your suggestion, feature request, or improvement idea
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Idea Title *</label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your idea a clear, descriptive title"
                      required
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Category *</label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Detailed Description *</label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
                      rows={4}
                      required
                      className="bg-input-background resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Use Case / Problem It Solves</label>
                    <Textarea
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      placeholder="Describe a specific scenario where this feature would be helpful"
                      rows={3}
                      className="bg-input-background resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Expected Impact</label>
                    <Textarea
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      placeholder="How would this benefit users? What's the expected outcome?"
                      rows={3}
                      className="bg-input-background resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-4">
                      Priority Level: <span className={`font-medium ${getPriorityColor(priority[0])}`}>
                        {getPriorityLabel(priority[0])}
                      </span>
                    </label>
                    <Slider
                      value={priority}
                      onValueChange={setPriority}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-foreground-muted mt-2">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                      <span>Critical</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Your Email (optional)</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Get updates on your idea's progress"
                      className="bg-input-background"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="updates"
                      checked={isSubscribeUpdates}
                      onCheckedChange={setIsSubscribeUpdates}
                    />
                    <label htmlFor="updates" className="text-sm">
                      Subscribe to product updates and feature announcements
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Idea
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-foreground-muted text-center">
                    By submitting, you agree that your idea may be used to improve our products. 
                    Ideas become part of our community feedback.
                  </p>
                </form>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass p-6">
                <h3 className="mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  {categories.slice(0, 4).map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => setCategory(cat.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {cat.count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Recent Ideas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass p-6">
                <h3 className="mb-4">Recent Community Ideas</h3>
                <div className="space-y-4">
                  {recentIdeas.map((idea, index) => (
                    <div key={index} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium line-clamp-1">{idea.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ml-2 ${
                            idea.status === 'In Progress' ? 'border-green-300 text-green-700 dark:text-green-400' :
                            idea.status === 'Under Review' ? 'border-yellow-300 text-yellow-700 dark:text-yellow-400' :
                            'border-blue-300 text-blue-700 dark:text-blue-400'
                          }`}
                        >
                          {idea.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground-muted mb-2 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground-muted">{idea.category}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" />
                          <span className="text-xs">{idea.votes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass p-6">
                <h3 className="mb-4">💡 Tips for Great Ideas</h3>
                <div className="space-y-3 text-sm text-foreground-muted">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Be specific about the problem you're trying to solve</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Include real use cases and examples</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Explain the expected impact on users</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Check if similar ideas have been submitted</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}