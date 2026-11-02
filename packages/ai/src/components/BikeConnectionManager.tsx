import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bluetooth, 
  Usb, 
  Wifi, 
  Search, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  AlertCircle,
  Car
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BikeDevice {
  id: string;
  name: string;
  type: 'bluetooth' | 'usb' | 'wifi';
  signal: number;
  status: 'available' | 'connecting' | 'connected' | 'error';
  lastSeen?: Date;
}

interface BikeConnectionManagerProps {
  onConnectionChange: (connected: boolean, device?: BikeDevice) => void;
}

export function BikeConnectionManager({ onConnectionChange }: BikeConnectionManagerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BikeDevice[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<BikeDevice | null>(null);
  const [connectionProgress, setConnectionProgress] = useState(0);

  // Simulate available devices
  const simulatedDevices: BikeDevice[] = [
    {
      id: 'bt-001',
      name: 'Honda CBR 600RR',
      type: 'bluetooth',
      signal: 85,
      status: 'available',
      lastSeen: new Date()
    },
    {
      id: 'usb-001',
      name: 'OBD-II Adapter',
      type: 'usb',
      signal: 100,
      status: 'available',
      lastSeen: new Date()
    },
    {
      id: 'wifi-001',
      name: 'Yamaha R1 WiFi',
      type: 'wifi',
      signal: 72,
      status: 'available',
      lastSeen: new Date()
    },
    {
      id: 'bt-002',
      name: 'Kawasaki Ninja 650',
      type: 'bluetooth',
      signal: 65,
      status: 'available',
      lastSeen: new Date()
    }
  ];

  const startScanning = () => {
    setIsScanning(true);
    setDevices([]);
    
    // Simulate device discovery
    setTimeout(() => {
      setDevices(simulatedDevices);
      setIsScanning(false);
    }, 3000);
  };

  const connectToDevice = async (device: BikeDevice) => {
    setDevices(prev => prev.map(d => 
      d.id === device.id ? { ...d, status: 'connecting' } : d
    ));
    
    setConnectionProgress(0);
    
    // Simulate connection process
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    setTimeout(() => {
      clearInterval(progressInterval);
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        const connectedDev = { ...device, status: 'connected' as const };
        setConnectedDevice(connectedDev);
        setDevices(prev => prev.map(d => 
          d.id === device.id ? connectedDev : d
        ));
        onConnectionChange(true, connectedDev);
      } else {
        setDevices(prev => prev.map(d => 
          d.id === device.id ? { ...d, status: 'error' } : d
        ));
        setTimeout(() => {
          setDevices(prev => prev.map(d => 
            d.id === device.id ? { ...d, status: 'available' } : d
          ));
        }, 3000);
      }
      setConnectionProgress(0);
    }, 2000);
  };

  const disconnectDevice = () => {
    if (connectedDevice) {
      setConnectedDevice(null);
      setDevices(prev => prev.map(d => 
        d.id === connectedDevice.id ? { ...d, status: 'available' } : d
      ));
      onConnectionChange(false);
    }
  };

  const getDeviceIcon = (type: BikeDevice['type']) => {
    switch (type) {
      case 'bluetooth': return <Bluetooth className="w-5 h-5" />;
      case 'usb': return <Usb className="w-5 h-5" />;
      case 'wifi': return <Wifi className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: BikeDevice['status']) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'connecting': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    }
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300">Bike Connection</h3>
          </div>
          
          {connectedDevice && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Connected
            </Badge>
          )}
        </div>

        {connectedDevice ? (
          /* Connected State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-green-400">
                  {getDeviceIcon(connectedDevice.type)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{connectedDevice.name}</div>
                  <div className="text-sm text-green-400">Connected via {connectedDevice.type.toUpperCase()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-400">Signal: {connectedDevice.signal}%</div>
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full mt-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={disconnectDevice}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </motion.div>
        ) : (
          /* Disconnected State */
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                onClick={startScanning}
                disabled={isScanning}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
              >
                <motion.div
                  animate={isScanning ? { rotate: 360 } : {}}
                  transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
                >
                  <Search className="w-4 h-4 mr-2" />
                </motion.div>
                {isScanning ? 'Scanning...' : 'Scan for Bikes'}
              </Button>
              
              {devices.length > 0 && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {devices.length} found
                </Badge>
              )}
            </div>

            <AnimatePresence>
              {devices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getStatusColor(device.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`${getStatusColor(device.status).split(' ')[0]}`}>
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{device.name}</div>
                        <div className="text-sm text-gray-400">
                          {device.type.toUpperCase()} • Signal: {device.signal}%
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => connectToDevice(device)}
                      disabled={device.status === 'connecting'}
                      size="sm"
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    >
                      {device.status === 'connecting' ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : device.status === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  </div>

                  {device.status === 'connecting' && connectionProgress > 0 && (
                    <div className="mt-2">
                      <Progress value={connectionProgress} className="h-1" />
                      <div className="text-xs text-gray-400 mt-1">
                        Connecting... {connectionProgress}%
                      </div>
                    </div>
                  )}

                  {device.status === 'error' && (
                    <div className="mt-2 text-xs text-red-400">
                      Connection failed. Please try again.
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {!isScanning && devices.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No bikes found</p>
                <p className="text-sm">Make sure your bike's Bluetooth/WiFi is enabled</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}