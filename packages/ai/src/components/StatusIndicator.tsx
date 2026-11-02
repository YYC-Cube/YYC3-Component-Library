import { motion } from 'motion/react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'connecting';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig = {
  online: { color: 'bg-green-400', shadow: 'shadow-green-400/50', label: 'Online' },
  offline: { color: 'bg-gray-400', shadow: 'shadow-gray-400/50', label: 'Offline' },
  warning: { color: 'bg-yellow-400', shadow: 'shadow-yellow-400/50', label: 'Warning' },
  error: { color: 'bg-red-400', shadow: 'shadow-red-400/50', label: 'Error' },
  connecting: { color: 'bg-blue-400', shadow: 'shadow-blue-400/50', label: 'Connecting' }
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4'
};

export function StatusIndicator({ 
  status, 
  label, 
  size = 'md', 
  animated = true 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          ${sizeClasses[size]} rounded-full 
          ${config.color} ${config.shadow}
          shadow-md
          ${(status === 'online' || status === 'connecting') ? 'animate-pulse' : ''}
        `}
      />
      {displayLabel && (
        <span className="text-sm text-gray-300">{displayLabel}</span>
      )}
    </div>
  );
}