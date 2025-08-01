import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  animated?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable = false, animated = true, children, ...props }, ref) => {
    const Component = animated ? motion.div : 'div';
    
    const motionProps = animated ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      ...(hoverable && {
        whileHover: { y: -2, transition: { duration: 0.2 } }
      })
    } : {};
    
    return (
      <Component
        ref={ref}
        className={clsx(
          'rounded-lg bg-white dark:bg-gray-800 transition-all duration-200',
          {
            // Variants
            'shadow-sm border border-gray-200 dark:border-gray-700': variant === 'default',
            'shadow-lg border border-gray-200 dark:border-gray-700': variant === 'elevated',
            'border-2 border-gray-300 dark:border-gray-600': variant === 'outlined',
            
            // Padding
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
            
            // Hoverable
            'hover:shadow-md cursor-pointer': hoverable && !animated,
            'hover:shadow-lg': hoverable && variant === 'elevated',
          },
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';