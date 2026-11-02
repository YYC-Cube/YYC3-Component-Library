import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gauge, Thermometer, Fuel, Zap, MapPin, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface BikeData {
  speed: number;
  rpm: number;
  fuel: number;
  temperature: number;
  battery: number;
  odometer: number;
  tripDistance: number;
  avgSpeed: number;
}

export function BikeMetrics() {
  const [bikeData, setBikeData] = useState<BikeData>({
    speed: 0,
    rpm: 0,
    fuel: 85,
    temperature: 78,
    battery: 92,
    odometer: 12847,
    tripDistance: 23.4,
    avgSpeed: 45
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBikeData(prev => ({
        ...prev,
        speed: Math.max(0, Math.min(200, prev.speed + (Math.random() - 0.5) * 20)),
        rpm: Math.max(0, Math.min(8000, Math.random() * 6000 + 1000)),
        fuel: Math.max(0, prev.fuel - (Math.random() * 0.1)),
        temperature: Math.max(60, Math.min(120, prev.temperature + (Math.random() - 0.5) * 5)),
        battery: Math.max(0, Math.min(100, prev.battery - (Math.random() * 0.05))),
        tripDistance: prev.tripDistance + (prev.speed * 0.0001),
        avgSpeed: Math.max(0, prev.avgSpeed + (Math.random() - 0.5) * 2)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getSpeedColor = (speed: number) => {
    if (speed < 40) return 'text-green-400';
    if (speed < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRpmColor = (rpm: number) => {
    if (rpm < 3000) return 'text-green-400';
    if (rpm < 6000) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gauge className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">Bike Telemetry</h3>
          <motion.div
            className="ml-auto w-2 h-2 bg-green-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Speed */}
          <div className="text-center">
            <motion.div 
              className={`text-4xl font-mono mb-2 ${getSpeedColor(bikeData.speed)}`}
              key={Math.floor(bikeData.speed)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Math.floor(bikeData.speed)}
            </motion.div>
            <div className="text-sm text-gray-400">km/h</div>
            <div className="text-xs text-gray-500 mt-1">Speed</div>
          </div>

          {/* RPM */}
          <div className="text-center">
            <motion.div 
              className={`text-4xl font-mono mb-2 ${getRpmColor(bikeData.rpm)}`}
              key={Math.floor(bikeData.rpm / 100)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {Math.floor(bikeData.rpm)}
            </motion.div>
            <div className="text-sm text-gray-400">RPM</div>
            <div className="text-xs text-gray-500 mt-1">Engine</div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Fuel */}
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Fuel</span>
            </div>
            <div className="text-lg font-mono text-white mb-1">
              {bikeData.fuel.toFixed(1)}%
            </div>
            <Progress 
              value={bikeData.fuel} 
              className="h-2"
            />
          </div>

          {/* Temperature */}
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-gray-300">Engine Temp</span>
            </div>
            <div className="text-lg font-mono text-white mb-1">
              {Math.floor(bikeData.temperature)}°C
            </div>
            <Progress 
              value={(bikeData.temperature - 60) / 60 * 100} 
              className="h-2"
            />
          </div>

          {/* Battery */}
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Battery</span>
            </div>
            <div className="text-lg font-mono text-white mb-1">
              {bikeData.battery.toFixed(1)}%
            </div>
            <Progress 
              value={bikeData.battery} 
              className="h-2"
            />
          </div>

          {/* Trip Info */}
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">Trip</span>
            </div>
            <div className="text-lg font-mono text-white mb-1">
              {bikeData.tripDistance.toFixed(1)} km
            </div>
            <div className="text-xs text-gray-500">
              Avg: {Math.floor(bikeData.avgSpeed)} km/h
            </div>
          </div>
        </div>

        {/* Odometer */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300">Total Odometer</span>
          </div>
          <div className="text-lg font-mono text-blue-200">
            {bikeData.odometer.toLocaleString()} km
          </div>
        </div>
      </div>
    </Card>
  );
}