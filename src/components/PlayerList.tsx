import { useState } from 'react';
import type { Player, PlayerFormData } from '../types';
import { PlayerForm } from './PlayerForm';

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (data: PlayerFormData) => void;
  onUpdatePlayer: (id: string, data: PlayerFormData) => void;
  onDeletePlayer: (id: string) => void;
}

export function PlayerList({ players, onAddPlayer, onUpdatePlayer, onDeletePlayer }: PlayerListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleFormSubmit = (data: PlayerFormData) => {
    if (editingPlayer) {
      onUpdatePlayer(editingPlayer.id, data);
    } else {
      onAddPlayer(data);
    }
    setShowForm(false);
    setEditingPlayer(null);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeletePlayer(deleteConfirm);
      setDeleteConfirm(null);
    }
  };

  // Sort players by overall rating (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.overallRating - a.overallRating);

  return (
    <div className="p-4" dir="rtl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">ניהול שחקנים</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium touch-target hover:bg-blue-600 transition-colors"
        >
          + הוסף שחקן
        </button>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        סה"כ {players.length} שחקנים
      </div>

      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-lg">{player.name}</span>
                  {player.status === 'guest' && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      אורח
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  <div className="flex gap-4">
                    <span>טכני: {player.technicalSkill}</span>
                    <span>כושר: {player.fitnessSkill}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                  {player.overallRating}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(player)}
                    className="text-blue-500 hover:text-blue-700 p-2 touch-target"
                    title="עריכה"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(player.id)}
                    className="text-red-500 hover:text-red-700 p-2 touch-target"
                    title="מחיקה"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPlayer(null);
          }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm" dir="rtl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">אישור מחיקה</h3>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך למחוק את השחקן?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-md font-medium touch-target hover:bg-red-600 transition-colors"
              >
                מחק
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium touch-target hover:bg-gray-300 transition-colors"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
