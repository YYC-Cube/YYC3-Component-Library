/**
 * @file conversationStore.ts
 * @description Zustand store for conversation state management
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, zustand, conversation, state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  attachments?: { type: string; name: string; url?: string }[];
}

export interface Project {
  id: string;
  name: string;
  thumbnail?: string;
  updatedAt: string;
  status: "active" | "archived" | "draft";
  description?: string;
}

interface ConversationStore {
  messages: ChatMessage[];
  isStreaming: boolean;
  recentProjects: Project[];
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setStreaming: (v: boolean) => void;
  clearMessages: () => void;
  setRecentProjects: (projects: Project[]) => void;
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      recentProjects: [
        {
          id: "p1",
          name: "Dashboard UI",
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          status: "active",
          description: "Admin dashboard with analytics",
        },
        {
          id: "p2",
          name: "E-Commerce App",
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          status: "active",
          description: "Full-stack shopping platform",
        },
        {
          id: "p3",
          name: "Blog Platform",
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          status: "draft",
          description: "Markdown-based blog engine",
        },
        {
          id: "p4",
          name: "Chat Application",
          updatedAt: new Date(Date.now() - 604800000).toISOString(),
          status: "archived",
          description: "Real-time messaging app",
        },
        {
          id: "p5",
          name: "Portfolio Site",
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          status: "active",
          description: "Personal portfolio website",
        },
      ],
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      setStreaming: (v) => set({ isStreaming: v }),
      clearMessages: () => set({ messages: [] }),
      setRecentProjects: (projects) => set({ recentProjects: projects }),
    }),
    { name: "yyc3-conversation" }
  )
);
