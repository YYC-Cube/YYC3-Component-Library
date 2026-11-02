/**
 * @file BrandHeader.tsx
 * @description Brand identity header with animated logo and slogan
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags brand, header, logo, slogan
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export const BrandHeader: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center pt-10 pb-4 px-5 text-center md:pt-14 md:pb-6"
    >
      {/* Animated Logo */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        className="mb-4 relative"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #00ff87 0%, #60efff 50%, #a855f7 100%)",
            boxShadow: "0 8px 32px rgba(0, 255, 135, 0.3), 0 4px 16px rgba(96, 239, 255, 0.2)",
          }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 60%)",
            }}
          />
          <span className="relative z-10 text-white" style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "Inter, -apple-system, system-ui, sans-serif" }}>
            YYC
          </span>
          <span className="absolute top-1.5 right-2.5 text-white/90" style={{ fontSize: "12px", fontWeight: 700 }}>3</span>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="absolute -inset-2 rounded-3xl opacity-20 pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, #00ff87, #60efff, #a855f7, #ff6b6b, #00ff87)",
          }}
        />
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="m-0 mb-2 bg-clip-text text-transparent"
        style={{
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          backgroundImage: "linear-gradient(135deg, #00ff87 0%, #60efff 40%, #a855f7 80%, #ff6b6b 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        YYC<sup style={{ fontSize: "0.5em", WebkitTextFillColor: "transparent" }}>3</sup> Family AI
      </motion.h1>

      {/* Slogan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-center gap-2"
      >
        <Sparkles size={16} className="text-emerald-400 opacity-70" />
        <p
          className="m-0 opacity-70 bg-clip-text text-transparent"
          style={{
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            fontSize: "clamp(16px, 2.5vw, 22px)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            backgroundImage: "linear-gradient(135deg, #00ff87 0%, #60efff 40%, #a855f7 80%, #ff6b6b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          言传千行代码 | 语枢万物智能
        </p>
        <Sparkles size={16} className="text-cyan-400 opacity-70" />
      </motion.div>
    </motion.div>
  );
};