"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define supported languages
export type Language = 
  | 'en' // English
  | 'zh' // Chinese (Mandarin)
  | 'hi' // Hindi
  | 'es' // Spanish
  | 'fr' // French
  | 'ar' // Arabic
  | 'bn' // Bengali
  | 'pt' // Portuguese
  | 'ru' // Russian
  | 'ur' // Urdu
  | 'id' // Indonesian
  | 'bbc' // Batak
  | 'jv' // Javanese
  | 'gaul'; // Bahasa Gaul Indonesia

export const languages: Record<Language, { name: string; nativeName: string; code: string; flag: string; rtl?: boolean }> = {
  en: { name: "English", nativeName: "English", code: "EN", flag: "🇬🇧" },
  zh: { name: "Chinese", nativeName: "中文", code: "ZH", flag: "🇨🇳" },
  hi: { name: "Hindi", nativeName: "हिन्दी", code: "HI", flag: "🇮🇳" },
  es: { name: "Spanish", nativeName: "Español", code: "ES", flag: "🇪🇸" },
  fr: { name: "French", nativeName: "Français", code: "FR", flag: "🇫🇷" },
  ar: { name: "Arabic", nativeName: "العربية", code: "AR", flag: "🇸🇦", rtl: true },
  bn: { name: "Bengali", nativeName: "বাংলা", code: "BN", flag: "🇧🇩" },
  pt: { name: "Portuguese", nativeName: "Português", code: "PT", flag: "🇵🇹" },
  ru: { name: "Russian", nativeName: "Русский", code: "RU", flag: "🇷🇺" },
  ur: { name: "Urdu", nativeName: "اردو", code: "UR", flag: "🇵🇰", rtl: true },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia", code: "ID", flag: "🇮🇩" },
  bbc: { name: "Batak", nativeName: "Hata Batak", code: "BBC", flag: "🌴" },
  jv: { name: "Javanese", nativeName: "ꦧꦱꦗꦮ", code: "JV", flag: "🏛️" },
  gaul: { name: "Bahasa Gaul", nativeName: "Bahasa Gaul", code: "GAUL", flag: "🔥" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations for all sections
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.team": "Team",
    "nav.tools": "Tools",
    "nav.contact": "Contact",
    "nav.scheduleNow": "Schedule Now",
    "nav.seeOurWork": "See Our Work",
    "nav.pricing": "Pricing",
    "nav.experiments": "Experiments",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Trusted by 20+ Innovative Clients",
    "header.strategicPartner": "Your Strategic Partner",
    "header.forDigitalSolutions": "for AI Digital Solutions",
    "header.description": "We help bold clients unlock the power of AI at scale, accelerate digital transformation, and launch future-ready ventures built for growth.",
    "header.bookConsultation": "Book Free Consultation",
    "header.trustedCompanies": "Trusted by innovative companies across Indonesia",
    
    // Problem Section
    "problem.badge": "The Problem",
    "problem.title.line1": "Traditional consulting is",
    "problem.title.slow": "slow",
    "problem.title.line2": "AI is often just",
    "problem.title.talk": "talk",
    "problem.1.text": "Projects take too long and cost too much",
    "problem.1.stat": "6-12 months",
    "problem.1.label": "typical waste",
    "problem.2.text": "Teams don't know where to start with AI",
    "problem.2.stat": "73% of teams",
    "problem.2.label": "are confused",
    "problem.3.text": "Agencies give advice, but don't build",
    "problem.3.stat": "$50K+ wasted",
    "problem.3.label": "on consultations",
    "problem.solution.title": "How we're different",
    "problem.solution.description": "Delibix combines strategy, design, and execution — we don't just give you a roadmap,",
    "problem.solution.highlight": "we help you build the car.",
    "problem.solution.timeline": "3 days - 4 weeks to launch",

    // Process Section
    "process.badge": "Our Process",
    "process.title": "Fast, simple, and tailored for",
    "process.subtitle": "digital teams",
    "process.step1.title": "Discover",
    "process.step1.description": "Understand your business and workflows",
    "process.step1.details": "Deep dive into your current processes, pain points, and opportunities for AI integration.",
    "process.step1.duration": "3-7 days",
    "process.step2.title": "Design",
    "process.step2.description": "Prototype real solutions using AI & automation",
    "process.step2.details": "Create working prototypes and proof-of-concepts that demonstrate real value.",
    "process.step2.duration": "1-2 weeks",
    "process.step3.title": "Build & Iterate",
    "process.step3.description": "Launch quickly, test fast, and improve continuously",
    "process.step3.details": "Deploy, gather feedback, and iterate based on real user data and business impact.",
    "process.step3.duration": "1-3 weeks",
    "process.bottom.message": "No endless slides. Just results you can",
    "process.bottom.test": "test",
    "process.bottom.touch": "touch",
    "process.bottom.scale": "scale",

    // Services Section
    "services.badge": "Our Services",
    "services.title": "Choose your",
    "services.subtitle": "engagement model",
    "services.description": "Scale as you grow. Start small, think big.",
    "services.1.title": "AI Strategy Sprint",
    "services.1.description": "Fast-track your AI roadmap with focused workshops and actionable implementation plans.",
    "services.1.feature1": "AI Readiness Assessment",
    "services.1.feature2": "Custom Strategy Roadmap",
    "services.1.feature3": "Quick Wins Identification",
    "services.1.deliverables": "Strategy doc, roadmap, priority matrix",
    "services.2.title": "AI Design and Development",
    "services.2.description": "From concept to launch - we build AI-powered solutions that solve real business problems.",
    "services.2.feature1": "Branding",
    "services.2.feature2": "Product Design",
    "services.2.feature3": "Web Development",
    "services.2.deliverables": "Working prototype, source code, documentation",
    "services.3.title": "On-Demand Product Consulting Team",
    "services.3.description": "Scale your team with our experts who understand both strategy and hands-on execution.",
    "services.3.feature1": "Flexible Engagement",
    "services.3.feature2": "Expert Team Access",
    "services.3.feature3": "Ongoing Support",
    "services.3.deliverables": "Dedicated team, regular reviews, continuous delivery",
    "services.cta": "Explore Services",

    // Why Delibix Section
    "why.badge": "Why Choose Delibix",
    "why.title": "Traditional consulting",
    "why.vs": "vs",
    "why.delibix": "Delibix",
    "why.comparison": "Comparison",
    "why.traditional": "Traditional",
    "why.consulting": "Consulting",
    "why.ainative": "AI-Native",
    "why.timeline": "Timeline",
    "why.timeline.traditional": "6-12 months for delivery",
    "why.timeline.delibix": "3 days - 4 weeks to working prototype",
    "why.approach": "Approach",
    "why.approach.traditional": "Endless presentations and documentation",
    "why.approach.delibix": "Build and test real solutions",
    "why.team": "Team",
    "why.team.traditional": "Junior consultants with templates",
    "why.team.delibix": "Senior experts who code and design",
    "why.output": "Output",
    "why.output.traditional": "PDF recommendations",
    "why.output.delibix": "Working software you can use",
    "why.advantage1.title": "Speed Without Compromise",
    "why.advantage1.description": "Rapid prototyping and iterative development means you see results in weeks, not months.",
    "why.advantage2.title": "Built by Builders",
    "why.advantage2.description": "Our team doesn't just advise – we design, code, and deploy real solutions.",
    "why.advantage3.title": "Results-Driven Process",
    "why.advantage3.description": "Every feature is tested and validated with real users and data.",
    "why.advantage4.title": "AI-Native Thinking",
    "why.advantage4.description": "We understand AI capabilities and limitations to build practical, effective solutions.",

    // Contact Section
    "contact.badge": "Let's Connect",
    "contact.title": "Got an idea?",
    "contact.subtitle": "Need speed?",
    "contact.description": "Let's talk. 30 minutes, no pressure, real insights about your AI journey.",
    "contact.option1.title": "Book a Free Call",
    "contact.option1.description": "30 minutes, no pressure, real insights",
    "contact.option1.action": "Schedule Now",
    "contact.option2.title": "WhatsApp Brief",
    "contact.option2.description": "Quick chat about your project needs",
    "contact.option2.action": "Send Message",
    "contact.option3.title": "Free Resources",
    "contact.option3.description": "Access our free tools and templates",
    "contact.option3.action": "View Resources",
    "contact.bottom.title": "Ready to transform your business with AI?",
    "contact.bottom.description": "Join 20+ companies who've already accelerated their growth with our AI solutions.",
    "contact.bottom.cta1": "Start Your AI Journey",
    "contact.bottom.cta2": "View Case Studies",
    "contact.bottom.info1.title": "Quick Response",
    "contact.bottom.info1.description": "We respond within 24 hours",
    "contact.bottom.info2.title": "Free Consultation",
    "contact.bottom.info2.description": "No commitment, just insights",

    // Contact Page
    "contact.hero.badge": "Contact Us",
    "contact.hero.title": "Let's Build Something Amazing Together",
    "contact.hero.description": "Ready to transform your business with cutting-edge AI and digital solutions? Our team of experts is here to help you unlock your potential and achieve extraordinary results.",
    
    "contact.stats.response": "Response Time",
    "contact.stats.satisfaction": "Client Satisfaction",
    "contact.stats.languages": "Languages",
    "contact.stats.consultations": "Consultations",
    
    "contact.methods.badge": "Get in Touch",
    "contact.methods.title": "Multiple Ways to Connect",
    "contact.methods.whatsapp.title": "WhatsApp Chat",
    "contact.methods.whatsapp.description": "Get instant responses to your questions through our WhatsApp business line.",
    "contact.methods.whatsapp.action": "Start Chat",
    "contact.methods.email.title": "Email Us",
    "contact.methods.email.description": "Send us a detailed message and we'll get back to you within 2 hours.",
    "contact.methods.email.action": "Send Email",
    "contact.methods.phone.title": "Call Us",
    "contact.methods.phone.description": "Speak directly with our team during business hours for immediate assistance.",
    "contact.methods.phone.action": "Call Now",
    "contact.methods.video.title": "Video Call",
    "contact.methods.video.description": "Schedule a video consultation to discuss your project in detail.",
    "contact.methods.video.action": "Book Call",
    
    "contact.form.badge": "Send Message",
    "contact.form.title": "Tell Us About Your Project",
    "contact.form.name": "Full Name",
    "contact.form.namePlaceholder": "Enter your full name",
    "contact.form.email": "Email Address",
    "contact.form.emailPlaceholder": "your.email@company.com",
    "contact.form.company": "Company",
    "contact.form.companyPlaceholder": "Your company name",
    "contact.form.service": "Service Needed",
    "contact.form.servicePlaceholder": "Select a service",
    "contact.form.services.aiConsulting": "AI Consulting",
    "contact.form.services.digitalTransformation": "Digital Transformation",
    "contact.form.services.webDevelopment": "Web Development",
    "contact.form.services.mobileApps": "Mobile Applications",
    "contact.form.services.dataAnalytics": "Data Analytics",
    "contact.form.services.other": "Other",
    "contact.form.budget": "Project Budget",
    "contact.form.budgetPlaceholder": "Select budget range",
    "contact.form.budgetDiscuss": "Let's discuss",
    "contact.form.message": "Project Details",
    "contact.form.messagePlaceholder": "Tell us about your project, goals, and how we can help you achieve them...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success.title": "Message Sent Successfully!",
    "contact.form.success.message": "Thank you for reaching out. We'll get back to you within 2 hours with a detailed response.",
    
    "contact.office.badge": "Our Office",
    "contact.office.title": "Visit Us in Yogyakarta",
    "contact.office.address.title": "Office Address",
    "contact.office.address.line1": "Jl. Malioboro Street No. 123",
    "contact.office.address.line2": "Yogyakarta 55271",
    "contact.office.address.line3": "Indonesia",
    "contact.office.hours.title": "Office Hours",
    "contact.office.hours.weekdays": "Monday - Friday: 9:00 AM - 6:00 PM",
    "contact.office.hours.weekend": "Saturday: 9:00 AM - 2:00 PM",
    "contact.office.directions": "Get Directions",
    "contact.office.mapTitle": "Strategic Location",
    "contact.office.mapDescription": "Located in the heart of Yogyakarta's business district, easily accessible by all forms of transportation.",
    
    "contact.faq.badge": "FAQ",
    "contact.faq.title": "Frequently Asked Questions",
    "contact.faq.description": "Quick answers to common questions about our services and process.",
    "contact.faq.pricing.question": "How do you price your services?",
    "contact.faq.pricing.answer": "Our pricing is project-based and depends on scope, complexity, and timeline. We provide detailed quotes after understanding your specific needs during our free consultation.",
    "contact.faq.timeline.question": "What's the typical project timeline?",
    "contact.faq.timeline.answer": "Project timelines vary from 2-6 months depending on complexity. We provide detailed timelines during our initial consultation and keep you updated throughout the process.",
    "contact.faq.process.question": "What's your development process?",
    "contact.faq.process.answer": "We follow a proven 3-step process: Discovery & Strategy, Design & Development, and Launch & Optimization. Each phase includes regular check-ins and deliverables.",
    "contact.faq.support.question": "Do you provide ongoing support?",
    "contact.faq.support.answer": "Yes, we offer comprehensive post-launch support including maintenance, updates, monitoring, and optimization to ensure your solution continues to perform at its best.",
    
    "contact.cta.title": "Ready to Start Your Project?",
    "contact.cta.description": "Book a free consultation call to discuss your project requirements and learn how we can help you achieve your business goals.",
    "contact.cta.schedule": "Schedule Free Consultation",
    "contact.cta.portfolio": "View Our Portfolio",
    
    // Common
    "common.learnMore": "Learn More",
    "common.getStarted": "Get Started",
    "common.readMore": "Read More",
    "common.close": "Close",
    "common.open": "Open",
    "common.loading": "Loading...",
    "common.selectLanguage": "Select Language",
    "common.languagesSupported": "languages supported",
  },
  
  id: {
    // Navigation
    "nav.services": "Layanan",
    "nav.work": "Karya",
    "nav.team": "Tim",
    "nav.tools": "Tools",
    "nav.contact": "Kontak",
    "nav.scheduleNow": "Jadwalkan Sekarang",
    "nav.seeOurWork": "Lihat Karya Kami",
    "nav.pricing": "Harga",
    "nav.experiments": "Eksperimen",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Dipercaya oleh 20+ Klien Inovatif",
    "header.strategicPartner": "Mitra Strategis Anda",
    "header.forDigitalSolutions": "untuk Solusi Digital AI",
    "header.description": "Kami membantu klien berani membuka kekuatan AI dalam skala besar, mempercepat transformasi digital, dan meluncurkan usaha siap masa depan yang dibangun untuk pertumbuhan.",
    "header.bookConsultation": "Pesan Konsultasi Gratis",
    "header.trustedCompanies": "Dipercaya oleh perusahaan inovatif di seluruh Indonesia",
    
    // Problem Section
    "problem.badge": "Masalah",
    "problem.title.line1": "Konsultasi tradisional",
    "problem.title.slow": "lambat",
    "problem.title.line2": "AI sering hanya",
    "problem.title.talk": "teori",
    "problem.1.text": "Proyek memakan waktu terlalu lama dan biaya terlalu besar",
    "problem.1.stat": "6-12 bulan",
    "problem.1.label": "pemborosan umum",
    "problem.2.text": "Tim tidak tahu harus mulai dari mana dengan AI",
    "problem.2.stat": "73% tim",
    "problem.2.label": "kebingungan",
    "problem.3.text": "Agen memberikan saran, tapi tidak membangun",
    "problem.3.stat": "$50K+ terbuang",
    "problem.3.label": "untuk konsultasi",
    "problem.solution.title": "Bagaimana kami berbeda",
    "problem.solution.description": "Delibix menggabungkan strategi, desain, dan eksekusi — kami tidak hanya memberikan roadmap,",
    "problem.solution.highlight": "kami membantu Anda membangun mobilnya.",
    "problem.solution.timeline": "3 hari - 4 minggu untuk peluncuran",
    
    // Process Section
    "process.badge": "Proses Kami",
    "process.title": "Cepat, sederhana, dan disesuaikan untuk",
    "process.subtitle": "tim digital",
    "process.step1.title": "Temukan",
    "process.step1.description": "Memahami bisnis dan alur kerja Anda",
    "process.step1.details": "Menyelami proses saat ini, pain point, dan peluang integrasi AI.",
    "process.step1.duration": "3-7 hari",
    "process.step2.title": "Desain",
    "process.step2.description": "Membuat prototipe solusi nyata menggunakan AI & otomasi",
    "process.step2.details": "Menciptakan prototipe kerja dan proof-of-concept yang menunjukkan nilai nyata.",
    "process.step2.duration": "1-2 minggu",
    "process.step3.title": "Bangun & Iterasi",
    "process.step3.description": "Peluncuran cepat, tes cepat, dan perbaikan berkelanjutan",
    "process.step3.details": "Deploy, kumpulkan feedback, dan iterasi berdasarkan data pengguna nyata dan dampak bisnis.",
    "process.step3.duration": "1-3 minggu",
    "process.bottom.message": "Tidak ada slide tanpa akhir. Hanya hasil yang bisa Anda",
    "process.bottom.test": "uji",
    "process.bottom.touch": "sentuh",
    "process.bottom.scale": "skalakan",

    // Services Section
    "services.badge": "Layanan Kami",
    "services.title": "Pilih",
    "services.subtitle": "model keterlibatan Anda",
    "services.description": "Berkembang seiring pertumbuhan. Mulai kecil, berpikir besar.",
    "services.1.title": "Sprint Strategi AI",
    "services.1.description": "Percepat roadmap AI Anda dengan workshop terfokus dan rencana implementasi yang dapat ditindaklanjuti.",
    "services.1.feature1": "Penilaian Kesiapan AI",
    "services.1.feature2": "Roadmap Strategi Kustom",
    "services.1.feature3": "Identifikasi Quick Wins",
    "services.1.deliverables": "Dokumen strategi, roadmap, matriks prioritas",
    "services.2.title": "Desain dan Pengembangan AI",
    "services.2.description": "Dari konsep hingga peluncuran - kami membangun solusi bertenaga AI yang memecahkan masalah bisnis nyata.",
    "services.2.feature1": "Branding",
    "services.2.feature2": "Desain Produk",
    "services.2.feature3": "Pengembangan Web",
    "services.2.deliverables": "Prototipe kerja, kode sumber, dokumentasi",
    "services.3.title": "Tim Konsultan Produk On-Demand",
    "services.3.description": "Skalakan tim Anda dengan ahli kami yang memahami strategi dan eksekusi langsung.",
    "services.3.feature1": "Keterlibatan Fleksibel",
    "services.3.feature2": "Akses Tim Ahli",
    "services.3.feature3": "Dukungan Berkelanjutan",
    "services.3.deliverables": "Tim khusus, review rutin, pengiriman berkelanjutan",
    "services.cta": "Jelajahi Layanan",

    // Why Delibix Section
    "why.badge": "Mengapa Memilih Delibix",
    "why.title": "Konsultasi tradisional",
    "why.vs": "vs",
    "why.delibix": "Delibix",
    "why.comparison": "Perbandingan",
    "why.traditional": "Tradisional",
    "why.consulting": "Konsultasi",
    "why.ainative": "AI-Native",
    "why.timeline": "Timeline",
    "why.timeline.traditional": "6-12 bulan untuk pengiriman",
    "why.timeline.delibix": "3 hari - 4 minggu untuk prototipe kerja",
    "why.approach": "Pendekatan",
    "why.approach.traditional": "Presentasi dan dokumentasi tanpa akhir",
    "why.approach.delibix": "Membangun dan menguji solusi nyata",
    "why.team": "Tim",
    "why.team.traditional": "Konsultan junior dengan template",
    "why.team.delibix": "Ahli senior yang kode dan desain",
    "why.output": "Output",
    "why.output.traditional": "Rekomendasi PDF",
    "why.output.delibix": "Software kerja yang bisa Anda gunakan",
    "why.advantage1.title": "Kecepatan Tanpa Kompromi",
    "why.advantage1.description": "Prototyping cepat dan pengembangan iteratif berarti Anda melihat hasil dalam minggu, bukan bulan.",
    "why.advantage2.title": "Dibangun oleh Pembangun",
    "why.advantage2.description": "Tim kami tidak hanya memberi saran – kami mendesain, kode, dan deploy solusi nyata.",
    "why.advantage3.title": "Proses yang Didorong Hasil",
    "why.advantage3.description": "Setiap fitur diuji dan divalidasi dengan pengguna nyata dan data.",
    "why.advantage4.title": "Pemikiran AI-Native",
    "why.advantage4.description": "Kami memahami kemampuan dan keterbatasan AI untuk membangun solusi praktis dan efektif.",

    // Contact Section
    "contact.badge": "Mari Terhubung",
    "contact.title": "Punya ide?",
    "contact.subtitle": "Butuh kecepatan?",
    "contact.description": "Mari bicara. 30 menit, tanpa tekanan, wawasan nyata tentang perjalanan AI Anda.",
    "contact.option1.title": "Pesan Panggilan Gratis",
    "contact.option1.description": "30 menit, tanpa tekanan, wawasan nyata",
    "contact.option1.action": "Jadwalkan Sekarang",
    "contact.option2.title": "Brief WhatsApp",
    "contact.option2.description": "Chat cepat tentang kebutuhan proyek Anda",
    "contact.option2.action": "Kirim Pesan",
    "contact.option3.title": "Sumber Daya Gratis",
    "contact.option3.description": "Akses tools dan template gratis kami",
    "contact.option3.action": "Lihat Sumber Daya",
    "contact.bottom.title": "Siap mengubah bisnis Anda dengan AI?",
    "contact.bottom.description": "Bergabunglah dengan 20+ perusahaan yang telah mempercepat pertumbuhan mereka dengan solusi AI kami.",
    "contact.bottom.cta1": "Mulai Perjalanan AI Anda",
    "contact.bottom.cta2": "Lihat Studi Kasus",
    "contact.bottom.info1.title": "Respons Cepat",
    "contact.bottom.info1.description": "Kami merespons dalam 24 jam",
    "contact.bottom.info2.title": "Konsultasi Gratis",
    "contact.bottom.info2.description": "Tidak ada komitmen, hanya wawasan",

    // Contact Page
    "contact.hero.badge": "Hubungi Kami",
    "contact.hero.title": "Mari Bangun Sesuatu yang Luar Biasa Bersama",
    "contact.hero.description": "Siap mengubah bisnis Anda dengan AI mutakhir dan solusi digital? Tim ahli kami di sini untuk membantu Anda membuka potensi dan mencapai hasil yang luar biasa.",
    
    "contact.stats.response": "Waktu Respons",
    "contact.stats.satisfaction": "Kepuasan Klien",
    "contact.stats.languages": "Bahasa",
    "contact.stats.consultations": "Konsultasi",
    
    "contact.methods.badge": "Hubungi Kami",
    "contact.methods.title": "Berbagai Cara Untuk Terhubung",
    "contact.methods.whatsapp.title": "Chat WhatsApp",
    "contact.methods.whatsapp.description": "Dapatkan respons instan untuk pertanyaan Anda melalui jalur bisnis WhatsApp kami.",
    "contact.methods.whatsapp.action": "Mulai Chat",
    "contact.methods.email.title": "Email Kami",
    "contact.methods.email.description": "Kirimkan pesan detail kepada kami dan kami akan membalas dalam 2 jam.",
    "contact.methods.email.action": "Kirim Email",
    "contact.methods.phone.title": "Telepon Kami",
    "contact.methods.phone.description": "Bicara langsung dengan tim kami selama jam kerja untuk bantuan segera.",
    "contact.methods.phone.action": "Telepon Sekarang",
    "contact.methods.video.title": "Video Call",
    "contact.methods.video.description": "Jadwalkan konsultasi video untuk membahas proyek Anda secara detail.",
    "contact.methods.video.action": "Pesan Call",
    
    "contact.form.badge": "Kirim Pesan",
    "contact.form.title": "Ceritakan Tentang Proyek Anda",
    "contact.form.name": "Nama Lengkap",
    "contact.form.namePlaceholder": "Masukkan nama lengkap Anda",
    "contact.form.email": "Alamat Email",
    "contact.form.emailPlaceholder": "email.anda@perusahaan.com",
    "contact.form.company": "Perusahaan",
    "contact.form.companyPlaceholder": "Nama perusahaan Anda",
    "contact.form.service": "Layanan yang Dibutuhkan",
    "contact.form.servicePlaceholder": "Pilih layanan",
    "contact.form.services.aiConsulting": "Konsultasi AI",
    "contact.form.services.digitalTransformation": "Transformasi Digital",
    "contact.form.services.webDevelopment": "Pengembangan Web",
    "contact.form.services.mobileApps": "Aplikasi Mobile",
    "contact.form.services.dataAnalytics": "Analitik Data",
    "contact.form.services.other": "Lainnya",
    "contact.form.budget": "Budget Proyek",
    "contact.form.budgetPlaceholder": "Pilih rentang budget",
    "contact.form.budgetDiscuss": "Mari diskusikan",
    "contact.form.message": "Detail Proyek",
    "contact.form.messagePlaceholder": "Ceritakan tentang proyek, tujuan, dan bagaimana kami dapat membantu Anda mencapainya...",
    "contact.form.send": "Kirim Pesan",
    "contact.form.sending": "Mengirim...",
    "contact.form.success.title": "Pesan Berhasil Dikirim!",
    "contact.form.success.message": "Terima kasih telah menghubungi kami. Kami akan membalas dalam 2 jam dengan respons yang detail.",
    
    "contact.office.badge": "Kantor Kami",
    "contact.office.title": "Kunjungi Kami di Yogyakarta",
    "contact.office.address.title": "Alamat Kantor",
    "contact.office.address.line1": "Jl. Malioboro No. 123",
    "contact.office.address.line2": "Yogyakarta 55271",
    "contact.office.address.line3": "Indonesia",
    "contact.office.hours.title": "Jam Operasional",
    "contact.office.hours.weekdays": "Senin - Jumat: 09:00 - 18:00",
    "contact.office.hours.weekend": "Sabtu: 09:00 - 14:00",
    "contact.office.directions": "Dapatkan Arah",
    "contact.office.mapTitle": "Lokasi Strategis",
    "contact.office.mapDescription": "Terletak di jantung distrik bisnis Yogyakarta, mudah diakses dengan semua jenis transportasi.",
    
    "contact.faq.badge": "FAQ",
    "contact.faq.title": "Pertanyaan yang Sering Diajukan",
    "contact.faq.description": "Jawaban cepat untuk pertanyaan umum tentang layanan dan proses kami.",
    "contact.faq.pricing.question": "Bagaimana Anda menentukan harga layanan?",
    "contact.faq.pricing.answer": "Harga kami berbasis proyek dan tergantung pada ruang lingkup, kompleksitas, dan timeline. Kami memberikan penawaran detail setelah memahami kebutuhan spesifik Anda selama konsultasi gratis.",
    "contact.faq.timeline.question": "Berapa timeline proyek yang tipikal?",
    "contact.faq.timeline.answer": "Timeline proyek bervariasi dari 2-6 bulan tergantung kompleksitas. Kami memberikan timeline detail selama konsultasi awal dan terus mengupdate Anda sepanjang proses.",
    "contact.faq.process.question": "Bagaimana proses pengembangan Anda?",
    "contact.faq.process.answer": "Kami mengikuti proses 3 langkah yang terbukti: Discovery & Strategy, Design & Development, dan Launch & Optimization. Setiap fase mencakup check-in rutin dan deliverable.",
    "contact.faq.support.question": "Apakah Anda menyediakan dukungan berkelanjutan?",
    "contact.faq.support.answer": "Ya, kami menawarkan dukungan pasca-peluncuran yang komprehensif termasuk maintenance, update, monitoring, dan optimisasi untuk memastikan solusi Anda terus berkinerja optimal.",
    
    "contact.cta.title": "Siap Memulai Proyek Anda?",
    "contact.cta.description": "Pesan panggilan konsultasi gratis untuk membahas kebutuhan proyek Anda dan pelajari bagaimana kami dapat membantu Anda mencapai tujuan bisnis.",
    "contact.cta.schedule": "Jadwalkan Konsultasi Gratis",
    "contact.cta.portfolio": "Lihat Portfolio Kami",
    
    // Common
    "common.selectLanguage": "Pilih Bahasa",
    "common.languagesSupported": "bahasa didukung",
    "common.learnMore": "Pelajari Lebih Lanjut",
    "common.getStarted": "Mulai",
    "common.readMore": "Baca Lebih Lanjut",
    "common.close": "Tutup",
    "common.open": "Buka",
    "common.loading": "Memuat...",
  },
  
  zh: {
    // Navigation  
    "nav.contact": "联系我们",
    "nav.scheduleNow": "立即预约",
    "nav.services": "服务",
    "nav.work": "作品",
    "nav.team": "团队",
    "nav.tools": "工具",
    "nav.pricing": "价格",
    "nav.experiments": "实验",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "受到20+创新客户信赖",
    "header.strategicPartner": "您的战略合作伙伴",
    "header.forDigitalSolutions": "AI数字解决方案",
    "header.description": "我们帮助大胆的客户释放大规模AI的力量，加速数字化转型，并推出为增长而建的未来就绪企业。",
    "header.bookConsultation": "预约免费咨询",
    
    // Contact Page
    "contact.hero.badge": "联系我们",
    "contact.hero.title": "让我们一起创造精彩",
    "contact.hero.description": "准备好通过尖端AI和数字解决方案改变您的业务吗？我们的专家团队在这里帮助您释放潜力并取得非凡成果。",
    
    "contact.stats.response": "响应时间",
    "contact.stats.satisfaction": "客户满意度", 
    "contact.stats.languages": "语言",
    "contact.stats.consultations": "咨询",
    
    "contact.methods.badge": "联系方式",
    "contact.methods.title": "多种联系方式",
    "contact.methods.whatsapp.title": "WhatsApp聊天",
    "contact.methods.whatsapp.description": "通过我们的WhatsApp商务线获得即时回复。",
    "contact.methods.whatsapp.action": "开始聊天",
    
    "contact.form.badge": "发送消息",
    "contact.form.title": "告诉我们您的项目",
    "contact.form.name": "姓名",
    "contact.form.email": "邮箱地址",
    "contact.form.send": "发送消息",
    "contact.form.sending": "发送中...",
    
    "contact.office.badge": "我们的办公室",
    "contact.office.title": "在日惹拜访我们",
    
    "contact.faq.badge": "常见问题",
    "contact.faq.title": "常见问题解答",
    
    "contact.cta.title": "准备开始您的项目了吗？",
    "contact.cta.schedule": "预约免费咨询",
    
    // Services Section
    "services.badge": "我们的服务",
    "services.title": "选择您的",
    "services.subtitle": "参与模式",
    "services.description": "随着成长而扩展。从小开始，思考宏大。",
    "services.cta": "探索服务",
    
    // Common
    "common.selectLanguage": "选择语言",
    "common.languagesSupported": "种语言支持",
  },
  
  hi: {
    // Navigation
    "nav.contact": "संपर्क",
    "nav.scheduleNow": "अभी शेड्यूल करें",
    "nav.services": "सेवाएं",
    "nav.work": "काम",
    "nav.team": "टीम",
    "nav.tools": "उपकरण",
    "nav.pricing": "मूल्य निर्धारण",
    "nav.experiments": "प्रयोग",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "20+ अभिनव ग्राहकों द्वारा भरोसा किया गया",
    "header.strategicPartner": "आपका रणनीतिक भागीदार",
    "header.forDigitalSolutions": "AI डिजिटल समाधानों के लिए",
    "header.description": "हम साहसी ग्राहकों को बड़े पैमाने पर AI की शक्ति को अनलॉक करने, डिजिटल परिवर्तन में तेजी लाने और विकास के लिए निर्मित भविष्य-तैयार उद्यम लॉन्च करने में मदद करते हैं।",
    "header.bookConsultation": "मुफ्त परामर्श बुक करें",
    
    // Contact Page
    "contact.hero.badge": "हमसे संपर्क करें",
    "contact.hero.title": "आइए मिलकर कुछ अद्भुत बनाते हैं",
    
    "contact.form.send": "संदेश भेजें",
    "contact.form.sending": "भेजा जा रहा है...",
    
    "contact.cta.title": "अपना प्रोजेक्ट शुरू करने के लिए तैयार हैं?",
    
    // Services Section
    "services.badge": "हमारी सेवाएं",
    "services.title": "अपना चुनें",
    "services.subtitle": "सहभागिता मॉडल",
    "services.description": "बढ़ने के साथ-साथ स्केल करें। छोटे से शुरू करें, बड़ा सोचें।",
    "services.cta": "सेवाओं का अन्वेषण करें",
    
    // Common
    "common.selectLanguage": "भाषा चुनें",
    "common.languagesSupported": "भाषाएं समर्थित",
  },
  
  es: {
    // Navigation
    "nav.contact": "Contacto",
    "nav.scheduleNow": "Programar Ahora",
    "nav.services": "Servicios",
    "nav.work": "Trabajo",
    "nav.team": "Equipo",
    "nav.tools": "Herramientas",
    "nav.pricing": "Precios",
    "nav.experiments": "Experimentos",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Confiado por 20+ Clientes Innovadores",
    "header.strategicPartner": "Tu Socio Estratégico",
    "header.forDigitalSolutions": "para Soluciones Digitales de AI",
    "header.description": "Ayudamos a clientes audaces a desbloquear el poder de la IA a escala, acelerar la transformación digital y lanzar empresas listas para el futuro construidas para el crecimiento.",
    "header.bookConsultation": "Reservar Consulta Gratuita",
    
    // Contact Page
    "contact.hero.badge": "Contáctanos",
    "contact.hero.title": "Construyamos Algo Increíble Juntos",
    
    "contact.form.send": "Enviar Mensaje",
    "contact.form.sending": "Enviando...",
    
    "contact.cta.title": "¿Listo para Comenzar tu Proyecto?",
    
    // Services Section
    "services.badge": "Nuestros Servicios",
    "services.title": "Elige tu",
    "services.subtitle": "modelo de compromiso",
    "services.description": "Escala a medida que creces. Comienza pequeño, piensa en grande.",
    "services.cta": "Explorar Servicios",
    
    // Common
    "common.selectLanguage": "Seleccionar Idioma",
    "common.languagesSupported": "idiomas soportados",
  },
  
  fr: {
    // Navigation
    "nav.contact": "Contact",
    "nav.scheduleNow": "Programmer Maintenant",
    "nav.services": "Services",
    "nav.work": "Travail",
    "nav.team": "Équipe",
    "nav.tools": "Outils",
    "nav.pricing": "Prix",
    "nav.experiments": "Expériences",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Fait confiance par 20+ Clients Innovants",
    "header.strategicPartner": "Votre Partenaire Stratégique",
    "header.forDigitalSolutions": "pour les Solutions Numériques IA",
    "header.description": "Nous aidons les clients audacieux à débloquer la puissance de l'IA à grande échelle, accélérer la transformation numérique et lancer des entreprises prêtes pour l'avenir construites pour la croissance.",
    "header.bookConsultation": "Réserver une Consultation Gratuite",
    
    // Contact Page
    "contact.hero.badge": "Contactez-nous",
    "contact.hero.title": "Construisons Quelque Chose d'Incroyable Ensemble",
    
    "contact.form.send": "Envoyer le Message",
    "contact.form.sending": "Envoi...",
    
    "contact.cta.title": "Prêt à Commencer votre Projet?",
    
    // Services Section
    "services.badge": "Nos Services",
    "services.title": "Choisissez votre",
    "services.subtitle": "modèle d'engagement",
    "services.description": "Évoluez à mesure que vous grandissez. Commencez petit, pensez grand.",
    "services.cta": "Explorer les Services",
    
    // Common
    "common.selectLanguage": "Sélectionner la Langue",
    "common.languagesSupported": "langues supportées",
  },
  
  ar: {
    // Navigation
    "nav.contact": "اتصل بنا",
    "nav.scheduleNow": "احجز الآن",
    "nav.services": "الخدمات",
    "nav.work": "العمل",
    "nav.team": "الفريق",
    "nav.tools": "الأدوات",
    "nav.pricing": "الأسعار",
    "nav.experiments": "التجارب",
    "nav.agi": "الذكاء الاصطناعي العام",
    
    // Header & Hero
    "header.trustedBy": "موثوق به من قبل 20+ عميل مبتكر",
    "header.strategicPartner": "شريكك الاستراتيجي",
    "header.forDigitalSolutions": "للحلول الرقمية بالذكاء الاصطناعي",
    "header.description": "نساعد العملاء الجريئين على إطلاق قوة الذكاء الاصطناعي على نطاق واسع، وتسريع التحول الرقمي، وإطلاق المشاريع الجاهزة للمستقبل المبنية للنمو.",
    "header.bookConsultation": "احجز استشارة مجانية",
    
    // Contact Page
    "contact.hero.badge": "اتصل بنا",
    "contact.hero.title": "لنبني شيئًا مذهلاً معًا",
    
    "contact.form.send": "إرسال الرسالة",
    "contact.form.sending": "جاري الإرسال...",
    
    "contact.cta.title": "هل أنت مستعد لبدء مشروعك؟",
    
    // Services Section
    "services.badge": "خدماتنا",
    "services.title": "اختر",
    "services.subtitle": "نموذج المشاركة الخاص بك",
    "services.description": "قم بالتوسع مع نموك. ابدأ صغيرًا، فكر كبيرًا.",
    "services.cta": "استكشف الخدمات",
    
    // Common
    "common.selectLanguage": "اختر اللغة",
    "common.languagesSupported": "لغة مدعومة",
  },
  
  bn: {
    // Navigation
    "nav.contact": "যোগাযোগ",
    "nav.scheduleNow": "এখনই সময়সূচী করুন",
    "nav.services": "সেবা",
    "nav.work": "কাজ",
    "nav.team": "দল",
    "nav.tools": "সরঞ্জাম",
    "nav.pricing": "মূল্য",
    "nav.experiments": "পরীক্ষা",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "২০+ উদ্ভাবনী ক্লায়েন্ট দ্বারা বিশ্বস্ত",
    "header.strategicPartner": "আপনার কৌশলগত অংশীদার",
    "header.forDigitalSolutions": "AI ডিজিটাল সমাধানের জন্য",
    "header.description": "আমরা সাহসী ক্লায়েন্টদের বড় আকারে AI এর শক্তি আনলক করতে, ডিজিটাল রূপান্তর ত্বরান্বিত করতে এবং বৃদ্ধির জন্য তৈরি ভবিষ্যত-প্রস্তুত উদ্যোগ চালু করতে সহায়তা করি।",
    "header.bookConsultation": "বিনামূল্যে পরামর্শ বুক করুন",
    
    // Contact Page
    "contact.hero.badge": "আমাদের সাথে যোগাযোগ করুন",
    "contact.hero.title": "আসুন একসাথে অসাধারণ কিছু তৈরি করি",
    
    "contact.form.send": "বার্তা পাঠান",
    "contact.form.sending": "পাঠানো হচ্ছে...",
    
    "contact.cta.title": "আপনার প্রকল্প শুরু করতে প্রস্তুত?",
    
    // Services Section
    "services.badge": "আমাদের সেবা",
    "services.title": "আপনার বেছে নিন",
    "services.subtitle": "সম্পৃক্ততার মডেল",
    "services.description": "আপনার বৃদ্ধির সাথে সাথে স্কেল করুন। ছোট শুরু করুন, বড় চিন্তা করুন।",
    "services.cta": "সেবা অন্বেষণ করুন",
    
    // Common
    "common.selectLanguage": "ভাষা নির্বাচন করুন",
    "common.languagesSupported": "ভাষা সমর্থিত",
  },
  
  pt: {
    // Navigation
    "nav.contact": "Contato",
    "nav.scheduleNow": "Agendar Agora",
    "nav.services": "Serviços",
    "nav.work": "Trabalho",
    "nav.team": "Equipe",
    "nav.tools": "Ferramentas",
    "nav.pricing": "Preços",
    "nav.experiments": "Experimentos",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Confiado por 20+ Clientes Inovadores",
    "header.strategicPartner": "Seu Parceiro Estratégico",
    "header.forDigitalSolutions": "para Soluções Digitais de IA",
    "header.description": "Ajudamos clientes ousados a desbloquear o poder da IA em escala, acelerar a transformação digital e lançar empreendimentos prontos para o futuro construídos para o crescimento.",
    "header.bookConsultation": "Reservar Consulta Gratuita",
    
    // Contact Page
    "contact.hero.badge": "Entre em Contato",
    "contact.hero.title": "Vamos Construir Algo Incrível Juntos",
    
    "contact.form.send": "Enviar Mensagem",
    "contact.form.sending": "Enviando...",
    
    "contact.cta.title": "Pronto para Começar seu Projeto?",
    
    // Services Section
    "services.badge": "Nossos Serviços",
    "services.title": "Escolha seu",
    "services.subtitle": "modelo de engajamento",
    "services.description": "Escale conforme você cresce. Comece pequeno, pense grande.",
    "services.cta": "Explorar Serviços",
    
    // Common
    "common.selectLanguage": "Selecionar Idioma",
    "common.languagesSupported": "idiomas suportados",
  },
  
  ru: {
    // Navigation
    "nav.contact": "Контакты",
    "nav.scheduleNow": "Запланировать Сейчас",
    "nav.services": "Услуги",
    "nav.work": "Работа",
    "nav.team": "Команда",
    "nav.tools": "Инструменты",
    "nav.pricing": "Цены",
    "nav.experiments": "Эксперименты",
    "nav.agi": "ОИИ",
    
    // Header & Hero
    "header.trustedBy": "Доверяют 20+ Инновационных Клиентов",
    "header.strategicPartner": "Ваш Стратегический Партнер",
    "header.forDigitalSolutions": "для Цифровых Решений ИИ",
    "header.description": "Мы помогаем смелым клиентам раскрыть мощь ИИ в масштабе, ускорить цифровую трансформацию и запустить готовые к будущему предприятия, созданные для роста.",
    "header.bookConsultation": "Забронировать Бесплатную Консультацию",
    
    // Contact Page
    "contact.hero.badge": "Свяжитесь с нами",
    "contact.hero.title": "Давайте создадим что-то удивительное вместе",
    
    "contact.form.send": "Отправить Сообщение",
    "contact.form.sending": "Отправка...",
    
    "contact.cta.title": "Готовы начать свой проект?",
    
    // Services Section
    "services.badge": "Наши Услуги",
    "services.title": "Выберите свою",
    "services.subtitle": "модель взаимодействия",
    "services.description": "Масштабируйтесь по мере роста. Начните с малого, думайте масштабно.",
    "services.cta": "Изучить Услуги",
    
    // Common
    "common.selectLanguage": "Выбрать язык",
    "common.languagesSupported": "поддерживаемых языков",
  },
  
  ur: {
    // Navigation
    "nav.contact": "رابطہ",
    "nav.scheduleNow": "ابھی شیڈول کریں",
    "nav.services": "خدمات",
    "nav.work": "کام",
    "nav.team": "ٹیم",
    "nav.tools": "ٹولز",
    "nav.pricing": "قیمتیں",
    "nav.experiments": "تجربات",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "20+ جدید کلائنٹس کا اعتماد",
    "header.strategicPartner": "آپ کا اسٹریٹجک پارٹنر",
    "header.forDigitalSolutions": "AI ڈیجیٹل حل کے لیے",
    "header.description": "ہم بہادر کلائنٹس کو بڑے پیمانے پر AI کی طاقت کو آزاد کرنے، ڈیجیٹل تبدیلی کو تیز کرنے، اور ترقی کے لیے بنائے گئے مستقبل کے لیے تیار کاروبار شروع کرنے میں مدد کرتے ہیں۔",
    "header.bookConsultation": "مفت مشاورت بک کریں",
    
    // Contact Page
    "contact.hero.badge": "ہم سے رابطہ کریں",
    "contact.hero.title": "آئیے مل کر کچھ حیرت انگیز بنائیں",
    
    "contact.form.send": "پیغام بھیجیں",
    "contact.form.sending": "بھیجا جا رہا ہے...",
    
    "contact.cta.title": "اپنا پروجیکٹ شروع کرنے کے لیے تیار ہیں؟",
    
    // Services Section
    "services.badge": "ہماری خدمات",
    "services.title": "اپنا منتخب کریں",
    "services.subtitle": "مشغولیت کا ماڈل",
    "services.description": "آپ کی ترقی کے ساتھ اسکیل کریں۔ چھوٹا شروع کریں، بڑا سوچیں۔",
    "services.cta": "خدمات کا جائزہ لیں",
    
    // Common
    "common.selectLanguage": "زبان منتخب کریں",
    "common.languagesSupported": "زبانیں معاونت یافتہ",
  },
  
  bbc: {
    // Navigation
    "nav.contact": "Kontak Hami",
    "nav.scheduleNow": "Jadwal Ima",
    "nav.services": "Layanan",
    "nav.work": "Karya",
    "nav.team": "Tim",
    "nav.tools": "Tools",
    "nav.pricing": "Harga",
    "nav.experiments": "Eksperimen",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Dipercaya 20+ Klien Inovatif",
    "header.strategicPartner": "Mitra Strategis Hamu",
    "header.forDigitalSolutions": "untuk Solusi Digital AI",
    "header.description": "Hami mambantu klien berani membuka kekuatan AI di skala besar, mempercepat transformasi digital, dan meluncurkan usaha siap masa depan.",
    "header.bookConsultation": "Pesan Konsultasi Gratis",
    
    // Contact Page
    "contact.hero.badge": "Kontak Hami",
    "contact.hero.title": "Mari Membangun Sesuatu Yang Luar Biasa",
    
    "contact.form.send": "Kirim Pesan",
    "contact.form.sending": "Dikirimi...",
    
    "contact.cta.title": "Siap Mulai Proyek Hamu?",
    
    // Services Section
    "services.badge": "Layanan Hami",
    "services.title": "Pilih",
    "services.subtitle": "model keterlibatan hamu",
    "services.description": "Berkembang seiring pertumbuhan. Mulai kecil, berpikir besar.",
    "services.cta": "Jelajahi Layanan",
    
    // Common
    "common.selectLanguage": "Pilih Hata",
    "common.languagesSupported": "hata didukung",
  },
  
  jv: {
    // Navigation
    "nav.contact": "Kontak",
    "nav.scheduleNow": "Jadwal Saiki",
    "nav.services": "Layanan",
    "nav.work": "Karya",
    "nav.team": "Tim",
    "nav.tools": "Tools",
    "nav.pricing": "Rega",
    "nav.experiments": "Eksperimen",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Dipercaya 20+ Klien Inovatif",
    "header.strategicPartner": "Mitra Strategis Sampeyan",
    "header.forDigitalSolutions": "kanggo Solusi Digital AI",
    "header.description": "Awake bantu klien sing wani mbukak kekuatan AI ing skala gedhe, nggawe cepet transformasi digital, lan ngluncurake usaha siap masa depan.",
    "header.bookConsultation": "Pesan Konsultasi Gratis",
    
    // Contact Page
    "contact.hero.badge": "Kontak Kita",
    "contact.hero.title": "Ayo Nggawe Barang Sing Apik Bareng",
    
    "contact.form.send": "Kirim Pesan",
    "contact.form.sending": "Ngirim...",
    
    "contact.cta.title": "Siap Miwiti Proyek Sampeyan?",
    
    // Services Section
    "services.badge": "Layanan Kita",
    "services.title": "Pilih",
    "services.subtitle": "model keterlibatan sampeyan",
    "services.description": "Berkembang karo pertumbuhan. Miwiti cilik, mikir gedhe.",
    "services.cta": "Jelajahi Layanan",
    
    // Common
    "common.selectLanguage": "Pilih Basa",
    "common.languagesSupported": "basa didhukung",
  },
  
  gaul: {
    // Navigation
    "nav.contact": "Contact",
    "nav.scheduleNow": "Schedule Now",
    "nav.services": "Services",
    "nav.work": "Work",
    "nav.team": "Team",
    "nav.tools": "Tools",
    "nav.pricing": "Pricing",
    "nav.experiments": "Experiments",
    "nav.agi": "AGI",
    
    // Header & Hero
    "header.trustedBy": "Trusted by 20+ Innovative Clients",
    "header.strategicPartner": "Strategic Partner Kamu",
    "header.forDigitalSolutions": "buat AI Digital Solutions",
    "header.description": "Kita help bold clients unlock power AI di scale besar, accelerate digital transformation, dan launch future-ready ventures built for growth.",
    "header.bookConsultation": "Book Free Consultation",
    
    // Contact Page
    "contact.hero.badge": "Contact Kita",
    "contact.hero.title": "Yuk Build Something Amazing Together",
    "contact.hero.description": "Ready buat transform business kamu dengan cutting-edge AI dan digital solutions? Team experts kita here to help unlock potential kamu dan achieve extraordinary results.",
    
    "contact.stats.response": "Response Time",
    "contact.stats.satisfaction": "Client Satisfaction",
    "contact.stats.languages": "Languages",
    "contact.stats.consultations": "Consultations",
    
    "contact.methods.badge": "Get in Touch",
    "contact.methods.title": "Multiple Ways Buat Connect",
    "contact.methods.whatsapp.title": "WhatsApp Chat",
    "contact.methods.whatsapp.description": "Get instant responses buat questions kamu through WhatsApp business line kita.",
    "contact.methods.whatsapp.action": "Start Chat",
    
    "contact.form.badge": "Send Message",
    "contact.form.title": "Tell Us About Project Kamu",
    "contact.form.name": "Full Name",
    "contact.form.namePlaceholder": "Masukkin nama lengkap kamu",
    "contact.form.email": "Email Address",
    "contact.form.emailPlaceholder": "email.kamu@company.com",
    "contact.form.company": "Company",
    "contact.form.companyPlaceholder": "Nama company kamu",
    "contact.form.service": "Service yang Dibutuhin",
    "contact.form.servicePlaceholder": "Pilih service",
    "contact.form.services.aiConsulting": "AI Consulting",
    "contact.form.services.digitalTransformation": "Digital Transformation",
    "contact.form.services.webDevelopment": "Web Development",
    "contact.form.services.mobileApps": "Mobile Apps",
    "contact.form.services.dataAnalytics": "Data Analytics",
    "contact.form.services.other": "Other",
    "contact.form.budget": "Project Budget",
    "contact.form.budgetPlaceholder": "Pilih budget range",
    "contact.form.budgetDiscuss": "Let's discuss aja",
    "contact.form.message": "Project Details",
    "contact.form.messagePlaceholder": "Ceritain tentang project, goals, dan gimana kita bisa help achieve them...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success.title": "Message Sent Successfully!",
    "contact.form.success.message": "Thanks udah reach out. Kita bakal get back dalam 2 hours dengan detailed response.",
    
    "contact.office.badge": "Office Kita",
    "contact.office.title": "Visit Kita di Yogyakarta",
    "contact.office.address.title": "Office Address",
    "contact.office.address.line1": "Jl. Malioboro Street No. 123",
    "contact.office.address.line2": "Yogyakarta 55271",
    "contact.office.address.line3": "Indonesia",
    "contact.office.hours.title": "Office Hours",
    "contact.office.hours.weekdays": "Monday - Friday: 9:00 AM - 6:00 PM",
    "contact.office.hours.weekend": "Saturday: 9:00 AM - 2:00 PM",
    "contact.office.directions": "Get Directions",
    "contact.office.mapTitle": "Strategic Location",
    "contact.office.mapDescription": "Located di heart of Yogyakarta's business district, easily accessible dengan all forms transportation.",
    
    "contact.faq.badge": "FAQ",
    "contact.faq.title": "Frequently Asked Questions",
    "contact.faq.description": "Quick answers buat common questions about services dan process kita.",
    "contact.faq.pricing.question": "Gimana cara kamu price services?",
    "contact.faq.pricing.answer": "Pricing kita project-based dan depends on scope, complexity, dan timeline. Kita provide detailed quotes after understanding specific needs kamu during free consultation.",
    "contact.faq.timeline.question": "Berapa typical project timeline?",
    "contact.faq.timeline.answer": "Project timelines vary dari 2-6 months depending on complexity. Kita provide detailed timelines during initial consultation dan keep you updated throughout process.",
    "contact.faq.process.question": "Gimana development process kamu?",
    "contact.faq.process.answer": "Kita follow proven 3-step process: Discovery & Strategy, Design & Development, dan Launch & Optimization. Each phase includes regular check-ins dan deliverables.",
    "contact.faq.support.question": "Do you provide ongoing support?",
    "contact.faq.support.answer": "Yes, kita offer comprehensive post-launch support including maintenance, updates, monitoring, dan optimization buat ensure solution kamu continues to perform at its best.",
    
    "contact.cta.title": "Ready buat Start Project Kamu?",
    "contact.cta.description": "Book free consultation call buat discuss project requirements kamu dan learn gimana kita bisa help achieve business goals.",
    "contact.cta.schedule": "Schedule Free Consultation",
    "contact.cta.portfolio": "View Portfolio Kita",
    
    // Services Section
    "services.badge": "Services Kita",
    "services.title": "Choose your",
    "services.subtitle": "engagement model",
    "services.description": "Scale as you grow. Start kecil, think big.",
    "services.1.title": "AI Strategy Sprint",
    "services.1.description": "Fast-track AI roadmap kamu dengan focused workshops dan actionable implementation plans.",
    "services.1.feature1": "AI Readiness Assessment",
    "services.1.feature2": "Custom Strategy Roadmap",
    "services.1.feature3": "Quick Wins Identification",
    "services.1.deliverables": "Strategy doc, roadmap, priority matrix",
    "services.2.title": "AI Design and Development",
    "services.2.description": "From concept to launch - kita build AI-powered solutions that solve real business problems.",
    "services.2.feature1": "Branding",
    "services.2.feature2": "Product Design",
    "services.2.feature3": "Web Development",
    "services.2.deliverables": "Working prototype, source code, documentation",
    "services.3.title": "On-Demand Product Consulting Team",
    "services.3.description": "Scale team kamu dengan experts kita yang understand both strategy dan hands-on execution.",
    "services.3.feature1": "Flexible Engagement",
    "services.3.feature2": "Expert Team Access",
    "services.3.feature3": "Ongoing Support",
    "services.3.deliverables": "Dedicated team, regular reviews, continuous delivery",
    "services.cta": "Explore Services",
    
    // Problem Section
    "problem.badge": "The Problem",
    "problem.title.line1": "Traditional consulting is",
    "problem.title.slow": "slow banget",
    "problem.title.line2": "AI often just",
    "problem.title.talk": "talk doang",
    "problem.1.text": "Projects take too long dan cost too much",
    "problem.1.stat": "6-12 months",
    "problem.1.label": "typical waste",
    "problem.2.text": "Teams gak tau harus start dari mana dengan AI",
    "problem.2.stat": "73% teams",
    "problem.2.label": "are confused",
    "problem.3.text": "Agencies give advice, tapi gak build",
    "problem.3.stat": "$50K+ wasted",
    "problem.3.label": "on consultations",
    "problem.solution.title": "Gimana kita different",
    "problem.solution.description": "Delibix combines strategy, design, dan execution — kita gak cuma give you roadmap,",
    "problem.solution.highlight": "kita help you build the car.",
    "problem.solution.timeline": "3 days - 4 weeks to launch",

    // Process Section
    "process.badge": "Process Kita",
    "process.title": "Fast, simple, dan tailored for",
    "process.subtitle": "digital teams",
    "process.step1.title": "Discover",
    "process.step1.description": "Understand business dan workflows kamu",
    "process.step1.details": "Deep dive into current processes, pain points, dan opportunities for AI integration.",
    "process.step1.duration": "3-7 days",
    "process.step2.title": "Design",
    "process.step2.description": "Prototype real solutions using AI & automation",
    "process.step2.details": "Create working prototypes dan proof-of-concepts yang demonstrate real value.",
    "process.step2.duration": "1-2 weeks",
    "process.step3.title": "Build & Iterate",
    "process.step3.description": "Launch quickly, test fast, dan improve continuously",
    "process.step3.details": "Deploy, gather feedback, dan iterate based on real user data dan business impact.",
    "process.step3.duration": "1-3 weeks",
    "process.bottom.message": "No endless slides. Just results yang bisa kamu",
    "process.bottom.test": "test",
    "process.bottom.touch": "touch",
    "process.bottom.scale": "scale",

    // Why Delibix Section
    "why.badge": "Why Choose Delibix",
    "why.title": "Traditional consulting",
    "why.vs": "vs",
    "why.delibix": "Delibix",
    "why.comparison": "Comparison",
    "why.traditional": "Traditional",
    "why.consulting": "Consulting",
    "why.ainative": "AI-Native",
    "why.timeline": "Timeline",
    "why.timeline.traditional": "6-12 months for delivery",
    "why.timeline.delibix": "3 days - 4 weeks to working prototype",
    "why.approach": "Approach",
    "why.approach.traditional": "Endless presentations dan documentation",
    "why.approach.delibix": "Build dan test real solutions",
    "why.team": "Team",
    "why.team.traditional": "Junior consultants dengan templates",
    "why.team.delibix": "Senior experts yang code dan design",
    "why.output": "Output",
    "why.output.traditional": "PDF recommendations",
    "why.output.delibix": "Working software yang bisa kamu use",
    "why.advantage1.title": "Speed Without Compromise",
    "why.advantage1.description": "Rapid prototyping dan iterative development means kamu see results in weeks, not months.",
    "why.advantage2.title": "Built by Builders",
    "why.advantage2.description": "Team kita gak cuma advise – we design, code, dan deploy real solutions.",
    "why.advantage3.title": "Results-Driven Process",
    "why.advantage3.description": "Every feature is tested dan validated dengan real users dan data.",
    "why.advantage4.title": "AI-Native Thinking",
    "why.advantage4.description": "Kita understand AI capabilities dan limitations buat build practical, effective solutions.",

    // Contact Section
    "contact.badge": "Let's Connect",
    "contact.title": "Got an idea?",
    "contact.subtitle": "Need speed?",
    "contact.description": "Let's talk. 30 minutes, no pressure, real insights about AI journey kamu.",
    "contact.option1.title": "Book a Free Call",
    "contact.option1.description": "30 minutes, no pressure, real insights",
    "contact.option1.action": "Schedule Now",
    "contact.option2.title": "WhatsApp Brief",
    "contact.option2.description": "Quick chat about project needs kamu",
    "contact.option2.action": "Send Message",
    "contact.option3.title": "Free Resources",
    "contact.option3.description": "Access free tools dan templates kita",
    "contact.option3.action": "View Resources",
    "contact.bottom.title": "Ready buat transform business kamu dengan AI?",
    "contact.bottom.description": "Join 20+ companies yang udah accelerate growth mereka dengan AI solutions kita.",
    "contact.bottom.cta1": "Start AI Journey Kamu",
    "contact.bottom.cta2": "View Case Studies",
    "contact.bottom.info1.title": "Quick Response",
    "contact.bottom.info1.description": "Kita respond dalam 24 hours",
    "contact.bottom.info2.title": "Free Consultation",
    "contact.bottom.info2.description": "No commitment, just insights",
    
    // Common
    "common.selectLanguage": "Pilih Language",
    "common.languagesSupported": "languages supported",
    "common.learnMore": "Learn More",
    "common.getStarted": "Get Started",
    "common.readMore": "Read More",
    "common.close": "Close",
    "common.open": "Open",
    "common.loading": "Loading...",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  // Auto-detect language from browser or local storage
  useEffect(() => {
    const savedLang = localStorage.getItem('delibix-language') as Language;
    if (savedLang && languages[savedLang]) {
      setLanguage(savedLang);
      return;
    }

    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    const detectedLang = 
      browserLang.startsWith('id') ? 'id' :
      browserLang.startsWith('zh') ? 'zh' :
      browserLang.startsWith('hi') ? 'hi' :
      browserLang.startsWith('es') ? 'es' :
      browserLang.startsWith('fr') ? 'fr' :
      browserLang.startsWith('ar') ? 'ar' :
      browserLang.startsWith('bn') ? 'bn' :
      browserLang.startsWith('pt') ? 'pt' :
      browserLang.startsWith('ru') ? 'ru' :
      browserLang.startsWith('ur') ? 'ur' :
      'en';
    
    setLanguage(detectedLang);
  }, []);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('delibix-language', language);
    
    // Set document attributes for RTL support
    const isRTL = languages[language]?.rtl || false;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const isRTL = languages[language]?.rtl || false;

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}