// ============================================================
// YYC³ · @yyc3/education autonomous-engine 真身（真身专项 · 2026-11-07）
// 源（D0 权威副本 UI-9）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/yyc3-learning-platform/packages/autonomous-engine/src/index.ts（逐字迁移，仅删 AutonomousAIEngine 两行导出：该文件牵出 core-engine/five-dimensional-management 逃逸链，不在本批闭包，随后续批次迁入）
// ============================================================
/**
 * YYC³ 自治AI引擎 - 入口文件
 * 基于五高五标五化设计原则的企业级自治AI系统核心实现
 */

export { AgenticCore } from './core/AgenticCore.js';
export type {
  IAutonomousAIEngine,
  EngineCapabilities,
  EngineMetrics,
  EngineConfiguration,
  Goal,
  Task,
  TaskResult,
  DecisionContext,
  DecisionOption,
  Decision,
  Experience,
  Strategy,
  EngineMessage,
  CollaborativeTask,
  CollaborativeResult,
  HealthStatus,
  DiagnosticInfo,
  ResourceRequirements,
  ResourceAllocation,
  DecisionEvaluation,
  LearningProgress
} from './IAutonomousAIEngine.js';

// 重新导出所有类型定义
export * from './IAutonomousAIEngine.js';
