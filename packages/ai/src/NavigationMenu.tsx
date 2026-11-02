"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  X, Search, Home, DollarSign, FlaskConical, Brain, Mail, Users, Briefcase, Settings, 
  ArrowRight, Phone, MapPin, Clock, Info, HelpCircle, Shield, FileText, Gavel,
  BookOpen, Lightbulb, Calendar, MessageCircle, Building2, Trophy, Newspaper,
  Gift, Palette, Zap, Code, Rocket, Star, Heart, Globe, Handshake, Award,
  Bot, Database, Monitor, Smartphone, Cpu, Network, Cloud, Lock,
  UserPlus, Target, TrendingUp, BarChart3, PieChart, Activity, Command,
  ShoppingBag, Sparkles, Package, MessageSquare, Scroll, AlertTriangle,
  Wrench, Construction, Clipboard, Users2, ThumbsUp, Archive, CookieIcon,
  Scale, ShieldCheck, Eye, Megaphone, Mic, UserCheck, ExternalLink, ChevronRight,
  Grid3X3, List, Filter, Layers, Server, CheckCircle, Calculator, Radio, Camera,
  Balance
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
  navigate?: (page: any) => void;
}

interface PageItem {
  name: string;
  href: string;
  icon: any;
  description: string;
  status?: 'live' | 'beta' | 'coming-soon';
  category: string;
  keywords: string[];
  popular?: boolean;
  priority?: number; // 1 = highest priority
}

interface CategoryTab {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export function NavigationMenu({ isOpen, onClose, currentPage = 'home', navigate }: NavigationMenuProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'popular' | 'category' | 'all'>('popular');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Enhanced category system
  const categories: CategoryTab[] = [
    { id: 'all', name: 'All Pages', icon: Grid3X3, description: 'Complete site index' },
    { id: 'Core', name: 'Essential', icon: Home, description: 'Core pages & navigation' },
    { id: 'Product', name: 'AI Tools', icon: Bot, description: 'AI tools & features' },
    { id: 'Company', name: 'Company', icon: Building2, description: 'About our organization' },
    { id: 'Community', name: 'Community', icon: Users2, description: 'Connect & engage' },
    { id: 'Support', name: 'Support', icon: HelpCircle, description: 'Help & resources' },
    { id: 'Press', name: 'Press & Media', icon: Megaphone, description: 'Press releases & media' },
    { id: 'Legal', name: 'Legal', icon: Shield, description: 'Policies & terms' },
    { id: 'System', name: 'System', icon: Server, description: 'System & error pages' }
  ];

  // COMPREHENSIVE pages database - ALL available pages from file structure
  const allPages: PageItem[] = [
    // === CORE PAGES (Priority 1-8) ===
    { name: 'Home', href: '#home', icon: Home, description: 'Return to homepage & main content', status: 'live', category: 'Core', keywords: ['home', 'main', 'start', 'dashboard', 'landing'], popular: true, priority: 1 },
    { name: 'About Us', href: '#about', icon: Info, description: 'Our story, mission, vision & values', status: 'live', category: 'Core', keywords: ['about', 'story', 'mission', 'company', 'vision', 'values'], popular: true, priority: 2 },
    { name: 'Services', href: '#services', icon: Settings, description: 'Comprehensive digital consulting services', status: 'live', category: 'Core', keywords: ['services', 'consulting', 'digital', 'solutions', 'ai', 'development'], popular: true, priority: 3 },
    { name: 'Blog', href: '#blog', icon: BookOpen, description: 'Latest insights, tutorials & AI knowledge', status: 'live', category: 'Core', keywords: ['blog', 'articles', 'insights', 'tutorials', 'knowledge', 'ai', 'learning'], popular: true, priority: 4 },
    { name: 'Pricing', href: '#pricing', icon: DollarSign, description: 'View our pricing plans & packages', status: 'live', category: 'Core', keywords: ['price', 'cost', 'plans', 'subscription', 'packages', 'rates'], popular: true, priority: 5 },
    { name: 'Contact Us', href: '#contact-page', icon: Mail, description: 'Get in touch with our team', status: 'live', category: 'Core', keywords: ['contact', 'support', 'help', 'email', 'reach', 'message'], popular: true, priority: 6 },
    { name: 'Search', href: '#search', icon: Search, description: 'Search our entire website', status: 'live', category: 'Core', keywords: ['search', 'find', 'lookup', 'discover', 'explore'], popular: true, priority: 7 },
    { name: 'Site Map', href: '#sitemap', icon: MapPin, description: 'Complete site navigation map', status: 'live', category: 'Core', keywords: ['sitemap', 'navigation', 'map', 'pages', 'structure', 'index'], priority: 8 },

    // === AI TOOLS & PRODUCTS (Priority 9-15) ===
    { name: 'AI Playground', href: '#ai-playground', icon: Bot, description: 'Interactive AI tools & live demos', status: 'live', category: 'Product', keywords: ['ai', 'playground', 'demo', 'interactive', 'tools', 'test'], popular: true, priority: 9 },
    { name: 'AGI Development', href: '#autonomous-ai', icon: Brain, description: 'Artificial General Intelligence capabilities', status: 'live', category: 'Product', keywords: ['agi', 'artificial', 'general', 'intelligence', 'automation', 'autonomous', 'smart'], popular: true, priority: 10 },
    { name: 'AI Experiments', href: '#experiments', icon: FlaskConical, description: 'Latest experimental AI features', status: 'live', category: 'Product', keywords: ['experiment', 'beta', 'new', 'features', 'lab', 'test', 'research'], popular: true, priority: 11 },
    { name: 'ROI Calculator', href: '#ai-roi-calculator', icon: Calculator, description: 'Calculate AI implementation ROI', status: 'live', category: 'Product', keywords: ['roi', 'calculator', 'return', 'investment', 'cost', 'benefit', 'analysis'], popular: true, priority: 12 },
    { name: 'AI Readiness Checklist', href: '#ai-readiness-checklist', icon: CheckCircle, description: 'Assess your AI readiness level', status: 'live', category: 'Product', keywords: ['readiness', 'checklist', 'assessment', 'preparation', 'ai', 'ready'], popular: true, priority: 13 },
    { name: 'Strategy Templates', href: '#strategy-templates', icon: FileText, description: 'AI strategy frameworks & templates', status: 'live', category: 'Product', keywords: ['strategy', 'templates', 'framework', 'planning', 'ai', 'guide'], popular: true, priority: 14 },
    { name: 'Documentation', href: '#documentation', icon: FileText, description: 'Complete technical documentation', status: 'live', category: 'Product', keywords: ['docs', 'documentation', 'guide', 'manual', 'api', 'technical'], priority: 15 },

    // === COMPANY (Priority 16-23) ===
    { name: 'Our Team', href: '#team', icon: Users, description: 'Meet the brilliant minds behind Delibix', status: 'live', category: 'Company', keywords: ['team', 'people', 'staff', 'experts', 'leadership', 'founders'], popular: true, priority: 16 },
    { name: 'Careers', href: '#careers', icon: UserPlus, description: 'Join our growing AI-first team', status: 'live', category: 'Company', keywords: ['jobs', 'careers', 'hiring', 'work', 'employment', 'opportunity'], popular: true, priority: 17 },
    { name: 'Our Clients', href: '#clients', icon: Handshake, description: 'Success stories & case studies', status: 'live', category: 'Company', keywords: ['clients', 'customers', 'testimonials', 'cases', 'success', 'portfolio'], popular: true, priority: 18 },
    { name: 'Partners', href: '#partners', icon: Award, description: 'Strategic partnerships & alliances', status: 'live', category: 'Company', keywords: ['partners', 'partnership', 'strategic', 'alliance', 'collaboration', 'network'], popular: true, priority: 19 },
    { name: 'Investors', href: '#investors', icon: TrendingUp, description: 'Investment information & relations', status: 'live', category: 'Company', keywords: ['investor', 'funding', 'investment', 'finance', 'capital', 'business'], popular: true, priority: 20 },
    { name: 'Branding', href: '#branding', icon: Palette, description: 'Brand guidelines & visual assets', status: 'live', category: 'Company', keywords: ['brand', 'branding', 'logo', 'guidelines', 'design', 'identity'], priority: 21 },
    { name: 'Merchandise Store', href: '#merchandise-store', icon: ShoppingBag, description: 'Official Delibix merchandise', status: 'live', category: 'Company', keywords: ['merchandise', 'store', 'shop', 'products', 'clothing', 'gear'], priority: 22 },

    // === COMMUNITY & EVENTS (Priority 24-29) ===
    { name: 'Community', href: '#community', icon: Users2, description: 'Join our thriving AI community', status: 'live', category: 'Community', keywords: ['community', 'forum', 'discussion', 'social', 'network', 'connect'], popular: true, priority: 24 },
    { name: 'Events & Workshops', href: '#events-workshops', icon: Calendar, description: 'Upcoming events & training sessions', status: 'live', category: 'Community', keywords: ['events', 'workshops', 'training', 'calendar', 'meetups', 'sessions'], popular: true, priority: 25 },
    { name: 'FAQ', href: '#faq', icon: MessageCircle, description: 'Frequently asked questions', status: 'live', category: 'Community', keywords: ['faq', 'questions', 'answers', 'common', 'help', 'guide'], priority: 26 },
    { name: 'Help Center', href: '#help-center', icon: HelpCircle, description: 'Get help & comprehensive support', status: 'live', category: 'Community', keywords: ['help', 'support', 'assistance', 'guide', 'center', 'faq'], priority: 27 },
    { name: 'Support Portal', href: '#support', icon: Heart, description: 'Technical support & ticket system', status: 'live', category: 'Community', keywords: ['support', 'technical', 'help', 'portal', 'tickets', 'service'], priority: 28 },

    // === COMMUNITY GROWTH & ENGAGEMENT (Priority 29-31) ===
    { name: 'Newsletter', href: '#newsletter', icon: Newspaper, description: 'Subscribe to our AI insights newsletter', status: 'live', category: 'Community', keywords: ['newsletter', 'subscribe', 'insights', 'updates', 'email', 'news'], popular: true, priority: 29 },
    { name: 'Submit Idea', href: '#submit-idea', icon: Lightbulb, description: 'Share your ideas and feedback with us', status: 'live', category: 'Community', keywords: ['idea', 'feedback', 'suggestion', 'submit', 'feature', 'request'], priority: 30 },
    { name: 'Affiliate Program', href: '#affiliate', icon: Handshake, description: 'Join our affiliate program and earn commissions', status: 'live', category: 'Community', keywords: ['affiliate', 'partner', 'commission', 'earn', 'program', 'referral'], priority: 31 },

    // === KNOWLEDGE & RESOURCES (Priority 32-35) ===
    { name: 'Community Forum', href: '#community-forum', icon: MessageSquare, description: 'Discuss AI topics with fellow enthusiasts', status: 'live', category: 'Community', keywords: ['forum', 'discussion', 'community', 'topics', 'chat', 'questions'], popular: true, priority: 32 },
    { name: 'Knowledge Base', href: '#knowledge-base', icon: Archive, description: 'Comprehensive guides and tutorials', status: 'live', category: 'Support', keywords: ['knowledge', 'base', 'guides', 'tutorials', 'learn', 'documentation'], popular: true, priority: 33 },
    { name: 'Whitepapers', href: '#whitepapers', icon: Scroll, description: 'Research papers and industry insights', status: 'live', category: 'Support', keywords: ['whitepaper', 'research', 'paper', 'insights', 'analysis', 'reports'], popular: true, priority: 34 },
    { name: 'Glossary', href: '#glossary', icon: BookOpen, description: 'AI and technical terms dictionary', status: 'live', category: 'Support', keywords: ['glossary', 'dictionary', 'terms', 'definitions', 'ai', 'technical'], popular: true, priority: 35 },

    // === PRESS & MEDIA (Priority 36-38) ===
    { name: 'Press Releases', href: '#press-releases', icon: Megaphone, description: 'Latest company announcements and news', status: 'live', category: 'Press', keywords: ['press', 'releases', 'news', 'announcements', 'media', 'updates'], popular: true, priority: 36 },
    { name: 'Media Coverage', href: '#media-coverage', icon: Radio, description: 'News articles and media mentions', status: 'live', category: 'Press', keywords: ['media', 'coverage', 'articles', 'interviews', 'mentions', 'press'], popular: true, priority: 37 },
    { name: 'Press & Media Kit', href: '#press-media-kit', icon: Camera, description: 'Downloadable media assets and company info', status: 'live', category: 'Press', keywords: ['media-kit', 'press-kit', 'assets', 'logos', 'photos', 'resources'], popular: true, priority: 38 },

    // === LEGAL & SECURITY (Priority 39-43) ===
    { name: 'Security', href: '#security', icon: Shield, description: 'Security measures & data protection', status: 'live', category: 'Legal', keywords: ['security', 'safety', 'protection', 'measures', 'privacy', 'secure'], priority: 39 },
    { name: 'Privacy Policy', href: '#privacy-policy', icon: ShieldCheck, description: 'How we protect your personal data', status: 'live', category: 'Legal', keywords: ['privacy', 'policy', 'data', 'protection', 'gdpr', 'personal'], priority: 40 },
    { name: 'Terms of Service', href: '#terms-service', icon: Gavel, description: 'Terms and conditions of use', status: 'live', category: 'Legal', keywords: ['terms', 'service', 'conditions', 'legal', 'agreement', 'use'], priority: 41 },
    { name: 'Cookies Policy', href: '#cookies-policy', icon: CookieIcon, description: 'Cookie usage & preferences', status: 'live', category: 'Legal', keywords: ['cookies', 'policy', 'tracking', 'privacy', 'preferences', 'data'], priority: 42 },
    { name: 'Ethics & Transparency', href: '#ethics-transparency', icon: Scale, description: 'Our ethical practices and transparency commitments', status: 'live', category: 'Legal', keywords: ['ethics', 'transparency', 'responsibility', 'accountability', 'principles', 'governance'], popular: true, priority: 43 },

    // === SYSTEM PAGES (Priority 44-46) ===
    { name: '404 Error Page', href: '#404', icon: AlertTriangle, description: 'Page not found error handling', status: 'live', category: 'System', keywords: ['404', 'error', 'not', 'found', 'missing', 'broken'], priority: 44 },
    { name: '500 Server Error', href: '#500', icon: AlertTriangle, description: 'Internal server error page', status: 'live', category: 'System', keywords: ['500', 'server', 'error', 'internal', 'technical', 'down'], priority: 45 },
    { name: 'Maintenance', href: '#maintenance', icon: Wrench, description: 'Site maintenance page', status: 'live', category: 'System', keywords: ['maintenance', 'downtime', 'update', 'repair', 'unavailable', 'upgrade'], priority: 46 },
  ];

  // Enhanced filtering with NO LIMITS and better search
  const getFilteredPages = () => {
    let pages = allPages;

    // Filter by category if not 'all'
    if (activeCategory !== 'all') {
      pages = pages.filter(page => page.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      pages = pages.filter(page => 
        page.name.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query) ||
        page.category.toLowerCase().includes(query) ||
        page.keywords.some(keyword => keyword.includes(query)) ||
        // Enhanced search: partial matches
        query.split(' ').some(word => 
          page.name.toLowerCase().includes(word) ||
          page.description.toLowerCase().includes(word) ||
          page.keywords.some(keyword => keyword.includes(word))
        )
      );
    }

    // Sort by priority, then popularity, then alphabetically
    return pages.sort((a, b) => {
      // Priority first (lower number = higher priority)
      if (a.priority && b.priority) return a.priority - b.priority;
      if (a.priority && !b.priority) return -1;
      if (!a.priority && b.priority) return 1;
      
      // Then by popularity
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  const filteredPages = getFilteredPages();

  // Get pages by view mode
  const getDisplayPages = () => {
    switch (viewMode) {
      case 'popular':
        return allPages.filter(page => page.popular).sort((a, b) => 
          (a.priority || 999) - (b.priority || 999)
        );
      case 'category':
        return getFilteredPages();
      case 'all':
        return allPages.sort((a, b) => 
          (a.priority || 999) - (b.priority || 999)
        );
      default:
        return filteredPages;
    }
  };

  const displayPages = searchQuery ? filteredPages : getDisplayPages();

  // Quick contact actions
  const quickActions = [
    {
      name: 'WhatsApp',
      icon: Phone,
      description: '+62 857 7002 4933',
      action: () => window.open('http://wa.me/6285770024933', '_blank'),
      color: 'green'
    },
    {
      name: 'Email Us',
      icon: Mail,
      description: 'hello@delibix.com',
      action: () => window.open('mailto:hello@delibix.com', '_blank'),
      color: 'blue'
    },
  ];

  // Handle navigation - COMPREHENSIVE routing for ALL pages - FIXED VERSION
  const handleNavClick = (href: string) => {
    onClose();
    
    if (!navigate) {
      console.warn('Navigate function not provided to NavigationMenu');
      return;
    }

    // Remove the # from href to get the page identifier
    const pageId = href.replace('#', '');
    
    // Direct page mapping - this ensures clicks work properly
    const pageMapping: Record<string, string> = {
      // Core pages
      'home': 'home',
      'about': 'about',
      'contact-page': 'contact',
      'search': 'search',
      'sitemap': 'sitemap',
      'services': 'services',
      'blog': 'blog',
      'pricing': 'pricing',
      
      // AI Tools & Products
      'ai-playground': 'ai-playground',
      'autonomous-ai': 'agi',
      'experiments': 'experiments',
      'ai-roi-calculator': 'ai-roi-calculator',
      'ai-readiness-checklist': 'ai-readiness-checklist',
      'strategy-templates': 'strategy-templates',
      'documentation': 'documentation',
      
      // Company
      'team': 'team',
      'careers': 'careers',
      'clients': 'clients',
      'partners': 'partners',
      'investors': 'investors',
      'branding': 'branding',
      'merchandise-store': 'merchandise-store',
      
      // Community & Support
      'community': 'community',
      'events-workshops': 'events-workshops',
      'faq': 'faq',
      'help-center': 'help-center',
      'support': 'support',
      
      // Community Growth & Engagement
      'newsletter': 'newsletter',
      'submit-idea': 'submit-idea',
      'affiliate': 'affiliate',
      
      // Knowledge & Resources
      'community-forum': 'community-forum',
      'knowledge-base': 'knowledge-base',
      'whitepapers': 'whitepapers',
      'glossary': 'glossary',
      
      // Press & Media
      'press-releases': 'press-releases',
      'media-coverage': 'media-coverage',
      'press-media-kit': 'press-media-kit',
      
      // Legal & Security
      'security': 'security',
      'privacy-policy': 'privacy-policy',
      'terms-service': 'terms-service',
      'cookies-policy': 'cookies-policy',
      'ethics-transparency': 'ethics-transparency',
      
      // System pages
      '404': '404',
      '500': '500',
      'maintenance': 'maintenance'
    };

    // Get the mapped page name or use the original if no mapping exists
    const targetPage = pageMapping[pageId] || pageId;
    
    // Debug logging
    console.log('Navigation:', {
      originalHref: href,
      pageId: pageId,
      mappedPage: targetPage,
      hasMapping: !!pageMapping[pageId]
    });
    
    // Call the navigate function with the correct page
    navigate(targetPage);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % displayPages.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + displayPages.length) % displayPages.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (displayPages[selectedIndex]) {
          handleNavClick(displayPages[selectedIndex].href);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, displayPages, onClose]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, viewMode, activeCategory]);

  const getStatusBadge = (status?: string) => {
    if (!status || status === 'live') return null;
    
    const statusConfig = {
      'beta': { color: 'bg-orange-500/20 text-orange-600 border-orange-500/30', text: 'Beta' },
      'coming-soon': { color: 'bg-blue-500/20 text-blue-600 border-blue-500/30', text: 'Soon' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${config.color} ${
        isDark ? 'dark:bg-opacity-30' : ''
      }`}>
        {config.text}
      </span>
    );
  };

  const getPriorityIcon = (priority?: number) => {
    if (!priority || priority > 15) return null;
    
    if (priority <= 5) {
      return <Star className="w-3 h-3 text-amber-500 fill-amber-500" />;
    }
    
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Enhanced Command Palette */}
          <motion.div
            className={`fixed top-[8%] left-1/2 -translate-x-1/2 w-full max-w-4xl mx-auto z-50 ${
              isRTL ? 'rtl' : ''
            }`}
            initial={{ 
              opacity: 0,
              scale: 0.95,
              y: -20
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              y: -20
            }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.3
            }}
          >
            <div className={`mx-4 rounded-2xl shadow-2xl border overflow-hidden ${
              isDark 
                ? 'bg-slate-800/95 border-blue-400/20' 
                : 'bg-white/95 border-blue-200/50'
            } backdrop-blur-xl`}>
              
              {/* Enhanced Header with Search */}
              <div className={`p-6 border-b ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/30'
              }`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Command className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`} />
                        <Input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search all pages..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12 text-lg ${
                            isDark 
                              ? 'bg-slate-700/50 border-blue-400/20 text-slate-200 placeholder:text-slate-400' 
                              : 'bg-blue-50/50 border-blue-200/50 text-slate-800 placeholder:text-slate-500'
                          } rounded-xl`}
                        />
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={onClose}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      isDark 
                        ? 'hover:bg-slate-700/50 text-slate-300 hover:text-slate-100' 
                        : 'hover:bg-blue-50/50 text-slate-600 hover:text-slate-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* View Mode Toggles */}
                {!searchQuery && (
                  <div className={`flex items-center gap-2 mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <motion.button
                      onClick={() => setViewMode('popular')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        viewMode === 'popular'
                          ? isDark
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-blue-100 text-blue-700'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-slate-600 hover:text-slate-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Star className="w-4 h-4 inline mr-1" />
                      Popular
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('category')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        viewMode === 'category'
                          ? isDark
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-blue-100 text-blue-700'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-slate-600 hover:text-slate-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Filter className="w-4 h-4 inline mr-1" />
                      By Category
                    </motion.button>
                    <motion.button
                      onClick={() => setViewMode('all')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        viewMode === 'all'
                          ? isDark
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-blue-100 text-blue-700'
                          : isDark
                            ? 'text-slate-400 hover:text-slate-200'
                            : 'text-slate-600 hover:text-slate-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <List className="w-4 h-4 inline mr-1" />
                      All Pages
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Category Tabs (only show in category mode) */}
              {!searchQuery && viewMode === 'category' && (
                <div className={`flex border-b overflow-x-auto ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/30'
                } px-6`}>
                  <div className="flex space-x-1 pb-1">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                          activeCategory === category.id
                            ? isDark
                              ? 'bg-blue-500/20 text-blue-300 border-b-2 border-blue-400'
                              : 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                            : isDark
                              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-blue-25'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="max-h-[65vh] overflow-y-auto">
                {/* Page Results */}
                <div className="p-6">
                  <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h3 className={`text-sm font-semibold ${
                      isDark ? 'text-blue-300' : 'text-blue-600'
                    } ${isRTL ? 'text-right' : ''}`}>
                      {searchQuery 
                        ? `${displayPages.length} results for "${searchQuery}"` 
                        : viewMode === 'popular' 
                          ? 'Most Popular Pages'
                          : viewMode === 'category' && activeCategory !== 'all'
                            ? `${categories.find(c => c.id === activeCategory)?.name} Pages`
                            : `All ${allPages.length} Pages`
                      }
                    </h3>
                    <span className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {displayPages.length} showing
                    </span>
                  </div>
                  
                  {displayPages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {displayPages.map((item, index) => (
                        <motion.button
                          key={item.href}
                          onClick={() => handleNavClick(item.href)}
                          className={`text-left p-4 rounded-xl transition-all duration-200 group ${
                            index === selectedIndex
                              ? isDark
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30 ring-2 ring-blue-400/20'
                                : 'bg-blue-50 text-blue-700 border border-blue-200 ring-2 ring-blue-200/50'
                              : isDark 
                                ? 'hover:bg-blue-500/10 text-slate-300 hover:text-blue-300 border border-transparent hover:border-blue-500/20' 
                                : 'hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 border border-transparent hover:border-blue-200/50'
                          } ${isRTL ? 'text-right' : ''} h-full`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.01 }}
                          whileHover={{ y: -2, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`flex flex-col gap-3 h-full ${isRTL ? 'items-end' : 'items-start'}`}>
                            {/* Icon and Status Row */}
                            <div className={`flex items-center justify-between w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className={`p-2 rounded-lg transition-all duration-200 ${
                                index === selectedIndex
                                  ? isDark 
                                    ? 'bg-blue-500/30' 
                                    : 'bg-blue-200'
                                  : isDark 
                                    ? 'bg-blue-500/20 group-hover:bg-blue-500/30' 
                                    : 'bg-blue-100 group-hover:bg-blue-200'
                              }`}>
                                <item.icon className={`w-5 h-5 ${
                                  isDark ? 'text-blue-300' : 'text-blue-600'
                                }`} />
                              </div>
                              <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {getStatusBadge(item.status)}
                                {item.popular && getPriorityIcon(item.priority)}
                                {index === selectedIndex && (
                                  <div className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                    ⏎
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Title and Description */}
                            <div className={`flex-1 min-w-0 w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                              <div className={`font-medium mb-1 line-clamp-1 ${isRTL ? 'text-right' : ''}`}>
                                {item.name}
                              </div>
                              <div className={`text-sm opacity-70 line-clamp-2 mb-2 ${isRTL ? 'text-right' : ''}`}>
                                {item.description}
                              </div>
                              
                              {/* Category and Priority */}
                              <div className={`flex items-center justify-between text-xs opacity-60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className={`truncate ${isRTL ? 'text-right' : ''}`}>
                                  {item.category}
                                </span>
                                {item.priority && item.priority <= 15 && (
                                  <span className={`px-1.5 py-0.5 bg-amber-500/20 text-amber-600 rounded-full text-xs ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                    #{item.priority}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Arrow */}
                            <div className={`w-full flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                              <ArrowRight className={`w-4 h-4 opacity-40 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 ${
                                isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''
                              }`} />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-center py-12 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No pages found</p>
                      <p>Try different keywords or browse by category</p>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {!searchQuery && viewMode === 'popular' && (
                  <div className={`px-6 pb-6 border-t ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/30'
                  }`}>
                    <h3 className={`text-sm font-semibold mb-4 mt-6 ${
                      isDark ? 'text-blue-300' : 'text-blue-600'
                    } ${isRTL ? 'text-right' : ''}`}>
                      Quick Contact
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.name}
                          onClick={() => {
                            action.action();
                            onClose();
                          }}
                          className={`p-4 rounded-xl text-left transition-all duration-200 ${
                            isDark 
                              ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200' 
                              : 'bg-blue-50/50 hover:bg-blue-100/50 text-slate-800'
                          } ${isRTL ? 'text-right' : ''}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <action.icon className={`w-5 h-5 ${
                              action.color === 'green' 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-blue-600 dark:text-blue-400'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <div className={`font-medium truncate ${isRTL ? 'text-right' : ''}`}>
                                {action.name}
                              </div>
                              <div className={`text-xs opacity-70 truncate ${isRTL ? 'text-right' : ''}`}>
                                {action.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              <div className={`px-6 py-3 border-t text-center ${
                isDark ? 'border-blue-400/20 text-slate-400' : 'border-blue-200/30 text-slate-500'
              }`}>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Enter</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-xs">Esc</kbd>
                    Close
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    • {allPages.length} total pages
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}