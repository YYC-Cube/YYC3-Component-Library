import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from './ui/card';
import { TrendingUp } from 'lucide-react';

export function DataVisualization() {
  const [data, setData] = useState([
    { time: '00:00', performance: 45, neural: 30, efficiency: 65 },
    { time: '04:00', performance: 52, neural: 45, efficiency: 72 },
    { time: '08:00', performance: 78, neural: 67, efficiency: 85 },
    { time: '12:00', performance: 85, neural: 82, efficiency: 90 },
    { time: '16:00', performance: 92, neural: 88, efficiency: 95 },
    { time: '20:00', performance: 89, neural: 85, efficiency: 92 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          performance: Math.floor(Math.random() * 40) + 60,
          neural: Math.floor(Math.random() * 40) + 50,
          efficiency: Math.floor(Math.random() * 30) + 70,
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">Performance Analytics</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="performance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="neural" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="efficiency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="performance"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#performance)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="neural"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#neural)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#F59E0B"
                fillOpacity={1}
                fill="url(#efficiency)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-400">Performance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-400">Neural Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-400">Efficiency</span>
          </div>
        </div>
      </div>
    </Card>
  );
}