import { useState, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

interface TypingMessageProps {
  message: string;
  onComplete: () => void;
}

export function TypingMessage({ message, onComplete }: TypingMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (message.length === 0) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedMessage(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [message, onComplete]);

  if (!isComplete && displayedMessage === '') {
    return <ChatMessage message="" isUser={false} isTyping={true} />;
  }

  return <ChatMessage message={displayedMessage} isUser={false} />;
}