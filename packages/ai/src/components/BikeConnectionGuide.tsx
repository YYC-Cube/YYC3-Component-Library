import { motion } from 'motion/react';
import { 
  Smartphone, 
  Bluetooth, 
  Wifi, 
  Cable, 
  Settings, 
  CheckCircle,
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function BikeConnectionGuide() {
  const connectionMethods = [
    {
      name: 'OBD-II Port',
      description: 'Connect directly to your bike\'s diagnostic port',
      difficulty: 'Easy',
      cost: '$25-50',
      icon: <Cable className="w-5 h-5" />,
      steps: [
        'Purchase OBD-II to Bluetooth/WiFi adapter',
        'Locate OBD-II port on your bike (usually near dashboard)',
        'Plug in adapter and pair with INFY app',
        'Start receiving real-time data'
      ]
    },
    {
      name: 'CAN Bus Integration',
      description: 'Tap into your bike\'s CAN bus for advanced telemetry',
      difficulty: 'Advanced',
      cost: '$100-200',
      icon: <Settings className="w-5 h-5" />,
      steps: [
        'Install CAN bus interface module',
        'Connect to bike\'s CAN high/low wires',
        'Configure message IDs and data parsing',
        'Calibrate sensors and test connections'
      ]
    },
    {
      name: 'Aftermarket Sensors',
      description: 'Add custom sensors for additional metrics',
      difficulty: 'Medium',
      cost: '$50-150',
      icon: <Smartphone className="w-5 h-5" />,
      steps: [
        'Install speed, temperature, and fuel sensors',
        'Mount GPS module and accelerometer',
        'Connect to microcontroller (Arduino/Raspberry Pi)',
        'Setup wireless data transmission to INFY'
      ]
    }
  ];

  const compatibleBikes = [
    'Honda CBR Series',
    'Yamaha R Series',
    'Kawasaki Ninja Series',
    'Suzuki GSX-R Series',
    'BMW S/R Series',
    'Ducati Panigale Series',
    'Most bikes with OBD-II (2008+)'
  ];

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bluetooth className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">Connect Your Bike</h3>
        </div>

        {/* Connection Methods */}
        <div className="space-y-4 mb-6">
          {connectionMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-blue-400 mt-1">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{method.name}</h4>
                    <Badge 
                      className={`text-xs ${
                        method.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        method.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}
                    >
                      {method.difficulty}
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                      {method.cost}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{method.description}</p>
                  
                  <div className="space-y-1">
                    {method.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-2 text-xs text-gray-500">
                        <span className="text-blue-400 mt-0.5">{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Compatible Bikes */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Compatible Bikes:</h4>
          <div className="grid grid-cols-2 gap-2">
            {compatibleBikes.map((bike, index) => (
              <div
                key={bike}
                className="flex items-center gap-2 p-2 rounded bg-gray-800/20 border border-gray-700/30"
              >
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-400">{bike}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 mb-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-xs text-yellow-300">
              <div className="font-medium mb-1">Important:</div>
              <div className="text-yellow-400/90">
                Modifying your bike's electrical system may void warranty. 
                Consult with a professional mechanic before installation.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30">
            <ExternalLink className="w-4 h-4 mr-2" />
            Hardware Guide
          </Button>
          <Button 
            variant="outline"
            className="bg-gray-800/30 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Setup Wizard
          </Button>
        </div>
      </div>
    </Card>
  );
}