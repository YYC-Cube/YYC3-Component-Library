"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Award, BookOpen, Users, Clock, Star, ArrowRight,
  CheckCircle, PlayCircle, Download, Calendar, Target, Brain,
  Trophy, Shield, Globe, Zap, Code, Database, Monitor, FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

interface TrainingCertificationPageProps {
  navigate: (page: string) => void;
}

const courses = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Master the basics of artificial intelligence and machine learning",
    duration: "4 weeks",
    level: "Beginner",
    price: "Free",
    enrolled: 2500,
    rating: 4.8,
    modules: 12,
    certification: true,
    featured: true
  },
  {
    id: "advanced-ml",
    title: "Advanced Machine Learning",
    description: "Deep dive into advanced ML algorithms and techniques",
    duration: "8 weeks",
    level: "Advanced",
    price: "$299",
    enrolled: 850,
    rating: 4.9,
    modules: 24,
    certification: true
  },
  {
    id: "ai-business",
    title: "AI for Business Leaders",
    description: "Strategic AI implementation for business transformation",
    duration: "6 weeks",
    level: "Intermediate",
    price: "$199",
    enrolled: 1200,
    rating: 4.7,
    modules: 18,
    certification: true
  }
];

const certifications = [
  {
    title: "Delibix AI Practitioner",
    description: "Entry-level certification for AI fundamentals",
    requirements: ["Complete AI Fundamentals course", "Pass final exam (80%+)"],
    validity: "2 years",
    badge: "ai-practitioner.png"
  },
  {
    title: "Delibix AI Specialist",
    description: "Advanced certification for AI implementation",
    requirements: ["Complete 3 advanced courses", "Real-world project", "Pass comprehensive exam"],
    validity: "3 years",
    badge: "ai-specialist.png"
  }
];

export function TrainingCertificationPage({ navigate }: TrainingCertificationPageProps) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/60 to-blue-100/40 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-800/30" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 glass-secondary rounded-full px-6 py-3">
              <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">Training & Certification</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold">
              Master <span className="gradient-text-blue">AI</span> Skills
            </h1>
            
            <p className="text-xl max-w-4xl mx-auto text-foreground-muted">
              Comprehensive training programs and industry-recognized certifications to advance your AI career.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
              {[
                { label: "Students", value: "5,000+" },
                { label: "Courses", value: "25+" },
                { label: "Certifications", value: "500+" },
                { label: "Success Rate", value: "94%" }
              ].map((stat, index) => (
                <div key={index} className="glass-heavy rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold gradient-text-blue">{stat.value}</div>
                  <div className="text-sm text-foreground-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="grid gap-6">
                  {courses.map((course, index) => (
                    <Card key={course.id} className="glass p-6 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3>{course.title}</h3>
                            {course.featured && <Badge className="bg-amber-100 text-amber-800">Featured</Badge>}
                          </div>
                          <p className="text-foreground-muted mb-4">{course.description}</p>
                          <div className="flex gap-4 text-sm text-foreground-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.modules} modules
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {course.enrolled} enrolled
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold gradient-text-blue">{course.price}</div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="text-sm">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{course.level}</Badge>
                        <Button>Enroll Now</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <Card className="glass p-6">
                  <h3 className="mb-4">Learning Path</h3>
                  <div className="space-y-4">
                    {['AI Fundamentals', 'Machine Learning', 'Deep Learning', 'AI Ethics'].map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{index + 1}</span>
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="glass p-6">
                  <h3 className="mb-4">Your Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>AI Fundamentals</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Machine Learning</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="grid md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => (
                <Card key={index} className="glass p-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-center mb-4">{cert.title}</h3>
                  <p className="text-center text-foreground-muted mb-6">{cert.description}</p>
                  
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold">Requirements:</h4>
                    <ul className="space-y-2">
                      {cert.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-foreground-muted mb-4">Valid for {cert.validity}</p>
                    <Button className="gradient-bg-blue text-white">
                      Start Certification Path
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <Card className="glass p-8 text-center">
              <h2 className="mb-6">Corporate Training Programs</h2>
              <p className="text-lg text-foreground-muted mb-8 max-w-2xl mx-auto">
                Custom training programs designed for organizations looking to upskill their teams in AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-bg-blue text-white">
                  <Users className="w-5 h-5 mr-2" />
                  Request Corporate Training
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}