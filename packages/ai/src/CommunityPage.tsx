"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, Trophy, Star, ArrowRight, Heart, Zap, Globe, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface CommunityPageProps {
  navigate: (page: string) => void;
}

export function CommunityPage({ navigate }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const communityStats = [
    { label: "Active Members", value: "15,000+", icon: Users },
    { label: "Projects Shared", value: "2,400+", icon: Code },
    { label: "Events Hosted", value: "120+", icon: Calendar },
    { label: "Countries", value: "80+", icon: Globe }
  ];

  const featuredMembers = [
    {
      name: "Sarah Chen",
      role: "AI Research Lead",
      company: "TechCorp",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      contributions: 156,
      speciality: "NLP"
    },
    {
      name: "Dr. Raj Patel",
      role: "ML Engineer",
      company: "DataLabs",
      location: "Mumbai, India",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      contributions: 143,
      speciality: "Computer Vision"
    },
    {
      name: "Elena Rodriguez",
      role: "Product Manager",
      company: "AI Startup",
      location: "Madrid, Spain",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      contributions: 127,
      speciality: "Product Strategy"
    },
    {
      name: "Ahmad Fitrianto",
      role: "Full Stack Developer",
      company: "Delibix",
      location: "Yogyakarta, Indonesia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      contributions: 198,
      speciality: "AI Integration"
    }
  ];

  const upcomingEvents = [
    {
      title: "AI Ethics Workshop",
      date: "Jan 25, 2025",
      time: "14:00 UTC",
      type: "Workshop",
      attendees: 89,
      maxAttendees: 100
    },
    {
      title: "Monthly Community Meetup",
      date: "Feb 1, 2025",
      time: "16:00 UTC",
      type: "Meetup",
      attendees: 234,
      maxAttendees: 300
    },
    {
      title: "Hackathon: Climate AI",
      date: "Feb 15-17, 2025",
      time: "All Day",
      type: "Hackathon",
      attendees: 156,
      maxAttendees: 200
    }
  ];

  const discussionTopics = [
    {
      title: "Best practices for fine-tuning large language models",
      author: "Sarah Chen",
      replies: 23,
      likes: 89,
      tag: "LLM",
      timeAgo: "2 hours ago"
    },
    {
      title: "Implementing real-time image recognition in mobile apps",
      author: "Dr. Raj Patel",
      replies: 17,
      likes: 56,
      tag: "Computer Vision",
      timeAgo: "4 hours ago"
    },
    {
      title: "Ethics considerations in AI product development",
      author: "Elena Rodriguez",
      replies: 31,
      likes: 102,
      tag: "Ethics",
      timeAgo: "6 hours ago"
    },
    {
      title: "Deploying AI models to production: lessons learned",
      author: "Ahmad Fitrianto",
      replies: 19,
      likes: 67,
      tag: "Deployment",
      timeAgo: "1 day ago"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Workshop': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Meetup': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Hackathon': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTagColor = (tag: string) => {
    const colors = {
      'LLM': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Computer Vision': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Ethics': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Deployment': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[tag as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 py-32 text-center bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-bg-blue flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-slate-900 dark:text-slate-100">
            Join Our AI Community
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Connect with AI enthusiasts, researchers, and developers from around the world. Share knowledge, collaborate on projects, and shape the future of AI together.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate('community-forum')}
              className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Discussions
            </Button>
            <Button
              onClick={() => navigate('events-workshops')}
              variant="outline"
              className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Events
            </Button>
          </motion.div>

          {/* Community Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="px-6 py-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'members', label: 'Featured Members' },
              { id: 'events', label: 'Upcoming Events' },
              { id: 'discussions', label: 'Latest Discussions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Community Features */}
              <div>
                <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
                  What Makes Our Community Special
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="glass text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Active Discussions
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Engage in meaningful conversations about AI, share insights, and learn from experts worldwide.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Code className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Open Source Projects
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Collaborate on cutting-edge AI projects and contribute to the open source ecosystem.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="glass text-center">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        Regular Events
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Join workshops, meetups, and hackathons to expand your skills and network.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-12">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Ready to Join the Community?
                </h3>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                  Become part of a global network of AI enthusiasts and professionals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('community-forum')}
                    className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90"
                  >
                    Join Community Forum
                  </Button>
                  <Button
                    onClick={() => navigate('contact')}
                    variant="outline"
                    className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Contact Community Team
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'members' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
                Featured Community Members
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredMembers.map((member, index) => (
                  <Card key={index} className="glass card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {member.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            {member.role} at {member.company}
                          </p>
                          <p className="text-sm text-slate-500 mb-3">{member.location}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{member.contributions} contributions</span>
                            </div>
                            <Badge className="text-xs">{member.speciality}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
                Upcoming Community Events
              </h2>
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => (
                  <Card key={index} className="glass card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {event.title}
                            </h3>
                            <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {event.date} • {event.time}
                          </div>
                          <div className="text-sm text-slate-500">
                            {event.attendees}/{event.maxAttendees} attendees
                          </div>
                        </div>
                        <Button className="gradient-bg-blue text-white hover:opacity-90">
                          Join Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button
                  onClick={() => navigate('events-workshops')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  View All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'discussions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-center mb-12 text-slate-900 dark:text-slate-100">
                Latest Community Discussions
              </h2>
              <div className="space-y-4">
                {discussionTopics.map((topic, index) => (
                  <Card key={index} className="glass card-hover cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                              {topic.title}
                            </h3>
                            <Badge className={`text-xs ${getTagColor(topic.tag)}`}>
                              {topic.tag}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            by {topic.author} • {topic.timeAgo}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span>{topic.replies} replies</span>
                            <span>{topic.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">{topic.likes}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button
                  onClick={() => navigate('community-forum')}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  View All Discussions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}