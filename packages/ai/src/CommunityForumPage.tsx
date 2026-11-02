"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, Users, Search, TrendingUp, Star, Clock, ArrowRight,
  ChevronRight, Filter, Pin, MessageCircle, ThumbsUp, Eye, Tag,
  Calendar, User, Plus, Bell, Settings, Hash, CheckCircle, Crown
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CommunityForumPageProps {
  navigate: (page: string) => void;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  topics: number;
  posts: number;
  lastActivity: string;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  lastReply: string;
  isPinned?: boolean;
  isAnswered?: boolean;
  tags: string[];
  userType: 'member' | 'expert' | 'moderator' | 'admin';
}

const categories: ForumCategory[] = [
  {
    id: "general",
    name: "General Discussion",
    description: "Open discussions about AI, technology, and industry trends",
    icon: MessageSquare,
    color: "blue",
    topics: 1247,
    posts: 8934,
    lastActivity: "2 minutes ago"
  },
  {
    id: "ai-implementation",
    name: "AI Implementation",
    description: "Technical discussions about implementing AI solutions",
    icon: Settings,
    color: "green",
    topics: 892,
    posts: 5621,
    lastActivity: "5 minutes ago"
  },
  {
    id: "help-support",
    name: "Help & Support",
    description: "Get help with Delibix products and services",
    icon: CheckCircle,
    color: "orange",
    topics: 634,
    posts: 3847,
    lastActivity: "8 minutes ago"
  },
  {
    id: "showcase",
    name: "Project Showcase",
    description: "Share your AI projects and success stories",
    icon: Star,
    color: "purple",
    topics: 445,
    posts: 2156,
    lastActivity: "12 minutes ago"
  },
  {
    id: "announcements",
    name: "Announcements",
    description: "Official updates and announcements from Delibix",
    icon: Bell,
    color: "red",
    topics: 67,
    posts: 234,
    lastActivity: "1 hour ago"
  },
  {
    id: "feedback",
    name: "Product Feedback",
    description: "Share feedback and feature requests",
    icon: TrendingUp,
    color: "yellow",
    topics: 356,
    posts: 1789,
    lastActivity: "15 minutes ago"
  }
];

const recentPosts: ForumPost[] = [
  {
    id: "1",
    title: "Best practices for implementing AI in manufacturing?",
    author: "Sarah Chen",
    avatar: "SC",
    category: "AI Implementation",
    content: "Looking for advice on implementing predictive maintenance AI in our manufacturing setup. What are the key considerations and potential pitfalls to avoid?",
    replies: 23,
    views: 456,
    likes: 18,
    lastReply: "3 minutes ago",
    isPinned: true,
    isAnswered: true,
    tags: ["manufacturing", "predictive-maintenance", "implementation"],
    userType: "expert"
  },
  {
    id: "2",
    title: "ROI Calculator results interpretation",
    author: "Mike Johnson",
    avatar: "MJ",
    category: "Help & Support",
    content: "I've run the AI ROI calculator for our e-commerce business, but I'm having trouble interpreting some of the metrics. Can someone help explain the projected automation savings?",
    replies: 12,
    views: 234,
    likes: 8,
    lastReply: "8 minutes ago",
    tags: ["roi-calculator", "e-commerce", "metrics"],
    userType: "member"
  },
  {
    id: "3",
    title: "Successful chatbot implementation - 300% efficiency gain!",
    author: "Lisa Wang",
    avatar: "LW",
    category: "Project Showcase",
    content: "Wanted to share our incredible results after implementing an AI chatbot using Delibix's solutions. We achieved a 300% improvement in customer service efficiency.",
    replies: 34,
    views: 892,
    likes: 67,
    lastReply: "12 minutes ago",
    tags: ["chatbot", "success-story", "customer-service"],
    userType: "expert"
  },
  {
    id: "4",
    title: "New AI Playground features released!",
    author: "Delibix Team",
    avatar: "DT",
    category: "Announcements",
    content: "We're excited to announce new features in our AI Playground, including advanced model fine-tuning capabilities and improved collaboration tools.",
    replies: 45,
    views: 1234,
    likes: 89,
    lastReply: "25 minutes ago",
    isPinned: true,
    tags: ["ai-playground", "new-features", "announcement"],
    userType: "admin"
  },
  {
    id: "5",
    title: "Feature request: Multi-language support for documentation",
    author: "Ahmed Hassan",
    avatar: "AH",
    category: "Product Feedback",
    content: "Would love to see documentation translated into more languages, especially Arabic and Spanish for our international team.",
    replies: 19,
    views: 345,
    likes: 24,
    lastReply: "18 minutes ago",
    tags: ["documentation", "localization", "feature-request"],
    userType: "member"
  }
];

const communityStats = [
  { label: "Active Members", value: "15.2K", change: "+12%" },
  { label: "Total Posts", value: "23.4K", change: "+8%" },
  { label: "Topics Discussed", value: "3.6K", change: "+15%" },
  { label: "Expert Contributors", value: "234", change: "+5%" }
];

export function CommunityForumPage({ navigate }: CommunityForumPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'moderator': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'expert': return <Star className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'admin': return <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Admin</Badge>;
      case 'moderator': return <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Moderator</Badge>;
      case 'expert': return <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Expert</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Forum Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [MessageSquare, Users, Star, TrendingUp, Hash, Bell];
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
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                15.2K+ Active Members
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
                Community <span className="gradient-text-blue">Forum</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Connect with AI professionals, share knowledge, get help, and discuss the latest trends in artificial intelligence and automation.
              </motion.p>
            </div>

            {/* Community Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {communityStats.map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center border-blue-200/50 dark:border-blue-400/20">
                  <div className="text-2xl md:text-3xl font-bold gradient-text-blue mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">{stat.label}</div>
                  <Badge variant="secondary" className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30">
                    {stat.change} this month
                  </Badge>
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
                  <Plus className="w-5 h-5" />
                  Join Discussion
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('recent-posts')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Topics
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search discussions, topics, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-input-background">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-32 bg-input-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="replies">Most Replies</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Forum Categories */}
        <motion.div
          id="categories"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-center mb-12">Discussion Categories</h2>
          
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
                        
                        <div className="flex items-center justify-between text-xs text-foreground-muted">
                          <div className="flex items-center gap-4">
                            <span>{category.topics} topics</span>
                            <span>{category.posts} posts</span>
                          </div>
                          <span>{category.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Posts */}
        <motion.div
          id="recent-posts"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2>Recent Discussions</h2>
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="glass p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {post.avatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {post.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                          <h3 className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1">
                            {post.title}
                          </h3>
                          {post.isAnswered && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium">{post.author}</span>
                        {getUserTypeIcon(post.userType)}
                        {getUserTypeBadge(post.userType)}
                        <span className="text-xs text-foreground-muted">·</span>
                        <span className="text-xs text-foreground-muted">{post.lastReply}</span>
                      </div>
                      
                      <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                        {post.content}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-xs text-foreground-muted">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                        </div>
                        
                        <ChevronRight className="w-4 h-4 text-foreground-muted" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950">
              Load More Posts
            </Button>
          </div>
        </motion.div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass p-8">
            <h3 className="mb-6 text-center">Community Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="mb-4 text-green-600 dark:text-green-400">✅ Do's</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Be respectful and professional in all interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Search before posting to avoid duplicates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use clear, descriptive titles for your posts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Share knowledge and help others learn</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 text-red-600 dark:text-red-400">❌ Don'ts</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <span>Post spam, promotional content, or off-topic discussions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <span>Share confidential or proprietary information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <span>Use offensive language or engage in personal attacks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0">×</span>
                    <span>Post duplicate questions without searching first</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}