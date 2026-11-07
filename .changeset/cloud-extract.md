---
'@yyc3/cloud': minor
---

Phase 7 精度抽取第二批：cloud 域 21 组件恢复有效导出（占位桶→根 14 件 + ecommerce 3 + native 1 + 类型/配置全量）。断链修复：@/types + @/config/{chart-themes,colors} 本地补建、@yyc3/lib/utils→@yyc3/ui-enterprise（cn）、@yyc3/lib 依赖补声明（workspace）。**native-device-service 浏览器原生实现补建**（camera getUserMedia/geolocation watch+clear/motion+orientation 传感器含 iOS requestPermission/detectShake/deviceInfo 全量含 connection）。摘除登记（lib services 批次遗留）：InteractiveChart/MobileChart（chart-voice-control/mobile-service/visualization-service）/VoiceControlPanel/EnhancedVoiceControl（speech-service）/ModelSelector/ChatInterface/ConversationInterface（ollama-context/ai-assistant-context）。测试 1→3 全绿。@yyc3/ui-enterprise 增补 YYCard 系薄封装（cloud ecommerce 消费）。源：主库 YYC-cloud-platform 权威副本（D0）。
