/**
 * @file HomePage.tsx
 * @description YYC³ AI Code Designer 首页 — 品牌区 + 紧凑聊天 + 最近项目 + 顶部导航栏
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v2.0.0
 * @created 2026-03-14
 * @updated 2026-03-18
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags homepage, entry, brand, chat, refactored
 */

import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { User, Settings } from "lucide-react";
import { AuroraBackground } from "../components/homepage/AuroraBackground";
import { BrandHeader } from "../components/homepage/BrandHeader";
import { ChatBox } from "../components/homepage/ChatBox";
import { RecentProjects } from "../components/homepage/RecentProjects";
import { HelpButton } from "../components/homepage/HelpButton";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuroraBackground>
      <div className="flex flex-col min-h-screen" style={{ color: "rgba(255,255,255,0.9)" }}>
        {/* ─── 顶部导航栏：右上角个人信息 + 设置 ─── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="fixed top-4 right-5 z-50 flex items-center gap-2"
        >
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
            aria-label="个人信息"
            title="个人信息"
          >
            <User size={16} />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
            aria-label="设置"
            title="设置"
          >
            <Settings size={16} />
          </button>
        </motion.div>

        {/* ─── 品牌区域（缩小间距） ─── */}
        <BrandHeader />

        {/* ─── AI 聊天框（紧凑模式） ─── */}
        <ChatBox />

        {/* ─── 最近项目 ─── */}
        <RecentProjects />

        {/* ─── 帮助按钮 ─── */}
        <HelpButton />

        {/* ─── 页脚 ─── */}
        <footer className="mt-auto py-4 text-center">
          <p className="m-0 opacity-20" style={{ fontSize: "12px" }}>
            &copy; 2026 YanYuCloudCube Team | YYC&sup3; AI Code Designer | MIT License
          </p>
        </footer>
      </div>
    </AuroraBackground>
  );
};

export default HomePage;
