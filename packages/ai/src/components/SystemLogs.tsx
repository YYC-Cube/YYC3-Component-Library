import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
}

export function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '09:23:45',
      type: 'success',
      message: 'Neural network initialization complete'
    },
    {
      id: '2',
      timestamp: '09:24:12',
      type: 'info',
      message: 'Connecting to external data sources'
    },
    {
      id: '3',
      timestamp: '09:24:33',
      type: 'success',
      message: 'Security protocols activated'
    },
    {
      id: '4',
      timestamp: '09:25:01',
      type: 'warning',
      message: 'Memory usage approaching 70%'
    }
  ]);

  useEffect(() => {
    const messages = [
      'Processing incoming data stream',
      'Performance optimization complete',
      'Database synchronization successful',
      'Cache cleared and rebuilt',
      'System backup initiated',
      'Network latency optimized',
      'Security scan completed',
      'Memory defragmentation finished',
      'API responses calibrated',
      'User preferences updated'
    ];

    const types: LogEntry['type'][] = ['success', 'info', 'warning'];

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">System Logs</h3>
        </div>

        <ScrollArea className="h-64">
          <div className="space-y-2">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-start gap-3 p-2 rounded-lg bg-gray-800/20 border border-gray-700/30"
                >
                  {getLogIcon(log.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-mono">
                        {log.timestamp}
                      </span>
                      <span className={`text-xs uppercase font-medium ${getLogColor(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{log.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}