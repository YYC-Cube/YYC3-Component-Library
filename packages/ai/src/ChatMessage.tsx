import { motion } from 'motion/react';
import { User, Cpu } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

export function ChatMessage({ message, isUser, isTyping = false }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <Cpu className="w-4 h-4 text-blue-400" />
        </div>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl backdrop-blur-sm ${
            isUser 
              ? 'bg-blue-500/20 border border-blue-500/30 text-blue-100' 
              : 'bg-gray-800/40 border border-gray-700/50 text-gray-200'
          }`}
        >
          {isTyping ? (
            <div className="flex items-center gap-1">
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <User className="w-4 h-4 text-blue-400" />
        </div>
      )}
    </motion.div>
  );
}