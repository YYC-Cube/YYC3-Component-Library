import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Wrench, 
  Shield, 
  Car,
  Navigation,
  Bluetooth,
  Wifi
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface BikeSystem {
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  value?: string;
  icon: React.ReactNode;
}

export function BikeStatus() {
  const [systems, setSystems] = useState<BikeSystem[]>([
    {
      name: 'Engine',
      status: 'healthy',
      value: 'Normal',
      icon: <Car className="w-4 h-4" />
    },
    {
      name: 'Brakes',
      status: 'healthy',
      value: '98%',
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: 'GPS',
      status: 'healthy',
      value: 'Connected',
      icon: <Navigation className="w-4 h-4" />
    },
    {
      name: 'Bluetooth',
      status: 'healthy',
      value: 'Paired',
      icon: <Bluetooth className="w-4 h-4" />
    },
    {
      name: 'Maintenance',
      status: 'warning',
      value: '2,847 km',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      name: 'Connectivity',
      status: 'healthy',
      value: '4G LTE',
      icon: <Wifi className="w-4 h-4" />
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prev => prev.map(system => {
        if (Math.random() < 0.1) { // 10% chance to change status
          const statuses: BikeSystem['status'][] = ['healthy', 'warning'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...system, status: randomStatus };
        }
        return system;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: BikeSystem['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'offline': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  const getStatusIcon = (status: BikeSystem['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-3 h-3" />;
      case 'warning': 
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const healthyCount = systems.filter(s => s.status === 'healthy').length;
  const warningCount = systems.filter(s => s.status === 'warning').length;
  const criticalCount = systems.filter(s => s.status === 'critical').length;

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300">Bike Systems</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {warningCount} Warning
              </Badge>
            )}
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {healthyCount} Healthy
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {systems.map((system, index) => (
            <motion.div
              key={system.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(system.status)}`}
            >
              <div className="flex items-center gap-3">
                <div className={`${getStatusColor(system.status).split(' ')[0]}`}>
                  {system.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200">
                    {system.name}
                  </div>
                  {system.value && (
                    <div className="text-xs text-gray-400">
                      {system.value}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`${getStatusColor(system.status).split(' ')[0]}`}>
                  {getStatusIcon(system.status)}
                </div>
                <span className={`text-xs uppercase font-medium ${getStatusColor(system.status).split(' ')[0]}`}>
                  {system.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection Instructions */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-sm text-blue-300 mb-2">
            🔧 Hardware Connection Required
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Connect OBD-II adapter to bike's diagnostic port</div>
            <div>• Pair Bluetooth/WiFi module with INFY system</div>
            <div>• Install sensor modules for advanced metrics</div>
            <div>• Configure CAN bus integration for real-time data</div>
          </div>
        </div>
      </div>
    </Card>
  );
}