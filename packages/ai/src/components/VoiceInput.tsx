import { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onVoiceInput, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceToggle = () => {
    if (disabled) return;
    
    setIsListening(!isListening);
    
    // Simulate voice input after 2 seconds
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        const sampleInputs = [
          "What's the weather like today?",
          "Tell me about artificial intelligence",
          "How can I improve my productivity?",
          "What are the latest tech trends?",
          "Help me plan my schedule"
        ];
        const randomInput = sampleInputs[Math.floor(Math.random() * sampleInputs.length)];
        onVoiceInput(randomInput);
      }, 2000);
    }
  };

  return (
    <motion.button
      onClick={handleVoiceToggle}
      disabled={disabled}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        isListening 
          ? 'bg-red-500/20 border-red-500/50 text-red-400' 
          : disabled
          ? 'bg-gray-700/30 border-gray-600/30 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
      } border backdrop-blur-sm`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </>
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </motion.button>
  );
}