import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Database, Users, Globe, Zap, Clock, Server } from 'lucide-react';
import { Card } from './ui/card';

interface Metric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

export function MetricsGrid() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Bike Status',
      value: 'Online',
      change: '+100%',
      trend: 'up',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Data Synced',
      value: '1.2GB',
      change: '+8.3%',
      trend: 'up',
      icon: <Database className="w-5 h-5" />
    },
    {
      label: 'Trip Count',
      value: '127',
      change: '+5.1%',
      trend: 'up',
      icon: <Globe className="w-5 h-5" />
    },
    {
      label: 'Connection',
      value: '99.9%',
      change: '0.0%',
      trend: 'stable',
      icon: <Clock className="w-5 h-5" />
    },
    {
      label: 'Sensor Lag',
      value: '0.23ms',
      change: '-2.1%',
      trend: 'down',
      icon: <Zap className="w-5 h-5" />
    },
    {
      label: 'Engine Load',
      value: '23%',
      change: '-15.3%',
      trend: 'down',
      icon: <Server className="w-5 h-5" />
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.label === 'Response Time' 
          ? `0.${Math.floor(Math.random() * 50) + 20}ms`
          : metric.label === 'Server Load'
          ? `${Math.floor(Math.random() * 40) + 20}%`
          : metric.value
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-400">
                  {metric.icon}
                </div>
                <span className={`text-xs ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </span>
              </div>
              
              <div className="space-y-1">
                <motion.div 
                  className="text-xl font-mono text-white"
                  key={metric.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>

              <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 100}%` }}
                  transition={{ duration: 2, delay: index * 0.2 }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}