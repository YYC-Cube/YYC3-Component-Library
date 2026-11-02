import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Phone, 
  User,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Input } from './ui/input';

interface Message {
  id: string;
  contactId: string;
  contactName: string;
  content: string;
  timestamp: Date;
  isIncoming: boolean;
  isRead: boolean;
  isVoiceMessage?: boolean;
}

interface Contact {
  id: string;
  name: string;
  number: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export function BikeMessaging() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      contactId: '1',
      contactName: 'Mom',
      content: 'Drive safely! Call me when you reach.',
      timestamp: new Date(Date.now() - 300000),
      isIncoming: true,
      isRead: false
    },
    {
      id: '2',
      contactId: '2',
      contactName: 'John',
      content: 'Hey! Are you still coming to the meet?',
      timestamp: new Date(Date.now() - 180000),
      isIncoming: true,
      isRead: false
    },
    {
      id: '3',
      contactId: '3',
      contactName: 'Sarah',
      content: 'Thanks for the ride yesterday!',
      timestamp: new Date(Date.now() - 600000),
      isIncoming: true,
      isRead: true
    }
  ]);

  const [contacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', number: '+1234567890', isOnline: true },
    { id: '2', name: 'John', number: '+1234567891', isOnline: false, lastSeen: new Date(Date.now() - 900000) },
    { id: '3', name: 'Sarah', number: '+1234567892', isOnline: true },
    { id: '4', name: 'Dad', number: '+1234567893', isOnline: false, lastSeen: new Date(Date.now() - 1800000) }
  ]);

  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [voiceReply, setVoiceReply] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const unreadCount = messages.filter(m => !m.isRead && m.isIncoming).length;

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const quickReplies = [
    "I'm driving, will call you later",
    "On my way!",
    "Thanks!",
    "Will be there in 10 minutes",
    "Can't talk right now",
    "Emergency - call 911"
  ];

  const handleQuickReply = (contactId: string, reply: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      contactId,
      contactName: contact.name,
      content: reply,
      timestamp: new Date(),
      isIncoming: false,
      isRead: true
    };

    // Single state update to avoid multiple re-renders
    setMessages(prev => {
      const updatedMessages = prev.map(m => 
        m.contactId === contactId ? { ...m, isRead: true } : m
      );
      return [...updatedMessages, newMessage];
    });
  };

  const handleVoiceReply = (contactId: string) => {
    if (isRecording) return; // Prevent multiple simultaneous recordings
    
    setIsRecording(true);
    
    // Simulate voice recording
    const recordingTimeout = setTimeout(() => {
      setIsRecording(false);
      const voiceReplies = [
        "Hey, I'm on my bike right now, will call you when I reach home",
        "Thanks for the message, I'll get back to you soon",
        "I'm in traffic, can we talk later?",
        "Almost there, see you in 5 minutes"
      ];
      
      const randomReply = voiceReplies[Math.floor(Math.random() * voiceReplies.length)];
      setVoiceReply(randomReply);
      
      const replyTimeout = setTimeout(() => {
        handleQuickReply(contactId, `🎤 Voice message: "${randomReply}"`);
        setVoiceReply(null);
      }, 2000);
      
      return () => clearTimeout(replyTimeout);
    }, 3000);
    
    return () => clearTimeout(recordingTimeout);
  };

  const emergencyContacts = contacts.filter(c => ['Mom', 'Dad', 'Emergency'].includes(c.name));

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300">Messages</h3>
          </div>
          
          {unreadCount > 0 && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {unreadCount} unread
            </Badge>
          )}
        </div>

        {/* Voice Recording Status */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Mic className="w-4 h-4 text-red-400" />
                </motion.div>
                <span className="text-red-300">Recording voice message...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Reply Preview */}
        <AnimatePresence>
          {voiceReply && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20"
            >
              <div className="text-xs text-green-400 mb-1">Voice Message:</div>
              <div className="text-sm text-green-300">"{voiceReply}"</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Messages */}
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 5)
            .map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  message.isRead 
                    ? 'bg-gray-800/30 border-gray-700/50' 
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
                onClick={() => setSelectedContact(message.contactId)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 bg-blue-500/20">
                      <User className="w-4 h-4 text-blue-400" />
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {message.contactName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {getTimeAgo(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {!message.isRead && message.isIncoming && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  )}
                </div>
                
                <div className={`text-sm ${message.isRead ? 'text-gray-400' : 'text-gray-200'}`}>
                  {message.content}
                </div>

                {/* Quick Actions for Unread Messages */}
                {!message.isRead && message.isIncoming && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVoiceReply(message.contactId);
                      }}
                      size="sm"
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    >
                      <Mic className="w-3 h-3 mr-1" />
                      Voice
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickReply(message.contactId, "I'm driving, will call you later");
                      }}
                      size="sm"
                      variant="outline"
                      className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                    >
                      Auto Reply
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
        </div>

        {/* Quick Replies */}
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Quick Replies:</div>
          <div className="grid grid-cols-1 gap-1">
            {quickReplies.slice(0, 3).map((reply, index) => (
              <Button
                key={index}
                onClick={() => {
                  const lastMessage = messages
                    .filter(m => m.isIncoming && !m.isRead)
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                  
                  if (lastMessage) {
                    handleQuickReply(lastMessage.contactId, reply);
                  }
                }}
                variant="outline"
                size="sm"
                className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 text-xs text-left justify-start"
              >
                <Send className="w-3 h-3 mr-2" />
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Emergency Contacts</span>
          </div>
          <div className="flex gap-2">
            {emergencyContacts.map((contact) => (
              <Button
                key={contact.id}
                onClick={() => handleQuickReply(contact.id, "🚨 Emergency assistance needed")}
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
              >
                <Phone className="w-3 h-3 mr-1" />
                {contact.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-4 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
          💡 Use voice commands or quick replies for safe messaging while riding
        </div>
      </div>
    </Card>
  );
}