"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, ExternalLink, ArrowRight, Search, Filter, Eye, Share2,
  Star, TrendingUp, Globe, Newspaper, Radio, Video, Mic, Award,
  Building2, Users, Target, ThumbsUp, BookOpen, Clock, Tag
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MediaCoveragePageProps {
  navigate: (page: string) => void;
}

interface MediaMention {
  id: string;
  title: string;
  excerpt: string;
  publication: string;
  author: string;
  publishDate: string;
  type: 'article' | 'interview' | 'podcast' | 'video' | 'award';
  readTime?: string;
  url: string;
  featured?: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  tags: string[];
  reach?: number;
  logo?: string;
}

const mediaMentions: MediaMention[] = [
  {
    id: "1",
    title: "How Delibix is Revolutionizing AI Adoption in Indonesia's SME Sector",
    excerpt: "A comprehensive look at how this Yogyakarta-based startup is making artificial intelligence accessible to small and medium enterprises across Indonesia, with impressive results showing 300% efficiency gains.",
    publication: "TechCrunch",
    author: "Sarah Kim",
    publishDate: "2024-03-18",
    type: "article",
    readTime: "8 min read",
    url: "https://techcrunch.com/delibix-ai-indonesia",
    featured: true,
    sentiment: "positive",
    tags: ["ai", "indonesia", "sme", "startup", "innovation"],
    reach: 2300000
  },
  {
    id: "2",
    title: "AI for All: Delibix CEO Discusses Democratizing Artificial Intelligence",
    excerpt: "In this exclusive interview, Delibix's founding team shares their vision for making AI accessible to businesses of all sizes and their journey from university research to successful startup.",
    publication: "Forbes Indonesia",
    author: "Michael Chen",
    publishDate: "2024-03-15",
    type: "interview",
    readTime: "12 min read",
    url: "https://forbes.com/delibix-interview",
    featured: true,
    sentiment: "positive",
    tags: ["interview", "ceo", "vision", "accessibility", "forbes"],
    reach: 1800000
  },
  {
    id: "3",
    title: "The Rise of Indonesian AI Startups: Delibix Leading the Charge",
    excerpt: "Southeast Asia's AI ecosystem is booming, and Indonesian companies like Delibix are at the forefront of this technological revolution, attracting international attention and investment.",
    publication: "Wired",
    author: "Lisa Rodriguez",
    publishDate: "2024-03-12",
    type: "article",
    readTime: "6 min read",
    url: "https://wired.com/indonesian-ai-startups",
    sentiment: "positive",
    tags: ["startup-ecosystem", "southeast-asia", "investment", "wired"],
    reach: 1500000
  },
  {
    id: "4",
    title: "Building the Future of AI: A Conversation with Delibix",
    excerpt: "Join us for an in-depth discussion about the challenges and opportunities in AI consulting, the importance of ethical AI development, and what's next for the industry.",
    publication: "AI Podcast Network",
    author: "David Park",
    publishDate: "2024-03-08",
    type: "podcast",
    readTime: "45 min listen",
    url: "https://aipodcast.com/delibix-episode",
    sentiment: "positive",
    tags: ["podcast", "ai-ethics", "consulting", "future"],
    reach: 450000
  },
  {
    id: "5",
    title: "Delibix Wins 'AI Innovation of the Year' at Indonesia Tech Awards",
    excerpt: "The Yogyakarta-based AI consulting firm was recognized for its groundbreaking work in making artificial intelligence accessible to Indonesian businesses and its contribution to the country's digital transformation.",
    publication: "Jakarta Post",
    author: "Amanda Sari",
    publishDate: "2024-02-16",
    type: "award",
    readTime: "4 min read",
    url: "https://jakartapost.com/delibix-award",
    featured: true,
    sentiment: "positive",
    tags: ["award", "recognition", "indonesia-tech-awards", "innovation"],
    reach: 890000
  },
  {
    id: "6",
    title: "From University to Unicorn: The Delibix Story",
    excerpt: "A detailed look at how a university research project evolved into one of Indonesia's most promising AI startups, with insights from the founding team and early investors.",
    publication: "Startup Indonesia",
    author: "Rizki Pratama",
    publishDate: "2024-02-10",
    type: "article",
    readTime: "10 min read",
    url: "https://startupindonesia.com/delibix-story",
    sentiment: "positive",
    tags: ["origin-story", "university", "research", "startup-journey"],
    reach: 320000
  },
  {
    id: "7",
    title: "The Future of Work in Indonesia: AI's Role in Business Transformation",
    excerpt: "Industry experts, including Delibix's leadership team, discuss how artificial intelligence is reshaping the Indonesian business landscape and what companies need to know.",
    publication: "CNN Indonesia",
    author: "Budi Santoso",
    publishDate: "2024-02-05",
    type: "video",
    readTime: "15 min watch",
    url: "https://cnn.id/delibix-future-work",
    sentiment: "positive",
    tags: ["future-of-work", "business-transformation", "cnn", "video"],
    reach: 1200000
  },
  {
    id: "8",
    title: "Tech Talk: AI Accessibility and the Indonesian Market",
    excerpt: "Radio interview with Delibix's product team discussing the challenges of building AI solutions for the Indonesian market and the importance of local language support.",
    publication: "Radio Republik Indonesia",
    author: "Siti Nurhaliza",
    publishDate: "2024-01-28",
    type: "interview",
    readTime: "20 min listen",
    url: "https://rri.co.id/delibix-interview",
    sentiment: "positive",
    tags: ["radio", "product", "localization", "indonesian-market"],
    reach: 680000
  }
];

const publications = [
  { name: "TechCrunch", reach: "25M+ monthly readers" },
  { name: "Forbes Indonesia", reach: "18M+ monthly readers" },
  { name: "Wired", reach: "15M+ monthly readers" },
  { name: "Jakarta Post", reach: "8M+ monthly readers" },
  { name: "CNN Indonesia", reach: "12M+ monthly viewers" },
  { name: "AI Podcast Network", reach: "2M+ monthly listeners" }
];

const mediaStats = [
  { label: "Media Mentions", value: "156", change: "+45% this quarter" },
  { label: "Total Reach", value: "8.2M", change: "People reached" },
  { label: "Positive Coverage", value: "94%", change: "Sentiment score" },
  { label: "Publications", value: "67", change: "Media outlets" }
];

export function MediaCoveragePage({ navigate }: MediaCoveragePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSentiment, setSelectedSentiment] = useState("all");

  const filteredMentions = mediaMentions.filter(mention => {
    const matchesSearch = mention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mention.publication.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mention.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === "all" || mention.type === selectedType;
    const matchesSentiment = selectedSentiment === "all" || mention.sentiment === selectedSentiment;
    
    return matchesSearch && matchesType && matchesSentiment;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return Newspaper;
      case "interview": return Mic;
      case "podcast": return Radio;
      case "video": return Video;
      case "award": return Award;
      default: return BookOpen;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "neutral": return "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400";
      case "negative": return "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400";
      default: return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Media Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Newspaper, Radio, Video, Mic, Globe, TrendingUp];
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
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                156 Media Mentions
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
                Media <span className="gradient-text-blue">Coverage</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Discover how leading media outlets are covering Delibix's journey in democratizing AI technology and transforming businesses across Indonesia.
              </motion.p>
            </div>

            {/* Media Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {mediaStats.map((stat, index) => (
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
                onClick={() => document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="flex items-center gap-3">
                  Explore Coverage
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => navigate('press-releases')}
              >
                Press Releases
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
                  placeholder="Search media coverage..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 text-lg py-6 bg-input-background"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="interview">Interviews</SelectItem>
                    <SelectItem value="podcast">Podcasts</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="award">Awards</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                  <SelectTrigger className="bg-input-background">
                    <SelectValue placeholder="All Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Featured Coverage */}
        {filteredMentions.length > 0 && filteredMentions[0].featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-center mb-8">Featured Coverage</h2>
            
            <Card className="glass p-8 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      FEATURED
                    </Badge>
                    <Badge className={getSentimentColor(filteredMentions[0].sentiment)}>
                      {filteredMentions[0].sentiment.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{filteredMentions[0].type}</Badge>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                    {filteredMentions[0].title}
                  </h3>
                  
                  <p className="text-lg text-foreground-muted mb-6 leading-relaxed">
                    {filteredMentions[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-foreground-muted mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{filteredMentions[0].publication}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(filteredMentions[0].publishDate).toLocaleDateString()}</span>
                      </div>
                      {filteredMentions[0].readTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{filteredMentions[0].readTime}</span>
                        </div>
                      )}
                      {filteredMentions[0].reach && (
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{(filteredMentions[0].reach / 1000000).toFixed(1)}M reach</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    {filteredMentions[0].tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open(filteredMentions[0].url, '_blank')}
                    >
                      Read Article
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Media Coverage Grid */}
        <motion.div
          id="coverage"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2>All Media Coverage</h2>
            <span className="text-sm text-foreground-muted">
              {filteredMentions.length} mentions found
            </span>
          </div>
          
          <div className="grid gap-6">
            {filteredMentions.slice(1).map((mention, index) => {
              const TypeIcon = getTypeIcon(mention.type);
              return (
                <motion.div
                  key={mention.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-start gap-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {mention.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              Featured
                            </Badge>
                          )}
                          <Badge className={getSentimentColor(mention.sentiment)}>
                            {mention.sentiment}
                          </Badge>
                          <Badge variant="outline">{mention.type}</Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                          {mention.title}
                        </h3>
                        
                        <p className="text-foreground-muted mb-4 line-clamp-2">
                          {mention.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-foreground-muted mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span className="font-medium">{mention.publication}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(mention.publishDate).toLocaleDateString()}</span>
                            </div>
                            {mention.readTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{mention.readTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          {mention.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {mention.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{mention.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-foreground-muted">
                              By {mention.author}
                            </span>
                            {mention.reach && (
                              <span className="text-sm text-foreground-muted">
                                {(mention.reach / 1000000).toFixed(1)}M reach
                              </span>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(mention.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-center mb-12">Featured In</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((publication, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass p-6 text-center hover:shadow-lg transition-all duration-300">
                  <h3 className="mb-2">{publication.name}</h3>
                  <p className="text-sm text-foreground-muted">{publication.reach}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact for Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass p-8 text-center">
            <h3 className="mb-6">Want to Feature Delibix?</h3>
            <p className="text-lg text-foreground-muted mb-8">
              We're always happy to speak with journalists and content creators. Get in touch for interviews, expert commentary, or company information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('mailto:press@delibix.com', '_blank')}
                className="gradient-bg-blue text-white px-8 py-3"
              >
                Contact Press Team
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('press-media-kit')}
              >
                Download Media Kit
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}