---
'@yyc3/web-ui': minor
---

Phase 5a：@yyc3/web-ui 新包首发（第 16 包）——S3 迁入 personal 副本 web-ui（9 件/620 行）：YYC3Provider（**D2 解耦版**：HubLike 接口注入替代 @yyc3/core 单点依赖，支持纯 UI 模式与既有 hub 实例接入）/ useYYC3/useChat/useAgents（AI 家族八成员档案）/useSkills 四 hooks + ChatInterface/AgentSelector/SkillPanel/GlitchText 四组件。修复：JSX 命名空间×4（React 19 types）、createPortal 型全局引用、timerRef 初始化。7 用例全绿（Provider 三态/chat 双消息/八成员/技能/glitch）。**D2 裁决：core（2,704 行）暂不迁入**——仅 provider 单点消费，解耦成本最低；core 全量迁入推迟至多包真实需求。5b 待入：NeonCard（178）+ useAI（226）。
