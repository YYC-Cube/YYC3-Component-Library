// ============================================================
// YYC³ · @yyc3/web-ui Provider（Phase 5 · S3 迁入 + D2 解耦）
// 源：personal 副本 YYC3-UI-用户界面/web-ui/src/provider.tsx
// D2 裁决（2026-11-04）：源依赖 @yyc3/core 的 YYC3Hub/HubConfig（core 真身
// 2,704 行，当前仅此单点消费）→ **接口注入解耦**：本地定义 HubLike 最小
// 接口，消费方传入任何结构兼容实例即可；core 全量迁入推迟至多包真实需求。
// ============================================================
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/** Hub 最小接口（结构兼容 @yyc3/core YYC3Hub） */
export interface HubLike {
  initialize: () => Promise<void> | void;
  /** 对话通道（useChat 消费） */
  chat: (content: string) => Promise<{ success: boolean; data?: { content: string } }>;
  [key: string]: unknown;
}

/** Hub 配置（源 HubConfig 的宽松映射） */
export type HubConfig = Record<string, unknown>;

export interface YYC3ProviderProps {
  children: ReactNode;
  config?: HubConfig;
  /** 注入既有 hub 实例（可选；不传则按 config 自建 HubLike） */
  createHub?: (config?: HubConfig) => HubLike;
}

interface YYC3ContextValue {
  hub: HubLike | null;
  initialized: boolean;
  error: Error | null;
}

const YYC3Context = createContext<YYC3ContextValue>({
  hub: null,
  initialized: false,
  error: null,
});

export function YYC3Provider({ children, config, createHub }: YYC3ProviderProps): React.JSX.Element {
  const [hub, setHub] = useState<HubLike | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!createHub) {
      // 未注入工厂时保持空 hub（纯 UI 模式）
      setInitialized(true);
      return;
    }
    const initHub = async () => {
      try {
        const newHub = createHub(config);
        await newHub.initialize();
        setHub(newHub);
        setInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize'));
      }
    };
    void initHub();
  }, [config, createHub]);

  return React.createElement(YYC3Context.Provider, { value: { hub, initialized, error } }, children);
}

export function useYYC3Context(): YYC3ContextValue {
  return useContext(YYC3Context);
}
