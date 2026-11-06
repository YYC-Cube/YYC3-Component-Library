---
'@yyc3/lib': minor
---

Phase 7 lib services 批次：services 轻量桩层 4 件（接口正确+浏览器降级+模拟响应）——chart-voice-control（含 createController/activate/deactivate/getStatus）、mobile-service（useDeviceDetection 含 deviceType/orientation、useGestures ref 签名、useTouchDetection）、visualization-service（DataSeries/ChartOptions 含 animation/responsive、ChartAnnotation）、ai-platform 合集（SpeechRecognitionResult 含 isFinal、RecognitionService/SynthesisService 全 API、Ollama 全家桶含 streamText/selectedModel、NLP/voiceCommandEngine）。解锁 cloud 域摘除件：InteractiveChart/MobileChart/VoiceControlPanel/EnhancedVoiceControl/ModelSelector/ChatInterface 恢复导出（ConversationInterface 因完整 AI 助手服务面未桩化维持摘除登记）。测试 cloud+lib 64 全绿。源用法反推（D0 消费方签名）。
