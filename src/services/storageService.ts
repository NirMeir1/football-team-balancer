import type { Player } from '../types';

const STORAGE_KEY = 'football_players';

export const storageService = {
  getPlayers(): Player[] | null {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data) as Player[];
    } catch {
      return null;
    }
  },

  savePlayers(players: Player[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  },

  clearPlayers(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasData(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};
