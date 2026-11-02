"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Building2, Globe, Handshake, Award, Users, Star, 
  ArrowRight, ExternalLink, Target, TrendingUp, Zap,
  Rocket, CheckCircle, Crown, Link, Filter, Plus,
  MessageSquare, Phone, Mail, Briefcase, Heart
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface PartnersPageProps {
  navigate?: (page: any) => void;
}

export function PartnersPage({ navigate }: PartnersPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Partners Data
  const partners = [
    {
      id: 'tech-giant-a',
      name: 'Google Cloud',
      type: 'Technology Partner',
      tier: 'Premier',
      region: 'Global',
      logo: '/api/placeholder/200/80',
      website: 'https://cloud.google.com',
      description: 'Leading cloud infrastructure and AI platform provider',
      partnership: {
        started: '2023-01-15',
        type: 'Strategic Technology Alliance',
        focus: 'AI/ML Infrastructure and Scaling'
      },
      benefits: [
        'Access to cutting-edge Google AI/ML APIs',
        'Preferred cloud infrastructure pricing',
        'Technical support and training resources',
        'Joint go-to-market opportunities'
      ],
      collaborations: [
        'AI model deployment optimization',
        'Enterprise client infrastructure scaling',
        'Advanced analytics platform development'
      ],
      certifications: ['Google Cloud Partner', 'ML Specialization'],
      jointProjects: 12,
      featured: true,
      status: 'active'
    },
    {
      id: 'consulting-firm-b',
      name: 'Accenture Indonesia',
      type: 'Consulting Partner',
      tier: 'Strategic',
      region: 'Indonesia',
      logo: '/api/placeholder/200/80',
      website: 'https://accenture.com',
      description: 'Global management consulting and technology services company',
      partnership: {
        started: '2023-03-10',
        type: 'Strategic Consulting Alliance',
        focus: 'Enterprise AI Transformation'
      },
      benefits: [
        'Access to enterprise client network',
        'Joint consulting methodology development',
        'Shared expertise in digital transformation',
        'Regional market expansion opportunities'
      ],
      collaborations: [
        'Large enterprise AI implementations',
        'Industry-specific AI solutions',
        'Executive AI strategy consulting'
      ],
      certifications: ['Accenture Partner Network', 'AI Transformation Certified'],
      jointProjects: 8,
      featured: true,
      status: 'active'
    },
    {
      id: 'university-c',
      name: 'Universitas Gadjah Mada',
      type: 'Academic Partner',
      tier: 'Research',
      region: 'Indonesia',
      logo: '/api/placeholder/200/80',
      website: 'https://ugm.ac.id',
      description: 'Leading research university in Indonesia with strong AI/ML programs',
      partnership: {
        started: '2022-08-20',
        type: 'Research and Education Partnership',
        focus: 'AI Research and Talent Development'
      },
      benefits: [
        'Access to cutting-edge research',
        'Talent pipeline for recruitment',
        'Joint research publication opportunities',
        'Academic credibility and validation'
      ],
      collaborations: [
        'AI ethics research initiatives',
        'Student internship programs',
        'Faculty guest lecture series'
      ],
      certifications: ['Research Partnership Agreement', 'Academic Collaboration'],
      jointProjects: 5,
      featured: false,
      status: 'active'
    },
    {
      id: 'startup-accelerator-d',
      name: 'Techstars',
      type: 'Accelerator Partner',
      tier: 'Growth',
      region: 'Global',
      logo: '/api/placeholder/200/80',
      website: 'https://techstars.com',
      description: 'Global startup accelerator with strong focus on AI and emerging technologies',
      partnership: {
        started: '2023-06-01',
        type: 'Startup Ecosystem Partnership',
        focus: 'AI Startup Mentorship and Investment'
      },
      benefits: [
        'Access to innovative startup ecosystem',
        'Early access to emerging AI technologies',
        'Investment and acquisition opportunities',
        'Mentorship and advisory roles'
      ],
      collaborations: [
        'AI startup mentorship programs',
        'Technology evaluation and investment',
        'Innovation lab partnerships'
      ],
      certifications: ['Techstars Mentor Network', 'Startup Advisor'],
      jointProjects: 15,
      featured: true,
      status: 'active'
    },
    {
      id: 'integration-platform-e',
      name: 'Salesforce',
      type: 'Technology Partner',
      tier: 'Certified',
      region: 'Global',
      logo: '/api/placeholder/200/80',
      website: 'https://salesforce.com',
      description: 'Leading CRM platform with extensive AI integration capabilities',
      partnership: {
        started: '2023-02-28',
        type: 'Technology Integration Partnership',
        focus: 'CRM AI Enhancement and Integration'
      },
      benefits: [
        'Native Salesforce app marketplace listing',
        'Technical integration support',
        'Joint customer success programs',
        'Co-marketing opportunities'
      ],
      collaborations: [
        'AI-powered CRM analytics',
        'Customer behavior prediction models',
        'Automated sales process optimization'
      ],
      certifications: ['Salesforce ISV Partner', 'AppExchange Certified'],
      jointProjects: 7,
      featured: false,
      status: 'active'
    },
    {
      id: 'regional-gov-f',
      name: 'Pemprov DIY',
      type: 'Government Partner',
      tier: 'Public Sector',
      region: 'Indonesia',
      logo: '/api/placeholder/200/80',
      website: 'https://jogjaprov.go.id',
      description: 'Yogyakarta Provincial Government - Smart City and Digital Transformation',
      partnership: {
        started: '2023-04-15',
        type: 'Public-Private Partnership',
        focus: 'Smart City AI Implementation'
      },
      benefits: [
        'Public sector project opportunities',
        'Policy influence and advocacy',
        'Community impact and social responsibility',
        'Regional ecosystem development'
      ],
      collaborations: [
        'Smart traffic management system',
        'Public service optimization',
        'Urban planning AI assistance'
      ],
      certifications: ['Government Vendor Registration', 'Smart City Partner'],
      jointProjects: 3,
      featured: false,
      status: 'active'
    },
    {
      id: 'fintech-platform-g',
      name: 'Stripe',
      type: 'Financial Partner',
      tier: 'Verified',
      region: 'Global',
      logo: '/api/placeholder/200/80',
      website: 'https://stripe.com',
      description: 'Global payment processing platform enabling seamless financial transactions',
      partnership: {
        started: '2023-05-10',
        type: 'Financial Services Partnership',
        focus: 'Payment Processing and Financial AI'
      },
      benefits: [
        'Streamlined payment processing',
        'Global market payment access',
        'Financial data analytics capabilities',
        'Fraud detection integration'
      ],
      collaborations: [
        'AI-powered fraud detection',
        'Payment optimization algorithms',
        'Financial analytics dashboards'
      ],
      certifications: ['Stripe Verified Partner', 'Financial Services Certified'],
      jointProjects: 4,
      featured: false,
      status: 'active'
    },
    {
      id: 'media-agency-h',
      name: 'WPP Indonesia',
      type: 'Marketing Partner',
      tier: 'Preferred',
      region: 'Indonesia',
      logo: '/api/placeholder/200/80',
      website: 'https://wpp.com',
      description: 'Leading marketing and communications agency with AI-driven campaigns',
      partnership: {
        started: '2023-07-20',
        type: 'Marketing and Communications Alliance',
        focus: 'AI-Driven Marketing Solutions'
      },
      benefits: [
        'Enhanced marketing campaign effectiveness',
        'Access to creative talent and resources',
        'Brand positioning and communication',
        'Market research and insights'
      ],
      collaborations: [
        'AI-powered campaign optimization',
        'Customer segmentation algorithms',
        'Brand sentiment analysis'
      ],
      certifications: ['WPP Preferred Partner', 'Marketing AI Specialist'],
      jointProjects: 6,
      featured: false,
      status: 'active'
    }
  ];

  // Partner Types
  const partnerTypes = [
    { id: 'all', name: 'All Partners', count: partners.length },
    { id: 'Technology Partner', name: 'Technology', count: partners.filter(p => p.type === 'Technology Partner').length },
    { id: 'Consulting Partner', name: 'Consulting', count: partners.filter(p => p.type === 'Consulting Partner').length },
    { id: 'Academic Partner', name: 'Academic', count: partners.filter(p => p.type === 'Academic Partner').length },
    { id: 'Accelerator Partner', name: 'Accelerator', count: partners.filter(p => p.type === 'Accelerator Partner').length },
    { id: 'Government Partner', name: 'Government', count: partners.filter(p => p.type === 'Government Partner').length },
    { id: 'Financial Partner', name: 'Financial', count: partners.filter(p => p.type === 'Financial Partner').length },
    { id: 'Marketing Partner', name: 'Marketing', count: partners.filter(p => p.type === 'Marketing Partner').length }
  ];

  // Regions
  const regions = [
    { id: 'all', name: 'All Regions', count: partners.length },
    { id: 'Global', name: 'Global', count: partners.filter(p => p.region === 'Global').length },
    { id: 'Indonesia', name: 'Indonesia', count: partners.filter(p => p.region === 'Indonesia').length },
    { id: 'Southeast Asia', name: 'Southeast Asia', count: partners.filter(p => p.region === 'Southeast Asia').length }
  ];

  // Partnership Stats
  const partnershipStats = [
    { label: 'Active Partners', value: partners.length, icon: Handshake },
    { label: 'Partner Types', value: partnerTypes.length - 1, icon: Building2 },
    { label: 'Joint Projects', value: partners.reduce((sum, p) => sum + p.jointProjects, 0), icon: Rocket },
    { label: 'Global Reach', value: '25+', icon: Globe }
  ];

  // Filter partners
  const filteredPartners = partners.filter(partner => {
    const matchesType = selectedType === 'all' || partner.type === selectedType;
    const matchesRegion = selectedRegion === 'all' || partner.region === selectedRegion;
    return matchesType && matchesRegion;
  });

  // Get partner type icon
  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'Technology Partner': return Rocket;
      case 'Consulting Partner': return Users;
      case 'Academic Partner': return Award;
      case 'Accelerator Partner': return TrendingUp;
      case 'Government Partner': return Building2;
      case 'Financial Partner': return Target;
      case 'Marketing Partner': return Zap;
      default: return Handshake;
    }
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Premier': return 'from-purple-500 to-purple-600';
      case 'Strategic': return 'from-blue-500 to-blue-600';
      case 'Certified': return 'from-green-500 to-green-600';
      case 'Preferred': return 'from-orange-500 to-orange-600';
      case 'Research': return 'from-teal-500 to-teal-600';
      case 'Growth': return 'from-pink-500 to-pink-600';
      case 'Public Sector': return 'from-indigo-500 to-indigo-600';
      case 'Verified': return 'from-emerald-500 to-emerald-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  // Get tier badge color
  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Premier': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Strategic': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Certified': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Preferred': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Research': return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'Growth': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'Public Sector': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'Verified': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Partnership Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 10 }, (_, i) => {
              const icons = [Handshake, Building2, Globe, Users, Rocket];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + (i % 5) * 20}%`,
                    top: `${15 + Math.floor(i / 5) * 35}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                >
                  <IconComponent className="w-16 h-16 text-blue-500" />
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
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {partners.length}+ Strategic Partners
              </span>
              <Heart className="w-4 h-4 text-red-500" />
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
                Our <span className="gradient-text-blue">Partners</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Strategic alliances with industry leaders, innovative startups, and prestigious institutions. 
                Together, we're building the future of AI-powered business transformation.
              </motion.p>
            </div>

            {/* Partnership Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {partnershipStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-blue-500" />
                    <div className={`text-3xl font-bold gradient-text-blue`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
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
                onClick={() => navigate('contact')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Become a Partner
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
                  const element = document.getElementById('partner-network');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Partnerships
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Network Section */}
      <section id="partner-network" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Partner <span className="gradient-text-blue">Network</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Our diverse ecosystem of strategic partnerships spans technology, consulting, academia, and more.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-12 space-y-6">
            {/* Partner Type Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {partnerTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedType === type.id
                      ? 'gradient-bg-blue text-white shadow-lg'
                      : isDark
                        ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                        : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{type.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedType === type.id
                      ? 'bg-white/20 text-white'
                      : isDark
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-600'
                  }`}>
                    {type.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {regions.map((region) => (
                <motion.button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
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

          {/* Partners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPartners.map((partner, index) => {
              const TypeIcon = getPartnerTypeIcon(partner.type);
              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  } ${partner.featured ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="p-8">
                    {/* Partner Header */}
                    <div className={`flex items-start gap-6 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getTierColor(partner.tier)} flex items-center justify-center flex-shrink-0`}>
                        <TypeIcon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className={`flex items-center gap-4 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h3 className={`text-xl font-bold ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            {partner.name}
                          </h3>
                          {partner.featured && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className={`text-base mb-3 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {partner.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge className={`border ${getTierBadgeColor(partner.tier)}`}>
                            <Crown className="w-3 h-3 mr-1" />
                            {partner.tier}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {partner.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {partner.region}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="space-y-6">
                      {/* Partnership Info */}
                      <div className={`p-4 rounded-xl ${
                        isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <h4 className={`text-sm font-semibold mb-3 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          Partnership Focus
                        </h4>
                        <p className={`text-sm mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          <strong>{partner.partnership.type}</strong>
                        </p>
                        <p className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {partner.partnership.focus}
                        </p>
                        <div className={`flex items-center gap-4 mt-3 text-xs ${
                          isDark ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          <span>Since {new Date(partner.partnership.started).getFullYear()}</span>
                          <span>•</span>
                          <span>{partner.jointProjects} Joint Projects</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          Partnership Benefits
                        </h4>
                        <ul className="space-y-2">
                          {partner.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className={`flex items-start gap-2 text-sm ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                              } ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Collaborations */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          Key Collaborations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {partner.collaborations.map((collab, collabIndex) => (
                            <Badge key={collabIndex} variant="secondary" className="text-xs">
                              {collab}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h4 className={`text-sm font-semibold mb-3 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {partner.certifications.map((cert, certIndex) => (
                            <Badge key={certIndex} className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                              <Award className="w-3 h-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center justify-between pt-6 border-t ${
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(partner.website, '_blank')}
                      >
                        <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </Button>
                      <Badge className={`text-xs ${
                        partner.status === 'active' 
                          ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                          : 'bg-gray-500/10 text-gray-600 border-gray-500/20'
                      }`}>
                        {partner.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <Handshake className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No partners found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-16 lg:py-24">
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
              Why <span className="gradient-text-blue">Partner</span> with Us?
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Join our ecosystem and unlock new opportunities for growth, innovation, and mutual success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Market Expansion',
                description: 'Access new markets and customer segments through our global network',
                icon: Globe,
                benefits: ['Global reach', 'New customer access', 'Market insights']
              },
              {
                title: 'Technical Innovation',
                description: 'Collaborate on cutting-edge AI technologies and solutions',
                icon: Rocket,
                benefits: ['Joint R&D', 'Shared expertise', 'Innovation labs']
              },
              {
                title: 'Business Growth',
                description: 'Drive revenue growth through strategic partnership opportunities',
                icon: TrendingUp,
                benefits: ['Revenue sharing', 'Co-marketing', 'Joint sales']
              },
              {
                title: 'Resource Sharing',
                description: 'Leverage shared resources and capabilities for mutual benefit',
                icon: Users,
                benefits: ['Cost optimization', 'Resource pooling', 'Skill sharing']
              },
              {
                title: 'Brand Enhancement',
                description: 'Strengthen brand positioning through strategic associations',
                icon: Award,
                benefits: ['Brand credibility', 'Market validation', 'Thought leadership']
              },
              {
                title: 'Future Ready',
                description: 'Prepare for the future with AI-first partnership strategies',
                icon: Zap,
                benefits: ['Future technologies', 'Innovation pipeline', 'Competitive advantage']
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg-blue flex items-center justify-center`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {benefit.title}
                </h3>
                <p className={`text-base mb-4 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {benefit.description}
                </p>
                <ul className="space-y-2">
                  {benefit.benefits.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`flex items-center justify-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to <span className="text-blue-200">Partner</span> with Us?
            </h2>
            
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              Join our growing ecosystem of strategic partners and unlock new opportunities for innovation, 
              growth, and mutual success in the AI-driven future.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('contact')}
              >
                <Handshake className="w-5 h-5 mr-3" />
                Become a Partner
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('services')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Learn More
              </Button>
            </div>

            {/* Contact Info */}
            <motion.div
              className="pt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-blue-200 mb-4">
                Interested in exploring partnership opportunities? Let's discuss how we can work together.
              </p>
              <div className="flex items-center justify-center gap-6">
                <span className="text-blue-100">partnerships@delibix.com</span>
                <span className="text-blue-100">+62 857 7002 4933</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}