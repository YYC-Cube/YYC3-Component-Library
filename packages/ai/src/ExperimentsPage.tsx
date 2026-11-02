"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Beaker, Brain, Cpu, Zap, Code, Database, Eye, Sparkles,
  Play, ChevronRight, ArrowRight, Star, Filter, Search,
  Lightbulb, Rocket, Settings, Monitor, Activity, TrendingUp,
  Bot, Microscope, Layers, Workflow, FileText, Globe,
  Target, Users, Clock, CheckCircle, AlertCircle, Info,
  BarChart3, PieChart, LineChart, Calendar, Bell, Lock,
  Heart, Bookmark, Share2, Download, ExternalLink, Github,
  MessageSquare, ThumbsUp, Gamepad2, Palette, Camera,
  Music, Video, Headphones, Smartphone, Tablet, Laptop,
  Timer, Gauge, Building, Truck, ShoppingCart, Plane,
  Car, Coffee, Home, Store, CreditCard, Banknote
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface ExperimentsPageProps {
  navigate?: (page: any) => void;
}

export function ExperimentsPage({ navigate }: ExperimentsPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedExperiments, setLikedExperiments] = useState<Set<string>>(new Set());
  const [bookmarkedExperiments, setBookmarkedExperiments] = useState<Set<string>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // AI Website Recreation Data
  const websiteRecreations = [
    // International Companies
    {
      id: 'apple-recreation',
      company: 'Apple',
      title: 'Apple.com Homepage',
      description: 'Complete recreation of Apple\'s product showcase homepage with interactive elements and responsive design.',
      region: 'international',
      category: 'e-commerce',
      buildTime: '45 minutes',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'Framer Motion', 'Tailwind CSS', 'AI Design'],
      features: ['Product Carousel', 'Interactive Animations', 'Responsive Design', 'Dark Mode'],
      icon: Smartphone,
      color: 'slate',
      viewUrl: '#demo-apple',
      likes: 892,
      views: 15420
    },
    {
      id: 'google-recreation',
      company: 'Google',
      title: 'Google Search Interface',
      description: 'AI-powered recreation of Google\'s clean search interface with advanced search features.',
      region: 'international',
      category: 'search',
      buildTime: '32 minutes',
      complexity: 'medium',
      status: 'completed',
      technologies: ['React', 'TypeScript', 'Material Design', 'AI UX'],
      features: ['Voice Search', 'Instant Results', 'Search Suggestions', 'Mobile First'],
      icon: Search,
      color: 'blue',
      viewUrl: '#demo-google',
      likes: 1247,
      views: 22380
    },
    {
      id: 'netflix-recreation',
      company: 'Netflix',
      title: 'Netflix Streaming Platform',
      description: 'Complete streaming platform recreation with AI-powered content recommendations.',
      region: 'international',
      category: 'entertainment',
      buildTime: '2.5 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['Next.js', 'AI Recommendations', 'Video Streaming', 'Real-time'],
      features: ['Video Player', 'User Profiles', 'AI Recommendations', 'Offline Mode'],
      icon: Video,
      color: 'red',
      viewUrl: '#demo-netflix',
      likes: 1893,
      views: 34560
    },
    {
      id: 'spotify-recreation',
      company: 'Spotify',
      title: 'Spotify Music Streaming',
      description: 'Music streaming platform with AI-generated playlists and social features.',
      region: 'international',
      category: 'entertainment',
      buildTime: '1.8 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'Web Audio API', 'AI Music Analysis', 'Social Features'],
      features: ['Music Player', 'AI Playlists', 'Social Sharing', 'Offline Sync'],
      icon: Music,
      color: 'green',
      viewUrl: '#demo-spotify',
      likes: 1456,
      views: 28940
    },
    {
      id: 'tesla-recreation',
      company: 'Tesla',
      title: 'Tesla Vehicle Configurator',
      description: 'Interactive vehicle customization platform with 3D visualization and real-time pricing.',
      region: 'international',
      category: 'automotive',
      buildTime: '3.2 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['Three.js', '3D Rendering', 'Real-time Config', 'AI Optimization'],
      features: ['3D Car Model', 'Real-time Pricing', 'AR Preview', 'Payment Integration'],
      icon: Car,
      color: 'slate',
      viewUrl: '#demo-tesla',
      likes: 2134,
      views: 41230
    },
    {
      id: 'airbnb-recreation',
      company: 'Airbnb',
      title: 'Airbnb Booking Platform',
      description: 'Complete travel booking platform with AI-powered recommendations and smart search.',
      region: 'international',
      category: 'travel',
      buildTime: '2.1 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'Maps API', 'AI Search', 'Payment Gateway'],
      features: ['Smart Search', 'Interactive Maps', 'Booking System', 'Host Dashboard'],
      icon: Home,
      color: 'pink',
      viewUrl: '#demo-airbnb',
      likes: 1678,
      views: 31450
    },
    {
      id: 'amazon-recreation',
      company: 'Amazon',
      title: 'Amazon E-commerce Platform',
      description: 'Full-scale e-commerce platform with AI recommendations and one-click purchasing.',
      region: 'international',
      category: 'e-commerce',
      buildTime: '4.1 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['Microservices', 'AI Recommendations', 'Real-time Inventory', 'ML'],
      features: ['Product Search', 'AI Recommendations', 'One-Click Buy', 'Prime Features'],
      icon: ShoppingCart,
      color: 'orange',
      viewUrl: '#demo-amazon',
      likes: 2456,
      views: 52340
    },
    {
      id: 'uber-recreation',
      company: 'Uber',
      title: 'Uber Ride Booking App',
      description: 'Complete ride-sharing platform with real-time tracking and AI-powered route optimization.',
      region: 'international',
      category: 'transportation',
      buildTime: '1.9 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React Native', 'Real-time Tracking', 'AI Routing', 'Payment API'],
      features: ['Live Tracking', 'Route Optimization', 'Driver Matching', 'Fare Calculator'],
      icon: Car,
      color: 'slate',
      viewUrl: '#demo-uber',
      likes: 1834,
      views: 39870
    },
    {
      id: 'linkedin-recreation',
      company: 'LinkedIn',
      title: 'LinkedIn Professional Network',
      description: 'Professional networking platform with AI-powered job matching and content recommendations.',
      region: 'international',
      category: 'social',
      buildTime: '2.7 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'AI Matching', 'Social Graph', 'Real-time Chat'],
      features: ['Professional Profiles', 'Job Matching', 'News Feed', 'Messaging'],
      icon: Users,
      color: 'blue',
      viewUrl: '#demo-linkedin',
      likes: 1567,
      views: 33420
    },
    {
      id: 'instagram-recreation',
      company: 'Instagram',
      title: 'Instagram Social Platform',
      description: 'Visual social media platform with AI content moderation and smart filters.',
      region: 'international',
      category: 'social',
      buildTime: '2.3 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'AI Filters', 'Real-time Feed', 'Image Processing'],
      features: ['Photo Sharing', 'AI Filters', 'Stories', 'Real-time Chat'],
      icon: Camera,
      color: 'purple',
      viewUrl: '#demo-instagram',
      likes: 2890,
      views: 48930
    },

    // Indonesian Companies
    {
      id: 'tokopedia-recreation',
      company: 'Tokopedia',
      title: 'Tokopedia E-commerce Platform',
      description: 'Indonesia\'s leading marketplace with AI-powered seller tools and smart recommendations.',
      region: 'indonesia',
      category: 'e-commerce',
      buildTime: '3.4 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['React', 'AI Recommendations', 'Multi-vendor', 'Payment Gateway'],
      features: ['Multi-vendor Support', 'Smart Search', 'Digital Wallet', 'Seller Analytics'],
      icon: Store,
      color: 'green',
      viewUrl: '#demo-tokopedia',
      likes: 1923,
      views: 41230
    },
    {
      id: 'gojek-recreation',
      company: 'Gojek',
      title: 'Gojek Super App',
      description: 'Multi-service super app with transportation, food delivery, and digital payments.',
      region: 'indonesia',
      category: 'transportation',
      buildTime: '4.8 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['React Native', 'Microservices', 'Real-time Tracking', 'AI Optimization'],
      features: ['Multi-service App', 'Real-time Tracking', 'Digital Wallet', 'Food Delivery'],
      icon: Truck,
      color: 'green',
      viewUrl: '#demo-gojek',
      likes: 2345,
      views: 56780
    },
    {
      id: 'bukalapak-recreation',
      company: 'Bukalapak',
      title: 'Bukalapak Marketplace',
      description: 'Complete marketplace platform with AI-powered fraud detection and seller support.',
      region: 'indonesia',
      category: 'e-commerce',
      buildTime: '2.9 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'AI Fraud Detection', 'Analytics', 'Mobile First'],
      features: ['Fraud Detection', 'Seller Tools', 'Mobile Payments', 'Analytics Dashboard'],
      icon: ShoppingCart,
      color: 'red',
      viewUrl: '#demo-bukalapak',
      likes: 1456,
      views: 32450
    },
    {
      id: 'traveloka-recreation',
      company: 'Traveloka',
      title: 'Traveloka Travel Platform',
      description: 'Comprehensive travel booking platform with AI trip planning and smart recommendations.',
      region: 'indonesia',
      category: 'travel',
      buildTime: '3.1 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'AI Trip Planning', 'Booking Engine', 'Price Prediction'],
      features: ['Flight Booking', 'Hotel Search', 'AI Trip Planner', 'Price Alerts'],
      icon: Plane,
      color: 'blue',
      viewUrl: '#demo-traveloka',
      likes: 1789,
      views: 38920
    },
    {
      id: 'shopee-recreation',
      company: 'Shopee',
      title: 'Shopee E-commerce App',
      description: 'Mobile-first e-commerce platform with gamification and AI-powered shopping assistant.',
      region: 'indonesia',
      category: 'e-commerce',
      buildTime: '2.6 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React Native', 'Gamification', 'AI Assistant', 'Social Commerce'],
      features: ['Social Shopping', 'Gamification', 'Live Streaming', 'AI Assistant'],
      icon: ShoppingCart,
      color: 'orange',
      viewUrl: '#demo-shopee',
      likes: 2134,
      views: 45670
    },
    {
      id: 'ovo-recreation',
      company: 'OVO',
      title: 'OVO Digital Wallet',
      description: 'Digital payment platform with AI-powered financial insights and smart spending.',
      region: 'indonesia',
      category: 'fintech',
      buildTime: '1.7 hours',
      complexity: 'medium',
      status: 'completed',
      technologies: ['React', 'AI Analytics', 'Secure Payments', 'Financial ML'],
      features: ['Digital Payments', 'AI Insights', 'Budgeting Tools', 'Merchant Network'],
      icon: CreditCard,
      color: 'purple',
      viewUrl: '#demo-ovo',
      likes: 1567,
      views: 34560
    },
    {
      id: 'dana-recreation',
      company: 'Dana',
      title: 'Dana Digital Wallet',
      description: 'Mobile payment solution with AI fraud prevention and smart financial planning.',
      region: 'indonesia',
      category: 'fintech',
      buildTime: '1.5 hours',
      complexity: 'medium',
      status: 'completed',
      technologies: ['React Native', 'AI Security', 'Blockchain', 'ML Analytics'],
      features: ['Secure Payments', 'AI Fraud Detection', 'Investment Tools', 'QR Payments'],
      icon: Banknote,
      color: 'blue',
      viewUrl: '#demo-dana',
      likes: 1234,
      views: 28790
    },
    {
      id: 'blibli-recreation',
      company: 'Blibli',
      title: 'Blibli Online Shopping',
      description: 'Premium e-commerce platform with AI stylist and personalized shopping experience.',
      region: 'indonesia',
      category: 'e-commerce',
      buildTime: '2.4 hours',
      complexity: 'high',
      status: 'completed',
      technologies: ['React', 'AI Stylist', 'AR Try-on', 'Personalization'],
      features: ['AI Personal Stylist', 'AR Try-on', 'Premium Products', 'Style Recommendations'],
      icon: Store,
      color: 'blue',
      viewUrl: '#demo-blibli',
      likes: 1345,
      views: 29870
    },
    {
      id: 'mandiri-recreation',
      company: 'Bank Mandiri',
      title: 'Mandiri Digital Banking',
      description: 'Complete digital banking platform with AI financial advisor and smart insights.',
      region: 'indonesia',
      category: 'fintech',
      buildTime: '3.8 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['React', 'AI Advisor', 'Secure Banking', 'Financial ML'],
      features: ['AI Financial Advisor', 'Investment Tools', 'Loan Calculator', 'Security Features'],
      icon: Building,
      color: 'yellow',
      viewUrl: '#demo-mandiri',
      likes: 1678,
      views: 35420
    },
    {
      id: 'grab-recreation',
      company: 'Grab',
      title: 'Grab Super App',
      description: 'Multi-service platform with ride-hailing, food delivery, and financial services.',
      region: 'indonesia',
      category: 'transportation',
      buildTime: '4.2 hours',
      complexity: 'very-high',
      status: 'completed',
      technologies: ['React Native', 'Multi-service', 'Real-time', 'AI Optimization'],
      features: ['Ride Booking', 'Food Delivery', 'GrabPay Wallet', 'Merchant Services'],
      icon: Car,
      color: 'green',
      viewUrl: '#demo-grab',
      likes: 2456,
      views: 51230
    }
  ];

  // Categories for recreation experiments
  const recreationCategories = [
    { id: 'all', name: 'All Recreations', count: websiteRecreations.length },
    { id: 'e-commerce', name: 'E-commerce', count: websiteRecreations.filter(w => w.category === 'e-commerce').length },
    { id: 'fintech', name: 'FinTech', count: websiteRecreations.filter(w => w.category === 'fintech').length },
    { id: 'transportation', name: 'Transportation', count: websiteRecreations.filter(w => w.category === 'transportation').length },
    { id: 'social', name: 'Social Media', count: websiteRecreations.filter(w => w.category === 'social').length },
    { id: 'entertainment', name: 'Entertainment', count: websiteRecreations.filter(w => w.category === 'entertainment').length },
    { id: 'travel', name: 'Travel', count: websiteRecreations.filter(w => w.category === 'travel').length }
  ];

  // Region filters
  const regionFilters = [
    { id: 'all', name: 'All Regions', count: websiteRecreations.length },
    { id: 'international', name: 'International', count: websiteRecreations.filter(w => w.region === 'international').length },
    { id: 'indonesia', name: 'Indonesia', count: websiteRecreations.filter(w => w.region === 'indonesia').length }
  ];

  // Experiment categories
  const categories = [
    { id: 'all', name: 'All Experiments', icon: Beaker, count: 24 },
    { id: 'ai-tools', name: 'AI Tools', icon: Brain, count: 8 },
    { id: 'research', name: 'Research', icon: Microscope, count: 6 },
    { id: 'beta', name: 'Beta Features', icon: Rocket, count: 5 },
    { id: 'demos', name: 'Live Demos', icon: Play, count: 3 },
    { id: 'open-source', name: 'Open Source', icon: Github, count: 2 }
  ];

  // Experiments data (keeping the original experiments)
  const experiments = [
    // AI Tools
    {
      id: 'neural-composer',
      title: 'Neural Music Composer',
      description: 'AI-powered music composition tool that creates original melodies and harmonies based on your style preferences.',
      category: 'ai-tools',
      status: 'live',
      difficulty: 'beginner',
      tags: ['Music', 'AI', 'Creative'],
      icon: Music,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      githubUrl: '#github',
      likes: 234,
      bookmarks: 89,
      lastUpdated: '2024-12-01',
      featured: true,
      interactive: true,
      technologies: ['Neural Networks', 'Audio Processing', 'Web Audio API']
    },
    {
      id: 'smart-colorizer',
      title: 'Smart Image Colorizer',
      description: 'Transform black and white photos into vibrant colored images using advanced deep learning algorithms.',
      category: 'ai-tools',
      status: 'live',
      difficulty: 'intermediate',
      tags: ['Computer Vision', 'Image Processing', 'AI'],
      icon: Palette,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      githubUrl: '#github',
      likes: 456,
      bookmarks: 178,
      lastUpdated: '2024-11-28',
      featured: true,
      interactive: true,
      technologies: ['GANs', 'Computer Vision', 'TensorFlow']
    },
    {
      id: 'voice-cloner',
      title: 'Voice Synthesis Studio',
      description: 'Create realistic voice clones with just a few minutes of audio samples using state-of-the-art TTS technology.',
      category: 'ai-tools',
      status: 'beta',
      difficulty: 'advanced',
      tags: ['Voice', 'TTS', 'Deep Learning'],
      icon: Headphones,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 189,
      bookmarks: 67,
      lastUpdated: '2024-11-25',
      featured: false,
      interactive: true,
      technologies: ['Speech Synthesis', 'Neural Vocoder', 'PyTorch']
    },
    {
      id: 'code-assistant',
      title: 'Intelligent Code Assistant',
      description: 'AI-powered coding companion that helps with code completion, bug detection, and optimization suggestions.',
      category: 'ai-tools',
      status: 'live',
      difficulty: 'intermediate',
      tags: ['Coding', 'Productivity', 'AI'],
      icon: Code,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      githubUrl: '#github',
      likes: 678,
      bookmarks: 234,
      lastUpdated: '2024-12-02',
      featured: true,
      interactive: true,
      technologies: ['Large Language Models', 'Code Analysis', 'AST Processing']
    },
    {
      id: 'document-qa',
      title: 'Document Q&A System',
      description: 'Upload any document and ask questions about its content. Get accurate answers with source citations.',
      category: 'ai-tools',
      status: 'live',
      difficulty: 'beginner',
      tags: ['NLP', 'Documents', 'Q&A'],
      icon: FileText,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 345,
      bookmarks: 123,
      lastUpdated: '2024-11-30',
      featured: false,
      interactive: true,
      technologies: ['RAG', 'Vector Embeddings', 'Transformer Models']
    },
    {
      id: 'visual-search',
      title: 'Visual Search Engine',
      description: 'Search through images using natural language descriptions or similar image matching.',
      category: 'ai-tools',
      status: 'beta',
      difficulty: 'intermediate',
      tags: ['Computer Vision', 'Search', 'Multimodal'],
      icon: Eye,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 267,
      bookmarks: 98,
      lastUpdated: '2024-11-27',
      featured: false,
      interactive: true,
      technologies: ['CLIP', 'Vector Search', 'Multimodal AI']
    },
    {
      id: 'chat-analyst',
      title: 'Conversation Analyzer',
      description: 'Analyze chat conversations for sentiment, topics, and communication patterns with detailed insights.',
      category: 'ai-tools',
      status: 'live',
      difficulty: 'beginner',
      tags: ['NLP', 'Analytics', 'Communication'],
      icon: MessageSquare,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 156,
      bookmarks: 45,
      lastUpdated: '2024-11-29',
      featured: false,
      interactive: true,
      technologies: ['Sentiment Analysis', 'Topic Modeling', 'NLP']
    },
    {
      id: 'smart-camera',
      title: 'AI Camera Effects',
      description: 'Real-time camera filters and effects powered by computer vision and augmented reality.',
      category: 'ai-tools',
      status: 'beta',
      difficulty: 'advanced',
      tags: ['Computer Vision', 'AR', 'Real-time'],
      icon: Camera,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 389,
      bookmarks: 134,
      lastUpdated: '2024-11-26',
      featured: true,
      interactive: true,
      technologies: ['MediaPipe', 'WebRTC', 'Computer Vision']
    },

    // Research Projects
    {
      id: 'quantum-ml',
      title: 'Quantum Machine Learning',
      description: 'Exploring the intersection of quantum computing and machine learning for next-generation algorithms.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['Quantum', 'ML', 'Research'],
      icon: Cpu,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 123,
      bookmarks: 78,
      lastUpdated: '2024-11-20',
      featured: true,
      interactive: false,
      technologies: ['Quantum Circuits', 'Variational Algorithms', 'NISQ']
    },
    {
      id: 'federated-learning',
      title: 'Privacy-Preserving Federated Learning',
      description: 'Distributed machine learning that keeps data decentralized while improving model performance.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['Privacy', 'Distributed ML', 'Security'],
      icon: Lock,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 234,
      bookmarks: 156,
      lastUpdated: '2024-11-18',
      featured: true,
      interactive: false,
      technologies: ['Differential Privacy', 'Secure Aggregation', 'Homomorphic Encryption']
    },
    {
      id: 'neural-architecture',
      title: 'Neural Architecture Search',
      description: 'Automated design of optimal neural network architectures for specific tasks and constraints.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['AutoML', 'Neural Networks', 'Optimization'],
      icon: Brain,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 187,
      bookmarks: 92,
      lastUpdated: '2024-11-22',
      featured: false,
      interactive: false,
      technologies: ['Evolutionary Algorithms', 'Reinforcement Learning', 'Architecture Optimization']
    },
    {
      id: 'multimodal-fusion',
      title: 'Multimodal AI Fusion',
      description: 'Advanced techniques for combining and understanding multiple data modalities simultaneously.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['Multimodal', 'Fusion', 'Cross-Modal'],
      icon: Layers,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 298,
      bookmarks: 145,
      lastUpdated: '2024-11-21',
      featured: true,
      interactive: false,
      technologies: ['Attention Mechanisms', 'Cross-Modal Learning', 'Transformer Fusion']
    },
    {
      id: 'causal-inference',
      title: 'Causal AI Systems',
      description: 'Building AI systems that understand causality and can make interventional predictions.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['Causality', 'Inference', 'Explainable AI'],
      icon: Target,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 165,
      bookmarks: 89,
      lastUpdated: '2024-11-19',
      featured: false,
      interactive: false,
      technologies: ['Causal Graphs', 'Counterfactual Inference', 'Structural Causal Models']
    },
    {
      id: 'continual-learning',
      title: 'Continual Learning Systems',
      description: 'AI models that can learn continuously without forgetting previous knowledge.',
      category: 'research',
      status: 'experimental',
      difficulty: 'advanced',
      tags: ['Continual Learning', 'Memory', 'Adaptation'],
      icon: TrendingUp,
      image: '/api/placeholder/400/200',
      demoUrl: '#paper',
      likes: 203,
      bookmarks: 67,
      lastUpdated: '2024-11-17',
      featured: false,
      interactive: false,
      technologies: ['Elastic Weight Consolidation', 'Progressive Networks', 'Memory Replay']
    },

    // Beta Features
    {
      id: 'workflow-automation',
      title: 'AI Workflow Automation',
      description: 'Intelligent automation platform that learns and optimizes business workflows.',
      category: 'beta',
      status: 'beta',
      difficulty: 'intermediate',
      tags: ['Automation', 'Workflows', 'Business'],
      icon: Workflow,
      image: '/api/placeholder/400/200',
      demoUrl: '#beta',
      likes: 412,
      bookmarks: 189,
      lastUpdated: '2024-12-01',
      featured: true,
      interactive: true,
      technologies: ['Process Mining', 'RPA', 'Machine Learning']
    },
    {
      id: 'predictive-analytics',
      title: 'Predictive Analytics Dashboard',
      description: 'Real-time predictive analytics with automated insights and trend forecasting.',
      category: 'beta',
      status: 'beta',
      difficulty: 'intermediate',
      tags: ['Analytics', 'Prediction', 'Dashboard'],
      icon: BarChart3,
      image: '/api/placeholder/400/200',
      demoUrl: '#beta',
      likes: 356,
      bookmarks: 234,
      lastUpdated: '2024-11-28',
      featured: true,
      interactive: true,
      technologies: ['Time Series Forecasting', 'Anomaly Detection', 'Statistical Learning']
    },
    {
      id: 'ai-assistant',
      title: 'Personal AI Assistant',
      description: 'Intelligent personal assistant that integrates with your daily tools and workflows.',
      category: 'beta',
      status: 'beta',
      difficulty: 'beginner',
      tags: ['Assistant', 'Productivity', 'Integration'],
      icon: Bot,
      image: '/api/placeholder/400/200',
      demoUrl: '#beta',
      likes: 789,
      bookmarks: 345,
      lastUpdated: '2024-12-02',
      featured: true,
      interactive: true,
      technologies: ['Large Language Models', 'API Integration', 'Context Management']
    },
    {
      id: 'smart-notifications',
      title: 'Intelligent Notification System',
      description: 'AI-powered notification management that learns your preferences and schedules.',
      category: 'beta',
      status: 'beta',
      difficulty: 'beginner',
      tags: ['Notifications', 'Smart', 'Personalization'],
      icon: Bell,
      image: '/api/placeholder/400/200',
      demoUrl: '#beta',
      likes: 234,
      bookmarks: 98,
      lastUpdated: '2024-11-30',
      featured: false,
      interactive: true,
      technologies: ['Reinforcement Learning', 'User Modeling', 'Context Awareness']
    },
    {
      id: 'adaptive-ui',
      title: 'Adaptive User Interface',
      description: 'UI that automatically adapts to user behavior and preferences for optimal experience.',
      category: 'beta',
      status: 'beta',
      difficulty: 'advanced',
      tags: ['UI/UX', 'Adaptation', 'Personalization'],
      icon: Monitor,
      image: '/api/placeholder/400/200',
      demoUrl: '#beta',
      likes: 345,
      bookmarks: 167,
      lastUpdated: '2024-11-29',
      featured: false,
      interactive: true,
      technologies: ['User Behavior Analysis', 'A/B Testing', 'Dynamic UI']
    },

    // Live Demos
    {
      id: 'neural-style-transfer',
      title: 'Neural Style Transfer',
      description: 'Transform your photos into artwork using the style of famous paintings.',
      category: 'demos',
      status: 'live',
      difficulty: 'beginner',
      tags: ['Art', 'Style Transfer', 'Creative'],
      icon: Palette,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      githubUrl: '#github',
      likes: 567,
      bookmarks: 234,
      lastUpdated: '2024-12-01',
      featured: true,
      interactive: true,
      technologies: ['Style Transfer', 'Convolutional Neural Networks', 'PyTorch']
    },
    {
      id: 'text-to-speech',
      title: 'Advanced Text-to-Speech',
      description: 'High-quality text-to-speech with multiple voices and emotional expressions.',
      category: 'demos',
      status: 'live',
      difficulty: 'beginner',
      tags: ['TTS', 'Voice', 'Audio'],
      icon: Headphones,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      likes: 445,
      bookmarks: 178,
      lastUpdated: '2024-11-28',
      featured: true,
      interactive: true,
      technologies: ['WaveNet', 'Tacotron', 'Neural Vocoders']
    },
    {
      id: 'ai-game',
      title: 'AI Strategy Game',
      description: 'Play against advanced AI opponents in this strategic board game implementation.',
      category: 'demos',
      status: 'live',
      difficulty: 'intermediate',
      tags: ['Gaming', 'Strategy', 'AI'],
      icon: Gamepad2,
      image: '/api/placeholder/400/200',
      demoUrl: '#demo',
      githubUrl: '#github',
      likes: 389,
      bookmarks: 145,
      lastUpdated: '2024-11-27',
      featured: false,
      interactive: true,
      technologies: ['Minimax Algorithm', 'Monte Carlo Tree Search', 'Game AI']
    },

    // Open Source
    {
      id: 'ml-toolkit',
      title: 'Delibix ML Toolkit',
      description: 'Open-source machine learning toolkit with pre-trained models and utilities.',
      category: 'open-source',
      status: 'live',
      difficulty: 'intermediate',
      tags: ['Open Source', 'ML', 'Toolkit'],
      icon: Github,
      image: '/api/placeholder/400/200',
      githubUrl: '#github',
      likes: 1234,
      bookmarks: 567,
      lastUpdated: '2024-12-02',
      featured: true,
      interactive: false,
      technologies: ['Python', 'scikit-learn', 'TensorFlow', 'PyTorch']
    },
    {
      id: 'data-pipeline',
      title: 'AI Data Pipeline Framework',
      description: 'Scalable data processing pipeline specifically designed for AI/ML workflows.',
      category: 'open-source',
      status: 'live',
      difficulty: 'advanced',
      tags: ['Data Pipeline', 'MLOps', 'Infrastructure'],
      icon: Database,
      image: '/api/placeholder/400/200',
      githubUrl: '#github',
      likes: 789,
      bookmarks: 234,
      lastUpdated: '2024-11-30',
      featured: true,
      interactive: false,
      technologies: ['Apache Airflow', 'Docker', 'Kubernetes', 'Apache Spark']
    }
  ];

  // Filter functions
  const filteredRecreations = websiteRecreations.filter(recreation => {
    const matchesRegion = selectedRegion === 'all' || recreation.region === selectedRegion;
    const matchesSearch = recreation.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recreation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recreation.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Filter experiments
  const filteredExperiments = experiments.filter(experiment => {
    const matchesCategory = selectedCategory === 'all' || experiment.category === selectedCategory;
    const matchesSearch = experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         experiment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get featured experiments
  const featuredExperiments = experiments.filter(exp => exp.featured);

  // Handle like/bookmark actions
  const handleLike = (experimentId: string) => {
    setLikedExperiments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(experimentId)) {
        newSet.delete(experimentId);
      } else {
        newSet.add(experimentId);
      }
      return newSet;
    });
  };

  const handleBookmark = (experimentId: string) => {
    setBookmarkedExperiments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(experimentId)) {
        newSet.delete(experimentId);
      } else {
        newSet.add(experimentId);
      }
      return newSet;
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'beta': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'experimental': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'intermediate': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'very-high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // Get company color theme
  const getCompanyColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'red': return 'from-red-500 to-red-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      case 'pink': return 'from-pink-500 to-pink-600';
      case 'yellow': return 'from-yellow-500 to-yellow-600';
      case 'slate': return 'from-slate-500 to-slate-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30"
            style={{ y: heroY, opacity: heroOpacity }}
          />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 opacity-10 dark:opacity-20">
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
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
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Beaker className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                AI Experiments Lab
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AI <span className="gradient-text-blue">Experiments</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Explore cutting-edge AI research, interactive tools, and experimental features. 
                Discover the future of artificial intelligence through hands-on demos and open-source projects.
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className={`glass-heavy rounded-2xl p-6 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  {experiments.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Active Experiments
                </div>
              </div>
              
              <div className={`glass-heavy rounded-2xl p-6 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  {websiteRecreations.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  AI Website Recreations
                </div>
              </div>
              
              <div className={`glass-heavy rounded-2xl p-6 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  {experiments.filter(exp => exp.category === 'open-source').length}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Open Source
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                onClick={() => {
                  const element = document.getElementById('ai-recreations');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  View AI Recreations
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => {
                  const element = document.getElementById('featured-experiments');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Experiments
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Website Recreation Lab Section */}
      <section id="ai-recreations" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              AI Website <span className="gradient-text-blue">Recreation Lab</span>
            </h2>
            <p className={`text-lg max-w-4xl mx-auto leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              We experiment with recreating websites and platforms from 20 famous companies worldwide and in Indonesia. 
              These AI-powered recreations are built in minutes to hours, demonstrating the speed and precision of our AI development capabilities.
            </p>
            
            {/* Key Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className={`text-3xl font-bold gradient-text-blue`}>
                  45 mins
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Average Build Time
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold gradient-text-blue`}>
                  95%
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Design Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold gradient-text-blue`}>
                  100%
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Responsive Design
                </div>
              </div>
            </div>
          </motion.div>

          {/* Region and Search Filters */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type="text"
                  placeholder="Search companies or platforms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-6 text-lg rounded-2xl ${
                    isDark 
                      ? 'glass-heavy border-blue-400/20 bg-slate-800/30 text-slate-100 placeholder:text-slate-400' 
                      : 'glass-heavy border-blue-200/50 bg-white/30 text-slate-900 placeholder:text-slate-500'
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                />
              </div>
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {regionFilters.map((region) => (
                <motion.button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedRegion === region.id
                      ? 'gradient-bg-blue text-white shadow-lg'
                      : isDark
                        ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                        : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className="w-4 h-4" />
                  <span>{region.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedRegion === region.id
                      ? 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {region.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Website Recreations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecreations.map((recreation, index) => (
              <motion.div
                key={recreation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Company Header */}
                <div className={`p-6 bg-gradient-to-r ${getCompanyColor(recreation.color)} text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <recreation.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{recreation.company}</h3>
                        <p className="text-white/80 text-sm">{recreation.region === 'indonesia' ? 'Indonesia' : 'International'}</p>
                      </div>
                    </div>
                    <Badge className={`border ${getStatusColor(recreation.status)}`}>
                      {recreation.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className={`text-lg font-semibold mb-3 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {recreation.title}
                  </h4>

                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {recreation.description}
                  </p>

                  {/* Build Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Timer className="w-4 h-4 text-green-500" />
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Build Time
                        </span>
                      </div>
                      <div className="text-green-600 font-semibold text-sm">{recreation.buildTime}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Gauge className="w-4 h-4 text-orange-500" />
                        <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          Complexity
                        </span>
                      </div>
                      <Badge className={`text-xs border ${getComplexityColor(recreation.complexity)}`}>
                        {recreation.complexity.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {recreation.technologies.slice(0, 3).map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {recreation.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{recreation.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h5 className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Key Features:
                    </h5>
                    <div className="space-y-1">
                      {recreation.features.slice(0, 2).map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className={`flex items-center gap-2 text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span className="text-xs">{recreation.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs">{recreation.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-lg h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open(recreation.viewUrl, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Demo
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredRecreations.length === 0 && (
            <div className="text-center py-12">
              <Search className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No recreations found matching your criteria.
              </p>
            </div>
          )}

          {/* Recreation Lab CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className={`glass-heavy rounded-2xl p-8 ${
              isDark ? 'border-blue-400/20' : 'border-blue-200/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Want Your Website Recreated?
              </h3>
              <p className={`text-lg mb-6 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Experience the power of AI-driven web development. We can recreate any website with stunning accuracy in record time.
              </p>
              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-4 text-lg font-semibold rounded-2xl"
                onClick={() => navigate && navigate('contact')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Request Recreation
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Experiments Section */}
      <section id="featured-experiments" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              Featured <span className="gradient-text-blue">Experiments</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Discover our most popular and innovative AI experiments, from interactive tools to research breakthroughs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiments.slice(0, 6).map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <experiment.icon className="w-16 h-16 text-blue-500 opacity-50" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`text-xs border ${getStatusColor(experiment.status)}`}>
                      {experiment.status}
                    </Badge>
                    <Badge className={`text-xs border ${getDifficultyColor(experiment.difficulty)}`}>
                      {experiment.difficulty}
                    </Badge>
                  </div>
                  {experiment.interactive && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                        <Play className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`text-xl font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {experiment.title}
                    </h3>
                  </div>

                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {experiment.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {experiment.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Heart 
                          className={`w-4 h-4 cursor-pointer transition-colors ${
                            likedExperiments.has(experiment.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                          onClick={() => handleLike(experiment.id)}
                        />
                        <span>{experiment.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark 
                          className={`w-4 h-4 cursor-pointer transition-colors ${
                            bookmarkedExperiments.has(experiment.id) 
                              ? 'text-blue-500 fill-current' 
                              : 'text-slate-400 hover:text-blue-500'
                          }`}
                          onClick={() => handleBookmark(experiment.id)}
                        />
                        <span>{experiment.bookmarks}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {experiment.demoUrl && (
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      {experiment.githubUrl && (
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Github className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Experiments Section */}
      <section id="all-experiments" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}>
              All <span className="gradient-text-blue">Experiments</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Browse our complete collection of AI experiments, research projects, and innovative tools.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type="text"
                  placeholder="Search experiments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-12 pr-4 py-6 text-lg rounded-2xl ${
                    isDark 
                      ? 'glass-heavy border-blue-400/20 bg-slate-800/30 text-slate-100 placeholder:text-slate-400' 
                      : 'glass-heavy border-blue-200/50 bg-white/30 text-slate-900 placeholder:text-slate-500'
                  } focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300`}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'gradient-bg-blue text-white shadow-lg'
                      : isDark
                        ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                        : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedCategory === category.id
                      ? 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <experiment.icon className="w-12 h-12 text-blue-500 opacity-50" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`text-xs border ${getStatusColor(experiment.status)}`}>
                      {experiment.status}
                    </Badge>
                  </div>
                  {experiment.interactive && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                        <Play className="w-3 h-3 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {experiment.title}
                  </h3>

                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {experiment.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {experiment.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Heart 
                          className={`w-3 h-3 cursor-pointer transition-colors ${
                            likedExperiments.has(experiment.id) 
                              ? 'text-red-500 fill-current' 
                              : 'text-slate-400 hover:text-red-500'
                          }`}
                          onClick={() => handleLike(experiment.id)}
                        />
                        <span className="text-xs">{experiment.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark 
                          className={`w-3 h-3 cursor-pointer transition-colors ${
                            bookmarkedExperiments.has(experiment.id) 
                              ? 'text-blue-500 fill-current' 
                              : 'text-slate-400 hover:text-blue-500'
                          }`}
                          onClick={() => handleBookmark(experiment.id)}
                        />
                        <span className="text-xs">{experiment.bookmarks}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {experiment.demoUrl && (
                        <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0">
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                      {experiment.githubUrl && (
                        <Button size="sm" variant="outline" className="rounded-lg h-8 w-8 p-0">
                          <Github className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredExperiments.length === 0 && (
            <div className="text-center py-12">
              <Search className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No experiments found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

Experiments
    </div>
  );
}