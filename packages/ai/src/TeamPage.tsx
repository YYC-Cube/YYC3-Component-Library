"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Users, MapPin, Calendar, Briefcase, ArrowRight, Mail, 
  Linkedin, Twitter, Github, Globe, Award, Target, 
  TrendingUp, Rocket, Brain, Code, Palette, Coffee,
  Heart, Star, Building2, MessageSquare, Phone
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface TeamPageProps {
  navigate?: (page: any) => void;
}

export function TeamPage({ navigate }: TeamPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Team Members Data
  const teamMembers = [
    {
      id: 'founder-ceo',
      name: 'Ahmad Delibix',
      role: 'Founder & CEO',
      department: 'Leadership',
      location: 'Yogyakarta, Indonesia',
      image: '/api/placeholder/400/400',
      bio: 'Visionary leader with 10+ years in AI and digital transformation. Passionate about democratizing AI for businesses worldwide.',
      expertise: ['AI Strategy', 'Business Development', 'Digital Transformation'],
      achievements: [
        'Founded 3 successful tech startups',
        'Former AI consultant for Fortune 500 companies',
        'TEDx speaker on AI democratization'
      ],
      social: {
        linkedin: '#linkedin',
        twitter: '#twitter',
        email: 'ahmad@delibix.com'
      },
      joinedDate: '2022-01-15',
      featured: true
    },
    {
      id: 'cto',
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      department: 'Engineering',
      location: 'Remote',
      image: '/api/placeholder/400/400',
      bio: 'Former Google AI researcher specializing in large language models and neural architecture. Leading our AGI development.',
      expertise: ['Machine Learning', 'AI Architecture', 'Distributed Systems'],
      achievements: [
        'PhD in Computer Science from Stanford',
        '15+ peer-reviewed papers in top AI conferences',
        'Led AI teams at Google and OpenAI'
      ],
      social: {
        linkedin: '#linkedin',
        github: '#github',
        email: 'sarah@delibix.com'
      },
      joinedDate: '2022-03-01',
      featured: true
    },
    {
      id: 'head-design',
      name: 'Raka Pradipta',
      role: 'Head of Design',
      department: 'Design',
      location: 'Yogyakarta, Indonesia',
      image: '/api/placeholder/400/400',
      bio: 'Award-winning designer with expertise in AI/UX interface design. Creates intuitive experiences for complex AI systems.',
      expertise: ['UI/UX Design', 'Design Systems', 'User Research'],
      achievements: [
        'Winner of Red Dot Design Award 2023',
        'Former Design Lead at Gojek',
        'Designed interfaces for 10M+ users'
      ],
      social: {
        linkedin: '#linkedin',
        twitter: '#twitter',
        email: 'raka@delibix.com'
      },
      joinedDate: '2022-04-15',
      featured: true
    },
    {
      id: 'lead-engineer',
      name: 'David Rodriguez',
      role: 'Lead Engineer',
      department: 'Engineering',
      location: 'Remote',
      image: '/api/placeholder/400/400',
      bio: 'Full-stack architect building scalable AI infrastructure. Passionate about clean code and system optimization.',
      expertise: ['Full-Stack Development', 'Cloud Architecture', 'DevOps'],
      achievements: [
        'Built systems serving 100M+ requests/day',
        'Former Senior Engineer at Netflix',
        'Open source contributor with 50K+ GitHub stars'
      ],
      social: {
        linkedin: '#linkedin',
        github: '#github',
        email: 'david@delibix.com'
      },
      joinedDate: '2022-06-01',
      featured: false
    },
    {
      id: 'marketing-director',
      name: 'Lisa Wang',
      role: 'Marketing Director',
      department: 'Marketing',
      location: 'Singapore',
      image: '/api/placeholder/400/400',
      bio: 'Growth marketing expert with deep understanding of AI market dynamics. Drives global brand awareness and adoption.',
      expertise: ['Growth Marketing', 'Brand Strategy', 'Content Marketing'],
      achievements: [
        'Scaled 3 startups from 0 to $10M ARR',
        'Former Marketing Lead at Stripe',
        'Built marketing teams across APAC'
      ],
      social: {
        linkedin: '#linkedin',
        twitter: '#twitter',
        email: 'lisa@delibix.com'
      },
      joinedDate: '2022-08-15',
      featured: false
    },
    {
      id: 'data-scientist',
      name: 'Dr. Priya Sharma',
      role: 'Senior Data Scientist',
      department: 'Data',
      location: 'Remote',
      image: '/api/placeholder/400/400',
      bio: 'ML researcher focused on ethical AI and bias detection. Ensures our AI systems are fair and transparent.',
      expertise: ['Machine Learning', 'AI Ethics', 'Statistical Analysis'],
      achievements: [
        'PhD in Statistics from MIT',
        'Published 20+ papers on AI ethics',
        'Former researcher at IBM Watson'
      ],
      social: {
        linkedin: '#linkedin',
        github: '#github',
        email: 'priya@delibix.com'
      },
      joinedDate: '2023-01-10',
      featured: false
    },
    {
      id: 'business-dev',
      name: 'Michael Thompson',
      role: 'VP Business Development',
      department: 'Sales',
      location: 'Remote',
      image: '/api/placeholder/400/400',
      bio: 'Strategic partnerships expert connecting enterprises with AI solutions. Building bridges between technology and business.',
      expertise: ['Strategic Partnerships', 'Enterprise Sales', 'Market Expansion'],
      achievements: [
        'Closed $50M+ in enterprise deals',
        'Former BD Director at Salesforce',
        'Built partnerships with 100+ Fortune 500 companies'
      ],
      social: {
        linkedin: '#linkedin',
        email: 'michael@delibix.com'
      },
      joinedDate: '2023-03-01',
      featured: false
    },
    {
      id: 'operations',
      name: 'Fatima Al-Zahra',
      role: 'Head of Operations',
      department: 'Operations',
      location: 'Remote',
      image: '/api/placeholder/400/400',
      bio: 'Operations strategist optimizing workflows and scaling teams globally. Ensures smooth execution of our ambitious goals.',
      expertise: ['Operations Strategy', 'Process Optimization', 'Team Management'],
      achievements: [
        'Scaled operations at 2 unicorn startups',
        'Former Operations Manager at Uber',
        'Expert in remote team management'
      ],
      social: {
        linkedin: '#linkedin',
        email: 'fatima@delibix.com'
      },
      joinedDate: '2023-05-15',
      featured: false
    }
  ];

  // Departments for filtering
  const departments = [
    { id: 'all', name: 'All Team', count: teamMembers.length },
    { id: 'Leadership', name: 'Leadership', count: teamMembers.filter(m => m.department === 'Leadership').length },
    { id: 'Engineering', name: 'Engineering', count: teamMembers.filter(m => m.department === 'Engineering').length },
    { id: 'Design', name: 'Design', count: teamMembers.filter(m => m.department === 'Design').length },
    { id: 'Marketing', name: 'Marketing', count: teamMembers.filter(m => m.department === 'Marketing').length },
    { id: 'Data', name: 'Data Science', count: teamMembers.filter(m => m.department === 'Data').length },
    { id: 'Sales', name: 'Sales', count: teamMembers.filter(m => m.department === 'Sales').length },
    { id: 'Operations', name: 'Operations', count: teamMembers.filter(m => m.department === 'Operations').length }
  ];

  // Company Culture Values
  const cultureValues = [
    {
      title: 'Innovation First',
      description: 'We push boundaries and explore the impossible',
      icon: Rocket,
      examples: ['20% time for personal projects', 'Hackathons and innovation days', 'Experimental technology budget']
    },
    {
      title: 'Global Mindset',
      description: 'We think globally while acting locally',
      icon: Globe,
      examples: ['Remote-first culture', 'Diverse international team', 'Cross-cultural collaboration']
    },
    {
      title: 'Excellence Standard',
      description: 'We deliver world-class solutions',
      icon: Award,
      examples: ['Peer code reviews', 'Continuous learning programs', 'Industry certifications']
    },
    {
      title: 'Collaborative Spirit',
      description: 'We achieve more together',
      icon: Users,
      examples: ['Cross-functional teams', 'Open communication channels', 'Knowledge sharing sessions']
    }
  ];

  // Team Statistics
  const teamStats = [
    { label: 'Team Members', value: teamMembers.length, icon: Users },
    { label: 'Countries', value: '8', icon: Globe },
    { label: 'Departments', value: departments.length - 1, icon: Building2 },
    { label: 'Years Experience', value: '80+', icon: Award }
  ];

  // Filter team members
  const filteredMembers = teamMembers.filter(member => 
    selectedDepartment === 'all' || member.department === selectedDepartment
  );

  // Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Leadership': return Target;
      case 'Engineering': return Code;
      case 'Design': return Palette;
      case 'Marketing': return TrendingUp;
      case 'Data': return Brain;
      case 'Sales': return Briefcase;
      case 'Operations': return Building2;
      default: return Users;
    }
  };

  // Get department color
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Leadership': return 'from-purple-500 to-purple-600';
      case 'Engineering': return 'from-blue-500 to-blue-600';
      case 'Design': return 'from-pink-500 to-pink-600';
      case 'Marketing': return 'from-green-500 to-green-600';
      case 'Data': return 'from-orange-500 to-orange-600';
      case 'Sales': return 'from-teal-500 to-teal-600';
      case 'Operations': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
          
          {/* Animated Team Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Users, Target, Code, Palette, Brain, TrendingUp];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${15 + (i % 5) * 18}%`,
                    top: `${15 + Math.floor(i / 5) * 25}%`,
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
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {teamMembers.length} Team Members
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
                Meet Our <span className="gradient-text-blue">Team</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Passionate innovators, world-class engineers, and visionary designers working together 
                to democratize AI and transform businesses worldwide.
              </motion.p>
            </div>

            {/* Team Stats */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {teamStats.map((stat, index) => (
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
                onClick={() => navigate('careers')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Join Our Team
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
                  const element = document.getElementById('team-members');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Meet the Team
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Our <span className="gradient-text-blue">Culture</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              The values and principles that guide how we work, collaborate, and innovate together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cultureValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                    <p className={`text-base mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {value.description}
                    </p>
                    <ul className="space-y-2">
                      {value.examples.map((example, exampleIndex) => (
                        <li
                          key={exampleIndex}
                          className={`flex items-center gap-2 text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          } ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section id="team-members" className="py-16 lg:py-24">
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
              Team <span className="gradient-text-blue">Members</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Meet the talented individuals driving innovation and excellence at Delibix.
            </p>
          </motion.div>

          {/* Department Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
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

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => {
              const DepartmentIcon = getDepartmentIcon(member.department);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`glass-heavy rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  } ${member.featured ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  {/* Member Image & Department */}
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getDepartmentColor(member.department)} flex items-center justify-center shadow-lg`}>
                        <DepartmentIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {member.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className={`text-xl font-semibold mb-1 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        {member.name}
                      </h3>
                      <p className={`text-base font-medium mb-2 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {member.role}
                      </p>
                      <div className={`flex items-center gap-2 text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <MapPin className="w-4 h-4" />
                        {member.location}
                      </div>
                    </div>

                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {member.bio}
                    </p>

                    {/* Expertise */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Expertise:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-4">
                      <h4 className={`text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {member.achievements.slice(0, 2).map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className={`flex items-start gap-2 text-xs ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Social Links */}
                    <div className={`flex items-center justify-between pt-4 border-t ${
                      isDark ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <a
                          href={`mailto:${member.social.email}`}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isDark ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/10' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>

                      <div className={`text-xs ${
                        isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        Joined {new Date(member.joinedDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              Ready to <span className="text-blue-200">Join Our Mission</span>?
            </h2>
            
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              We're always looking for passionate individuals who want to shape the future of AI. 
              Join our team and help us democratize artificial intelligence for businesses worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('careers')}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                View Open Positions
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-2xl"
                onClick={() => navigate('contact')}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Get in Touch
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
                Have questions about our team or culture? Want to discuss opportunities?
              </p>
              <div className="flex items-center justify-center gap-6">
                <span className="text-blue-100">team@delibix.com</span>
                <span className="text-blue-100">+62 857 7002 4933</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}