"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Clock, Star, Video, Trophy, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface EventsWorkshopsPageProps {
  navigate: (page: string) => void;
}

export function EventsWorkshopsPage({ navigate }: EventsWorkshopsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const eventCategories = [
    { id: 'all', name: 'All Events', count: 15 },
    { id: 'workshop', name: 'Workshops', count: 6 },
    { id: 'meetup', name: 'Meetups', count: 4 },
    { id: 'hackathon', name: 'Hackathons', count: 3 },
    { id: 'webinar', name: 'Webinars', count: 2 }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "AI Ethics Workshop: Building Responsible AI Systems",
      type: "workshop",
      date: "2025-01-25",
      time: "14:00 - 17:00 UTC",
      location: "Online",
      maxAttendees: 100,
      currentAttendees: 87,
      price: "Free",
      level: "Intermediate",
      description: "Learn about ethical considerations in AI development, bias detection, and responsible deployment strategies.",
      speaker: {
        name: "Dr. Elena Rodriguez",
        role: "AI Ethics Researcher",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["AI Ethics", "Bias Detection", "Responsible AI"],
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      title: "Monthly AI Community Meetup",
      type: "meetup",
      date: "2025-02-01",
      time: "16:00 - 18:00 UTC",
      location: "Hybrid (Yogyakarta + Online)",
      maxAttendees: 150,
      currentAttendees: 134,
      price: "Free",
      level: "All Levels",
      description: "Connect with fellow AI enthusiasts, share projects, and discuss the latest trends in artificial intelligence.",
      speaker: {
        name: "Ahmad Fitrianto",
        role: "CEO, Delibix",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["Networking", "Project Showcase", "AI Trends"],
      rating: 4.8,
      featured: false
    },
    {
      id: 3,
      title: "Climate AI Hackathon 2025",
      type: "hackathon",
      date: "2025-02-15",
      time: "48 hours",
      location: "Global (Remote)",
      maxAttendees: 200,
      currentAttendees: 156,
      price: "Free",
      level: "Intermediate",
      description: "Build AI solutions to combat climate change. Win prizes and make a positive impact on our planet.",
      speaker: {
        name: "Dr. Sarah Chen",
        role: "CTO, Delibix",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["Climate Change", "Sustainability", "Machine Learning"],
      rating: 4.9,
      featured: true
    },
    {
      id: 4,
      title: "Introduction to Large Language Models",
      type: "workshop",
      date: "2025-02-20",
      time: "13:00 - 16:00 UTC",
      location: "Online",
      maxAttendees: 80,
      currentAttendees: 45,
      price: "$29",
      level: "Beginner",
      description: "Get started with LLMs, understand their architecture, and learn how to use them in your projects.",
      speaker: {
        name: "Dr. Raj Patel",
        role: "Head of AI Research",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["LLM", "Natural Language Processing", "Transformers"],
      rating: 4.7,
      featured: false
    },
    {
      id: 5,
      title: "Computer Vision for Mobile Apps",
      type: "webinar",
      date: "2025-03-05",
      time: "15:00 - 16:30 UTC",
      location: "Online",
      maxAttendees: 300,
      currentAttendees: 178,
      price: "Free",
      level: "Intermediate",
      description: "Learn how to implement computer vision features in mobile applications using modern frameworks.",
      speaker: {
        name: "Maria Santos",
        role: "Lead UX Designer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["Computer Vision", "Mobile Development", "UI/UX"],
      rating: 4.6,
      featured: false
    },
    {
      id: 6,
      title: "AI Startup Pitch Competition",
      type: "hackathon",
      date: "2025-03-20",
      time: "19:00 - 21:00 UTC",
      location: "Hybrid (Singapore + Online)",
      maxAttendees: 100,
      currentAttendees: 67,
      price: "Free",
      level: "All Levels",
      description: "Present your AI startup idea to investors and industry experts. Win funding and mentorship opportunities.",
      speaker: {
        name: "Alex Thompson",
        role: "Venture Partner",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
      },
      topics: ["Entrepreneurship", "Pitching", "Investment"],
      rating: 4.8,
      featured: true
    }
  ];

  const pastEvents = [
    {
      title: "Deep Learning Fundamentals Workshop",
      date: "Dec 15, 2024",
      attendees: 95,
      rating: 4.9,
      recording: true
    },
    {
      title: "AI in Healthcare Symposium",
      date: "Nov 28, 2024",
      attendees: 156,
      rating: 4.8,
      recording: true
    },
    {
      title: "NLP Innovation Hackathon",
      date: "Oct 20, 2024",
      attendees: 89,
      rating: 4.7,
      recording: false
    }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.type === selectedCategory);

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
    const colors = {
      'workshop': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'meetup': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'hackathon': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'webinar': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Beginner': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      'Intermediate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Advanced': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      'All Levels': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAvailabilityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { text: 'Almost Full', color: 'text-red-600' };
    if (percentage >= 75) return { text: 'Filling Fast', color: 'text-orange-600' };
    return { text: 'Available', color: 'text-green-600' };
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
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-slate-900 dark:text-slate-100">
            Events & Workshops
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Join our global community at workshops, meetups, and hackathons. Learn from experts, network with peers, and advance your AI skills.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => navigate('community')}
              className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90 transition-opacity"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Community
            </Button>
            <Button
              onClick={() => navigate('submit-idea')}
              variant="outline"
              className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              Suggest Event Topic
            </Button>
          </motion.div>

          {/* Event Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">120+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">15,000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">4.8</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">80+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Countries</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="px-6 py-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {eventCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-slate-900 dark:text-slate-100">Upcoming Events</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Don't miss these exciting opportunities to learn and connect
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, index) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Card className={`glass card-hover h-full ${event.featured ? 'ring-2 ring-blue-500/20' : ''}`}>
                  {event.featured && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-xs ${getTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{event.rating}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                    
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Speaker */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={event.speaker.avatar} alt={event.speaker.name} />
                        <AvatarFallback>{event.speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {event.speaker.name}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          {event.speaker.role}
                        </div>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1">
                      {event.topics.slice(0, 2).map((topic, topicIndex) => (
                        <Badge key={topicIndex} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {event.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.topics.length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Attendance Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          {event.currentAttendees}/{event.maxAttendees} attendees
                        </span>
                        <span className={`font-medium ${getAvailabilityStatus(event.currentAttendees, event.maxAttendees).color}`}>
                          {getAvailabilityStatus(event.currentAttendees, event.maxAttendees).text}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getLevelColor(event.level)}`}>
                          {event.level}
                        </Badge>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {event.price}
                        </span>
                      </div>
                      <Button size="sm" className="gradient-bg-blue text-white hover:opacity-90">
                        Register
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No events in this category
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Check back soon for new events or try a different category.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="px-6 py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-slate-900 dark:text-slate-100">Past Events</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Catch up on what you missed with recordings and resources
            </p>
          </motion.div>

          <div className="space-y-4">
            {pastEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.attendees} attendees</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span>{event.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.recording && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <Video className="w-3 h-3 mr-1" />
                            Recording Available
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
              View All Past Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Host an Event */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-12">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Want to Host an Event?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Share your expertise with our global community. We support speakers with promotion, technical setup, and more.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('submit-idea')}
                  className="h-12 px-8 gradient-bg-blue text-white hover:opacity-90"
                >
                  Propose an Event
                </Button>
                <Button
                  onClick={() => navigate('contact')}
                  variant="outline"
                  className="h-12 px-8 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  Speaker Guidelines
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}