import type { TeamResult } from '../types';
import { getTeamColor } from '../services/teamBalancer';

interface TeamResultsProps {
  result: TeamResult;
  onShuffle: () => void;
  onConfirm: () => void;
}

export function TeamResults({ result, onShuffle, onConfirm }: TeamResultsProps) {
  const { teams, deviation } = result;

  const getTeamName = (id: 'A' | 'B' | 'C'): string => {
    switch (id) {
      case 'A': return 'קבוצה א׳';
      case 'B': return 'קבוצה ב׳';
      case 'C': return 'קבוצה ג׳';
    }
  };

  const getTeamBgStyle = (id: 'A' | 'B' | 'C'): React.CSSProperties => {
    return {
      backgroundColor: getTeamColor(id),
    };
  };

  const getTeamLightBgClass = (id: 'A' | 'B' | 'C'): string => {
    switch (id) {
      case 'A': return 'bg-blue-50 border-blue-200';
      case 'B': return 'bg-green-50 border-green-200';
      case 'C': return 'bg-orange-50 border-orange-200';
    }
  };

  return (
    <div className="p-4" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">תוצאות החלוקה</h1>

      <div className="bg-gray-100 rounded-lg p-3 mb-6 text-center">
        <span className="text-gray-600">סטיית איזון: </span>
        <span className={`font-bold text-lg ${deviation <= 10 ? 'text-green-600' : deviation <= 15 ? 'text-yellow-600' : 'text-red-600'}`}>
          ±{deviation} נקודות
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className={`rounded-lg border-2 overflow-hidden ${getTeamLightBgClass(team.id)}`}
          >
            <div
              className="text-white px-4 py-3 flex justify-between items-center"
              style={getTeamBgStyle(team.id)}
            >
              <span className="font-bold text-lg">{getTeamName(team.id)}</span>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-bold">
                {team.totalRating}
              </span>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                {team.players.map((player) => (
                  <li
                    key={player.id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                  >
                    <span className="text-gray-900">{player.name}</span>
                    <span className="text-gray-500">({player.overallRating})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 sticky bottom-4">
        <button
          onClick={onShuffle}
          className="flex-1 bg-yellow-500 text-white py-4 rounded-lg font-bold text-lg touch-target hover:bg-yellow-600 transition-colors"
        >
          ערבב שוב
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-green-500 text-white py-4 rounded-lg font-bold text-lg touch-target hover:bg-green-600 transition-colors"
        >
          אשר קבוצות
        </button>
      </div>
    </div>
  );
}
