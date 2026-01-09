import { v4 as uuidv4 } from 'uuid';
import type { Player, PlayerFormData, InitialPlayerData } from '../types';
import { storageService } from './storageService';
import initialPlayersData from '../data/initialPlayers.json';

export function calculateOverallRating(technical: number, fitness: number): number {
  return Math.round(technical * 0.6 + fitness * 0.4);
}

function createPlayerFromInitialData(data: InitialPlayerData): Player {
  return {
    id: uuidv4(),
    name: data.name,
    technicalSkill: data.technical,
    fitnessSkill: data.fitness,
    overallRating: calculateOverallRating(data.technical, data.fitness),
    status: 'regular',
    isActive: true
  };
}

export const playerService = {
  initializePlayers(): Player[] {
    const existingPlayers = storageService.getPlayers();
    if (existingPlayers && existingPlayers.length > 0) {
      return existingPlayers;
    }

    const players = (initialPlayersData.players as InitialPlayerData[]).map(createPlayerFromInitialData);
    storageService.savePlayers(players);
    return players;
  },

  getAllPlayers(): Player[] {
    return storageService.getPlayers() || [];
  },

  addPlayer(formData: PlayerFormData): Player {
    const players = this.getAllPlayers();
    const newPlayer: Player = {
      id: uuidv4(),
      name: formData.name,
      technicalSkill: formData.technicalSkill,
      fitnessSkill: formData.fitnessSkill,
      overallRating: calculateOverallRating(formData.technicalSkill, formData.fitnessSkill),
      status: formData.status,
      isActive: true
    };
    players.push(newPlayer);
    storageService.savePlayers(players);
    return newPlayer;
  },

  updatePlayer(id: string, formData: Partial<PlayerFormData>): Player | null {
    const players = this.getAllPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;

    const player = players[index];
    const updatedPlayer: Player = {
      ...player,
      ...(formData.name !== undefined && { name: formData.name }),
      ...(formData.technicalSkill !== undefined && { technicalSkill: formData.technicalSkill }),
      ...(formData.fitnessSkill !== undefined && { fitnessSkill: formData.fitnessSkill }),
      ...(formData.status !== undefined && { status: formData.status }),
      overallRating: calculateOverallRating(
        formData.technicalSkill ?? player.technicalSkill,
        formData.fitnessSkill ?? player.fitnessSkill
      )
    };

    players[index] = updatedPlayer;
    storageService.savePlayers(players);
    return updatedPlayer;
  },

  deletePlayer(id: string): boolean {
    const players = this.getAllPlayers();
    const filtered = players.filter(p => p.id !== id);
    if (filtered.length === players.length) return false;
    storageService.savePlayers(filtered);
    return true;
  },

  togglePlayerActive(id: string): Player | null {
    const players = this.getAllPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index === -1) return null;

    players[index] = {
      ...players[index],
      isActive: !players[index].isActive
    };

    storageService.savePlayers(players);
    return players[index];
  },

  getPlayerById(id: string): Player | null {
    const players = this.getAllPlayers();
    return players.find(p => p.id === id) || null;
  }
};
