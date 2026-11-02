/**
 * @file AuroraBackground.tsx
 * @description Animated aurora gradient background with flowing light effects
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags aurora, background, animation, gradient
 */

import React from "react";

export const AuroraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#080b14" }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 130% 70% at 50% 15%, rgba(6,24,44,1) 0%, rgba(8,11,20,1) 100%)",
        }}
      />

      {/* Aurora blob 1 — teal/green */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-25%",
          left: "-5%",
          width: "65%",
          height: "55%",
          background: "radial-gradient(ellipse, rgba(0,255,135,0.07) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "auroraMove1 20s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 2 — cyan */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          right: "-10%",
          width: "55%",
          height: "45%",
          background: "radial-gradient(ellipse, rgba(96,239,255,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "auroraMove2 25s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 3 — purple */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          left: "25%",
          width: "45%",
          height: "35%",
          background: "radial-gradient(ellipse, rgba(168,85,247,0.05) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "auroraMove3 18s ease-in-out infinite",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style>{`
        @keyframes auroraMove1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, 5%) scale(1.1); }
          66% { transform: translate(-5%, -3%) scale(0.95); }
        }
        @keyframes auroraMove2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-8%, 6%) scale(1.05); }
          66% { transform: translate(5%, -4%) scale(1.1); }
        }
        @keyframes auroraMove3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, -5%) scale(1.08); }
        }
      `}</style>
    </div>
  );
};