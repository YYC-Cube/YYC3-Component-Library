import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function ParticleBackground() {
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    const checkMotion = () => setIsReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    checkMobile();
    checkMotion();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce particles on mobile for better performance
  const particleCount = isMobile ? 20 : 50;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (isMobile ? 2 : 4) + 1,
    duration: Math.random() * (isMobile ? 15 : 20) + 10,
  }));

  // Don't render particles if user prefers reduced motion
  if (isReducedMotion) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/10 to-gray-900 pointer-events-none" />
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(59,130,246,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.5)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>
    </div>
  );
}