import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw, Check } from 'lucide-react';
import type { TeamResult } from '../types';
import { Button } from './ui/Button';
import { cn, getInitials } from '../lib/utils';

interface TeamResultsProps {
  result: TeamResult;
  onShuffle: () => void;
  onConfirm: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const teamVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

const playerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  }),
};

export function TeamResults({ result, onShuffle, onConfirm }: TeamResultsProps) {
  const { teams } = result;

  const getTeamConfig = (id: 'A' | 'B' | 'C') => {
    switch (id) {
      case 'A':
        return {
          name: 'קבוצה א׳',
          gradient: 'from-blue-500 to-blue-600',
          lightBg: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-700',
          avatarGradient: 'from-blue-400 to-blue-600',
          icon: '🔵',
        };
      case 'B':
        return {
          name: 'קבוצה ב׳',
          gradient: 'from-emerald-500 to-green-600',
          lightBg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-700',
          avatarGradient: 'from-emerald-400 to-emerald-600',
          icon: '🟢',
        };
      case 'C':
        return {
          name: 'קבוצה ג׳',
          gradient: 'from-orange-500 to-amber-600',
          lightBg: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-700',
          avatarGradient: 'from-orange-400 to-amber-500',
          icon: '🟠',
        };
    }
  };

  return (
    <div className="py-4 pb-28" dir="rtl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <CheckCircle className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold bg-gradient-to-l from-emerald-600 to-green-700 bg-clip-text text-transparent mb-1">
          הקבוצות מוכנות!
        </h1>
        <p className="text-gray-500 text-sm">3 קבוצות מאוזנות עם 5 שחקנים בכל אחת</p>
      </motion.div>

      {/* Teams */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 mb-6"
      >
        {teams.map((team) => {
          const config = getTeamConfig(team.id);
          return (
            <motion.div
              key={team.id}
              variants={teamVariants}
              className={cn(
                'rounded-2xl overflow-hidden border shadow-sm',
                config.border
              )}
            >
              {/* Team Header */}
              <div className={cn('bg-gradient-to-l px-4 py-3 flex items-center gap-3', config.gradient)}>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-xl">{config.icon}</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-white text-lg">{config.name}</h2>
                  <p className="text-white/70 text-sm">{team.players.length} שחקנים</p>
                </div>
              </div>

              {/* Players List */}
              <div className={cn('p-3', config.lightBg)}>
                <div className="space-y-2">
                  {team.players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      custom={index}
                      variants={playerVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm"
                    >
                      {/* Number Badge */}
                      <div className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm',
                        config.badge
                      )}>
                        {index + 1}
                      </div>

                      {/* Avatar */}
                      <div className={cn(
                        'w-9 h-9 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-semibold text-sm shadow-sm',
                        config.avatarGradient
                      )}>
                        {getInitials(player.name)}
                      </div>

                      {/* Name */}
                      <span className="font-medium text-gray-900 flex-1">{player.name}</span>

                      {/* Guest Badge */}
                      {player.status === 'guest' && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                          אורח
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-gray-100 via-gray-100/95 to-transparent">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={onShuffle}
            leftIcon={<RefreshCw className="h-5 w-5" />}
          >
            ערבב
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={onConfirm}
            leftIcon={<Check className="h-5 w-5" />}
          >
            אשר
          </Button>
        </div>
      </div>
    </div>
  );
}
