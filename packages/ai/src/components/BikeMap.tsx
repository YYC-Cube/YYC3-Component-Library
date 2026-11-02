import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Route, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: Date;
  speed: number;
}

export function BikeMap() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 28.6139,
    lng: 77.2090,
    address: "Connaught Place, New Delhi"
  });

  const [isTracking, setIsTracking] = useState(true);
  const [routeDistance, setRouteDistance] = useState(23.4);
  const [estimatedTime, setEstimatedTime] = useState(32);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isTracking) {
        setCurrentLocation(prev => ({
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
        setRouteDistance(prev => prev + Math.random() * 0.1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isTracking]);

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            <h3 className="text-blue-300">Location & Route</h3>
          </div>
          
          <motion.div
            className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-400' : 'bg-gray-500'}`}
            animate={isTracking ? { opacity: [0.3, 1, 0.3] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Map Placeholder */}
        <div className="relative h-32 mb-4 rounded-lg bg-gray-800/50 border border-gray-700/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          
          {/* Simulated Route Line */}
          <svg className="absolute inset-0 w-full h-full">
            <motion.path
              d="M 20 80 Q 80 20 160 60 T 280 80"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>

          {/* Current Position */}
          <motion.div
            className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
            style={{ left: '70%', top: '60%' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Route Markers */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-400 rounded-full" />
        </div>

        {/* Location Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Current Location:</span>
          </div>
          <div className="text-sm text-blue-300 ml-6">
            {currentLocation.address}
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Route className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Distance</span>
            </div>
            <div className="text-lg font-mono text-white">
              {routeDistance.toFixed(1)} km
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">ETA</span>
            </div>
            <div className="text-lg font-mono text-white">
              {estimatedTime} min
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsTracking(!isTracking)}
            className={`flex-1 ${
              isTracking 
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30'
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
            } border`}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
          
          <Button
            variant="outline"
            className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>

        {/* Connection Info */}
        <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="text-xs text-purple-300 mb-1">
            📍 GPS Module Status
          </div>
          <div className="text-xs text-gray-400">
            Satellites: 12 connected • Accuracy: ±3m • Update rate: 1Hz
          </div>
        </div>
      </div>
    </Card>
  );
}