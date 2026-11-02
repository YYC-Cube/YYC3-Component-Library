import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from './ThemeContext';

/**
 * 粒子场 — 滚动响应式 · 主题感知
 * 粒子密度/速度/连接距离随滚动深度动态变化
 * 鼠标交互：粒子躲避光标
 * 滚动交互：快速滚动时粒子加速扩散
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  phase: number;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef({ y: 0, velocity: 0, maxScroll: 1 });
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const { isDark } = useTheme();

  /** 主题感知粒子色板 */
  const colors = isDark
    ? ['#7c3aed', '#06b6d4', '#8b5cf6', '#22d3ee', '#a78bfa', '#c084fc']
    : ['#9f6eff', '#22d3ee', '#a78bfa', '#67e8f9', '#c4b5fd', '#d8b4fe'];

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 6000), 160);
    particlesRef.current = Array.from({ length: count }, () => {
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.5;
      const radius = Math.random() * 2 + 0.5;
      const opacity = Math.random() * 0.5 + 0.1;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        radius,
        baseRadius: radius,
        opacity,
        baseOpacity: opacity,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastScrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) {
        initParticles(canvas.width, canvas.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = {
        y: currentY,
        velocity: delta,
        maxScroll: docHeight || 1,
      };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current;
      timeRef.current += 0.016;
      const time = timeRef.current;

      /** 滚动深度因子 0..1 */
      const scrollDepth = Math.min(scroll.y / scroll.maxScroll, 1);
      /** 滚动速度因子 */
      const scrollSpeed = Math.min(Math.abs(scroll.velocity) / 30, 1);

      /** 连接距离随深度增加 */
      const connectionDist = 100 + scrollDepth * 60;
      /** 连接透明度基准 */
      const connectionAlpha = 0.06 + scrollDepth * 0.04;

      /** 速度衰减 — 滚动时恢复 */
      scroll.velocity *= 0.92;

      particles.forEach((p) => {
        /** 鼠标互斥力 */
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        /** 滚动脉冲 — 快速滚动时粒子向外扩散 */
        if (scrollSpeed > 0.1) {
          p.vx += (Math.random() - 0.5) * scrollSpeed * 0.8;
          p.vy += (Math.random() - 0.5) * scrollSpeed * 0.8;
        }

        /** 阻尼 */
        p.vx *= 0.97;
        p.vy *= 0.97;

        /** 呼吸运动 */
        const breathe = Math.sin(time * 0.5 + p.phase) * 0.1;
        p.x += p.vx + breathe;
        p.y += p.vy + breathe * 0.5;

        /** 循环边界 */
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        /** 滚动深度影响半径和透明度 */
        const depthBoost = 1 + scrollDepth * 0.5;
        const currentRadius = p.baseRadius * depthBoost;
        const currentOpacity = Math.min(p.baseOpacity * (1 + scrollDepth * 0.3), 0.8);

        /** 绘制粒子 */
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentOpacity;
        ctx.fill();

        /** 较大粒子加发光 */
        if (currentRadius > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, currentRadius * 3
          );
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.globalAlpha = currentOpacity * 0.15;
          ctx.fill();
        }
      });

      /** 绘制连接线 */
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = connectionAlpha * (1 - dist / connectionDist);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            /** 连接线颜色随深度渐变 */
            const purpleAmt = 1 - scrollDepth;
            const cyanAmt = scrollDepth;
            const r = Math.floor(124 * purpleAmt + 6 * cyanAmt);
            const g = Math.floor(58 * purpleAmt + 182 * cyanAmt);
            const b = Math.floor(237 * purpleAmt + 212 * cyanAmt);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}