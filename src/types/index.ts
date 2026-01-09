export interface Player {
  id: string;
  name: string;
  technicalSkill: number;
  fitnessSkill: number;
  overallRating: number;
  status: 'regular' | 'guest';
  isActive: boolean;
}

export interface Team {
  id: 'A' | 'B' | 'C';
  players: Player[];
  totalRating: number;
}

export interface TeamResult {
  teams: Team[];
  deviation: number;
  timestamp: Date;
}

export interface PlayerFormData {
  name: string;
  technicalSkill: number;
  fitnessSkill: number;
  status: 'regular' | 'guest';
}

export interface InitialPlayerData {
  name: string;
  technical: number;
  fitness: number;
}
