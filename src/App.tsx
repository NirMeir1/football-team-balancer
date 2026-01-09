import { useState, useEffect } from 'react';
import type { Player, PlayerFormData, TeamResult } from './types';
import { playerService } from './services/playerService';
import { balanceTeams } from './services/teamBalancer';
import { PlayerList } from './components/PlayerList';
import { TeamSelector } from './components/TeamSelector';
import { TeamResults } from './components/TeamResults';
import './App.css';

type Screen = 'players' | 'select' | 'results';

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

  const navItems: { screen: Screen; label: string }[] = [
    { screen: 'players', label: 'שחקנים' },
    { screen: 'select', label: 'בחירה' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex" dir="rtl">
            {navItems.map((item) => (
              <button
                key={item.screen}
                onClick={() => setCurrentScreen(item.screen)}
                className={`flex-1 py-4 text-center font-medium touch-target transition-colors ${
                  currentScreen === item.screen || (currentScreen === 'results' && item.screen === 'select')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-lg mx-auto pb-20">
        {currentScreen === 'players' && (
          <PlayerList
            players={players}
            onAddPlayer={handleAddPlayer}
            onUpdatePlayer={handleUpdatePlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        )}

        {currentScreen === 'select' && (
          <TeamSelector
            players={players}
            onArrangeTeams={handleArrangeTeams}
          />
        )}

        {currentScreen === 'results' && teamResult && (
          <TeamResults
            result={teamResult}
            onShuffle={handleShuffle}
            onConfirm={handleConfirm}
          />
        )}
      </main>
    </div>
  );
}

export default App;
