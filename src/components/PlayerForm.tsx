import { useState, useEffect } from 'react';
import { User, Check, UserPlus } from 'lucide-react';
import type { Player, PlayerFormData } from '../types';
import { calculateOverallRating } from '../services/playerService';
import { Modal, ModalHeader, ModalContent } from './ui/Modal';
import { Input } from './ui/Input';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import { cn, getSkillColor } from '../lib/utils';

interface PlayerFormProps {
  player?: Player | null;
  onSubmit: (data: PlayerFormData) => void;
  onCancel: () => void;
}

export function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [name, setName] = useState('');
  const [technicalSkill, setTechnicalSkill] = useState(70);
  const [fitnessSkill, setFitnessSkill] = useState(70);
  const [status, setStatus] = useState<'regular' | 'guest'>('regular');

  useEffect(() => {
    if (player) {
      setName(player.name);
      setTechnicalSkill(player.technicalSkill);
      setFitnessSkill(player.fitnessSkill);
      setStatus(player.status);
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      technicalSkill,
      fitnessSkill,
      status
    });
  };

  const overallRating = calculateOverallRating(technicalSkill, fitnessSkill);

  return (
    <Modal isOpen onClose={onCancel} showCloseButton={false}>
      <ModalHeader
        title={player ? 'עריכת שחקן' : 'שחקן חדש'}
        subtitle={player ? 'עדכן את פרטי השחקן' : 'הוסף שחקן חדש לרשימה'}
      />
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <Input
            label="שם השחקן"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="הכנס שם מלא"
            required
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />

          {/* Technical Skill Slider */}
          <Slider
            label="יכולת טכנית"
            value={technicalSkill}
            onChange={setTechnicalSkill}
          />

          {/* Fitness Skill Slider */}
          <Slider
            label="כושר גופני"
            value={fitnessSkill}
            onChange={setFitnessSkill}
          />

          {/* Overall Rating */}
          <div className="bg-gradient-to-l from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">דירוג כולל</span>
              <p className="text-xs text-gray-400 mt-0.5">ממוצע משוקלל</p>
            </div>
            <div
              className={cn(
                'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                getSkillColor(overallRating)
              )}
            >
              <span className="text-white font-bold text-xl">{overallRating}</span>
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              סטטוס שחקן
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('regular')}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 active:scale-95',
                  status === 'regular'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <Check className="h-5 w-5" />
                <span className="font-medium">קבוע</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('guest')}
                className={cn(
                  'p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 active:scale-95',
                  status === 'guest'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <UserPlus className="h-5 w-5" />
                <span className="font-medium">אורח</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" leftIcon={<Check className="h-5 w-5" />}>
              {player ? 'עדכן שחקן' : 'הוסף שחקן'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="px-6">
              ביטול
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
