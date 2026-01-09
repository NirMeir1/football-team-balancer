import { useState, useEffect } from 'react';
import type { Player } from '../types';

interface TeamSelectorProps {
  players: Player[];
  onArrangeTeams: (selectedPlayers: Player[]) => void;
}

export function TeamSelector({ players, onArrangeTeams }: TeamSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Sort players by overall rating (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.overallRating - a.overallRating);

  const selectedCount = selectedIds.size;
  const isExactly15 = selectedCount === 15;

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

  const handleSelectAll = () => {
    const newSelected = new Set<string>();
    sortedPlayers.slice(0, 15).forEach(p => newSelected.add(p.id));
    setSelectedIds(newSelected);
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const handleArrangeTeams = () => {
    if (!isExactly15) {
      setError('יש לבחור בדיוק 15 שחקנים');
      return;
    }
    const selectedPlayers = players.filter(p => selectedIds.has(p.id));
    onArrangeTeams(selectedPlayers);
  };

  return (
    <div className="p-4" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">בחירת שחקנים למשחק</h1>

      <div className="flex justify-between items-center mb-4">
        <div className={`text-lg font-medium ${isExactly15 ? 'text-green-600' : 'text-gray-600'}`}>
          נבחרו: {selectedCount}/15
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-500 hover:text-blue-700 px-3 py-1"
          >
            בחר 15 מובילים
          </button>
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
          >
            נקה הכל
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2 mb-6">
        {sortedPlayers.map((player) => {
          const isSelected = selectedIds.has(player.id);
          const isDisabled = !isSelected && selectedCount >= 15;

          return (
            <label
              key={player.id}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : isDisabled
                  ? 'bg-gray-100 border-2 border-gray-200 opacity-50'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(player.id)}
                disabled={isDisabled}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 ml-3"
              />
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">{player.name}</span>
                  {player.status === 'guest' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mr-2">
                      אורח
                    </span>
                  )}
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                  {player.overallRating}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="sticky bottom-4">
        <button
          onClick={handleArrangeTeams}
          disabled={!isExactly15}
          className={`w-full py-4 rounded-lg font-bold text-lg touch-target transition-colors ${
            isExactly15
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          סדר קבוצות
        </button>
      </div>
    </div>
  );
}
