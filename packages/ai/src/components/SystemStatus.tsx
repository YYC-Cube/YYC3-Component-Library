import { motion } from 'motion/react';
import { Activity, Cpu, HardDrive, Wifi, Zap } from 'lucide-react';
import { Card } from './ui/card';

interface SystemMetric {
  label: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
  icon: React.ReactNode;
}

export function SystemStatus() {
  const metrics: SystemMetric[] = [
    {
      label: 'CPU Usage',
      value: 23,
      status: 'optimal',
      icon: <Cpu className="w-5 h-5" />
    },
    {
      label: 'Memory',
      value: 67,
      status: 'warning',
      icon: <HardDrive className="w-5 h-5" />
    },
    {
      label: 'Network',
      value: 94,
      status: 'optimal',
      icon: <Wifi className="w-5 h-5" />
    },
    {
      label: 'Power',
      value: 88,
      status: 'optimal',
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'warning': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'critical': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">System Status</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="text-sm text-gray-300">{metric.label}</span>
                </div>
                <span className="text-sm font-mono">{metric.value}%</span>
              </div>
              
              <div className="w-full bg-gray-800/50 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    metric.status === 'optimal' ? 'bg-green-400' :
                    metric.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}