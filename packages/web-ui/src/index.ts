// ============================================================
// YYC³ · @yyc3/web-ui 桶文件（Phase 5 · 5b 全量闭环 2026-11-04）
// 源（S3·D0）：personal 副本 YYC3-UI-用户界面/web-ui/src/（15 文件全量）
// D2 裁决：@yyc3/core（2,704 行）暂不迁入——仅 provider 单点消费，
//          已以 HubLike 接口注入解耦；core 全量迁入推迟至多包真实需求
// ============================================================

// Provider（D2 解耦版）
export { YYC3Provider, useYYC3Context } from './provider';
export type { YYC3ProviderProps, HubLike, HubConfig } from './provider';

// Hooks
export { useYYC3 } from './hooks/use-yyc3';
export { useChat, type ChatMessage } from './hooks/use-chat';
export { useAgents, type Agent } from './hooks/use-agents';
export { useSkills, type Skill } from './hooks/use-skills';
export {
  useAI,
  type AIProvider,
  type AIConfig,
  type AIMessage,
  type AIStreamCallback,
  type UseAIReturn,
} from './hooks/useAI';

// Components
export { ChatInterface } from './components/chat-interface';
export { AgentSelector } from './components/agent-selector';
export { SkillPanel } from './components/skill-panel';
export { GlitchText } from './components/glitch-text';
export type { GlitchTextProps } from './components/glitch-text';
export { NeonCard } from './components/neon-card';
export type { NeonCardProps, NeonCardThemeMode } from './components/neon-card';
