"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  Play, 
  Clock, 
  Star,
  ChevronRight,
  Download,
  Certificate,
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Code,
  Database,
  Shield,
  Rocket,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Video,
  FileText,
  MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface DelibixAcademyPageProps {
  navigate: (page: string) => void;
}

export function DelibixAcademyPage({ navigate }: DelibixAcademyPageProps) {
  const [selectedTrack, setSelectedTrack] = useState("ai-fundamentals");

  const learningTracks = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals",
      description: "Master the core concepts of artificial intelligence and machine learning",
      level: "Beginner",
      duration: "6 weeks",
      modules: 12,
      icon: Brain,
      color: "bg-blue-500",
      enrolled: 2847,
      rating: 4.9,
      skills: ["Machine Learning Basics", "AI Ethics", "Data Science", "Python Programming"]
    },
    {
      id: "digital-strategy",
      title: "Digital Strategy",
      description: "Learn to develop and execute comprehensive digital transformation strategies",
      level: "Intermediate",
      duration: "8 weeks", 
      modules: 16,
      icon: Target,
      color: "bg-purple-500",
      enrolled: 1923,
      rating: 4.8,
      skills: ["Strategic Planning", "Digital Leadership", "Change Management", "Innovation"]
    },
    {
      id: "ai-implementation",
      title: "AI Implementation",
      description: "Hands-on experience implementing AI solutions in enterprise environments",
      level: "Advanced",
      duration: "10 weeks",
      modules: 20,
      icon: Code,
      color: "bg-green-500",
      enrolled: 1456,
      rating: 4.9,
      skills: ["MLOps", "Cloud AI", "Model Deployment", "System Integration"]
    },
    {
      id: "data-governance",
      title: "Data Governance & Ethics",
      description: "Understand responsible AI practices and data management frameworks",
      level: "Intermediate",
      duration: "6 weeks",
      modules: 14,
      icon: Shield,
      color: "bg-orange-500",
      enrolled: 1789,
      rating: 4.7,
      skills: ["Data Privacy", "AI Ethics", "Compliance", "Risk Management"]
    }
  ];

  const featuredCourses = [
    {
      title: "Introduction to Generative AI",
      instructor: "Dr. Sarah Chen",
      duration: "3 hours",
      level: "Beginner",
      rating: 4.9,
      students: 15420,
      description: "Explore the fundamentals of generative AI and its business applications",
      thumbnail: "🤖"
    },
    {
      title: "AI Strategy for Executives",
      instructor: "Michael Rodriguez",
      duration: "2.5 hours",
      level: "Executive",
      rating: 4.8,
      students: 8930,
      description: "Strategic framework for AI adoption in enterprise environments",
      thumbnail: "🎯"
    },
    {
      title: "Machine Learning in Production",
      instructor: "Dr. Amit Patel",
      duration: "6 hours",
      level: "Advanced",
      rating: 4.9,
      students: 5670,
      description: "Deploy and maintain ML models in production environments",
      thumbnail: "⚙️"
    },
    {
      title: "Data Ethics & AI Bias",
      instructor: "Dr. Lisa Thompson",
      duration: "4 hours",
      level: "Intermediate",
      rating: 4.7,
      students: 7890,
      description: "Understanding and mitigating bias in AI systems",
      thumbnail: "⚖️"
    }
  ];

  const achievements = [
    { label: "Total Students", value: "50,000+", icon: Users },
    { label: "Course Completion Rate", value: "94%", icon: CheckCircle2 },
    { label: "Industry Certifications", value: "25+", icon: Award },
    { label: "Expert Instructors", value: "150+", icon: GraduationCap }
  ];

  const selectedTrackData = learningTracks.find(track => track.id === selectedTrack);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/60 dark:from-blue-950/40 dark:via-background dark:to-blue-900/30" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" />
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-400/35 dark:bg-blue-400/25 rounded-full blur-md float-delayed-2" />
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
                  <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Delibix</span>{' '}
                <span className="gradient-text-blue-light">Academy</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Master AI and digital transformation with our comprehensive learning platform. From fundamentals to advanced implementation.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-600">{achievement.value}</div>
                      <div className="text-xs text-foreground-muted">{achievement.label}</div>
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
                onClick={() => navigate('course-catalog')}
                size="lg"
                className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Courses
              </Button>
              
              <Button
                onClick={() => navigate('certification-program')}
                variant="outline"
                size="lg"
                className="glass-blue-light border-blue-200 dark:border-blue-700 hover:glass-blue transition-all duration-300 px-8 py-6 text-lg button-hover"
              >
                <Award className="w-5 h-5 mr-2" />
                Get Certified
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="tracks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="tracks">Learning Tracks</TabsTrigger>
            <TabsTrigger value="courses">Featured Courses</TabsTrigger>
            <TabsTrigger value="instructors">Expert Instructors</TabsTrigger>
          </TabsList>

          <TabsContent value="tracks" className="space-y-8 mt-8">
            {/* Learning Tracks Overview */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  Structured Learning Paths
                </CardTitle>
                <CardDescription>
                  Choose your learning journey based on your experience level and career goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {learningTracks.map((track, index) => {
                    const Icon = track.icon;
                    const isSelected = track.id === selectedTrack;
                    
                    return (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedTrack(track.id)}
                      >
                        <Card className={`glass-heavy h-full card-hover ${isSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''}`}>
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <div className={`p-3 ${track.color} rounded-xl text-white`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-grow">
                                <CardTitle className="text-lg">{track.title}</CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary">{track.level}</Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs">{track.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground-muted mb-4">{track.description}</p>
                            
                            <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{track.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{track.modules} modules</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{track.enrolled.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-foreground-muted">Key Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {track.skills.slice(0, 3).map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {track.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{track.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Track Details */}
            {selectedTrackData && (
              <Card className="glass w-full bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-700">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">
                    {selectedTrackData.title} - Learning Path
                  </CardTitle>
                  <CardDescription>
                    Detailed curriculum and progression for this track
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">What You'll Learn:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedTrackData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Track Progress</span>
                          <span className="text-sm text-blue-600">0% Complete</span>
                        </div>
                        <Progress value={0} className="h-2" />
                        <p className="text-xs text-foreground-muted mt-1">
                          Start your journey today and track your progress
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="glass-blue-light p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Track Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Level:</span>
                            <span className="font-medium">{selectedTrackData.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{selectedTrackData.duration}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Modules:</span>
                            <span className="font-medium">{selectedTrackData.modules}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Enrolled:</span>
                            <span className="font-medium">{selectedTrackData.enrolled.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => navigate('signup')}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-8">
            {/* Featured Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-heavy h-full card-hover">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{course.thumbnail}</div>
                        <div className="flex-grow">
                          <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{course.level}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{course.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground-muted">{course.instructor}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground-muted mb-4">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-grow">
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Course Categories */}
            <Card className="glass w-full">
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
                <CardDescription>Explore courses organized by topics and specializations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "AI Fundamentals", count: "24 courses", icon: Brain },
                    { name: "Machine Learning", count: "18 courses", icon: TrendingUp },
                    { name: "Data Science", count: "16 courses", icon: Database },
                    { name: "Digital Strategy", count: "12 courses", icon: Target },
                    { name: "Ethics & Governance", count: "8 courses", icon: Shield },
                    { name: "Implementation", count: "14 courses", icon: Code },
                    { name: "Leadership", count: "10 courses", icon: Users },
                    { name: "Innovation", count: "6 courses", icon: Lightbulb }
                  ].map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        onClick={() => navigate('course-catalog')}
                      >
                        <Icon className="w-6 h-6 text-blue-600" />
                        <div className="text-center">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-foreground-muted">{category.count}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructors" className="space-y-6 mt-8">
            {/* Expert Instructors */}
            <Card className="glass-heavy w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-blue-600" />
                  World-Class Instructors
                </CardTitle>
                <CardDescription>
                  Learn from industry experts and thought leaders in AI and digital transformation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Dr. Sarah Chen",
                      title: "AI Research Director",
                      expertise: "Generative AI, NLP",
                      courses: 8,
                      students: 15420,
                      rating: 4.9,
                      bio: "Former Google AI researcher with 15+ years in machine learning and natural language processing."
                    },
                    {
                      name: "Michael Rodriguez",
                      title: "Digital Transformation Expert",
                      expertise: "Strategy, Leadership",
                      courses: 6,
                      students: 12350,
                      rating: 4.8,
                      bio: "Ex-McKinsey partner who led digital transformation for Fortune 500 companies."
                    },
                    {
                      name: "Dr. Amit Patel",
                      title: "MLOps Specialist",
                      expertise: "Production ML, DevOps",
                      courses: 10,
                      students: 9870,
                      rating: 4.9,
                      bio: "Senior engineer at Netflix, specialist in scaling machine learning systems."
                    },
                    {
                      name: "Dr. Lisa Thompson",
                      title: "AI Ethics Researcher",
                      expertise: "Ethics, Bias, Governance",
                      courses: 5,
                      students: 7890,
                      rating: 4.7,
                      bio: "Stanford professor and leading researcher in responsible AI and algorithmic fairness."
                    },
                    {
                      name: "James Wilson",
                      title: "Enterprise Architect",
                      expertise: "System Design, Integration",
                      courses: 7,
                      students: 11200,
                      rating: 4.8,
                      bio: "20+ years designing enterprise systems, currently CTO at a leading AI startup."
                    },
                    {
                      name: "Dr. Maria Garcia",
                      title: "Data Science Director",
                      expertise: "Analytics, Visualization",
                      courses: 9,
                      students: 13450,
                      rating: 4.9,
                      bio: "Former Uber data science leader, expert in large-scale analytics and experimentation."
                    }
                  ].map((instructor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass h-full card-hover">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-16 h-16">
                              <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                                {instructor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{instructor.name}</h3>
                              <p className="text-sm text-blue-600">{instructor.title}</p>
                              <p className="text-xs text-foreground-muted">{instructor.expertise}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-foreground-muted mb-4">{instructor.bio}</p>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                            <div className="text-center">
                              <div className="font-semibold">{instructor.courses}</div>
                              <div className="text-xs text-foreground-muted">Courses</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{instructor.students.toLocaleString()}</div>
                              <div className="text-xs text-foreground-muted">Students</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold flex items-center justify-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {instructor.rating}
                              </div>
                              <div className="text-xs text-foreground-muted">Rating</div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 dark:from-blue-950/30 dark:via-background dark:to-blue-950/30">
            <CardContent className="p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Start Your AI Learning Journey Today
                </h2>
                <p className="text-lg text-foreground-muted mb-8">
                  Join thousands of professionals who have advanced their careers with Delibix Academy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('signup')}
                    size="lg"
                    className="gradient-bg-blue text-white hover:gradient-bg-blue-light transition-all duration-300 px-8 py-4"
                  >
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Enroll Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('course-catalog')}
                    size="lg"
                    className="px-8 py-4"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Browse Catalog
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}