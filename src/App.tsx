import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player, PlayerFormData, TeamResult } from './types';
import { playerService } from './services/playerService';
import { balanceTeams } from './services/teamBalancer';
import { Header } from './components/layout/Header';
import { PlayerList } from './components/PlayerList';
import { TeamSelector } from './components/TeamSelector';
import { TeamResults } from './components/TeamResults';
import './App.css';

type Screen = 'players' | 'select' | 'results';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const pageTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentScreen, setCurrentScreen] = useState<Screen>('players');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [teamResult, setTeamResult] = useState<TeamResult | null>(null);

  useEffect(() => {
    const initialPlayers = playerService.initializePlayers();
    setPlayers(initialPlayers);
  }, []);

  const handleAddPlayer = (data: PlayerFormData) => {
    const newPlayer = playerService.addPlayer(data);
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleUpdatePlayer = (id: string, data: PlayerFormData) => {
    const updated = playerService.updatePlayer(id, data);
    if (updated) {
      setPlayers(prev => prev.map(p => p.id === id ? updated : p));
    }
  };

  const handleDeletePlayer = (id: string) => {
    if (playerService.deletePlayer(id)) {
      setPlayers(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleArrangeTeams = (selected: Player[]) => {
    setSelectedPlayers(selected);
    const result = balanceTeams(selected, false);
    setTeamResult(result);
    setCurrentScreen('results');
  };

  const handleShuffle = () => {
    const result = balanceTeams(selectedPlayers, true);
    setTeamResult(result);
  };

  const handleConfirm = () => {
    setCurrentScreen('select');
    setTeamResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header currentScreen={currentScreen} onScreenChange={setCurrentScreen} />

      <main className="max-w-lg mx-auto px-4">
        <AnimatePresence mode="wait">
          {currentScreen === 'players' && (
            <motion.div
              key="players"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <PlayerList
                players={players}
                onAddPlayer={handleAddPlayer}
                onUpdatePlayer={handleUpdatePlayer}
                onDeletePlayer={handleDeletePlayer}
              />
            </motion.div>
          )}

          {currentScreen === 'select' && (
            <motion.div
              key="select"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <TeamSelector
                players={players}
                onArrangeTeams={handleArrangeTeams}
              />
            </motion.div>
          )}

          {currentScreen === 'results' && teamResult && (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <TeamResults
                result={teamResult}
                onShuffle={handleShuffle}
                onConfirm={handleConfirm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
