"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Linkedin, Github, Twitter, MapPin, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Co-Founder & CEO",
      bio: "Former tech lead at Google AI. Passionate about making AI accessible to all businesses.",
      location: "Yogyakarta, ID",
      expertise: ["AI Strategy", "Product Leadership", "System Architecture"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      name: "Maya Putri",
      role: "Co-Founder & CTO", 
      bio: "AI researcher turned entrepreneur. Expert in machine learning and scalable systems.",
      location: "Yogyakarta, ID",
      expertise: ["Machine Learning", "Backend Systems", "DevOps"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      color: "from-blue-100 to-blue-200",
      borderColor: "border-blue-300",
      glowColor: "rgba(59, 130, 246, 0.2)"
    },
    {
      name: "David Tan",
      role: "Head of Design",
      bio: "UX designer with 8+ years creating intuitive interfaces for complex AI systems.",
      location: "Yogyakarta, ID", 
      expertise: ["UX Design", "Design Systems", "User Research"],
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      color: "from-blue-200 to-blue-300",
      borderColor: "border-blue-400",
      glowColor: "rgba(59, 130, 246, 0.25)"
    },
    {
      name: "Sarah Kim",
      role: "Lead Developer",
      bio: "Full-stack developer specializing in AI integration and modern web technologies.",
      location: "Yogyakarta, ID",
      expertise: ["Full-Stack Development", "AI Integration", "React/Node.js"],
      social: {
        linkedin: "#",
        github: "#", 
        twitter: "#"
      },
      color: "from-blue-300 to-blue-400",
      borderColor: "border-blue-500",
      glowColor: "rgba(59, 130, 246, 0.3)"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section id="team" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass-secondary rounded-full px-4 py-2 mb-8 border border-blue-200"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-600 font-medium">Our Team</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Meet the{" "}
            <span className="gradient-text-blue font-bold">
              builders
            </span>
          </h2>
          <div className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Passionate experts who don't just talk about AI — we build it.
          </div>
        </motion.div>

        {/* Team Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ perspective: 1200 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              onHoverStart={() => setHoveredMember(index)}
              onHoverEnd={() => setHoveredMember(null)}
              className="group relative"
              whileHover={{ 
                y: -15,
                rotateY: 5,
                rotateX: -5,
                scale: 1.02
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className={`glass-heavy rounded-3xl p-6 h-full relative overflow-hidden bg-gradient-to-br ${member.color} border-2 ${member.borderColor}`}
                whileHover={{
                  boxShadow: `0 30px 60px ${member.glowColor}`
                }}
              >
                {/* Content */}
                <div className="relative z-10">
                  {/* Avatar */}
                  <motion.div
                    className="w-20 h-20 glass rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden border border-blue-200"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-${1500000000000 + index * 1000}?w=80&h=80&fit=crop&crop=face`}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </motion.div>

                  {/* Location */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="text-xs text-slate-500 font-medium">{member.location}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1 text-center">
                    {member.name}
                  </h3>
                  
                  <div className="text-sm text-slate-600 mb-4 text-center font-medium">
                    {member.role}
                  </div>

                  <div className="text-sm text-slate-600 mb-4 leading-relaxed text-center">
                    {member.bio}
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <motion.span
                        key={skillIndex}
                        className="text-xs glass-secondary rounded-full px-2 py-1 text-slate-600 border border-blue-200 font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={hoveredMember === index ? { opacity: 1, scale: 1 } : { opacity: 0.9, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: skillIndex * 0.1 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <motion.div
                    className="flex justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={hoveredMember === index ? { opacity: 1, y: 0 } : { opacity: 0.8, y: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[
                      { icon: Linkedin, href: member.social.linkedin },
                      { icon: Github, href: member.social.github },
                      { icon: Twitter, href: member.social.twitter }
                    ].map((social, socialIndex) => (
                      <motion.a
                        key={socialIndex}
                        href={social.href}
                        className="w-8 h-8 glass-secondary rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors border border-blue-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <social.icon className="w-4 h-4 text-slate-600" />
                      </motion.a>
                    ))}
                  </motion.div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Culture Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-slate-900 mb-6">
                Based in Yogyakarta, serving the world
              </h3>
              
              <div className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                We're a tight-knit team of builders, designers, and strategists who believe 
                the best AI solutions come from understanding real business problems first.
              </div>

              {/* Values */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "Build First", description: "We prototype and test before we theorize" },
                  { title: "Stay Curious", description: "Always learning, always experimenting" },
                  { title: "Ship Fast", description: "Quick iterations, continuous improvement" }
                ].map((value, index) => (
                  <motion.div
                    key={value.title}
                    className="glass-secondary rounded-xl p-6 border border-blue-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h4>
                    <div className="text-slate-600 text-sm">{value.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}