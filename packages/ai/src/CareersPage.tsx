"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { 
  Users, MapPin, Calendar, Briefcase, ArrowRight, Search, 
  Filter, Star, CheckCircle, Heart, Coffee, Car, 
  Zap, Shield, TrendingUp, Award, Globe, Building2,
  Clock, DollarSign, Laptop, Wifi, BookOpen, 
  Target, Lightbulb, Rocket, Brain, Code, Palette,
  HeadphonesIcon, MessageSquare, Mail, Phone
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface CareersPageProps {
  navigate?: (page: any) => void;
}

export function CareersPage({ navigate }: CareersPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Job Openings Data
  const jobOpenings = [
    {
      id: 'senior-ai-engineer',
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Senior',
      salary: '$80,000 - $120,000',
      description: 'Lead the development of cutting-edge AI solutions and machine learning models that power our digital consulting platform.',
      requirements: [
        '5+ years experience in AI/ML development',
        'Strong background in Python, TensorFlow, PyTorch',
        'Experience with large language models and neural networks',
        'PhD in Computer Science, AI, or related field preferred'
      ],
      responsibilities: [
        'Design and implement advanced AI algorithms',
        'Lead machine learning research initiatives',
        'Collaborate with cross-functional teams',
        'Mentor junior engineers and data scientists'
      ],
      benefits: ['Remote work', 'Health insurance', 'Stock options', 'Learning budget'],
      featured: true,
      urgent: false,
      postedDays: 3
    },
    {
      id: 'fullstack-developer',
      title: 'Full-Stack Developer',
      department: 'Engineering',
      location: 'Yogyakarta',
      type: 'Full-time',
      experience: 'Mid-level',
      salary: '$50,000 - $70,000',
      description: 'Build and maintain our web applications using modern technologies like React, Node.js, and cloud infrastructure.',
      requirements: [
        '3+ years full-stack development experience',
        'Proficiency in React, Node.js, TypeScript',
        'Experience with cloud platforms (AWS, GCP)',
        'Strong understanding of web architecture'
      ],
      responsibilities: [
        'Develop responsive web applications',
        'Build and maintain APIs and databases',
        'Implement security best practices',
        'Collaborate with designers and product managers'
      ],
      benefits: ['Hybrid work', 'Health insurance', 'Performance bonus', 'Tech stipend'],
      featured: true,
      urgent: true,
      postedDays: 1
    },
    {
      id: 'digital-marketing-specialist',
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      salary: '$45,000 - $65,000',
      description: 'Drive our digital marketing efforts across multiple channels to increase brand awareness and generate qualified leads.',
      requirements: [
        '3+ years digital marketing experience',
        'Expertise in SEO, SEM, social media marketing',
        'Experience with analytics tools (Google Analytics, etc.)',
        'Strong content creation and copywriting skills'
      ],
      responsibilities: [
        'Develop and execute marketing campaigns',
        'Optimize SEO and manage paid advertising',
        'Create engaging content for multiple platforms',
        'Analyze campaign performance and ROI'
      ],
      benefits: ['Remote work', 'Health insurance', 'Marketing budget', 'Conference tickets'],
      featured: false,
      urgent: false,
      postedDays: 7
    },
    {
      id: 'ux-ui-designer',
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Yogyakarta',
      type: 'Full-time',
      experience: 'Mid-level',
      salary: '$40,000 - $60,000',
      description: 'Create intuitive and beautiful user experiences for our AI-powered consulting platform and client applications.',
      requirements: [
        '3+ years UX/UI design experience',
        'Proficiency in Figma, Adobe Creative Suite',
        'Strong portfolio showcasing web/mobile design',
        'Understanding of design systems and accessibility'
      ],
      responsibilities: [
        'Design user interfaces and experiences',
        'Conduct user research and usability testing',
        'Create wireframes, prototypes, and design systems',
        'Collaborate with developers and product managers'
      ],
      benefits: ['Hybrid work', 'Health insurance', 'Design tools budget', 'Creative time'],
      featured: true,
      urgent: false,
      postedDays: 5
    },
    {
      id: 'business-development-manager',
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Senior',
      salary: '$60,000 - $90,000',
      description: 'Drive business growth by identifying new opportunities, building partnerships, and expanding our client base.',
      requirements: [
        '5+ years business development experience',
        'Strong network in digital consulting or tech industry',
        'Excellent communication and negotiation skills',
        'Experience with CRM systems and sales processes'
      ],
      responsibilities: [
        'Identify and pursue new business opportunities',
        'Build and maintain strategic partnerships',
        'Develop proposals and close deals',
        'Represent company at industry events'
      ],
      benefits: ['Remote work', 'Commission structure', 'Travel allowance', 'Networking budget'],
      featured: false,
      urgent: true,
      postedDays: 2
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      department: 'Data',
      location: 'Remote',
      type: 'Contract',
      experience: 'Senior',
      salary: '$70,000 - $100,000',
      description: 'Extract insights from large datasets to inform business decisions and improve our AI models and consulting services.',
      requirements: [
        '4+ years data science experience',
        'Strong skills in Python, R, SQL',
        'Experience with machine learning and statistical analysis',
        'Knowledge of data visualization tools'
      ],
      responsibilities: [
        'Analyze complex datasets for business insights',
        'Build predictive models and algorithms',
        'Create data visualizations and reports',
        'Collaborate with AI team on model improvement'
      ],
      benefits: ['Remote work', 'Flexible hours', 'Learning budget', 'Conference attendance'],
      featured: false,
      urgent: false,
      postedDays: 10
    }
  ];

  // Filter options
  const departments = [
    { id: 'all', name: 'All Departments', count: jobOpenings.length },
    { id: 'Engineering', name: 'Engineering', count: jobOpenings.filter(job => job.department === 'Engineering').length },
    { id: 'Marketing', name: 'Marketing', count: jobOpenings.filter(job => job.department === 'Marketing').length },
    { id: 'Design', name: 'Design', count: jobOpenings.filter(job => job.department === 'Design').length },
    { id: 'Sales', name: 'Sales', count: jobOpenings.filter(job => job.department === 'Sales').length },
    { id: 'Data', name: 'Data', count: jobOpenings.filter(job => job.department === 'Data').length }
  ];

  const locations = [
    { id: 'all', name: 'All Locations', count: jobOpenings.length },
    { id: 'Remote', name: 'Remote', count: jobOpenings.filter(job => job.location === 'Remote').length },
    { id: 'Yogyakarta', name: 'Yogyakarta', count: jobOpenings.filter(job => job.location === 'Yogyakarta').length },
    { id: 'Hybrid', name: 'Hybrid', count: jobOpenings.filter(job => job.location === 'Hybrid').length }
  ];

  const jobTypes = [
    { id: 'all', name: 'All Types', count: jobOpenings.length },
    { id: 'Full-time', name: 'Full-time', count: jobOpenings.filter(job => job.type === 'Full-time').length },
    { id: 'Part-time', name: 'Part-time', count: jobOpenings.filter(job => job.type === 'Part-time').length },
    { id: 'Contract', name: 'Contract', count: jobOpenings.filter(job => job.type === 'Contract').length }
  ];

  // Company Benefits
  const companyBenefits = [
    {
      title: 'Flexible Work Environment',
      description: 'Work remotely, in our Yogyakarta office, or choose a hybrid model that works best for you.',
      icon: Laptop,
      color: 'blue'
    },
    {
      title: 'Professional Development',
      description: 'Annual learning budget, conference tickets, and support for certifications and courses.',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Competitive Compensation',
      description: 'Competitive salaries, performance bonuses, and equity options for full-time employees.',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness allowances.',
      icon: Heart,
      color: 'red'
    },
    {
      title: 'Innovation Time',
      description: '20% time for personal projects, research, and exploring new technologies and ideas.',
      icon: Lightbulb,
      color: 'orange'
    },
    {
      title: 'Global Impact',
      description: 'Work on projects that democratize AI and help businesses worldwide transform digitally.',
      icon: Globe,
      color: 'teal'
    }
  ];

  // Company Values
  const companyValues = [
    {
      title: 'Innovation First',
      description: 'We push the boundaries of what is possible with AI and technology.',
      icon: Rocket
    },
    {
      title: 'Transparency',
      description: 'Open communication, honest feedback, and clear decision-making processes.',
      icon: Shield
    },
    {
      title: 'Growth Mindset',
      description: 'Continuous learning, experimenting, and improving both personally and professionally.',
      icon: TrendingUp
    },
    {
      title: 'Global Perspective',
      description: 'Serving clients worldwide while maintaining our Indonesian roots and values.',
      icon: Globe
    }
  ];

  // Filter jobs based on selected criteria
  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesLocation && matchesType && matchesSearch;
  });

  // Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Engineering': return Code;
      case 'Marketing': return TrendingUp;
      case 'Design': return Palette;
      case 'Sales': return Target;
      case 'Data': return Brain;
      default: return Briefcase;
    }
  };

  // Get experience level color
  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Entry-level': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Mid-level': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Senior': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  // Get benefit color
  const getBenefitColor = (color: string) => {
    switch (color) {
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'purple': return 'from-purple-500 to-purple-600';
      case 'red': return 'from-red-500 to-red-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      case 'teal': return 'from-teal-500 to-teal-600';
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
          
          {/* Animated Career Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 12 }, (_, i) => {
              const icons = [Code, Palette, Brain, Target, BookOpen, Rocket];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + (i % 4) * 20}%`,
                    top: `${20 + Math.floor(i / 4) * 25}%`,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5
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
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {jobOpenings.length} Open Positions
              </span>
              <Star className="w-4 h-4 text-amber-500" />
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
                Join Our <span className="gradient-text-blue">Mission</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Help us democratize AI and transform businesses worldwide. Join our team of 
                innovators, creators, and problem-solvers working on the future of digital consulting.
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
                  {jobOpenings.length}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Open Positions
                </div>
              </div>
              
              <div className={`glass-heavy rounded-2xl p-6 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  5
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Departments
                </div>
              </div>
              
              <div className={`glass-heavy rounded-2xl p-6 text-center ${
                isDark ? 'border-blue-400/20' : 'border-blue-200/50'
              }`}>
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  Remote
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Work Options
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
                  const element = document.getElementById('open-positions');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  View Open Positions
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
                  const element = document.getElementById('company-culture');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn About Our Culture
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Benefits Section */}
      <section id="company-culture" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Why <span className="gradient-text-blue">Delibix</span>?
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              We offer more than just a job - we provide an environment where you can grow, 
              innovate, and make a meaningful impact on the future of AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyBenefits.map((benefit, index) => (
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
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${getBenefitColor(benefit.color)} flex items-center justify-center`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {benefit.title}
                </h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values Section */}
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
              Our <span className="gradient-text-blue">Values</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              The principles that guide everything we do and the foundation of our company culture.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center flex-shrink-0`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}>
                      {value.title}
                    </h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Open <span className="gradient-text-blue">Positions</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Find your perfect role and join our mission to democratize AI and transform businesses worldwide.
            </p>
          </motion.div>

          {/* Filters and Search */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <Input
                  type="text"
                  placeholder="Search positions..."
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

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* Department Filter */}
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <motion.button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedDepartment === dept.id
                        ? 'gradient-bg-blue text-white shadow-lg'
                        : isDark
                          ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                          : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{dept.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedDepartment === dept.id
                        ? 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-blue-100 text-blue-600'
                    }`}>
                      {dept.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Location Filter */}
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <motion.button
                    key={location.id}
                    onClick={() => setSelectedLocation(location.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedLocation === location.id
                        ? 'gradient-bg-blue text-white shadow-lg'
                        : isDark
                          ? 'glass-secondary border border-blue-400/20 text-slate-300 hover:bg-blue-400/10'
                          : 'glass-secondary border border-blue-200/50 text-slate-600 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{location.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedLocation === location.id
                        ? 'bg-white/20 text-white'
                        : isDark
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-blue-100 text-blue-600'
                    }`}>
                      {location.count}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Job Type Filter */}
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
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
                    <Clock className="w-4 h-4" />
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
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job, index) => {
              const DepartmentIcon = getDepartmentIcon(job.department);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  } ${job.featured ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="p-8">
                    <div className={`flex items-start justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-1">
                        <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                            <DepartmentIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className={`text-2xl font-bold ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              {job.title}
                            </h3>
                            <div className={`flex items-center gap-4 text-sm ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            } ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className={`text-base mb-6 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {job.description}
                        </p>

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                          {/* Requirements */}
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              Requirements
                            </h4>
                            <ul className="space-y-2">
                              {job.requirements.map((req, reqIndex) => (
                                <li
                                  key={reqIndex}
                                  className={`flex items-start gap-2 text-sm ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Responsibilities */}
                          <div>
                            <h4 className={`text-lg font-semibold mb-3 ${
                              isDark ? 'text-slate-100' : 'text-slate-900'
                            }`}>
                              Responsibilities
                            </h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp, respIndex) => (
                                <li
                                  key={respIndex}
                                  className={`flex items-start gap-2 text-sm ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                  } ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                  {resp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-6">
                          <h4 className={`text-lg font-semibold mb-3 ${
                            isDark ? 'text-slate-100' : 'text-slate-900'
                          }`}>
                            Benefits
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit, benefitIndex) => (
                              <Badge key={benefitIndex} variant="secondary" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Job Meta */}
                      <div className={`flex flex-col items-end gap-3 ml-6 ${isRTL ? 'items-start mr-6 ml-0' : ''}`}>
                        {job.featured && (
                          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {job.urgent && (
                          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge className={`border ${getExperienceColor(job.experience)}`}>
                          {job.experience}
                        </Badge>
                        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {job.postedDays} days ago
                        </div>
                      </div>
                    </div>

                    {/* Job Footer */}
                    <div className={`flex items-center justify-between pt-6 border-t ${
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    } ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`text-lg font-semibold ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {job.salary}
                      </div>
                      <Button
                        className="gradient-bg-blue text-white px-6 py-3 rounded-xl"
                        onClick={() => navigate('contact')}
                      >
                        <span className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          Apply Now
                          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Search className={`w-16 h-16 mx-auto mb-4 opacity-50 ${
                isDark ? 'text-blue-400' : 'text-blue-500'
              }`} />
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                No positions found matching your criteria.
              </p>
            </div>
          )}
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
              Ready to <span className="text-blue-200">Make an Impact</span>?
            </h2>
            
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              Don't see a perfect fit? We're always interested in hearing from talented individuals. 
              Join our mission to democratize AI and shape the future of technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('contact')}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                Send Us Your Resume
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('team')}
              >
                <Users className="w-5 h-5 mr-3" />
                Learn About Our Culture
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
                Have questions about joining our team or want to discuss opportunities?
              </p>
              <div className="flex items-center justify-center gap-6">
                <span className="text-blue-100">careers@delibix.com</span>
                <span className="text-blue-100">+62 857 7002 4933</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}