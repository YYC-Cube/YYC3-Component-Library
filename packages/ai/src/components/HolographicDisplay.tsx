import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Eye } from 'lucide-react';

export function HolographicDisplay() {
  const rings = Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    scale: 1 + i * 0.3,
  }));

  return (
    <Card className="bg-gray-900/40 border-blue-500/20 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-400" />
          <h3 className="text-blue-300">Neural Interface</h3>
        </div>

        <div className="relative h-48 flex items-center justify-center">
          {/* Central Core */}
          <motion.div
            className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Rotating Rings */}
          {rings.map((ring) => (
            <motion.div
              key={ring.id}
              className="absolute border-2 border-blue-400/30 rounded-full"
              style={{
                width: `${40 + ring.id * 30}px`,
                height: `${40 + ring.id * 30}px`,
              }}
              animate={{
                rotate: 360,
                scale: [ring.scale, ring.scale + 0.1, ring.scale],
              }}
              transition={{
                rotate: {
                  duration: 10 + ring.id * 2,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  delay: ring.delay,
                },
              }}
            />
          ))}

          {/* Floating Particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 30 * Math.PI / 180) * 80],
                y: [0, Math.sin(i * 30 * Math.PI / 180) * 80],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Data Streams */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                style={{ top: `${30 + i * 30}%` }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-4">
          <motion.div
            className="text-sm text-blue-400 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            NEURAL PROCESSING ACTIVE
          </motion.div>
        </div>
      </div>
    </Card>
  );
}