import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import type { Player, PlayerFormData } from '../types';
import { PlayerForm } from './PlayerForm';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal, ModalContent } from './ui/Modal';
import { Avatar } from './ui/Avatar';

interface PlayerListProps {
  players: Player[];
  onAddPlayer: (data: PlayerFormData) => void;
  onUpdatePlayer: (id: string, data: PlayerFormData) => void;
  onDeletePlayer: (id: string) => void;
}

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  }),
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.2 },
  },
};

export function PlayerList({ players, onAddPlayer, onUpdatePlayer, onDeletePlayer }: PlayerListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Player | null>(null);

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

  const handleDeleteClick = (player: Player) => {
    setDeleteConfirm(player);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDeletePlayer(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name, 'he'));

  return (
    <div className="py-4 pb-8" dir="rtl">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-l from-emerald-600 to-green-700 bg-clip-text text-transparent">
              ניהול שחקנים
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {players.length} שחקנים רשומים
            </p>
          </div>
          <Button onClick={handleAddClick} leftIcon={<Plus className="h-5 w-5" />}>
            הוסף שחקן
          </Button>
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              custom={index}
              variants={listItemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Card className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar name={player.name} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {player.name}
                      </h3>
                      {player.status === 'guest' && (
                        <span className="inline-flex items-center text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                          אורח
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(player)}
                      title="עריכה"
                    >
                      <Pencil className="h-5 w-5 text-gray-400 hover:text-emerald-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(player)}
                      title="מחיקה"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-600" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {players.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
            <Users className="h-10 w-10 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">אין שחקנים עדיין</h3>
          <p className="text-gray-500 mb-4">התחל להוסיף שחקנים לרשימה</p>
          <Button onClick={handleAddClick} leftIcon={<Plus className="h-5 w-5" />}>
            הוסף שחקן ראשון
          </Button>
        </motion.div>
      )}

      {/* Player Form Modal */}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        showCloseButton={false}
      >
        <ModalContent className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center"
          >
            <Trash2 className="h-7 w-7 text-red-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">מחיקת שחקן</h3>
          <p className="text-gray-500 mb-6">
            האם אתה בטוח שברצונך למחוק את <span className="font-semibold text-gray-900">{deleteConfirm?.name}</span>?
            <br />
            פעולה זו אינה ניתנת לביטול.
          </p>
          <div className="flex gap-3">
            <Button variant="destructive" className="flex-1" onClick={confirmDelete}>
              מחק
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              ביטול
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
