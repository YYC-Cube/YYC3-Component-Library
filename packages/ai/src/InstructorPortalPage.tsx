"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Star, 
  Award, 
  TrendingUp,
  BarChart3,
  Calendar,
  MessageSquare,
  Video,
  FileText,
  Upload,
  Download,
  Settings,
  Bell,
  Clock,
  Target,
  CheckCircle2,
  ChevronRight,
  Play,
  Edit,
  Eye,
  DollarSign,
  Globe,
  Activity,
  Monitor,
  Lightbulb,
  Shield,
  Database,
  Zap,
  Brain,
  Network
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface InstructorPortalPageProps {
  navigate: (page: string) => void;
}

export function InstructorPortalPage({ navigate }: InstructorPortalPageProps) {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  const instructorStats = [
    { label: "Total Students", value: "2,847", change: "+12%", icon: Users, color: "text-blue-600" },
    { label: "Course Completion Rate", value: "94%", change: "+5%", icon: TrendingUp, color: "text-green-600" },
    { label: "Average Rating", value: "4.9", change: "+0.1", icon: Star, color: "text-yellow-600" },
    { label: "Revenue This Month", value: "$12,450", change: "+8%", icon: DollarSign, color: "text-purple-600" },
    { label: "Active Courses", value: "8", change: "+2", icon: BookOpen, color: "text-orange-600" },
    { label: "Hours Taught", value: "156", change: "+18", icon: Clock, color: "text-indigo-600" }
  ];

  const activeCourses = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals for Business",
      students: 342,
      completion: 87,
      rating: 4.9,
      revenue: "$3,240",
      status: "Active",
      nextDeadline: "Assignment Review",
      dueDate: "2024-06-15"
    },
    {
      id: "machine-learning",
      title: "Machine Learning Implementation",
      students: 189,
      completion: 92,
      rating: 4.8,
      revenue: "$2,835",
      status: "Active",
      nextDeadline: "Course Update",
      dueDate: "2024-06-18"
    },
    {
      id: "digital-strategy",
      title: "Digital Strategy Masterclass",
      students: 256,
      completion: 89,
      rating: 4.9,
      revenue: "$3,840",
      status: "Active",
      nextDeadline: "Live Session",
      dueDate: "2024-06-16"
    },
    {
      id: "ai-ethics",
      title: "AI Ethics & Governance",
      students: 97,
      completion: 94,
      rating: 4.7,
      revenue: "$1,455",
      status: "New",
      nextDeadline: "Content Review",
      dueDate: "2024-06-20"
    }
  ];

  const recentActivities = [
    {
      type: "student_question",
      message: "New question from Sarah Chen in AI Fundamentals",
      time: "5 minutes ago",
      priority: "high"
    },
    {
      type: "course_completion",
      message: "25 students completed Machine Learning Module 3",
      time: "2 hours ago",
      priority: "medium"
    },
    {
      type: "review_received",
      message: "New 5-star review for Digital Strategy course",
      time: "4 hours ago",
      priority: "low"
    },
    {
      type: "payment_received",
      message: "Monthly earnings payment of $2,340 processed",
      time: "1 day ago",
      priority: "medium"
    },
    {
      type: "course_milestone",
      message: "AI Ethics course reached 100 students milestone",
      time: "2 days ago",
      priority: "low"
    }
  ];

  const upcomingSchedule = [
    {
      type: "live_session",
      title: "AI Strategy Live Q&A",
      course: "Digital Strategy Masterclass",
      date: "2024-06-16",
      time: "14:00 UTC",
      participants: 45
    },
    {
      type: "assignment_deadline",
      title: "Module 4 Assignment Review",
      course: "AI Fundamentals for Business",
      date: "2024-06-17",
      time: "23:59 UTC",
      submissions: 234
    },
    {
      type: "webinar",
      title: "Future of AI in Business",
      course: "Public Webinar",
      date: "2024-06-20",
      time: "16:00 UTC",
      participants: 150
    },
    {
      type: "office_hours",
      title: "Office Hours - ML Implementation",
      course: "Machine Learning Implementation",
      date: "2024-06-18",
      time: "10:00 UTC",
      participants: 12
    }
  ];

  const instructorResources = [
    {
      category: "Teaching Tools",
      icon: Monitor,
      resources: [
        "Interactive lesson builder",
        "Assignment creation tools",
        "Quiz and assessment maker",
        "Live session platform",
        "Student progress tracking",
        "Grade book management"
      ]
    },
    {
      category: "Content Library",
      icon: Database,
      resources: [
        "Course template library",
        "Stock image collection",
        "Video editing tools",
        "Presentation templates",
        "Code snippet library",
        "Case study database"
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart3,
      resources: [
        "Student engagement analytics",
        "Course performance metrics",
        "Revenue tracking",
        "Completion rate analysis",
        "Feedback sentiment analysis",
        "Market trend insights"
      ]
    },
    {
      category: "Support & Training",
      icon: Lightbulb,
      resources: [
        "Instructor best practices guide",
        "Video recording tutorials",
        "Course marketing strategies",
        "Student engagement techniques",
        "Technology training",
        "Peer instructor community"
      ]
    }
  ];

  const certificationStatus = {
    current: [
      { name: "Certified AI Instructor", level: "Advanced", earned: "2023-09-15", expires: "2025-09-15" },
      { name: "Digital Strategy Expert", level: "Master", earned: "2023-12-20", expires: "2025-12-20" },
      { name: "Machine Learning Specialist", level: "Professional", earned: "2024-02-10", expires: "2026-02-10" }
    ],
    available: [
      { name: "Quantum Computing Educator", level: "Emerging", duration: "40 hours", cost: "Free" },
      { name: "Web3 Technology Instructor", level: "Advanced", duration: "60 hours", cost: "Free" },
      { name: "IoT Systems Trainer", level: "Professional", duration: "50 hours", cost: "Free" }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      case "medium": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "student_question": return MessageSquare;
      case "course_completion": return CheckCircle2;
      case "review_received": return Star;
      case "payment_received": return DollarSign;
      case "course_milestone": return Award;
      default: return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950/20 dark:via-background dark:to-blue-950/20 prevent-overflow-x">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-purple-100/40 dark:from-purple-950/20 dark:via-blue-950/10 dark:to-purple-900/20" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,69,244,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.03)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(rgba(139,69,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,69,244,0.05)_1px,transparent_1px)]" />
          
          {/* Education-themed floating elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/30 dark:bg-purple-600/20 rounded-full blur-xl float" />
          <div className="absolute top-32 right-20 w-24 h-24 bg-blue-300/40 dark:bg-blue-500/30 rounded-full blur-lg float-delayed" />
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
                  <GraduationCap className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  <div className="dust-particle dust-particle-blue dust-particle-1"></div>
                  <div className="dust-particle dust-particle-light dust-particle-2"></div>
                  <div className="dust-particle dust-particle-white dust-particle-3"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text-blue">Instructor</span>{' '}
                <span className="text-purple-600">Portal</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-foreground-muted max-w-4xl mx-auto mb-8 leading-relaxed">
                Empower the next generation of AI professionals. Manage your courses, track student progress, and grow your teaching impact at Delibix Academy.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-8">
                {instructorStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="glass-blue-light p-4 rounded-xl text-center">
                      <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                      <div className="text-lg font-bold text-purple-600">{stat.value}</div>
                      <div className="text-xs text-foreground-muted">{stat.label}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="glass p-6 rounded-2xl mb-8 max-w-3xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-purple-600 text-white text-lg font-bold">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <h2 className="text-2xl font-bold">Welcome back, Dr. Rodriguez!</h2>
                  <p className="text-foreground-muted">AI Strategy & Digital Transformation Expert</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Master Instructor
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.9 Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 glass">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="certification">Certification</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-8">
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Metrics */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                      Performance Overview
                    </CardTitle>
                    <CardDescription>Your teaching metrics for this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {instructorStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <div key={index} className="text-center p-4 glass-blue-light rounded-lg">
                            <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className="text-sm text-foreground-muted">{stat.label}</div>
                            <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {stat.change} this month
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Courses */}
                <Card className="glass-heavy">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                      Active Courses
                    </CardTitle>
                    <CardDescription>Manage your current course offerings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeCourses.map((course, index) => (
                        <div key={index} className="glass-blue-light p-4 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{course.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-foreground-muted">
                                <span>{course.students} students</span>
                                <span>{course.completion}% completion</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{course.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">{course.revenue}</div>
                              <Badge className={course.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}>
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="font-medium">Next: </span>
                              <span>{course.nextDeadline}</span>
                              <span className="text-foreground-muted"> - {course.dueDate}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activities */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 glass-blue-light rounded-lg">
                            <Icon className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-grow">
                              <p className="text-sm">{activity.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-foreground-muted">{activity.time}</span>
                                <Badge className={getPriorityColor(activity.priority)} variant="secondary">
                                  {activity.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Schedule */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      Upcoming Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingSchedule.map((item, index) => (
                        <div key={index} className="p-3 glass-blue-light rounded-lg">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <p className="text-xs text-foreground-muted">{item.course}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs">{item.date} at {item.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.participants || item.submissions} participants
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6 mt-8">
            {/* Course Management */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Management</h2>
              <Button className="gradient-bg-blue text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create New Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCourses.map((course, index) => (
                <Card key={index} className="glass-heavy card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className={course.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}>
                        {course.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Students Enrolled:</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion Rate:</span>
                          <span className="font-medium">{course.completion}%</span>
                        </div>
                        <Progress value={course.completion} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Revenue:</span>
                        <span className="font-bold text-green-600">{course.revenue}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6 mt-8">
            {/* Student Management */}
            <Card className="glass-heavy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Student Analytics
                </CardTitle>
                <CardDescription>Overview of your student base and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 glass-blue-light rounded-lg">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">2,847</div>
                    <div className="text-sm text-foreground-muted">Total Students</div>
                  </div>
                  <div className="text-center p-4 glass-blue-light rounded-lg">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-sm text-foreground-muted">Avg Completion</div>
                  </div>
                  <div className="text-center p-4 glass-blue-light rounded-lg">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm text-foreground-muted">Avg Rating</div>
                  </div>
                  <div className="text-center p-4 glass-blue-light rounded-lg">
                    <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-foreground-muted">Active Discussions</div>
                  </div>
                </div>

                {/* Student Engagement Tools */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    <span>Q&A Forum</span>
                    <span className="text-xs text-foreground-muted">24 new questions</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Video className="w-6 h-6" />
                    <span>Live Sessions</span>
                    <span className="text-xs text-foreground-muted">Next: Tomorrow 2PM</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Award className="w-6 h-6" />
                    <span>Certificates</span>
                    <span className="text-xs text-foreground-muted">89 pending reviews</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6 mt-8">
            {/* Instructor Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {instructorResources.map((resource, index) => {
                const Icon = resource.icon;
                
                return (
                  <Card key={index} className="glass-heavy">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                          <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.category}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {resource.resources.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-3 glass-blue-light rounded-lg">
                            <span className="text-sm">{item}</span>
                            <ChevronRight className="w-4 h-4 text-foreground-muted" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="certification" className="space-y-6 mt-8">
            {/* Certification Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Certifications */}
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-gold-600" />
                    Current Certifications
                  </CardTitle>
                  <CardDescription>Your active instructor certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificationStatus.current.map((cert, index) => (
                      <div key={index} className="p-4 glass-blue-light rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {cert.level}
                          </Badge>
                        </div>
                        <div className="text-sm text-foreground-muted">
                          <div>Earned: {cert.earned}</div>
                          <div>Expires: {cert.expires}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Available Certifications */}
              <Card className="glass-heavy">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Available Certifications
                  </CardTitle>
                  <CardDescription>Expand your expertise with new certifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificationStatus.available.map((cert, index) => (
                      <div key={index} className="p-4 glass-blue-light rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{cert.name}</h3>
                          <Badge variant="outline">{cert.level}</Badge>
                        </div>
                        <div className="text-sm text-foreground-muted mb-3">
                          <div>Duration: {cert.duration}</div>
                          <div>Cost: {cert.cost}</div>
                        </div>
                        <Button size="sm" className="w-full">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          Start Certification
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <Card className="glass w-full">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Expand Your Impact?</h2>
                <p className="text-foreground-muted max-w-2xl mx-auto">
                  Take your teaching to the next level with advanced tools, new courses, and expanded reach.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button className="h-auto p-4 flex flex-col items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  <span>Create Course</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Video className="w-6 h-6" />
                  <span>Schedule Live Session</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  <span>Contact Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}