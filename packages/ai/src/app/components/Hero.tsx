import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, CircleHelp, ChevronRight } from 'lucide-react';
import shieldLogo from 'figma:asset/40025af4b8baa344842bf5c8553025808daf7909.png';
import cloudLogo from 'figma:asset/bbf3e3fa0f74d88bf01cb28b236dfeee49fdfab5.png';

interface HeroProps {
  onEnter: () => void;
}

export const Hero = ({ onEnter }: HeroProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple particle network effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 122, 255, 0.3)';
      ctx.strokeStyle = 'rgba(0, 122, 255, 0.1)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect near particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section 
      id="hero" 
      onClick={onEnter}
      className="relative min-h-screen flex items-center justify-center overflow-hidden cursor-pointer group"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050510]">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#007AFF] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00C6FF] rounded-full blur-[150px] opacity-10 animate-pulse delay-1000" />
      </div>

      {/* Corner Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-20">
        <button className="p-2 text-white/50 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        <button className="p-2 text-white/50 hover:text-white transition-colors">
          <CircleHelp size={20} />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Floating Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-40 h-40 mb-10"
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-[#007AFF]/20 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.img 
            src={shieldLogo} 
            alt="YYC Shield" 
            className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,122,255,0.6)]"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img 
            src={cloudLogo} 
            alt="YYC Cloud" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-contain mix-blend-plus-lighter"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
            YYC³ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007AFF] to-[#00C6FF]">EasyVizAI</span>
          </h1>
          
          <div className="space-y-2">
            <p className="text-2xl md:text-3xl text-white/90 font-light tracking-wide">
              小语陪你高效成长
            </p>
            <p className="text-lg text-blue-200/60 font-light">
              每一次学习都值得被关注
            </p>
          </div>
        </motion.div>

        {/* Breathing Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 text-sm tracking-widest uppercase flex items-center gap-2"
          >
            点击或滑动进入
            <ChevronRight size={14} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
