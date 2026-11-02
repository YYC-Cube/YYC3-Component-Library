/**
 * @file useFsWatch.ts
 * @description 文件系统监听 Hook — 监听目录/文件变更，自动刷新文件树
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-03-19
 * @updated 2026-03-19
 * @status dev
 * @license MIT
 * @copyright Copyright (c) 2026 YanYuCloudCube Team
 * @tags hook, fs, watch, notify, file-tree, auto-refresh
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { fsBridge, FileNode } from "../services/tauriBridgeService";

/* ─── 文件变更事件（对应 Rust FsChangeEvent） ─── */
export interface FsChangeEvent {
  changeType: "create" | "modify" | "remove" | "access" | "other" | "unknown";
  paths: string[];
  watchId: string;
  timestamp: number;
}

/* ─── Hook 配置 ─── */
export interface UseFsWatchOptions {
  /** 是否递归监听子目录（默认 true） */
  recursive?: boolean;
  /** 自动刷新文件列表（默认 true） */
  autoRefresh?: boolean;
  /** 刷新防抖延迟（默认 300ms） */
  debounceMs?: number;
  /** 变更回调 */
  onChange?: (event: FsChangeEvent) => void;
  /** 是否启用（默认 true） */
  enabled?: boolean;
}

/* ─── Hook 返回值 ─── */
export interface UseFsWatchResult {
  /** 当前目录下的文件列表（自动刷新） */
  files: FileNode[];
  /** 是否正在加载 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 监听 ID */
  watchId: string | null;
  /** 是否正在监听 */
  isWatching: boolean;
  /** 最后一次变更事件 */
  lastEvent: FsChangeEvent | null;
  /** 手动刷新 */
  refresh: () => Promise<void>;
  /** 手动开始监听 */
  startWatch: () => Promise<void>;
  /** 手动停止监听 */
  stopWatch: () => Promise<void>;
}

/**
 * useFsWatch — 文件系统监听 + 自动刷新 Hook
 *
 * @example
 * ```tsx
 * const { files, isWatching, lastEvent, refresh } = useFsWatch("/Users/yyc3/project/src");
 * ```
 */
export function useFsWatch(
  path: string | null,
  options: UseFsWatchOptions = {}
): UseFsWatchResult {
  const {
    recursive = true,
    autoRefresh = true,
    debounceMs = 300,
    onChange,
    enabled = true,
  } = options;

  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [lastEvent, setLastEvent] = useState<FsChangeEvent | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const watchIdRef = useRef<string | null>(null);
  const pathRef = useRef(path);
  pathRef.current = path;

  /* ─── 刷新文件列表 ─── */
  const refresh = useCallback(async () => {
    if (!pathRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const nodes = await fsBridge.listDir(pathRef.current);
      setFiles(nodes);
    } catch (e: any) {
      setError(e?.message || "文件列表加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ─── 防抖刷新 ─── */
  const debouncedRefresh = useCallback(() => {
    if (!autoRefresh) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(refresh, debounceMs);
  }, [autoRefresh, debounceMs, refresh]);

  /* ─── 启动监听 ─── */
  const startWatch = useCallback(async () => {
    if (!path || !enabled) return;

    // 先停止旧监听
    if (watchIdRef.current) {
      try {
        await fsBridge.watchStop(watchIdRef.current);
      } catch {
        // ignore
      }
    }

    try {
      const id = await fsBridge.watchStart(path);
      watchIdRef.current = id;
      setWatchId(id);
      setIsWatching(true);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "启动文件监听失败");
      setIsWatching(false);
    }
  }, [path, enabled]);

  /* ─── 停止监听 ─── */
  const stopWatch = useCallback(async () => {
    if (!watchIdRef.current) return;
    try {
      await fsBridge.watchStop(watchIdRef.current);
    } catch {
      // ignore
    }
    watchIdRef.current = null;
    setWatchId(null);
    setIsWatching(false);
  }, []);

  /* ─── 监听 Tauri 事件 ─── */
  useEffect(() => {
    if (!enabled || !path) return;

    let unlisten: (() => void) | null = null;

    const setupListener = async () => {
      try {
        // 尝试使用 Tauri 事件监听（通过全局 __TAURI__ 对象，避免动态导入不存在的模块）
        const tauriEvents = (window as any).__TAURI__?.event;
        if (tauriEvents?.listen) {
          const unlistenFn = await tauriEvents.listen("fs:change", (event: { payload: FsChangeEvent }) => {
            const fsEvent = event.payload;

            // 仅处理属于当前 watchId 的事件
            if (watchIdRef.current && fsEvent.watchId === watchIdRef.current) {
              setLastEvent(fsEvent);
              onChange?.(fsEvent);
              debouncedRefresh();
            }
          });
          unlisten = unlistenFn;
        } else {
          // 非 Tauri 环境：使用轮询模拟
          const pollInterval = setInterval(refresh, 5000);
          unlisten = () => clearInterval(pollInterval);
        }
      } catch {
        // 回退轮询
        const pollInterval = setInterval(refresh, 5000);
        unlisten = () => clearInterval(pollInterval);
      }
    };

    setupListener();

    return () => {
      unlisten?.();
      clearTimeout(debounceRef.current);
    };
  }, [enabled, path, onChange, debouncedRefresh, refresh]);

  /* ─── path 变更时重启监听 + 初始加载 ─── */
  useEffect(() => {
    if (!path || !enabled) {
      stopWatch();
      setFiles([]);
      return;
    }

    // 初始加载文件列表
    refresh();
    // 启动文件监听
    startWatch();

    return () => {
      stopWatch();
    };
  }, [path, enabled]);

  return {
    files,
    loading,
    error,
    watchId,
    isWatching,
    lastEvent,
    refresh,
    startWatch,
    stopWatch,
  };
}