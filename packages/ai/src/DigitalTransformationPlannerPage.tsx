"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Target, TrendingUp, Zap, CheckCircle, Star, Calendar,
  ArrowRight, Award, Mail, Users, BarChart3, Settings,
  PieChart, LineChart, Activity, FileText, Clock, Shield
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface DigitalTransformationPlannerPageProps {
  navigate?: (page: any) => void;
}

export function DigitalTransformationPlannerPage({ navigate }: DigitalTransformationPlannerPageProps) {
  const { isDark } = useDarkMode();
  const { t, isRTL } = useLanguage();
  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 300], [0, -50]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const plannerStats = [
    {
      title: "Planning Templates",
      value: "50+",
      description: "Pre-built transformation frameworks",
      icon: Target,
      growth: "Industry proven"
    },
    {
      title: "Success Rate",
      value: "96%",
      description: "Projects completed on-time",
      icon: CheckCircle,
      growth: "Reliable planning"
    },
    {
      title: "Cost Accuracy",
      value: "94%",
      description: "Budget estimation precision",
      icon: BarChart3,
      growth: "Financial confidence"
    },
    {
      title: "Organizations",
      value: "2,000+",
      description: "Successfully planned transformations",
      icon: Users,
      growth: "Global adoption"
    }
  ];

  // Planning Phases
  const planningPhases = [
    {
      id: 1,
      title: "Assessment & Analysis",
      description: "Comprehensive current state analysis and digital maturity evaluation",
      duration: "4-6 weeks",
      tasks: [
        "Digital maturity assessment",
        "Current technology audit",
        "Process mapping & analysis",
        "Stakeholder interviews",
        "Gap analysis & recommendations"
      ],
      deliverables: [
        "Digital Maturity Report",
        "Technology Audit Report",
        "Process Analysis Document",
        "Gap Analysis & Recommendations"
      ],
      progress: 100,
      status: "completed"
    },
    {
      id: 2,
      title: "Strategy Development",
      description: "Define digital transformation strategy aligned with business objectives",
      duration: "6-8 weeks",
      tasks: [
        "Strategic goal setting",
        "Technology roadmap planning",
        "Business case development",
        "Change management strategy",
        "Risk assessment & mitigation"
      ],
      deliverables: [
        "Digital Strategy Document",
        "Technology Roadmap",
        "Business Case & ROI Analysis",
        "Change Management Plan"
      ],
      progress: 75,
      status: "in-progress"
    },
    {
      id: 3,
      title: "Planning & Design",
      description: "Detailed implementation planning with timeline and resource allocation",
      duration: "8-10 weeks",
      tasks: [
        "Implementation roadmap",
        "Resource planning & allocation",
        "Technology architecture design",
        "Project timeline development",
        "Budget planning & approval"
      ],
      deliverables: [
        "Implementation Roadmap",
        "Resource Allocation Plan",
        "Technical Architecture",
        "Project Timeline & Milestones"
      ],
      progress: 45,
      status: "planning"
    },
    {
      id: 4,
      title: "Execution & Deployment",
      description: "Phased implementation with continuous monitoring and optimization",
      duration: "12-18 months",
      tasks: [
        "Phased implementation",
        "Team training & development",
        "System integration & testing",
        "User adoption & support",
        "Performance monitoring"
      ],
      deliverables: [
        "Deployed Solutions",
        "Training Programs",
        "Integration Documentation",
        "Performance Reports"
      ],
      progress: 0,
      status: "planned"
    },
    {
      id: 5,
      title: "Optimization & Scale",
      description: "Continuous improvement and scaling successful implementations",
      duration: "Ongoing",
      tasks: [
        "Performance optimization",
        "Process refinement",
        "Solution scaling",
        "Advanced analytics",
        "Innovation initiatives"
      ],
      deliverables: [
        "Optimization Reports",
        "Scaling Strategies",
        "Analytics Dashboards",
        "Innovation Roadmap"
      ],
      progress: 0,
      status: "future"
    }
  ];

  // Planning Templates
  const planningTemplates = [
    {
      category: "Industry-Specific",
      templates: [
        { name: "Healthcare Digital Transformation", complexity: "High", duration: "18-24 months" },
        { name: "Financial Services Modernization", complexity: "High", duration: "15-20 months" },
        { name: "Manufacturing Industry 4.0", complexity: "Medium", duration: "12-18 months" },
        { name: "Retail Digital Commerce", complexity: "Medium", duration: "10-15 months" },
        { name: "Education Technology Integration", complexity: "Medium", duration: "8-12 months" },
        { name: "Government Digital Services", complexity: "High", duration: "20-30 months" }
      ]
    },
    {
      category: "Technology-Focused",
      templates: [
        { name: "Cloud Migration Strategy", complexity: "Medium", duration: "6-12 months" },
        { name: "AI/ML Implementation", complexity: "High", duration: "12-18 months" },
        { name: "Data Analytics Platform", complexity: "Medium", duration: "8-14 months" },
        { name: "Cybersecurity Enhancement", complexity: "High", duration: "10-16 months" },
        { name: "Process Automation", complexity: "Medium", duration: "6-10 months" },
        { name: "Digital Customer Experience", complexity: "Medium", duration: "8-12 months" }
      ]
    },
    {
      category: "Organizational",
      templates: [
        { name: "Digital Culture Transformation", complexity: "High", duration: "12-24 months" },
        { name: "Workforce Digital Skills", complexity: "Medium", duration: "6-12 months" },
        { name: "Change Management Program", complexity: "Medium", duration: "8-15 months" },
        { name: "Innovation Lab Setup", complexity: "Medium", duration: "4-8 months" },
        { name: "Digital Governance Framework", complexity: "Medium", duration: "6-10 months" },
        { name: "Agile Transformation", complexity: "High", duration: "12-18 months" }
      ]
    }
  ];

  // Key Planning Metrics
  const planningMetrics = [
    {
      category: "Project Success",
      metrics: [
        { metric: "On-Time Delivery", value: "96%", benchmark: "Industry: 72%" },
        { metric: "Budget Adherence", value: "94%", benchmark: "Industry: 68%" },
        { metric: "Scope Achievement", value: "98%", benchmark: "Industry: 75%" },
        { metric: "Quality Standards", value: "99%", benchmark: "Industry: 80%" }
      ]
    },
    {
      category: "Business Impact",
      metrics: [
        { metric: "ROI Achievement", value: "285%", benchmark: "Target: 200%" },
        { metric: "Process Efficiency", value: "+67%", benchmark: "Target: +40%" },
        { metric: "Customer Satisfaction", value: "94%", benchmark: "Target: 85%" },
        { metric: "Employee Adoption", value: "89%", benchmark: "Target: 75%" }
      ]
    },
    {
      category: "Risk Management",
      metrics: [
        { metric: "Risk Mitigation", value: "92%", benchmark: "Target: 80%" },
        { metric: "Issue Resolution", value: "<24hrs", benchmark: "Target: <48hrs" },
        { metric: "Security Compliance", value: "100%", benchmark: "Required: 100%" },
        { metric: "Data Protection", value: "100%", benchmark: "Required: 100%" }
      ]
    }
  ];

  const [selectedPhase, setSelectedPhase] = useState(planningPhases[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(planningTemplates[0]);

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30"
            style={{ y: heroY, opacity: heroOpacity }}
          />
          
          {/* Planning-themed animated icons */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            {Array.from({ length: 15 }, (_, i) => {
              const icons = [Target, BarChart3, Calendar, Settings, PieChart, FileText];
              const IconComponent = icons[i % icons.length];
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${10 + (i % 5) * 20}%`,
                    top: `${10 + Math.floor(i / 5) * 25}%`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 0.6
                  }}
                >
                  <IconComponent className="w-16 h-16 text-blue-500" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              className={`inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                Strategic Planning
              </span>
              <Star className="w-4 h-4 text-amber-500" />
            </motion.div>

            <div className="space-y-6">
              <motion.h1
                className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Transformation <span className="gradient-text-blue">Planner</span>
              </motion.h1>
              
              <motion.p
                className={`text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Comprehensive digital transformation planning tool with 50+ proven templates and 96% success rate. 
                2,000+ organizations planned with 94% cost accuracy and strategic roadmap development.
              </motion.p>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {plannerStats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-heavy rounded-2xl p-6 text-center ${
                    isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                  }`}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className={`text-2xl md:text-3xl font-bold mb-2 gradient-text-blue`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-1`}>
                    {stat.title}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mb-2`}>
                    {stat.description}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.growth}
                  </Badge>
                </div>
              ))}
            </motion.div>

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
                  Start Planning
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
                  const element = document.getElementById('planning-phases');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                View Planning Process
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Planning Phases Section */}
      <section id="planning-phases" className="py-16 lg:py-24 bg-gradient-to-br from-blue-50/30 to-background dark:from-blue-950/10 dark:to-background">
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
              Planning <span className="gradient-text-blue">Process</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Comprehensive 5-phase planning process with proven methodologies 
              and structured deliverables for successful digital transformation.
            </p>
          </motion.div>

          <div className="space-y-8">
            {planningPhases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                } ${selectedPhase.id === phase.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPhase(phase)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg`}>
                        {phase.id}
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {phase.title}
                        </h3>
                        <p className={`text-sm ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {phase.duration}
                        </p>
                      </div>
                    </div>
                    
                    <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} mb-4`}>
                      {phase.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Progress value={phase.progress} className="flex-1" />
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {phase.progress}%
                      </span>
                    </div>
                    
                    <Badge 
                      variant={
                        phase.status === 'completed' ? 'default' :
                        phase.status === 'in-progress' ? 'secondary' :
                        phase.status === 'planning' ? 'outline' : 'outline'
                      }
                      className="capitalize"
                    >
                      {phase.status.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`text-lg font-semibold mb-3 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        Key Tasks:
                      </h4>
                      <div className="space-y-2">
                        {phase.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className={`flex items-center gap-2 text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {task}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-lg font-semibold mb-3 ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        Deliverables:
                      </h4>
                      <div className="space-y-2">
                        {phase.deliverables.map((deliverable, delIndex) => (
                          <div key={delIndex} className={`flex items-center gap-2 text-sm ${
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            {deliverable}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Templates Section */}
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
              Planning <span className="gradient-text-blue">Templates</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Pre-built planning templates for various industries and use cases 
              with proven methodologies and best practices included.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {planningTemplates.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 text-center ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {category.category}
                </h3>

                <div className="space-y-4">
                  {category.templates.map((template, templateIndex) => (
                    <div
                      key={templateIndex}
                      className={`glass-secondary rounded-xl p-4 ${
                        isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`font-medium ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}>
                          {template.name}
                        </h4>
                        <Badge 
                          variant={
                            template.complexity === 'High' ? 'destructive' :
                            template.complexity === 'Medium' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                      <div className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Duration: {template.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Metrics Section */}
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
              Planning <span className="gradient-text-blue">Success</span>
            </h2>
            <p className={`text-lg max-w-3xl mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Proven planning methodologies deliver exceptional results with 
              consistent performance across project success, business impact, and risk management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planningMetrics.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`glass-heavy rounded-2xl p-8 h-full ${
                  isDark ? 'border-blue-400/20' : 'border-blue-200/50'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-6 text-center ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  {category.category}
                </h3>

                <div className="space-y-4">
                  {category.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className={`glass-secondary rounded-xl p-4 ${
                        isDark ? 'border-blue-400/10' : 'border-blue-200/30'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className={`text-sm font-medium ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {metric.metric}
                        </div>
                        <div className={`text-lg font-bold gradient-text-blue`}>
                          {metric.value}
                        </div>
                      </div>
                      <div className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {metric.benchmark}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden bg-background transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950/40 dark:via-blue-900/30 dark:to-blue-800/20 transition-colors duration-300" />
        
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-8 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
                  Ready to Plan Your Digital Transformation?
                </h3>
                
                <div className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
                  Access 50+ proven templates with 96% success rate and comprehensive planning tools for strategic transformation roadmap.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="gradient-bg-blue text-white px-8 py-6 text-lg font-semibold rounded-2xl border-0 shadow-lg relative overflow-hidden transition-all duration-300"
                    onClick={() => navigate('demo-request')}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Start Planning Now
                    </span>
                  </Button>

                  <Button 
                    variant="outline" 
                    size="lg"
                    className="glass-secondary border-2 border-blue-300 dark:border-blue-600/50 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-6 text-lg rounded-2xl font-semibold transition-all duration-300"
                    onClick={() => navigate('cost-calculator')}
                  >
                    Cost Calculator
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-blue-200 dark:border-blue-600/50 transition-colors duration-300">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Strategic Planning</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">50+ templates & 96% success rate</p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">Proven Results</h4>
                    <p className="text-slate-600 dark:text-slate-400 transition-colors duration-300">2,000+ organizations & 94% accuracy</p>
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