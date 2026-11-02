/**
 * @file pluginStore.ts
 * @description 插件 API 系统 — registerPlugin() 扩展机制、第三方存储后端、插件生命周期
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-14
 * @updated 2026-03-14
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags store, plugin, api, extension, registry, storage-backend
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── 类型定义 ─── */
export type PluginCategory = "storage" | "ai" | "editor" | "preview" | "theme" | "integration" | "tool";
export type PluginStatus = "active" | "inactive" | "error" | "updating";

export interface PluginHook {
  name: string;
  description: string;
  handler: (...args: any[]) => any;
}

export interface PluginAPI {
  /** 唯一标识 */
  id: string;
  /** 插件名称 */
  name: string;
  /** 版本号 */
  version: string;
  /** 描述 */
  description: string;
  /** 分类 */
  category: PluginCategory;
  /** 作者 */
  author: string;
  /** 许可证 */
  license: string;
  /** 入口方法：初始化 */
  initialize?: () => Promise<void> | void;
  /** 入口方法：销毁 */
  destroy?: () => Promise<void> | void;
  /** 提供的钩子/能力 */
  hooks?: Record<string, (...args: any[]) => any>;
  /** 提供的 UI 面板 */
  panels?: { id: string; title: string; render: () => unknown }[];
  /** 存储后端接口 (仅 category='storage') */
  storageBackend?: StorageBackendAPI;
}

export interface StorageBackendAPI {
  /** 存储类型 (如 sqlite, s3, ftp) */
  type: string;
  /** 连接 */
  connect: (config: Record<string, unknown>) => Promise<void>;
  /** 断开 */
  disconnect: () => Promise<void>;
  /** 列出文件 */
  list: (path: string) => Promise<{ name: string; type: "file" | "folder"; size: number }[]>;
  /** 读取 */
  read: (path: string) => Promise<string>;
  /** 写入 */
  write: (path: string, content: string) => Promise<void>;
  /** 删除 */
  remove: (path: string) => Promise<void>;
}

export interface PluginRegistration {
  id: string;
  name: string;
  version: string;
  description: string;
  category: PluginCategory;
  author: string;
  license: string;
  status: PluginStatus;
  enabled: boolean;
  installedAt: number;
  updatedAt: number;
  hasUI: boolean;
  hasStorage: boolean;
  hookCount: number;
  size: string;
  icon?: string;
  homepage?: string;
}

/* ─── 预设插件注册表 ─── */
const presetPlugins: PluginRegistration[] = [
  {
    id: "yyc3-local-sqlite",
    name: "本地 SQLite 存储",
    version: "1.0.0",
    description: "通过 Tauri 桥接本地 SQLite 数据库，提供轻量级文件版本存储。",
    category: "storage",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 2,
    hasUI: false,
    hasStorage: true,
    hookCount: 4,
    size: "1.2 MB",
    icon: "Database",
  },
  {
    id: "yyc3-s3-backend",
    name: "AWS S3 云存储",
    version: "1.0.0",
    description: "连接 AWS S3 存储桶，支持文件备份、同步和版本管理。",
    category: "storage",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "inactive",
    enabled: false,
    installedAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    hasUI: true,
    hasStorage: true,
    hookCount: 6,
    size: "0.8 MB",
    icon: "Cloud",
  },
  {
    id: "yyc3-git-integration",
    name: "Git 版本控制",
    version: "2.0.0",
    description: "集成 Git 操作：commit, push, pull, branch, merge，支持 GitHub/GitLab。",
    category: "integration",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000,
    hasUI: true,
    hasStorage: false,
    hookCount: 12,
    size: "3.4 MB",
    icon: "GitBranch",
  },
  {
    id: "yyc3-theme-aurora",
    name: "极光主题增强包",
    version: "1.2.0",
    description: "增强极光背景效果，添加更多动画和渐变变体。",
    category: "theme",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    hasUI: false,
    hasStorage: false,
    hookCount: 2,
    size: "0.5 MB",
    icon: "Palette",
  },
  {
    id: "yyc3-code-snippets",
    name: "代码片段管理器",
    version: "1.1.0",
    description: "管理和快速插入常用代码片段，支持分类、搜索和模板变量。",
    category: "editor",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 2,
    hasUI: true,
    hasStorage: false,
    hookCount: 5,
    size: "0.3 MB",
    icon: "Code",
  },
  {
    id: "yyc3-preview-threejs",
    name: "Three.js 3D 预览",
    version: "0.9.0",
    description: "在预览面板中支持 Three.js 3D 场景实时渲染。",
    category: "preview",
    author: "Community",
    license: "MIT",
    status: "inactive",
    enabled: false,
    installedAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6,
    hasUI: true,
    hasStorage: false,
    hookCount: 3,
    size: "2.1 MB",
    icon: "Box",
  },
  {
    id: "yyc3-ai-ollama-ext",
    name: "Ollama 本地模型增强",
    version: "1.0.0",
    description: "增强 Ollama 本地模型管理：模型下载、参数调优、GPU 监控。",
    category: "ai",
    author: "Community",
    license: "Apache-2.0",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    hasUI: true,
    hasStorage: false,
    hookCount: 8,
    size: "1.8 MB",
    icon: "Bot",
  },
  {
    id: "yyc3-file-diff",
    name: "文件差异对比",
    version: "1.0.0",
    description: "提供两个文件版本的并排差异对比视图，支持行内差异高亮。",
    category: "tool",
    author: "YanYuCloudCube Team",
    license: "MIT",
    status: "active",
    enabled: true,
    installedAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 3,
    hasUI: true,
    hasStorage: false,
    hookCount: 3,
    size: "0.6 MB",
    icon: "Diff",
  },
];

/* ─── Store 接口 ─── */
interface PluginStore {
  plugins: PluginRegistration[];
  registeredAPIs: Map<string, PluginAPI>;
  hookRegistry: Map<string, Array<{ pluginId: string; handler: (...args: any[]) => any }>>;

  /* 插件管理 */
  registerPlugin: (api: PluginAPI) => void;
  unregisterPlugin: (pluginId: string) => void;
  enablePlugin: (pluginId: string) => void;
  disablePlugin: (pluginId: string) => void;
  updatePlugin: (pluginId: string, version: string) => void;

  /* 钩子系统 */
  registerHook: (hookName: string, pluginId: string, handler: (...args: any[]) => any) => void;
  unregisterHook: (hookName: string, pluginId: string) => void;
  callHook: (hookName: string, ...args: any[]) => any[];

  /* 存储后端 */
  getStorageBackends: () => PluginRegistration[];

  /* 查询 */
  getPluginsByCategory: (category: PluginCategory) => PluginRegistration[];
  getActivePlugins: () => PluginRegistration[];
  getPlugin: (id: string) => PluginRegistration | undefined;

  /* 统计 */
  getStats: () => { total: number; active: number; storage: number; totalSize: string };
}

/* ─── Store 实现 ─── */
export const usePluginStore = create<PluginStore>()(
  persist(
    (set, get) => ({
      plugins: presetPlugins,
      registeredAPIs: new Map(),
      hookRegistry: new Map(),

      registerPlugin: (api) => {
        const existing = get().plugins.find((p) => p.id === api.id);
        if (existing) return; // 不重复注册

        const registration: PluginRegistration = {
          id: api.id,
          name: api.name,
          version: api.version,
          description: api.description,
          category: api.category,
          author: api.author,
          license: api.license,
          status: "active",
          enabled: true,
          installedAt: Date.now(),
          updatedAt: Date.now(),
          hasUI: !!api.panels && api.panels.length > 0,
          hasStorage: !!api.storageBackend,
          hookCount: api.hooks ? Object.keys(api.hooks).length : 0,
          size: "0 KB",
        };

        const newAPIs = new Map(get().registeredAPIs);
        newAPIs.set(api.id, api);

        // 注册钩子
        if (api.hooks) {
          for (const [hookName, handler] of Object.entries(api.hooks)) {
            get().registerHook(hookName, api.id, handler);
          }
        }

        // 调用初始化
        api.initialize?.();

        set((s) => ({
          plugins: [...s.plugins, registration],
          registeredAPIs: newAPIs,
        }));
      },

      unregisterPlugin: (pluginId) => {
        const api = get().registeredAPIs.get(pluginId);
        api?.destroy?.();

        const newAPIs = new Map(get().registeredAPIs);
        newAPIs.delete(pluginId);

        // 移除所有钩子
        const newHooks = new Map(get().hookRegistry);
        for (const [name, handlers] of newHooks) {
          newHooks.set(name, handlers.filter((h) => h.pluginId !== pluginId));
        }

        set((s) => ({
          plugins: s.plugins.filter((p) => p.id !== pluginId),
          registeredAPIs: newAPIs,
          hookRegistry: newHooks,
        }));
      },

      enablePlugin: (pluginId) => {
        set((s) => ({
          plugins: s.plugins.map((p) =>
            p.id === pluginId ? { ...p, enabled: true, status: "active" as const } : p
          ),
        }));
        get().registeredAPIs.get(pluginId)?.initialize?.();
      },

      disablePlugin: (pluginId) => {
        set((s) => ({
          plugins: s.plugins.map((p) =>
            p.id === pluginId ? { ...p, enabled: false, status: "inactive" as const } : p
          ),
        }));
        get().registeredAPIs.get(pluginId)?.destroy?.();
      },

      updatePlugin: (pluginId, version) => {
        set((s) => ({
          plugins: s.plugins.map((p) =>
            p.id === pluginId ? { ...p, version, updatedAt: Date.now(), status: "active" as const } : p
          ),
        }));
      },

      registerHook: (hookName, pluginId, handler) => {
        const hooks = new Map(get().hookRegistry);
        const existing = hooks.get(hookName) || [];
        hooks.set(hookName, [...existing, { pluginId, handler }]);
        set({ hookRegistry: hooks });
      },

      unregisterHook: (hookName, pluginId) => {
        const hooks = new Map(get().hookRegistry);
        const existing = hooks.get(hookName) || [];
        hooks.set(hookName, existing.filter((h) => h.pluginId !== pluginId));
        set({ hookRegistry: hooks });
      },

      callHook: (hookName, ...args) => {
        const handlers = get().hookRegistry.get(hookName) || [];
        return handlers
          .filter((h) => {
            const plugin = get().plugins.find((p) => p.id === h.pluginId);
            return plugin?.enabled;
          })
          .map((h) => h.handler(...args));
      },

      getStorageBackends: () => get().plugins.filter((p) => p.category === "storage"),
      getPluginsByCategory: (category) => get().plugins.filter((p) => p.category === category),
      getActivePlugins: () => get().plugins.filter((p) => p.enabled && p.status === "active"),
      getPlugin: (id) => get().plugins.find((p) => p.id === id),

      getStats: () => {
        const plugins = get().plugins;
        const parseSize = (s: string) => {
          const num = parseFloat(s);
          return s.includes("MB") ? num * 1024 : num;
        };
        const totalKB = plugins.reduce((sum, p) => sum + parseSize(p.size), 0);
        return {
          total: plugins.length,
          active: plugins.filter((p) => p.enabled).length,
          storage: plugins.filter((p) => p.category === "storage").length,
          totalSize: totalKB >= 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${totalKB.toFixed(0)} KB`,
        };
      },
    }),
    {
      name: "yyc3-plugins",
      partialize: (state) => ({
        plugins: state.plugins,
      }),
    }
  )
);

/* ─── 全局注册函数 ─── */
export function registerPlugin(api: PluginAPI): void {
  usePluginStore.getState().registerPlugin(api);
}