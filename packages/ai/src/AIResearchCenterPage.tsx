"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Microscope, 
  FileText, 
  Download, 
  Calendar,
  Users,
  TrendingUp,
  Brain,
  Database,
  Atom,
  Lightbulb,
  Target,
  Award,
  ExternalLink,
  Search,
  Filter,
  BookOpen,
  Quote,
  Globe,
  ChevronRight,
  Star,
  Clock,
  Eye,
  Share2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AIResearchCenterPageProps {
  navigate: (page: string) => void;
}

export function AIResearchCenterPage({ navigate }: AIResearchCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const researchCategories = [
    { id: "all", label: "All Research", count: 156 },
    { id: "generative-ai", label: "Generative AI", count: 42 },
    { id: "machine-learning", label: "Machine Learning", count: 38 },
    { id: "ai-ethics", label: "AI Ethics", count: 24 },
    { id: "computer-vision", label: "Computer Vision", count: 28 },
    { id: "nlp", label: "Natural Language Processing", count: 34 },
    { id: "robotics", label: "Robotics & Automation", count: 18 },
    { id: "quantum-ai", label: "Quantum AI", count: 12 }
  ];

  const featuredResearch = [
    {
      title: "Advances in Large Language Model Efficiency",
      authors: ["Dr. Sarah Chen", "Dr. Michael Zhang", "Prof. Lisa Wang"],
      date: "2024-06-01",
      category: "Generative AI",
      abstract: "This paper presents novel techniques for improving the computational efficiency of large language models while maintaining performance quality...",
      downloads: 2847,
      citations: 156,
      impact: "High",
      type: "Journal Article",
      status: "Published",
      journal: "Nature Machine Intelligence"
    },
    {
      title: "Ethical Considerations in AI Decision Making Systems",
      authors: ["Dr. Priya Sharma", "Dr. John Mueller"],
      date: "2024-05-15",
      category: "AI Ethics",
      abstract: "A comprehensive analysis of ethical frameworks for AI systems in critical decision-making scenarios across healthcare, finance, and justice...",
      downloads: 1923,
      citations: 89,
      impact: "Medium",
      type: "Conference Paper",
      status: "Published",
      journal: "AAAI 2024"
    },
    {
      title: "Quantum-Enhanced Machine Learning Algorithms",
      authors: ["Dr. Ahmed Hassan", "Prof. Maria Rodriguez"],
      date: "2024-05-01",
      category: "Quantum AI",
      abstract: "Investigation into hybrid quantum-classical algorithms that demonstrate significant speedup for specific machine learning tasks...",
      downloads: 1456,
      citations: 67,
      impact: "High",
      type: "Preprint",
      status: "Under Review",
      journal: "arXiv"
    },
    {
      title: "Real-time Computer Vision for Industrial Automation",
      authors: ["Dr. Thomas Kim", "Dr. Elena Petrov", "Dr. Raj Patel"],
      date: "2024-04-20",
      category: "Computer Vision",
      abstract: "Development of edge-optimized computer vision models for real-time quality control in manufacturing environments...",
      downloads: 2156,
      citations: 112,
      impact: "Medium",
      type: "Journal Article",
      status: "Published",
      journal: "IEEE Transactions on Industrial Informatics"
    }
  ];

  const researchStats = [
    { label: "Published Papers", value: "450+", icon: FileText },
    { label: "Total Citations", value: "12,500+", icon: Quote },
    { label: "Research Partners", value: "85+", icon: Users },
    { label: "H-Index", value: "87", icon: TrendingUp }
  ];

  const collaborations = [
    {
      name: "Stanford AI Lab",
      type: "University",
      projects: 8,
      duration: "2020-2024",
      focus: "Generative AI, Ethics"
    },
    {
      name: "MIT CSAIL",
      type: "University", 
      projects: 6,
      duration: "2021-2024",
      focus: "Quantum Computing, ML"
    },
    {
      name: "Google DeepMind",
      type: "Industry",
      projects: 4,
      duration: "2022-2024",
      focus: "Large Language Models"
    },
    {
      name: "OpenAI",
      type: "Industry",
      projects: 3,
      duration: "2023-2024",
      focus: "AGI Safety, Alignment"
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "Medium": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "Low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Under Review": return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "In Progress": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-400/35 dark:bg-blue-400/25 rounded-full blur-md float-delayed-2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12"
            >
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="glass p-4 rounded-2xl glow-blue-light dust-container">
                  <Microscope className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">AI Research</span>{' '}
                <span className="gradient-text-blue-light">Center</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Advancing the frontiers of artificial intelligence through cutting-edge research, publications, and global collaborations.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {researchStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-xs text-foreground-muted">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative glass p-2 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-foreground-muted ml-3" />
                  <Input
                    placeholder="Search research papers, authors, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent focus:ring-0 text-lg"
                  />
                  <Button size="sm" className="gradient-bg-blue text-white">
                    Search
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="publications" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="projects">Research Projects</TabsTrigger>
            <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
            <TabsTrigger value="impact">Research Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="publications" className="space-y-8 mt-8">
            {/* Filters */}
            <Card className="glass w-full">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filter by:</span>
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {researchCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="citations">Most Cited</SelectItem>
                      <SelectItem value="downloads">Most Downloaded</SelectItem>
                      <SelectItem value="impact">Highest Impact</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2">
                    {researchCategories.slice(1, 5).map((category) => (
                      <Badge 
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Publications */}
            <div className="space-y-6">
              {featuredResearch.map((paper, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(paper.status)}>
                              {paper.status}
                            </Badge>
                            <Badge variant="outline">{paper.type}</Badge>
                            <Badge className={getImpactColor(paper.impact)}>
                              {paper.impact} Impact
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                            {paper.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-foreground-muted mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(paper.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              <span>{paper.journal}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {paper.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium">Authors:</span>
                            <div className="flex flex-wrap gap-2">
                              {paper.authors.map((author, authorIndex) => (
                                <span key={authorIndex} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                  {author}
                                  {authorIndex < paper.authors.length - 1 && ","}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <p className="text-foreground-muted mb-4">{paper.abstract}</p>
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{paper.downloads.toLocaleString()} downloads</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Quote className="w-3 h-3" />
                              <span>{paper.citations} citations</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>Views</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Publications
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 mt-8">
            {/* Research Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Next-Generation Language Models",
                  status: "Active",
                  timeline: "2023-2025",
                  funding: "$2.5M",
                  team: 12,
                  description: "Developing more efficient and aligned language models with reduced computational requirements.",
                  partners: ["Stanford University", "Google AI"],
                  publications: 8
                },
                {
                  title: "Ethical AI Framework Development",
                  status: "Active", 
                  timeline: "2024-2026",
                  funding: "$1.8M",
                  team: 8,
                  description: "Creating comprehensive frameworks for ethical AI development and deployment.",
                  partners: ["MIT", "Partnership on AI"],
                  publications: 5
                },
                {
                  title: "Quantum-Classical Hybrid Learning",
                  status: "Planning",
                  timeline: "2024-2027",
                  funding: "$3.2M",
                  team: 15,
                  description: "Exploring quantum advantages in machine learning algorithms for specific problem domains.",
                  partners: ["IBM Quantum", "University of Oxford"],
                  publications: 2
                },
                {
                  title: "Automated Scientific Discovery",
                  status: "Completed",
                  timeline: "2022-2024",
                  funding: "$1.9M",
                  team: 10,
                  description: "AI systems that can autonomously generate and test scientific hypotheses.",
                  partners: ["Allen Institute", "Nature Research"],
                  publications: 12
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy h-full card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-foreground-muted">{project.timeline}</span>
                          </div>
                        </div>
                        <Badge variant="outline">{project.funding}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground-muted mb-4">{project.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{project.team} team members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3" />
                          <span>{project.publications} publications</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground-muted">Research Partners:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.partners.map((partner, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {partner}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Project Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6 mt-8">
            {/* Research Collaborations */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Global Research Partnerships
                </CardTitle>
                <CardDescription>
                  Our collaborative research network spans leading universities and industry partners worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collaborations.map((collab, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-blue-light p-6 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{collab.name}</h3>
                          <Badge variant="outline" className="mt-1">{collab.type}</Badge>
                        </div>
                        <div className="text-right text-sm text-foreground-muted">
                          <div>{collab.duration}</div>
                          <div>{collab.projects} projects</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-foreground-muted mb-4">
                        Focus areas: {collab.focus}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-3 h-3" />
                          <span>Active collaboration</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partnership Map Placeholder */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Global Partnership Network</CardTitle>
                <CardDescription>Interactive map of our research collaborations worldwide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-700 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-foreground-muted">Interactive Partnership Map</p>
                    <p className="text-sm text-foreground-muted">Explore our global research network</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6 mt-8">
            {/* Research Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass text-center">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">87</div>
                  <div className="text-sm text-foreground-muted">H-Index Score</div>
                  <div className="text-xs text-foreground-muted mt-1">Top 1% globally</div>
                </CardContent>
              </Card>
              
              <Card className="glass text-center">
                <CardContent className="p-6">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-green-600 mb-2">12.5K</div>
                  <div className="text-sm text-foreground-muted">Total Citations</div>
                  <div className="text-xs text-foreground-muted mt-1">+25% this year</div>
                </CardContent>
              </Card>
              
              <Card className="glass text-center">
                <CardContent className="p-6">
                  <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-yellow-600 mb-2">156</div>
                  <div className="text-sm text-foreground-muted">Publications</div>
                  <div className="text-xs text-foreground-muted mt-1">42 this year</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Awards and Recognition */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Awards & Recognition
                </CardTitle>
                <CardDescription>Recent achievements and accolades from the research community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Best Paper Award - ICML 2024",
                      description: "Outstanding contribution to machine learning theory",
                      date: "June 2024",
                      type: "Conference Award"
                    },
                    {
                      title: "AI Ethics Excellence Award",
                      description: "Recognition for leadership in responsible AI development",
                      date: "May 2024",
                      type: "Industry Award"
                    },
                    {
                      title: "Nature Research Spotlight",
                      description: "Featured research on quantum machine learning",
                      date: "April 2024",
                      type: "Publication"
                    },
                    {
                      title: "Young Researcher Award",
                      description: "Dr. Sarah Chen recognized for breakthrough research",
                      date: "March 2024",
                      type: "Individual Award"
                    }
                  ].map((award, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 glass-blue-light rounded-lg">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{award.title}</h3>
                          <Badge variant="outline" className="text-xs">{award.type}</Badge>
                        </div>
                        <p className="text-sm text-foreground-muted mb-2">{award.description}</p>
                        <div className="flex items-center gap-1 text-xs text-foreground-muted">
                          <Calendar className="w-3 h-3" />
                          <span>{award.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Collaborate with Our Research Team
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Join our research initiatives or propose collaborative projects to advance AI science together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('contact')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Join Research
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('whitepapers')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Download Papers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}