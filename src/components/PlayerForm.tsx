import { useState, useEffect } from 'react';
import type { Player, PlayerFormData } from '../types';
import { calculateOverallRating } from '../services/playerService';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md" dir="rtl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {player ? 'עריכת שחקן' : 'הוספת שחקן חדש'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם השחקן
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="הכנס שם"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              יכולת טכנית: {technicalSkill}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={technicalSkill}
              onChange={(e) => setTechnicalSkill(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              כושר גופני: {fitnessSkill}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={fitnessSkill}
              onChange={(e) => setFitnessSkill(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <span className="text-sm text-gray-600">דירוג כולל: </span>
            <span className="font-bold text-lg text-gray-900">{overallRating}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'regular' | 'guest')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="regular">שחקן קבוע</option>
              <option value="guest">אורח</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md font-medium touch-target hover:bg-blue-600 transition-colors"
            >
              {player ? 'עדכן' : 'הוסף'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium touch-target hover:bg-gray-300 transition-colors"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
