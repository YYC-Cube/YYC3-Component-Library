"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Layers, BarChart3, Zap, TrendingUp, CheckCircle, Star, 
  ArrowRight, Settings, Brain, Globe, Monitor,
  Clock, Award, Search, Bell, MessageSquare,
  Calendar, Mail, Phone, Video, Headphones, Activity,
  Laptop, Smartphone, Lightbulb, UserCheck, Database,
  Network, Workflow, Cog, Cpu, Users, Eye, Shield
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface TechStackAnalyzerPageProps {
  navigate?: (page: any) => void;
}

export function TechStackAnalyzerPage({ navigate }: TechStackAnalyzerPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Tech Stack Analysis Categories
  const analysisCategories = [
    {
      title: "Frontend Technologies",
      description: "Comprehensive analysis of frontend frameworks, libraries, performance metrics, and modern development practices.",
      icon: Monitor,
      category: "Frontend",
      technologies: [
        "React, Vue.js, Angular frameworks",
        "Next.js, Nuxt.js, SvelteKit",
        "TypeScript, JavaScript ES6+",
        "CSS frameworks & design systems"
      ],
      metrics: [
        "Performance benchmarks",
        "Bundle size analysis",
        "Code quality scores",
        "Developer experience rating"
      ],
      score: 85
    },
    {
      title: "Backend Architecture",
      description: "Deep dive into backend systems, APIs, microservices architecture, and server infrastructure analysis.",
      icon: Database,
      category: "Backend",
      technologies: [
        "Node.js, Python, Java, .NET",
        "Express, FastAPI, Spring Boot",
        "REST, GraphQL, gRPC APIs",
        "Microservices architecture"
      ],
      metrics: [
        "API performance metrics",
        "Scalability assessment",
        "Security compliance",
        "Architecture complexity"
      ],
      score: 78
    },
    {
      title: "Database Systems",
      description: "Complete database architecture evaluation including relational, NoSQL, and data warehouse technologies.",
      icon: Layers,
      category: "Database",
      technologies: [
        "PostgreSQL, MySQL, MongoDB",
        "Redis, Elasticsearch, Neo4j",
        "Data warehouses & lakes",
        "Database optimization tools"
      ],
      metrics: [
        "Query performance",
        "Data consistency",
        "Backup strategies",
        "Scalability potential"
      ],
      score: 82
    },
    {
      title: "Cloud Infrastructure",
      description: "Comprehensive cloud platform analysis covering deployment, orchestration, and infrastructure management.",
      icon: Globe,
      category: "Cloud",
      technologies: [
        "AWS, Azure, Google Cloud",
        "Kubernetes, Docker containers",
        "Serverless functions",
        "CDN & edge computing"
      ],
      metrics: [
        "Cost optimization",
        "Performance monitoring",
        "Security posture",
        "Disaster recovery"
      ],
      score: 88
    },
    {
      title: "DevOps & CI/CD",
      description: "Analysis of development operations, continuous integration, deployment pipelines, and automation tools.",
      icon: Workflow,
      category: "DevOps",
      technologies: [
        "GitHub Actions, Jenkins, GitLab",
        "Terraform, Ansible, Helm",
        "Monitoring & observability",
        "Testing automation"
      ],
      metrics: [
        "Deployment frequency",
        "Lead time for changes",
        "Mean time to recovery",
        "Change failure rate"
      ],
      score: 75
    },
    {
      title: "Security & Compliance",
      description: "Security architecture assessment including vulnerability analysis, compliance frameworks, and risk evaluation.",
      icon: Shield,
      category: "Security",
      technologies: [
        "Authentication & authorization",
        "Encryption & data protection",
        "Security scanning tools",
        "Compliance frameworks"
      ],
      metrics: [
        "Vulnerability assessment",
        "Compliance score",
        "Security incidents",
        "Risk mitigation"
      ],
      score: 70
    }
  ];

  // Tech Stack Analysis Framework
  const analysisFramework = [
    {
      step: "01",
      title: "Discovery",
      description: "Comprehensive technology inventory and current state assessment of your entire tech stack",
      icon: Search,
      activities: [
        "Technology inventory mapping",
        "Architecture documentation review",
        "Performance baseline measurement",
        "Security posture assessment"
      ]
    },
    {
      step: "02",
      title: "Analysis",
      description: "Deep technical analysis with benchmarking, gap identification, and risk assessment",
      icon: BarChart3,
      activities: [
        "Performance benchmarking",
        "Security vulnerability analysis",
        "Cost optimization review",
        "Technology gap assessment"
      ]
    },
    {
      step: "03",
      title: "Optimization",
      description: "Strategic recommendations for technology modernization and performance improvements",
      icon: Zap,
      activities: [
        "Architecture optimization plan",
        "Technology upgrade roadmap",
        "Performance enhancement strategy",
        "Cost reduction initiatives"
      ]
    },
    {
      step: "04",
      title: "Implementation",
      description: "Guided implementation of improvements with continuous monitoring and optimization",
      icon: TrendingUp,
      activities: [
        "Phased implementation plan",
        "Performance monitoring setup",
        "Team training & enablement",
        "Continuous improvement process"
      ]
    }
  ];

  // Analysis Benefits
  const analysisBenefits = [
    {
      title: "Performance Boost",
      value: "400%",
      description: "Average performance improvement",
      icon: Zap
    },
    {
      title: "Cost Reduction",
      value: "60%",
      description: "Infrastructure cost savings",
      icon: TrendingUp
    },
    {
      title: "Security Score",
      value: "95%",
      description: "Security compliance rating",
      icon: Shield
    },
    {
      title: "Efficiency Gain",
      value: "5x",
      description: "Development speed increase",
      icon: Clock
    }
  ];

  // Calculate overall tech stack score
  const overallTechScore = Math.round(
    analysisCategories.reduce((acc, category) => acc + category.score, 0) / analysisCategories.length
  );

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
          
          {/* Animated Tech Stack Icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Layers, Database, Monitor, Globe, Workflow, Shield];
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
              <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Advanced Tech Stack Analyzer
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
                Tech Stack <span className="gradient-text-blue">Analyzer</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Comprehensive technology stack analysis and optimization platform. 
                Evaluate your entire tech architecture, identify improvement opportunities, and optimize performance.
              </motion.p>
            </div>

            {/* Analysis Benefits Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {analysisBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <benefit.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {benefit.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {benefit.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {benefit.description}
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
                onClick={() => navigate('demo-request')}
              >
                <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  Analyze My Tech Stack
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
                  const element = document.getElementById('analysis-framework');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Our Analysis Framework
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={`px-8 py-6 text-lg font-semibold rounded-2xl backdrop-blur-xl ${
                  isDark 
                    ? 'border-blue-400/30 text-blue-300 hover:bg-blue-400/10' 
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => navigate('tech-stack-consulting')}
              >
                Free Quick Assessment
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Analysis Framework Section */}
      <section id="analysis-framework" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Analysis <span className="gradient-text-blue">Framework</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A comprehensive 4-phase technology analysis approach that evaluates your entire tech stack 
              and provides actionable recommendations for optimization and modernization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {analysisFramework.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg-blue flex items-center justify-center`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className={`text-3xl font-bold mb-2 gradient-text-blue`}>
                  {step.step}
                </div>
                
                <h3 className={`text-xl font-semibold mb-4 ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {step.title}
                </h3>
                
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.activities.map((activity, activityIndex) => (
                    <li key={activityIndex} className={`text-sm ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      • {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Categories Section */}
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
              Tech Stack <span className="gradient-text-blue">Analysis Categories</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive analysis across six critical technology dimensions 
              to provide complete visibility into your technology architecture and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analysisCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full group hover:scale-105 transition-all duration-300 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-xl gradient-bg-blue flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{category.category}</Badge>
                </div>

                {/* Category Info */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-3 ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>
                    {category.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {category.description}
                  </p>

                  {/* Performance Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Performance Score
                      </span>
                      <span className={`text-sm font-bold ${
                        category.score >= 80 ? 'text-green-500' : 
                        category.score >= 70 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {category.score}%
                      </span>
                    </div>
                    <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2`}>
                      <div 
                        className={`h-2 rounded-full ${
                          category.score >= 80 ? 'bg-green-500' : 
                          category.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className={`text-sm font-semibold mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Key Technologies:
                  </h4>
                  <ul className="space-y-2">
                    {category.technologies.slice(0, 3).map((tech, techIndex) => (
                      <li key={techIndex} className={`flex items-center gap-2 text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Button
                    className="w-full gradient-bg-blue text-white rounded-xl"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      Analyze Category
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Overall Tech Stack Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16"
          >
            <div className={`glass-heavy rounded-2xl p-8 text-center ${
              isDark ? 'border-blue-400/20' : 'border-blue-200/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}>
                Overall Tech Stack Performance Score
              </h3>
              
              <div className={`text-6xl font-bold mb-4 ${
                overallTechScore >= 80 ? 'text-green-500' : 
                overallTechScore >= 70 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {overallTechScore}%
              </div>

              <p className={`text-lg mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {overallTechScore >= 80 ? 'Excellent Technology Architecture' : 
                 overallTechScore >= 70 ? 'Good Technology Foundation' : 'Needs Technology Modernization'}
              </p>

              <Button
                size="lg"
                className="gradient-bg-blue text-white px-8 py-3 font-semibold rounded-xl"
                onClick={() => navigate('demo-request')}
              >
                Get Complete Tech Analysis Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background transition-colors duration-300">
        {/* Background with glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 transition-colors duration-300" />
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 dark:opacity-10 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden border-2 border-blue-300 dark:border-blue-600/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-3xl transition-colors duration-300" />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-8 shadow-lg">
                  <Layers className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Optimize Your Tech Stack?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Get comprehensive tech stack analysis and achieve 400% performance improvement with 60% cost reduction.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Tech Analysis
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('contact')}
                  >
                    Consult Tech Experts
                  </Button>
                </div>

                {/* Contact info */}
                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Comprehensive Analysis</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">6 critical technology dimensions</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Results</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">400% performance improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}