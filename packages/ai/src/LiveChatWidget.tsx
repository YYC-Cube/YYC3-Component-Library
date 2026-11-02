"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, X, Send, Paperclip, Smile, MoreHorizontal,
  Phone, Video, Info, Minimize2, Maximize2, CheckCheck,
  Clock, AlertCircle, Star, Zap, Bot, User, Heart
} from "lucide-react";
import { useDarkMode } from "./DarkModeProvider";
import { useLanguage } from "./LanguageProvider";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'typing';
  senderName?: string;
  senderAvatar?: string;
}

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy';
  title: string;
  rating: number;
}

interface LiveChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'blue' | 'green' | 'purple';
  showRating?: boolean;
  showTypingIndicator?: boolean;
  enableFileUpload?: boolean;
  enableEmoji?: boolean;
}

export function LiveChatWidget({
  position = 'bottom-right',
  theme = 'blue',
  showRating = true,
  showTypingIndicator = true,
  enableFileUpload = true,
  enableEmoji = true
}: LiveChatWidgetProps) {
  const { isDark } = useDarkMode();
  const { t, language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
  const [chatStatus, setChatStatus] = useState<'connecting' | 'connected' | 'queue' | 'ended'>('connecting');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock agent data
  const mockAgent: Agent = {
    id: 'agent-1',
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    title: 'AI Consulting Specialist',
    rating: 4.9
  };

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setCurrentAgent(mockAgent);
        setChatStatus('connected');
        
        const welcomeMessage: Message = {
          id: '1',
          content: `Hi! I'm ${mockAgent.name}, your AI consulting specialist. How can I help you with your digital transformation today?`,
          sender: 'agent',
          timestamp: new Date(),
          status: 'read',
          type: 'text',
          senderName: mockAgent.name,
          senderAvatar: mockAgent.avatar
        };
        
        setMessages([welcomeMessage]);
      }, 1000);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate message being sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' as const }
            : msg
        )
      );
    }, 500);

    // Simulate agent typing
    if (showTypingIndicator) {
      setTimeout(() => {
        setIsTyping(true);
      }, 800);

      setTimeout(() => {
        setIsTyping(false);
        
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getAgentResponse(newMessage),
          sender: 'agent',
          timestamp: new Date(),
          status: 'read',
          type: 'text',
          senderName: currentAgent?.name,
          senderAvatar: currentAgent?.avatar
        };
        
        setMessages(prev => [...prev, agentResponse]);
      }, 2000);
    }

    setIsSending(false);
  };

  // Generate agent response (mock)
  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "I'd be happy to help you understand our pricing options. We have flexible plans starting from our Free tier up to Enterprise solutions. Would you like me to schedule a consultation to discuss your specific needs?";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('artificial intelligence')) {
      return "Great question about AI! We specialize in AI-native digital transformation. Our team can help you assess AI readiness, develop implementation strategies, and guide you through the entire transformation process. What specific AI challenges are you facing?";
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('consultation')) {
      return "I'd love to arrange a demo for you! Our consultations are completely free and tailored to your business needs. I can connect you with one of our senior consultants. When would be a good time for you?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! Thanks for reaching out. I'm here to help you with any questions about digital transformation, AI consulting, or our services. What would you like to know?";
    }
    
    return "That's a great question! Let me connect you with one of our specialists who can provide more detailed information. In the meantime, you can explore our comprehensive resources or schedule a free consultation. How else can I assist you today?";
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  // Theme colors
  const getThemeColors = () => {
    switch (theme) {
      case 'green':
        return {
          primary: 'bg-green-600 hover:bg-green-700',
          secondary: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400'
        };
      case 'purple':
        return {
          primary: 'bg-purple-600 hover:bg-purple-700',
          secondary: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-600 dark:text-purple-400'
        };
      default:
        return {
          primary: 'bg-blue-600 hover:bg-blue-700',
          secondary: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-600 dark:text-blue-400'
        };
    }
  };

  const themeColors = getThemeColors();

  // Common emojis
  const commonEmojis = ['😊', '👍', '🚀', '💡', '🔥', '⭐', '👏', '💯', '🎯', '✨'];

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`w-80 sm:w-96 bg-background border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden mb-4 ${
              isMinimized ? 'h-16' : 'h-[500px]'
            }`}
          >
            {/* Header */}
            <div className={`${themeColors.primary} text-white p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                {currentAgent && (
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentAgent.avatar} alt={currentAgent.name} />
                      <AvatarFallback className="bg-white/20 text-white text-sm">
                        {currentAgent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      currentAgent.status === 'online' ? 'bg-green-500' :
                      currentAgent.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">
                    {currentAgent ? currentAgent.name : 'Delibix Support'}
                  </h3>
                  <p className="text-xs text-white/80 truncate">
                    {chatStatus === 'connected' && currentAgent
                      ? `${currentAgent.title} • ${currentAgent.status}`
                      : chatStatus === 'connecting'
                      ? 'Connecting...'
                      : 'Support Team'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          {message.sender !== 'user' && (
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-xs">
                                  {message.sender === 'bot' ? <Bot className="w-3 h-3" /> : 
                                   message.senderName ? message.senderName[0] : 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {message.senderName || 'Agent'}
                              </span>
                            </div>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              message.sender === 'user'
                                ? `${themeColors.primary} text-white`
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-xs ${
                                message.sender === 'user' 
                                  ? 'text-white/70' 
                                  : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.sender === 'user' && (
                                <div className="flex items-center gap-1">
                                  {message.status === 'sending' && <Clock className="w-3 h-3 text-white/70" />}
                                  {message.status === 'sent' && <CheckCheck className="w-3 h-3 text-white/70" />}
                                  {message.status === 'delivered' && <CheckCheck className="w-3 h-3 text-white/70" />}
                                  {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-300" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={currentAgent?.avatar} alt={currentAgent?.name} />
                          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-xs">
                            {currentAgent?.name?.[0] || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2">
                          <div className="flex items-center gap-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">typing...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Emoji Picker */}
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="px-4 py-2 border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="grid grid-cols-10 gap-1">
                        {commonEmojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setNewMessage(prev => prev + emoji);
                              setShowEmoji(false);
                              inputRef.current?.focus();
                            }}
                            className="text-lg hover:bg-slate-100 dark:hover:bg-slate-800 rounded p-1 transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    {enableFileUpload && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="pr-10"
                        disabled={isSending}
                      />
                      {enableEmoji && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowEmoji(!showEmoji)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className={`h-8 w-8 p-0 ${themeColors.primary}`}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setUnreadCount(0);
              setIsMinimized(false);
            }
          }}
          className={`h-14 w-14 rounded-full ${themeColors.primary} text-white shadow-lg relative`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread Count */}
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}

          {/* Online Indicator */}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full h-4 w-4"
            />
          )}
        </Button>
      </motion.div>
    </div>
  );
}