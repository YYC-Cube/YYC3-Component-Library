"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Users,
  BarChart3,
  Calendar,
  Monitor,
  Shield,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Star,
  Play,
  Pause,
  RotateCcw,
  Flag,
  AlertTriangle,
  Eye,
  Download,
  Upload,
  Settings,
  HelpCircle,
  MessageSquare,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Maximize2
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";

interface ExamCenterPageProps {
  navigate: (page: string) => void;
}

export function ExamCenterPage({ navigate }: ExamCenterPageProps) {
  const [selectedExam, setSelectedExam] = useState("ai-fundamentals");
  const [examMode, setExamMode] = useState("practice"); // practice, certification, proctored
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [isExamActive, setIsExamActive] = useState(false);

  const availableExams = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals Certification",
      description: "Test your knowledge of basic AI concepts, machine learning, and business applications",
      level: "Beginner",
      duration: "60 minutes",
      questions: 50,
      passingScore: 80,
      attempts: 3,
      cost: "Free",
      category: "AI & Machine Learning",
      prerequisites: ["Complete AI Fundamentals Course"],
      badge: "AI Fundamentals Certified"
    },
    {
      id: "digital-strategy",
      title: "Digital Strategy Expert",
      description: "Advanced certification in digital transformation and strategic AI implementation",
      level: "Advanced",
      duration: "90 minutes",
      questions: 75,
      passingScore: 85,
      attempts: 2,
      cost: "Free",
      category: "Strategy & Leadership",
      prerequisites: ["Complete Digital Strategy Course", "2+ years experience"],
      badge: "Digital Strategy Expert"
    },
    {
      id: "machine-learning",
      title: "Machine Learning Specialist",
      description: "Comprehensive examination on ML algorithms, implementation, and optimization",
      level: "Intermediate",
      duration: "75 minutes",
      questions: 60,
      passingScore: 82,
      attempts: 3,
      cost: "Free",
      category: "Technical Implementation",
      prerequisites: ["Complete ML Implementation Course", "Basic Python knowledge"],
      badge: "ML Specialist Certified"
    },
    {
      id: "ai-ethics",
      title: "AI Ethics & Governance",
      description: "Certification in responsible AI development, ethics, and regulatory compliance",
      level: "Intermediate",
      duration: "45 minutes",
      questions: 40,
      passingScore: 85,
      attempts: 3,
      cost: "Free",
      category: "Ethics & Compliance",
      prerequisites: ["Complete AI Ethics Course"],
      badge: "AI Ethics Certified"
    }
  ];

  const examStats = [
    { label: "Total Exams Taken", value: "12,847", icon: FileText },
    { label: "Pass Rate", value: "87%", icon: CheckCircle2 },
    { label: "Average Score", value: "89%", icon: TrendingUp },
    { label: "Certifications Issued", value: "11,156", icon: Award },
    { label: "Active Candidates", value: "3,429", icon: Users },
    { label: "Exam Sessions Today", value: "156", icon: Calendar }
  ];

  const sampleQuestions = [
    {
      id: 1,
      question: "Which of the following best describes the primary goal of machine learning?",
      type: "multiple-choice",
      options: [
        "To replace human decision-making entirely",
        "To enable computers to learn and improve from experience without being explicitly programmed",
        "To create artificial general intelligence",
        "To automate all business processes"
      ],
      correctAnswer: 1,
      explanation: "Machine learning's primary goal is to enable computers to learn patterns from data and improve their performance on tasks without being explicitly programmed for each scenario.",
      difficulty: "Easy",
      category: "Fundamentals"
    },
    {
      id: 2,
      question: "What are the key considerations when implementing AI in a business environment?",
      type: "multiple-select",
      options: [
        "Data quality and availability",
        "Regulatory compliance and ethics",
        "Technical infrastructure requirements",
        "Cost-benefit analysis",
        "Employee training and change management"
      ],
      correctAnswers: [0, 1, 2, 3, 4],
      explanation: "All these factors are crucial for successful AI implementation in business environments.",
      difficulty: "Medium",
      category: "Implementation"
    },
    {
      id: 3,
      question: "Explain the difference between supervised and unsupervised learning, providing one example of each.",
      type: "essay",
      maxWords: 200,
      rubric: [
        "Clear definition of supervised learning (2 points)",
        "Clear definition of unsupervised learning (2 points)", 
        "Appropriate example of supervised learning (2 points)",
        "Appropriate example of unsupervised learning (2 points)",
        "Overall clarity and organization (2 points)"
      ],
      difficulty: "Hard",
      category: "Theory"
    }
  ];

  const examHistory = [
    {
      examTitle: "AI Fundamentals Certification",
      date: "2024-05-15",
      score: 92,
      passed: true,
      duration: "58:32",
      certificateId: "AFC-2024-0892"
    },
    {
      examTitle: "Digital Strategy Expert",
      date: "2024-04-20",
      score: 78,
      passed: false,
      duration: "87:45",
      certificateId: null
    },
    {
      examTitle: "Machine Learning Specialist",
      date: "2024-03-10",
      score: 89,
      passed: true,
      duration: "72:18",
      certificateId: "MLS-2024-0567"
    }
  ];

  const proctorFeatures = [
    { name: "Live Video Monitoring", icon: Camera, description: "Real-time webcam monitoring during exam" },
    { name: "Screen Recording", icon: Monitor, description: "Full screen recording and analysis" },
    { name: "Audio Monitoring", icon: Mic, description: "Continuous audio monitoring for irregularities" },
    { name: "AI Behavior Analysis", icon: Brain, description: "AI-powered suspicious behavior detection" },
    { name: "Browser Security", icon: Shield, description: "Secure browser environment with restrictions" },
    { name: "Identity Verification", icon: Eye, description: "Multi-factor identity verification process" }
  ];

  const selectedExamData = availableExams.find(exam => exam.id === selectedExam);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "Intermediate": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "Advanced": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-blue-50/30 to-indigo-100/40 dark:from-indigo-950/20 dark:via-blue-950/10 dark:to-indigo-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)]" />
          
          {/* Exam-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200/30 dark:bg-indigo-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-indigo-400/35 dark:bg-indigo-400/25 rounded-full blur-md float-delayed-2" />
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
                  <FileText className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Exam</span>{' '}
                <span className="text-indigo-600">Center</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Validate your AI expertise with industry-recognized certifications. Take proctored exams, track your progress, and earn credentials that advance your career.
              </p>

              {/* Technology Badges */}
              <div className="flex justify-center flex-wrap gap-4 mb-8">
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure Proctoring
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Industry Certified
                </Badge>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-4 py-2">
                  <Brain className="w-4 h-4 mr-2" />
                  AI-Powered
                </Badge>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2">
                  <Monitor className="w-4 h-4 mr-2" />
                  Remote Testing
                </Badge>
              </div>

              {/* Exam Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {examStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-indigo-600">{stat.value}</div>
                      <div className="text-xs text-foreground-muted">{stat.label}</div>
                    </div>
                  );
                })}
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
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Play className="w-5 h-5 mr-2" />
                Take Practice Exam
              </Button>
              
              <Button
                onClick={() => navigate('delibix-academy')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Award className="w-5 h-5 mr-2" />
                View Certifications
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass">
            <TabsTrigger value="exams">Available Exams</TabsTrigger>
            <TabsTrigger value="practice">Practice Mode</TabsTrigger>
            <TabsTrigger value="proctoring">Proctored Exams</TabsTrigger>
            <TabsTrigger value="results">My Results</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-8 mt-8">
            {/* Available Exams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {availableExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy h-full card-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{exam.title}</CardTitle>
                          <CardDescription className="mb-3">{exam.description}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge className={getLevelColor(exam.level)}>
                              {exam.level}
                            </Badge>
                            <Badge variant="outline">{exam.category}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Exam Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            <span>{exam.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span>{exam.questions} questions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <span>{exam.passingScore}% to pass</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <RotateCcw className="w-4 h-4 text-orange-600" />
                            <span>{exam.attempts} attempts</span>
                          </div>
                        </div>

                        <Separator />

                        {/* Prerequisites */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">Prerequisites:</h4>
                          <div className="space-y-1">
                            {exam.prerequisites.map((prereq, prereqIndex) => (
                              <div key={prereqIndex} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                <span>{prereq}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Certification Badge */}
                        <div className="glass-blue-light p-3 rounded-lg text-center">
                          <Award className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                          <div className="font-medium text-sm">{exam.badge}</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Practice
                          </Button>
                          <Button size="sm" className="gradient-bg-blue text-white">
                            <FileText className="w-4 h-4 mr-2" />
                            Take Exam
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 mt-8">
            {/* Practice Mode Interface */}
            <Card className="glass-heavy">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-6 h-6 text-indigo-600" />
                      Practice Mode - AI Fundamentals
                    </CardTitle>
                    <CardDescription>Unlimited practice with instant feedback</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Question {currentQuestion + 1} of {sampleQuestions.length}
                    </Badge>
                    <div className="text-lg font-mono text-indigo-600">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-6">
                  <Progress value={(currentQuestion / sampleQuestions.length) * 100} className="h-2" />
                </div>

                {/* Sample Question */}
                {sampleQuestions[currentQuestion] && (
                  <div className="space-y-6">
                    <div className="p-6 glass-blue-light rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {sampleQuestions[currentQuestion].question}
                        </h3>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {sampleQuestions[currentQuestion].difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {sampleQuestions[currentQuestion].category}
                          </Badge>
                        </div>
                      </div>

                      {/* Multiple Choice */}
                      {sampleQuestions[currentQuestion].type === "multiple-choice" && (
                        <RadioGroup>
                          {sampleQuestions[currentQuestion].options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 p-3 glass rounded-lg">
                              <RadioGroupItem value={optionIndex.toString()} id={`option-${optionIndex}`} />
                              <Label htmlFor={`option-${optionIndex}`} className="flex-grow cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {/* Multiple Select */}
                      {sampleQuestions[currentQuestion].type === "multiple-select" && (
                        <div className="space-y-3">
                          {sampleQuestions[currentQuestion].options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-2 p-3 glass rounded-lg">
                              <Checkbox id={`checkbox-${optionIndex}`} />
                              <Label htmlFor={`checkbox-${optionIndex}`} className="flex-grow cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Essay Question */}
                      {sampleQuestions[currentQuestion].type === "essay" && (
                        <div className="space-y-4">
                          <div className="glass p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Essay Response</span>
                              <span className="text-sm text-foreground-muted">
                                Max {sampleQuestions[currentQuestion].maxWords} words
                              </span>
                            </div>
                            <textarea
                              className="w-full h-32 p-3 bg-input-background border border-border rounded-lg resize-none"
                              placeholder="Type your response here..."
                            />
                          </div>
                          
                          <div className="glass-blue-light p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Grading Rubric:</h4>
                            <div className="space-y-1">
                              {sampleQuestions[currentQuestion].rubric?.map((criterion, index) => (
                                <div key={index} className="text-sm text-foreground-muted">
                                  • {criterion}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Flag className="w-4 h-4 mr-2" />
                          Flag for Review
                        </Button>
                        <Button>
                          Submit Answer
                        </Button>
                      </div>
                      
                      <Button
                        onClick={() => setCurrentQuestion(Math.min(sampleQuestions.length - 1, currentQuestion + 1))}
                        disabled={currentQuestion === sampleQuestions.length - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proctoring" className="space-y-6 mt-8">
            {/* Proctored Exam Features */}
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  Secure Proctored Examinations
                </CardTitle>
                <CardDescription>
                  Industry-standard remote proctoring for certification exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {proctorFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="glass-blue-light p-6 rounded-lg text-center">
                        <Icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">{feature.name}</h3>
                        <p className="text-sm text-foreground-muted">{feature.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* System Requirements */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>System Requirements & Setup</CardTitle>
                <CardDescription>Ensure your system meets requirements for proctored exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Technical Requirements:</h4>
                    <div className="space-y-3">
                      {[
                        "Stable internet connection (minimum 5 Mbps)",
                        "Webcam (720p or higher resolution)",
                        "Microphone with noise cancellation",
                        "Modern web browser (Chrome, Firefox, Safari)",
                        "Quiet, well-lit testing environment",
                        "Government-issued photo ID for verification"
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Pre-Exam Checklist:</h4>
                    <div className="space-y-3">
                      {[
                        "Complete system compatibility test",
                        "Verify identity documents",
                        "Clear your testing area",
                        "Close all unnecessary applications",
                        "Inform others not to disturb",
                        "Review exam rules and policies"
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 border border-gray-400 rounded"></div>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="gradient-bg-blue text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Test System Compatibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6 mt-8">
            {/* Exam History */}
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Exam History & Results
                </CardTitle>
                <CardDescription>Track your examination performance and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examHistory.map((exam, index) => (
                    <div key={index} className="glass-blue-light p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{exam.examTitle}</h3>
                          <div className="flex items-center gap-4 text-sm text-foreground-muted">
                            <span>Date: {exam.date}</span>
                            <span>Duration: {exam.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {exam.score}%
                          </div>
                          <Badge className={exam.passed ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}>
                            {exam.passed ? 'PASSED' : 'FAILED'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {exam.certificateId && (
                            <span className="text-sm">Certificate ID: {exam.certificateId}</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          {exam.certificateId && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Download Certificate
                            </Button>
                          )}
                          {!exam.passed && (
                            <Button size="sm">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Retake
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6 mt-8">
            {/* Digital Certificates */}
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-600" />
                  Digital Certificates
                </CardTitle>
                <CardDescription>Your earned certifications and digital badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examHistory.filter(exam => exam.passed).map((exam, index) => (
                    <div key={index} className="glass-blue-light p-6 rounded-lg text-center">
                      <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">{exam.examTitle}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="text-2xl font-bold text-green-600">{exam.score}%</div>
                        <div className="text-sm text-foreground-muted">Earned: {exam.date}</div>
                        <div className="text-xs font-mono">{exam.certificateId}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {examHistory.filter(exam => exam.passed).length === 0 && (
                  <div className="text-center py-12">
                    <Award className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground-muted mb-2">No Certificates Yet</h3>
                    <p className="text-foreground-muted mb-6">Pass your first exam to earn a digital certificate</p>
                    <Button>
                      <FileText className="w-4 h-4 mr-2" />
                      Take Your First Exam
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help & Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Need Help with Exams?</h2>
                <p className="text-foreground-muted max-w-2xl mx-auto">
                  Our support team is here to help you succeed. Get assistance with technical issues, exam preparation, or certification questions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <HelpCircle className="w-6 h-6" />
                  <span>FAQ</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Live Chat</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6" />
                  <span>Study Guides</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6" />
                  <span>System Test</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}