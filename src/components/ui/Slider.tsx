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
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  showTooltip = true,
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = ((value - min) / (max - min)) * 100;
  const colorClass = getSkillColor(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">
          {label}
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
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-emerald-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-emerald-500
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <AnimatePresence>
          {showTooltip && isDragging && (
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
