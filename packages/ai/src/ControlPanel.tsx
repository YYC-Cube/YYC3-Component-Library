import { useState } from 'react';
import { motion } from 'motion/react';
import { Power, Shield, Settings, Scan, PlayCircle, PauseCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

export function ControlPanel() {
  const [systemPower, setSystemPower] = useState(true);
  const [securityMode, setSecurityMode] = useState(true);
  const [scanActive, setScanActive] = useState(false);
  const [autoMode, setAutoMode] = useState(true);

  const handleScan = () => {
    setScanActive(true);
    setTimeout(() => setScanActive(false), 3000);
  };

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">Control Panel</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-3">
              <Power className={`w-5 h-5 ${systemPower ? 'text-green-400' : 'text-gray-500'}`} />
              <span className="text-gray-300">System Power</span>
            </div>
            <Switch 
              checked={systemPower} 
              onCheckedChange={setSystemPower}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${securityMode ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="text-gray-300">Security Mode</span>
            </div>
            <Switch 
              checked={securityMode} 
              onCheckedChange={setSecurityMode}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
            <div className="flex items-center gap-3">
              <PlayCircle className={`w-5 h-5 ${autoMode ? 'text-green-400' : 'text-gray-500'}`} />
              <span className="text-gray-300">Auto Mode</span>
            </div>
            <Switch 
              checked={autoMode} 
              onCheckedChange={setAutoMode}
            />
          </div>

          <Button 
            onClick={handleScan}
            disabled={scanActive}
            className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
          >
            <motion.div
              animate={scanActive ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: scanActive ? Infinity : 0, ease: "linear" }}
            >
              <Scan className="w-4 h-4 mr-2" />
            </motion.div>
            {scanActive ? 'Scanning...' : 'Initialize Scan'}
          </Button>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button 
              variant="outline" 
              className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
            >
              Diagnostics
            </Button>
            <Button 
              variant="outline" 
              className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
            >
              Calibrate
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}