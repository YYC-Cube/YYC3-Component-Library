"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, FileText, Image, Video, Archive, Copy, Check, Mail,
  Phone, Globe, MapPin, Calendar, User, Building2, Award, Target,
  Zap, Users, TrendingUp, Star, ArrowRight, ExternalLink, Package,
  Camera, Palette, BookOpen, Shield, Info, Briefcase
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface PressMediaKitPageProps {
  navigate: (page: string) => void;
}

interface Asset {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'document' | 'video' | 'archive';
  format: string;
  size: string;
  lastUpdated: string;
  downloadUrl: string;
  previewUrl?: string;
  category: string;
}

const assets: Asset[] = [
  {
    id: "1",
    name: "Delibix Logo Package",
    description: "Complete logo package including PNG, SVG, and vector formats in various color schemes",
    type: "archive",
    format: "ZIP",
    size: "2.4 MB",
    lastUpdated: "2024-03-15",
    downloadUrl: "/media-kit/delibix-logo-package.zip",
    category: "Logo & Branding"
  },
  {
    id: "2",
    name: "Company Fact Sheet",
    description: "Official company information, statistics, and key facts about Delibix",
    type: "document",
    format: "PDF",
    size: "1.2 MB",
    lastUpdated: "2024-03-18",
    downloadUrl: "/media-kit/delibix-fact-sheet.pdf",
    category: "Company Information"
  },
  {
    id: "3",
    name: "Executive Team Photos",
    description: "High-resolution professional photos of Delibix leadership team",
    type: "archive",
    format: "ZIP",
    size: "15.6 MB",
    lastUpdated: "2024-03-10",
    downloadUrl: "/media-kit/executive-photos.zip",
    category: "Photography"
  },
  {
    id: "4",
    name: "Product Screenshots",
    description: "High-quality screenshots of AI Playground and other Delibix products",
    type: "archive",
    format: "ZIP",
    size: "8.3 MB",
    lastUpdated: "2024-03-12",
    downloadUrl: "/media-kit/product-screenshots.zip",
    category: "Product Images"
  },
  {
    id: "5",
    name: "Company Presentation",
    description: "Official company overview presentation with key metrics and achievements",
    type: "document",
    format: "PDF",
    size: "4.7 MB",
    lastUpdated: "2024-03-16",
    downloadUrl: "/media-kit/company-presentation.pdf",
    category: "Company Information"
  },
  {
    id: "6",
    name: "Office & Team Photos",
    description: "Professional photos of Delibix office space and team in action",
    type: "archive",
    format: "ZIP",
    size: "12.8 MB",
    lastUpdated: "2024-03-08",
    downloadUrl: "/media-kit/office-photos.zip",
    category: "Photography"
  },
  {
    id: "7",
    name: "Brand Guidelines",
    description: "Complete brand guidelines including typography, colors, and usage instructions",
    type: "document",
    format: "PDF",
    size: "3.1 MB",
    lastUpdated: "2024-03-14",
    downloadUrl: "/media-kit/brand-guidelines.pdf",
    category: "Logo & Branding"
  },
  {
    id: "8",
    name: "Award Certificates",
    description: "Official certificates and recognition documents from industry awards",
    type: "archive",
    format: "ZIP",
    size: "5.4 MB",
    lastUpdated: "2024-02-20",
    downloadUrl: "/media-kit/award-certificates.zip",
    category: "Awards & Recognition"
  }
];

const companyInfo = {
  name: "Delibix",
  tagline: "Democratizing AI for Indonesian Businesses",
  founded: "2023",
  headquarters: "Yogyakarta, Indonesia",
  employees: "8+ team members",
  departments: "7 specialized departments",
  experience: "80+ years combined experience",
  website: "www.delibix.com",
  email: "hello@delibix.com",
  phone: "+62 857 7002 4933"
};

const keyMetrics = [
  { label: "Projects Delivered", value: "25+", description: "Successful AI implementations" },
  { label: "Client Satisfaction", value: "99%", description: "Customer satisfaction rate" },
  { label: "Companies Served", value: "100+", description: "Businesses transformed" },
  { label: "Launch Time", value: "3-28 days", description: "Typical project timeline" }
];

const executiveTeam = [
  {
    name: "Dr. Sarah Chen",
    title: "Chief Executive Officer",
    bio: "Former Google AI researcher with 10+ years in machine learning",
    education: "PhD Computer Science, Stanford University",
    email: "sarah.chen@delibix.com"
  },
  {
    name: "Michael Rodriguez",
    title: "Chief Technology Officer", 
    bio: "Ex-Microsoft engineer specializing in AI infrastructure and scalability",
    education: "MS Computer Engineering, MIT",
    email: "michael.rodriguez@delibix.com"
  },
  {
    name: "Dr. Lisa Wang",
    title: "Head of AI Research",
    bio: "Leading AI researcher with 15+ publications in top-tier conferences",
    education: "PhD Artificial Intelligence, Carnegie Mellon",
    email: "lisa.wang@delibix.com"
  }
];

const partnerships = [
  "Google Cloud Platform",
  "Techstars", 
  "Universitas Gadjah Mada",
  "Accenture",
  "AWS Partner Network",
  "Microsoft for Startups"
];

const mediaKitStats = [
  { label: "Assets Available", value: "24", change: "High-quality resources" },
  { label: "Last Updated", value: "Mar 18", change: "Always current" },
  { label: "Download Size", value: "52MB", change: "Complete package" },
  { label: "File Formats", value: "8+", change: "Multiple formats" }
];

export function PressMediaKitPage({ navigate }: PressMediaKitPageProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "image": return Image;
      case "document": return FileText;
      case "video": return Video;
      case "archive": return Archive;
      default: return FileText;
    }
  };

  const downloadAllAssets = () => {
    // In a real implementation, this would trigger a download of all assets
    console.log("Downloading all media kit assets...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Media Kit Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Package, Camera, FileText, Image, Download, Palette];
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
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                24 Media Assets
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
                Press & <span className="gradient-text-blue">Media Kit</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light text-slate-500 dark:text-slate-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Complete media resources including logos, photos, company information, and brand guidelines for journalists and content creators.
              </motion.p>
            </div>

            {/* Media Kit Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {mediaKitStats.map((stat, index) => (
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
                onClick={downloadAllAssets}
              >
                <span className="flex items-center gap-3">
                  <Download className="w-5 h-5" />
                  Download Complete Kit
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-400/30 dark:text-blue-300 dark:hover:bg-blue-400/10"
                onClick={() => document.getElementById('assets')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Assets
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="assets" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Media Assets
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company Info
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Executive Team
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Media Contact
              </TabsTrigger>
            </TabsList>

            {/* Media Assets Tab */}
            <TabsContent value="assets" id="assets">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Downloadable Media Assets</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    High-quality assets for media coverage, including logos, photos, and official documents. All assets are available for editorial use.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assets.map((asset, index) => {
                    const AssetIcon = getAssetIcon(asset.type);
                    return (
                      <motion.div
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <Card className="glass p-6 hover:shadow-lg transition-all duration-300 h-full">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AssetIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold mb-1 line-clamp-1">{asset.name}</h3>
                              <Badge variant="outline" className="text-xs mb-2">
                                {asset.category}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-foreground-muted mb-4 line-clamp-2">
                            {asset.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-foreground-muted mb-4">
                            <span>{asset.format}</span>
                            <span>{asset.size}</span>
                            <span>Updated {new Date(asset.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => console.log(`Downloading ${asset.name}`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </TabsContent>

            {/* Company Info Tab */}
            <TabsContent value="company">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Company Information</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Essential facts and figures about Delibix for accurate reporting and coverage.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Company Details */}
                  <Card className="glass p-8">
                    <h3 className="mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Company Details
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(companyInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-foreground-muted">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Key Metrics */}
                  <Card className="glass p-8">
                    <h3 className="mb-6 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Key Metrics
                    </h3>
                    <div className="space-y-6">
                      {keyMetrics.map((metric, index) => (
                        <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold gradient-text-blue mb-1">
                            {metric.value}
                          </div>
                          <div className="font-medium mb-1">{metric.label}</div>
                          <div className="text-sm text-foreground-muted">
                            {metric.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Partnerships */}
                <Card className="glass p-8">
                  <h3 className="mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Strategic Partnerships
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {partnerships.map((partner, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium">{partner}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Executive Team Tab */}
            <TabsContent value="team">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Executive Team</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Meet the leadership team driving Delibix's mission to democratize AI technology.
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {executiveTeam.map((executive, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className="glass p-8 text-center hover:shadow-lg transition-all duration-300 h-full">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        
                        <h3 className="mb-2">{executive.name}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                          {executive.title}
                        </p>
                        
                        <p className="text-sm text-foreground-muted mb-4 leading-relaxed">
                          {executive.bio}
                        </p>
                        
                        <div className="space-y-2 text-xs text-foreground-muted mb-6">
                          <p>{executive.education}</p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(executive.email, executive.name)}
                            className="text-xs"
                          >
                            {copiedText === executive.name ? (
                              <Check className="w-3 h-3 mr-1" />
                            ) : (
                              <Copy className="w-3 h-3 mr-1" />
                            )}
                            {copiedText === executive.name ? 'Copied!' : 'Copy Email'}
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Media Contact Tab */}
            <TabsContent value="contact">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="mb-4">Media Contact Information</h2>
                  <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
                    Get in touch with our media relations team for interviews, press inquiries, and additional information.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Press Contact */}
                  <Card className="glass p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <h3 className="mb-4">Press Relations</h3>
                    <div className="space-y-3 mb-6">
                      <p className="font-medium">Sarah Chen</p>
                      <p className="text-foreground-muted">Head of Communications</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-blue-600 dark:text-blue-400">press@delibix.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span>+62 857 7002 4933</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full gradient-bg-blue text-white"
                      onClick={() => window.open('mailto:press@delibix.com', '_blank')}
                    >
                      Send Email
                    </Button>
                  </Card>

                  {/* Partnership Contact */}
                  <Card className="glass p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <h3 className="mb-4">Partnership Inquiries</h3>
                    <div className="space-y-3 mb-6">
                      <p className="font-medium">Michael Rodriguez</p>
                      <p className="text-foreground-muted">Strategic Partnerships</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-green-600 dark:text-green-400">partnerships@delibix.com</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span>+62 857 7002 4934</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open('mailto:partnerships@delibix.com', '_blank')}
                    >
                      Send Email
                    </Button>
                  </Card>
                </div>

                {/* Response Times */}
                <Card className="glass p-8 max-w-2xl mx-auto">
                  <h3 className="text-center mb-6">Response Times</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="font-semibold">Press Inquiries</p>
                      <p className="text-sm text-foreground-muted">Within 4 hours</p>
                    </div>
                    <div>
                      <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="font-semibold">Interview Requests</p>
                      <p className="text-sm text-foreground-muted">Within 24 hours</p>
                    </div>
                    <div>
                      <ExternalLink className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <p className="font-semibold">General Media</p>
                      <p className="text-sm text-foreground-muted">Within 48 hours</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}