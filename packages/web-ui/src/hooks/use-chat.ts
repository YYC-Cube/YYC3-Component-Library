// ============================================================
// YYC³ · @yyc3/web-ui useChat（Phase 5 · S3 迁入）
// 源：personal 副本 web-ui/src/hooks/use-chat.ts
// ============================================================
import { useState, useCallback } from 'react';
import { useYYC3Context } from '../provider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function useChat() {
  const { hub } = useYYC3Context();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!hub) return;

      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        if (!hub.chat) return;
        const result = await hub.chat(content);
        const assistantMessage: ChatMessage = {
          id: 'msg-' + Date.now() + '-response',
          role: 'assistant',
          content: result.success && result.data ? result.data.content : 'Error',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [hub]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, sendMessage, clearMessages };
}
