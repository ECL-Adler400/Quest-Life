import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showValues?: boolean;
  animated?: boolean;
  className?: string;
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  red: 'bg-red-500'
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4'
};

export function ProgressBar({
  value,
  max,
  label,
  color = 'blue',
  size = 'md',
  showPercentage = false,
  showValues = false,
  animated = true,
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={clsx('w-full', className)}>
      {(label || showPercentage || showValues) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {showPercentage && <span>{Math.round(percentage)}%</span>}
            {showValues && (
              <span className={showPercentage ? 'ml-2' : ''}>
                {value}/{max}
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className={clsx(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={clsx(
            'rounded-full transition-all duration-500 ease-out',
            colorClasses[color]
          )}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: "easeOut" }}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}