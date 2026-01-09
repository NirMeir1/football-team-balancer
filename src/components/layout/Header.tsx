import { Users, ClipboardCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

type Screen = 'players' | 'select' | 'results';

interface HeaderProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const navItems: { screen: Screen; label: string; icon: typeof Users }[] = [
  { screen: 'players', label: 'שחקנים', icon: Users },
  { screen: 'select', label: 'בחירה', icon: ClipboardCheck },
];

export function Header({ currentScreen, onScreenChange }: HeaderProps) {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
      <div className="max-w-lg mx-auto px-4">
        {/* Top row with title */}
        <div className="flex items-center justify-center py-3" dir="rtl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-lg">⚽</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">מחלק קבוצות</h1>
              <p className="text-xs text-gray-500">חלוקה מאוזנת לקבוצות</p>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex" dir="rtl">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen || (currentScreen === 'results' && item.screen === 'select');
            const Icon = item.icon;

            return (
              <button
                key={item.screen}
                onClick={() => onScreenChange(item.screen)}
                className={cn(
                  'flex-1 py-3 flex flex-col items-center gap-1 font-medium touch-target transition-all duration-200 relative',
                  isActive
                    ? 'text-emerald-600'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-xl transition-all duration-200',
                    isActive ? 'bg-emerald-50' : ''
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
