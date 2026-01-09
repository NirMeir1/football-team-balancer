import { cn, getInitials, getAvatarColor } from '../../lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-xl',
};

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-md',
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
