import { forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  hover?: boolean;
  selected?: boolean;
  className?: string;
  children?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, selected = false, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-2xl shadow-sm border transition-all duration-200',
          hover && 'hover:shadow-md hover:-translate-y-0.5',
          selected
            ? 'border-emerald-400 shadow-emerald-500/20'
            : 'border-gray-100 hover:border-emerald-200',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  gradient?: string;
  className?: string;
  children?: ReactNode;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, gradient, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-4 py-3',
          gradient ? `bg-gradient-to-l ${gradient}` : '',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps {
  className?: string;
  children?: ReactNode;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn('p-4', className)}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardContent };
