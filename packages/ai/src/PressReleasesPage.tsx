"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, User, ArrowRight, Search, Filter, Eye, Share2, Download,
  ExternalLink, Clock, Tag, ChevronRight, Star, TrendingUp, Zap,
  Building2, Award, Globe, Users, Target, Megaphone, FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface PressReleasesPageProps {
  navigate: (page: string) => void;
}

interface PressRelease {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  views: number;
  featured?: boolean;
  urgent?: boolean;
  image?: string;
}

const pressReleases: PressRelease[] = [
  {
    id: "1",
    title: "Delibix Raises $2.5M Series A to Democratize AI for Indonesian SMEs",
    excerpt: "Leading AI consulting firm secures funding from Google Cloud and Techstars to expand operations across Southeast Asia and develop innovative AI solutions for small and medium enterprises.",
    content: "Delibix, Indonesia's premier AI-native digital consulting company, today announced the successful completion of its $2.5 million Series A funding round...",
    publishDate: "2024-03-15",
    category: "Funding",
    tags: ["funding", "series-a", "expansion", "sme", "southeast-asia"],
    author: "Corporate Communications",
    readTime: "4 min read",
    views: 2340,
    featured: true,
    urgent: true
  },
  {
    id: "2",
    title: "Delibix Launches AI Playground: Revolutionary Platform for Business AI Experimentation",
    excerpt: "New interactive platform allows businesses to test AI capabilities without technical expertise, featuring 25+ pre-built models and real-time ROI calculations.",
    content: "Today, Delibix unveiled its groundbreaking AI Playground platform, designed to make artificial intelligence accessible to businesses of all sizes...",
    publishDate: "2024-03-10",
    category: "Product Launch",
    tags: ["ai-playground", "product-launch", "innovation", "accessibility"],
    author: "Product Team",
    readTime: "3 min read",
    views: 1890,
    featured: true
  },
  {
    id: "3",
    title: "Partnership Announcement: Delibix and Universitas Gadjah Mada Launch AI Research Initiative",
    excerpt: "Strategic partnership aims to advance AI research in Indonesia and develop next-generation AI solutions for local industries and government sectors.",
    content: "Delibix is proud to announce a strategic research partnership with Universitas Gadjah Mada (UGM), Indonesia's leading university...",
    publishDate: "2024-03-05",
    category: "Partnership",
    tags: ["ugm", "research", "partnership", "education", "indonesia"],
    author: "Strategic Partnerships",
    readTime: "5 min read",
    views: 1456
  },
  {
    id: "4",
    title: "Delibix Achieves 99% Client Satisfaction Rate, Completes 25+ AI Implementation Projects",
    excerpt: "Company milestone highlights exceptional service delivery and successful AI transformations across healthcare, manufacturing, and e-commerce sectors.",
    content: "Delibix today announced significant operational milestones, including a 99% client satisfaction rate and the successful completion of over 25 AI implementation projects...",
    publishDate: "2024-02-28",
    category: "Milestone",
    tags: ["milestone", "client-satisfaction", "projects", "success"],
    author: "Operations Team",
    readTime: "3 min read",
    views: 1234,
    featured: true
  },
  {
    id: "5",
    title: "Delibix Expands Team with Senior AI Engineers from Google and Microsoft",
    excerpt: "Strategic hiring initiative brings world-class talent to strengthen technical capabilities and accelerate product development roadmap.",
    content: "Delibix continues its rapid growth trajectory with the addition of senior AI engineers from leading technology companies...",
    publishDate: "2024-02-20",
    category: "Team",
    tags: ["hiring", "team-expansion", "talent", "growth"],
    author: "Human Resources",
    readTime: "2 min read",
    views: 987
  },
  {
    id: "6",
    title: "Delibix Wins 'AI Innovation of the Year' at Indonesia Tech Awards 2024",
    excerpt: "Recognition for groundbreaking work in making AI accessible to Indonesian businesses and contribution to the country's digital transformation.",
    content: "We are honored to announce that Delibix has been awarded 'AI Innovation of the Year' at the prestigious Indonesia Tech Awards 2024...",
    publishDate: "2024-02-15",
    category: "Award",
    tags: ["award", "recognition", "innovation", "indonesia-tech-awards"],
    author: "Marketing Team",
    readTime: "2 min read",
    views: 1678,
    featured: true
  }
];

const categories = [
  { id: "all", name: "All Categories", count: pressReleases.length },
  { id: "Funding", name: "Funding & Investment", count: 1 },
  { id: "Product Launch", name: "Product Launches", count: 1 },
  { id: "Partnership", name: "Partnerships", count: 1 },
  { id: "Milestone", name: "Company Milestones", count: 1 },
  { id: "Team", name: "Team & Hiring", count: 1 },
  { id: "Award", name: "Awards & Recognition", count: 1 }
];

const pressStats = [
  { label: "Press Releases", value: "24", change: "+6 this quarter" },
  { label: "Media Mentions", value: "156", change: "+45% growth" },
  { label: "Media Reach", value: "2.3M", change: "People reached" },
  { label: "Coverage Score", value: "94%", change: "Positive sentiment" }
];

export function PressReleasesPage({ navigate }: PressReleasesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredReleases = pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || release.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Funding": return TrendingUp;
      case "Product Launch": return Zap;
      case "Partnership": return Users;
      case "Milestone": return Target;
      case "Team": return User;
      case "Award": return Award;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Press Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Megaphone, FileText, Globe, Award, TrendingUp, Building2];
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
              <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Latest Company News
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
                Press <span className="gradient-text-blue">Releases</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Latest announcements, milestones, and company news from Delibix. Stay informed about our journey in democratizing AI technology.
              </motion.p>
            </div>

            {/* Press Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {pressStats.map((stat, index) => (
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
                onClick={() => document.getElementById('releases')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Read Latest News
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => navigate('press-media-kit')}
              >
                Media Kit
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
                  placeholder="Search press releases..."
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
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Press Release */}
        {filteredReleases.length > 0 && filteredReleases[0].featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-center mb-8">Featured Announcement</h2>
            
            <Card className="glass p-8 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    {filteredReleases[0].urgent && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        URGENT
                      </Badge>
                    )}
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      FEATURED
                    </Badge>
                    <Badge variant="outline">{filteredReleases[0].category}</Badge>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    {filteredReleases[0].title}
                  </h3>
                  
                  <p className="text-lg text-foreground-muted mb-6 leading-relaxed">
                    {filteredReleases[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-foreground-muted mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(filteredReleases[0].publishDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{filteredReleases[0].author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{filteredReleases[0].readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{filteredReleases[0].views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    {filteredReleases[0].tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Read Full Release
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Press Releases Grid */}
        <motion.div
          id="releases"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2>All Press Releases</h2>
            <span className="text-sm text-foreground-muted">
              {filteredReleases.length} releases found
            </span>
          </div>
          
          <div className="grid gap-6">
            {filteredReleases.slice(1).map((release, index) => {
              const CategoryIcon = getCategoryIcon(release.category);
              return (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {release.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Featured
                            </Badge>
                          )}
                          <Badge variant="outline">{release.category}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                          {release.title}
                        </h3>
                        
                        <p className="text-foreground-muted mb-4 line-clamp-2">
                          {release.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-foreground-muted mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(release.publishDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{release.readTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{release.views.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {release.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {release.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{release.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground-muted">
                            By {release.author}
                          </span>
                          <ChevronRight className="w-5 h-5 text-foreground-muted" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Media Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass p-8 text-center">
            <h3 className="mb-6">Media Inquiries</h3>
            <p className="text-lg text-foreground-muted mb-8">
              For media inquiries, interview requests, or additional information about Delibix, please contact our press team.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <h4 className="mb-2">Press Contact</h4>
                <p className="text-foreground-muted mb-1">Sarah Chen</p>
                <p className="text-foreground-muted mb-1">Head of Communications</p>
                <p className="text-blue-600 dark:text-blue-400">press@delibix.com</p>
                <p className="text-foreground-muted">+62 857 7002 4933</p>
              </div>
              
              <div className="text-center">
                <h4 className="mb-2">Partnership Inquiries</h4>
                <p className="text-foreground-muted mb-1">Michael Rodriguez</p>
                <p className="text-foreground-muted mb-1">Strategic Partnerships</p>
                <p className="text-blue-600 dark:text-blue-400">partnerships@delibix.com</p>
                <p className="text-foreground-muted">+62 857 7002 4934</p>
              </div>
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={() => navigate('press-media-kit')}
                className="gradient-bg-blue text-white px-8 py-3"
              >
                Download Media Kit
                <Download className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}