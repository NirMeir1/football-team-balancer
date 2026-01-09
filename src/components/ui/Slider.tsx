import { useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getSkillColor } from '../../lib/utils';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  showTooltip?: boolean;
  disabled?: boolean;
  onDisabledClick?: () => void;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  showTooltip = true,
  disabled = false,
  onDisabledClick,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  const colorClass = getSkillColor(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleDisabledClick = () => {
    if (disabled && onDisabledClick) {
      onDisabledClick();
    }
  };

  return (
    <div className={cn('w-full relative', disabled && 'opacity-60')}>
      {/* Clickable overlay when disabled */}
      {disabled && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={handleDisabledClick}
        />
      )}
      <div className="flex justify-between items-center mb-2">
        <label className={cn('text-sm font-semibold', disabled ? 'text-gray-400' : 'text-gray-700')}>
          {label}
          {disabled && <span className="mr-2 text-xs">🔒</span>}
        </label>
        <span
          className={cn(
            'px-2.5 py-1 rounded-lg text-sm font-bold text-white bg-gradient-to-r transition-all',
            colorClass
          )}
        >
          {value}
        </span>
      </div>
      <div className="relative h-10 flex items-center">
        <div className="absolute w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
          <motion.div
            className={cn('h-full rounded-lg bg-gradient-to-r', colorClass)}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={() => !disabled && setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => !disabled && setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          disabled={disabled}
          className={cn(
            "relative w-full h-2 appearance-none bg-transparent z-10",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            `[&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-emerald-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-emerald-500
            [&::-moz-range-thumb]:shadow-lg`,
            !disabled && `[&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:cursor-pointer`
          )}
        />
        <AnimatePresence>
          {showTooltip && isDragging && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={cn(
                'absolute -top-8 px-2 py-1 rounded text-xs font-bold text-white bg-gradient-to-r pointer-events-none',
                colorClass
              )}
              style={{ left: `calc(${percentage}% - 16px)` }}
            >
              {value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
