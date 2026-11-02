import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X, Home, Layers, Cpu, Box, Code, BookOpen, Palette } from 'lucide-react';
import { cn } from '@/lib/utils'; // I'll need to create this utility or just use clsx directly

const navItems = [
  { id: 'hero', label: '首页', icon: Home },
  { id: 'overview', label: '概览', icon: BookOpen },
  { id: 'genes', label: '品牌基因', icon: Layers },
  { id: 'design', label: '设计系统', icon: Palette },
  { id: 'modules', label: '核心模块', icon: Box },
  { id: 'tech', label: '技术架构', icon: Cpu },
  { id: 'api', label: 'API 文档', icon: Code },
];

export const Navigation = () => {
  const [active, setActive] = useState('hero');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActive(id);
    }
  };

  return (
    <motion.nav 
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      {navItems.map((item) => (
        <div key={item.id} className="group relative flex items-center justify-end">
          <span 
            className="absolute right-10 py-1 px-3 rounded-md bg-brand-primary/10 text-brand-primary text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-md border border-brand-primary/20"
          >
            {item.label}
          </span>
          <button
            onClick={() => scrollToSection(item.id)}
            className={`p-3 rounded-full transition-all duration-300 border backdrop-blur-sm ${
              active === item.id 
                ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_15px_rgba(0,122,255,0.5)] scale-110' 
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            <item.icon size={20} />
          </button>
        </div>
      ))}
    </motion.nav>
  );
};

// Mobile Nav
export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="lg:hidden fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 right-0 w-48 py-2 rounded-lg glass-panel flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-4 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
