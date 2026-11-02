"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Shield, 
  Scale, 
  Eye, 
  Users, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Target,
  BarChart3,
  FileText,
  Download,
  Upload,
  Zap,
  Settings,
  Globe,
  Lock,
  Heart,
  Lightbulb,
  Award,
  MessageSquare,
  Calendar,
  ArrowRight,
  ChevronDown,
  Star,
  TrendingUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

interface AIEthicsCheckerPageProps {
  navigate: (page: string) => void;
}

export function AIEthicsCheckerPage({ navigate }: AIEthicsCheckerPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const ethicsCategories = [
    {
      id: "fairness",
      name: "Fairness & Bias",
      description: "Evaluate algorithmic fairness and bias mitigation",
      icon: Scale,
      color: "text-blue-600",
      questions: [
        {
          id: "bias_training_data",
          question: "Has your training data been evaluated for potential bias?",
          options: [
            { value: "comprehensive", label: "Comprehensive bias audit completed", score: 10 },
            { value: "basic", label: "Basic bias evaluation done", score: 7 },
            { value: "minimal", label: "Minimal evaluation conducted", score: 3 },
            { value: "none", label: "No bias evaluation performed", score: 0 }
          ]
        },
        {
          id: "demographic_parity",
          question: "Does your AI system maintain demographic parity across different groups?",
          options: [
            { value: "verified", label: "Verified through testing", score: 10 },
            { value: "monitored", label: "Actively monitored", score: 7 },
            { value: "considered", label: "Considered but not verified", score: 3 },
            { value: "unknown", label: "Unknown or not considered", score: 0 }
          ]
        }
      ]
    },
    {
      id: "transparency",
      name: "Transparency & Explainability",
      description: "Assess AI system transparency and decision explainability",
      icon: Eye,
      color: "text-green-600",
      questions: [
        {
          id: "decision_explanation",
          question: "Can your AI system explain its decisions to users?",
          options: [
            { value: "full", label: "Full explanations available", score: 10 },
            { value: "partial", label: "Partial explanations provided", score: 7 },
            { value: "limited", label: "Limited explanation capability", score: 3 },
            { value: "none", label: "No explanation capability", score: 0 }
          ]
        },
        {
          id: "algorithm_documentation",
          question: "Is your algorithm thoroughly documented and auditable?",
          options: [
            { value: "comprehensive", label: "Comprehensive documentation", score: 10 },
            { value: "adequate", label: "Adequate documentation", score: 7 },
            { value: "basic", label: "Basic documentation", score: 3 },
            { value: "minimal", label: "Minimal or no documentation", score: 0 }
          ]
        }
      ]
    },
    {
      id: "accountability",
      name: "Accountability & Governance",
      description: "Review governance structures and accountability measures",
      icon: Shield,
      color: "text-purple-600",
      questions: [
        {
          id: "governance_structure",
          question: "Do you have a clear AI governance structure in place?",
          options: [
            { value: "established", label: "Established governance committee", score: 10 },
            { value: "developing", label: "Developing governance framework", score: 7 },
            { value: "informal", label: "Informal governance processes", score: 3 },
            { value: "none", label: "No governance structure", score: 0 }
          ]
        },
        {
          id: "responsibility_assignment",
          question: "Are responsibilities for AI decisions clearly assigned?",
          options: [
            { value: "clear", label: "Clear responsibility assignment", score: 10 },
            { value: "mostly", label: "Mostly clear assignments", score: 7 },
            { value: "partial", label: "Partial assignment", score: 3 },
            { value: "unclear", label: "Unclear or no assignment", score: 0 }
          ]
        }
      ]
    },
    {
      id: "privacy",
      name: "Privacy & Data Protection",
      description: "Evaluate privacy safeguards and data protection measures",
      icon: Lock,
      color: "text-orange-600",
      questions: [
        {
          id: "data_minimization",
          question: "Do you practice data minimization in your AI system?",
          options: [
            { value: "strict", label: "Strict data minimization", score: 10 },
            { value: "moderate", label: "Moderate data minimization", score: 7 },
            { value: "limited", label: "Limited data minimization", score: 3 },
            { value: "none", label: "No data minimization", score: 0 }
          ]
        },
        {
          id: "consent_management",
          question: "How do you manage user consent for data processing?",
          options: [
            { value: "comprehensive", label: "Comprehensive consent management", score: 10 },
            { value: "adequate", label: "Adequate consent processes", score: 7 },
            { value: "basic", label: "Basic consent collection", score: 3 },
            { value: "minimal", label: "Minimal or no consent", score: 0 }
          ]
        }
      ]
    },
    {
      id: "human_oversight",
      name: "Human Oversight & Control",
      description: "Assess human involvement and control mechanisms",
      icon: Users,
      color: "text-red-600",
      questions: [
        {
          id: "human_review",
          question: "Do you have human review processes for AI decisions?",
          options: [
            { value: "always", label: "Always human reviewed", score: 10 },
            { value: "critical", label: "Human review for critical decisions", score: 7 },
            { value: "occasional", label: "Occasional human review", score: 3 },
            { value: "never", label: "No human review", score: 0 }
          ]
        },
        {
          id: "override_capability",
          question: "Can humans override AI decisions when necessary?",
          options: [
            { value: "full", label: "Full override capability", score: 10 },
            { value: "limited", label: "Limited override capability", score: 7 },
            { value: "restricted", label: "Restricted override", score: 3 },
            { value: "none", label: "No override capability", score: 0 }
          ]
        }
      ]
    }
  ];

  const allQuestions = ethicsCategories.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.id, categoryName: category.name }))
  );

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    allQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      }
      maxScore += 10; // Maximum score per question
    });
    
    return Math.round((totalScore / maxScore) * 100);
  };

  const completeAssessment = () => {
    const score = calculateScore();
    setOverallScore(score);
    setIsAssessmentComplete(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Needs Improvement";
    return "Critical";
  };

  const getCategoryScore = (categoryId: string) => {
    const categoryQuestions = allQuestions.filter(q => q.category === categoryId);
    let categoryScore = 0;
    let maxCategoryScore = 0;
    
    categoryQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          categoryScore += option.score;
        }
      }
      maxCategoryScore += 10;
    });
    
    return Math.round((categoryScore / maxCategoryScore) * 100);
  };

  const currentQuestion = allQuestions[currentStep];
  const isLastQuestion = currentStep === allQuestions.length - 1;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / allQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Ethics-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-green-300/40 dark:bg-green-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-purple-400/35 dark:bg-purple-400/25 rounded-full blur-md float-delayed-2" />
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
                  <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">AI Ethics</span>{' '}
                <span className="gradient-text-blue-light">Checker</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Comprehensive AI ethics assessment tool. Evaluate your AI systems against global ethical standards and best practices.
              </p>

              {/* Ethics Principles */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Scale className="w-4 h-4 mr-2" />
                  Fairness
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Eye className="w-4 h-4 mr-2" />
                  Transparency
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Accountability
                </Badge>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-2">
                  <Lock className="w-4 h-4 mr-2" />
                  Privacy
                </Badge>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={() => setCurrentStep(0)}
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Ethics Assessment
              </Button>
              
              <Button
                onClick={() => navigate('ai-consulting-tools')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Settings className="w-5 h-5 mr-2" />
                View All Tools
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass">
            <TabsTrigger value="assessment">Ethics Assessment</TabsTrigger>
            <TabsTrigger value="categories">Ethics Categories</TabsTrigger>
            <TabsTrigger value="guidelines">Best Practices</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-8 mt-8">
            {!isAssessmentComplete ? (
              <>
                {/* Progress Indicator */}
                <Card className="glass w-full">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Assessment Progress</h3>
                      <Badge variant="outline">
                        {answeredQuestions} of {allQuestions.length} completed
                      </Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-sm text-foreground-muted mt-2">
                      {Math.round(progressPercentage)}% complete
                    </div>
                  </CardContent>
                </Card>

                {/* Current Question */}
                {currentQuestion && (
                  <Card className="glass-heavy w-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">
                          Question {currentStep + 1} of {allQuestions.length}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {currentQuestion.categoryName}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                      >
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <div key={option.value} className="flex items-center space-x-3 p-3 glass-blue-light rounded-lg hover:glass-blue transition-all">
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label htmlFor={option.value} className="flex-grow cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <span>{option.label}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {option.score}/10
                                  </Badge>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                      
                      <div className="flex justify-between mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                          disabled={currentStep === 0}
                        >
                          Previous
                        </Button>
                        
                        {isLastQuestion ? (
                          <Button
                            onClick={completeAssessment}
                            disabled={!answers[currentQuestion.id]}
                            className="gradient-bg-blue text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Complete Assessment
                          </Button>
                        ) : (
                          <Button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!answers[currentQuestion.id]}
                          >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              /* Assessment Results */
              <div className="space-y-8">
                {/* Overall Score */}
                <Card className="glass-heavy w-full">
                  <CardHeader>
                    <CardTitle className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-yellow-600" />
                        <span>Ethics Assessment Results</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
                        {overallScore}%
                      </div>
                      <div className="text-2xl font-semibold mb-4">
                        {getScoreLabel(overallScore)}
                      </div>
                      <Progress value={overallScore} className="h-4 max-w-md mx-auto" />
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card className="glass w-full">
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Detailed scores by ethics category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {ethicsCategories.map((category) => {
                        const Icon = category.icon;
                        const categoryScore = getCategoryScore(category.id);
                        
                        return (
                          <div key={category.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${category.color}`} />
                                <span className="font-medium">{category.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${getScoreColor(categoryScore)}`}>
                                  {categoryScore}%
                                </span>
                                <Badge className={getScoreColor(categoryScore)} variant="secondary">
                                  {getScoreLabel(categoryScore)}
                                </Badge>
                              </div>
                            </div>
                            <Progress value={categoryScore} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card className="glass w-full">
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>Priority improvements based on your assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ethicsCategories
                        .filter(category => getCategoryScore(category.id) < 80)
                        .map((category) => {
                          const Icon = category.icon;
                          return (
                            <div key={category.id} className="flex items-start gap-4 p-4 glass-blue-light rounded-lg">
                              <Icon className={`w-6 h-6 ${category.color} flex-shrink-0 mt-1`} />
                              <div>
                                <h4 className="font-semibold">{category.name}</h4>
                                <p className="text-sm text-foreground-muted mt-1">{category.description}</p>
                                <Button variant="outline" size="sm" className="mt-3">
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  View Recommendations
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Report */}
                <Card className="glass text-center">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Get Detailed Report</h3>
                    <p className="text-foreground-muted mb-6">
                      Download a comprehensive ethics assessment report with detailed recommendations.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button className="gradient-bg-blue text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setIsAssessmentComplete(false);
                        setCurrentStep(0);
                        setAnswers({});
                      }}>
                        <Brain className="w-4 h-4 mr-2" />
                        Retake Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6 mt-8">
            {/* Ethics Categories Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ethicsCategories.map((category, index) => {
                const Icon = category.icon;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-heavy h-full card-hover">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <Icon className={`w-8 h-8 ${category.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground-muted mb-4">{category.description}</p>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Key Focus Areas:</h4>
                          {category.questions.map((question, qIndex) => (
                            <div key={qIndex} className="text-sm text-foreground-muted">
                              • {question.question}
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          <Info className="w-3 h-3 mr-1" />
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6 mt-8">
            {/* Best Practices Guidelines */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  AI Ethics Best Practices
                </CardTitle>
                <CardDescription>
                  Industry-standard guidelines for ethical AI development and deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      principle: "Human-Centric Design",
                      description: "Design AI systems that augment human capabilities rather than replace human judgment",
                      practices: [
                        "Involve humans in critical decision loops",
                        "Provide meaningful human oversight",
                        "Enable human override capabilities",
                        "Design for human-AI collaboration"
                      ]
                    },
                    {
                      principle: "Fairness and Non-Discrimination",
                      description: "Ensure AI systems treat all individuals and groups fairly",
                      practices: [
                        "Regular bias testing and mitigation",
                        "Diverse and representative training data",
                        "Continuous monitoring for discrimination",
                        "Inclusive design processes"
                      ]
                    },
                    {
                      principle: "Transparency and Explainability",
                      description: "Make AI systems understandable and their decisions explainable",
                      practices: [
                        "Clear documentation of AI capabilities",
                        "Explainable AI techniques",
                        "Open communication about limitations",
                        "Regular stakeholder engagement"
                      ]
                    },
                    {
                      principle: "Privacy and Data Protection",
                      description: "Protect individual privacy and ensure responsible data handling",
                      practices: [
                        "Data minimization principles",
                        "Strong consent mechanisms",
                        "Secure data storage and transmission",
                        "Regular privacy impact assessments"
                      ]
                    }
                  ].map((guideline, index) => (
                    <div key={index} className="space-y-3 p-6 glass-blue-light rounded-lg">
                      <h3 className="text-lg font-semibold">{guideline.principle}</h3>
                      <p className="text-foreground-muted">{guideline.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {guideline.practices.map((practice, pIndex) => (
                          <div key={pIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>{practice}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-8">
            {/* Additional Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Documentation & Guides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "AI Ethics Implementation Guide",
                      "Bias Detection and Mitigation Manual",
                      "Transparency Framework Templates",
                      "Privacy Impact Assessment Tools",
                      "Governance Structure Guidelines"
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 glass-blue-light rounded-lg">
                        <span className="text-sm">{doc}</span>
                        <Button variant="outline" size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Standards & Frameworks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "IEEE Standards for AI Ethics", org: "IEEE" },
                      { name: "EU AI Act Guidelines", org: "European Union" },
                      { name: "NIST AI Risk Management", org: "NIST" },
                      { name: "ISO/IEC AI Standards", org: "ISO" },
                      { name: "Partnership on AI Tenets", org: "Partnership on AI" }
                    ].map((standard, index) => (
                      <div key={index} className="p-3 glass-blue-light rounded-lg">
                        <div className="font-medium text-sm">{standard.name}</div>
                        <div className="text-xs text-foreground-muted">{standard.org}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact for Expert Consultation */}
            <Card className="glass text-center">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Need Expert Guidance?</h3>
                <p className="text-foreground-muted mb-6">
                  Our AI ethics specialists can help you implement comprehensive ethical frameworks.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('contact')}
                    className="gradient-bg-blue text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Consult Expert
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('demo-request')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}