import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Player } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface TeamSelectorProps {
  players: Player[];
  onArrangeTeams: (selectedPlayers: Player[]) => void;
}

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.02,
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  }),
};

export function TeamSelector({ players, onArrangeTeams }: TeamSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name, 'he'));

  const selectedCount = selectedIds.size;
  const isValid = selectedCount === 10 || selectedCount === 15;
  const target = selectedCount <= 10 ? 10 : 15;
  const progress = (selectedCount / target) * 100;

  useEffect(() => {
    if (selectedCount > 15) {
      setError('ניתן לבחור עד 15 שחקנים בלבד');
    } else {
      setError(null);
    }
  }, [selectedCount]);

  const handleToggle = (playerId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      if (newSelected.size < 15) {
        newSelected.add(playerId);
      }
    }
    setSelectedIds(newSelected);
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleArrangeTeams = () => {
    if (!isValid) {
      setError('יש לבחור 10 או 15 שחקנים');
      return;
    }
    const selectedPlayers = players.filter(p => selectedIds.has(p.id));
    onArrangeTeams(selectedPlayers);
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Get consistent color based on name
  const getAvatarGradient = (name: string): string => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-emerald-500 to-emerald-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-amber-500 to-amber-600',
      'from-cyan-500 to-cyan-600',
      'from-rose-500 to-rose-600',
      'from-indigo-500 to-indigo-600',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="py-4 pb-32" dir="rtl">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold bg-gradient-to-l from-emerald-600 to-green-700 bg-clip-text text-transparent mb-1">
          בחירת שחקנים
        </h1>
        <p className="text-gray-500 text-sm">בחר 10 שחקנים (2 קבוצות) או 15 שחקנים (3 קבוצות)</p>
      </div>

      {/* Progress & Actions Card */}
      <Card hover={false} className="p-4 mb-5">
        {/* Counter Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm',
                isValid
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
              )}
            >
              <span className={cn(
                'font-bold text-2xl',
                isValid ? 'text-white' : 'text-gray-700'
              )}>
                {selectedCount}
              </span>
            </div>
            <div>
              <p className={cn(
                'font-bold text-lg',
                isValid ? 'text-emerald-600' : 'text-gray-800'
              )}>
                {isValid ? 'מוכן!' : `${selectedCount} / ${target}`}
              </p>
              <p className="text-sm text-gray-500">
                {isValid ? `אפשר לחלק ל-${selectedCount === 10 ? 2 : 3} קבוצות` : `חסרים ${target - selectedCount} שחקנים`}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-gray-500"
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            נקה
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full transition-colors duration-300',
              isValid
                ? 'bg-gradient-to-l from-emerald-400 to-green-500'
                : selectedCount > 0
                ? 'bg-gradient-to-l from-blue-400 to-blue-500'
                : 'bg-gray-200'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
          />
        </div>
      </Card>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl mb-5 flex items-center gap-3 border border-red-100"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Players Grid */}
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isSelected = selectedIds.has(player.id);
          const isDisabled = !isSelected && selectedCount >= 15;

          return (
            <motion.div
              key={player.id}
              custom={index}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
            >
              <button
                type="button"
                onClick={() => handleToggle(player.id)}
                disabled={isDisabled}
                className={cn(
                  'w-full min-h-[72px] flex items-center gap-4 p-4 rounded-2xl transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
                  isSelected
                    ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : isDisabled
                    ? 'bg-gray-50 border-2 border-gray-100 opacity-40 cursor-not-allowed'
                    : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]'
                )}
              >
                {/* Large Checkbox - 44x44 touch target */}
                <div
                  className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200',
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/30'
                      : 'bg-gray-100 border-2 border-gray-200'
                  )}
                >
                  {isSelected ? (
                    <Check className="h-6 w-6 text-white" strokeWidth={3} />
                  ) : (
                    <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white" />
                  )}
                </div>

                {/* Avatar */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md transition-transform duration-200',
                    'bg-gradient-to-br',
                    getAvatarGradient(player.name),
                    isSelected && 'scale-105'
                  )}
                >
                  {getInitials(player.name)}
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      'font-semibold text-base transition-colors duration-200',
                      isSelected ? 'text-emerald-700' : 'text-gray-900'
                    )}>
                      {player.name}
                    </span>
                    {player.status === 'guest' && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg font-medium">
                        אורח
                      </span>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
                  isSelected
                    ? 'bg-emerald-100'
                    : 'bg-transparent'
                )}>
                  {isSelected && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">אין שחקנים</h3>
          <p className="text-gray-500">הוסף שחקנים בלשונית "שחקנים"</p>
        </motion.div>
      )}

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-gray-100 via-gray-100 to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleArrangeTeams}
            disabled={!isValid}
            size="lg"
            className={cn(
              'w-full text-lg h-14 rounded-2xl shadow-lg',
              isValid
                ? 'shadow-emerald-500/30'
                : 'opacity-50 shadow-none'
            )}
            leftIcon={<Users className="h-6 w-6" />}
          >
            חלק לקבוצות
          </Button>
          {!isValid && selectedCount > 0 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              בחר עוד {target - selectedCount} שחקנים להמשך
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
