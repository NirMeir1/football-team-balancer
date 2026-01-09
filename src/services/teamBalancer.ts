import type { Player, Team, TeamResult } from '../types';

function calculateTeamTotal(players: Player[]): number {
  return players.reduce((sum, p) => sum + p.overallRating, 0);
}

function calculateDeviation(teams: Team[]): number {
  const totals = teams.map(t => t.totalRating);
  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  const maxDev = Math.max(...totals.map(t => Math.abs(t - mean)));
  return Math.round(maxDev * 10) / 10;
}

function cloneTeams(teams: Team[]): Team[] {
  return teams.map(team => ({
    ...team,
    players: [...team.players]
  }));
}

function snakeDraft(sortedPlayers: Player[]): Team[] {
  const teams: Team[] = [
    { id: 'A', players: [], totalRating: 0 },
    { id: 'B', players: [], totalRating: 0 },
    { id: 'C', players: [], totalRating: 0 }
  ];

  // Snake draft pattern for 15 players (5 rounds)
  // Round 1: A, B, C (indices 0,1,2)
  // Round 2: C, B, A (indices 3,4,5)
  // Round 3: A, B, C (indices 6,7,8)
  // Round 4: C, B, A (indices 9,10,11)
  // Round 5: A, B, C (indices 12,13,14)

  const draftOrder = [
    0, 1, 2,  // Round 1: A, B, C
    2, 1, 0,  // Round 2: C, B, A
    0, 1, 2,  // Round 3: A, B, C
    2, 1, 0,  // Round 4: C, B, A
    0, 1, 2   // Round 5: A, B, C
  ];

  for (let i = 0; i < sortedPlayers.length && i < 15; i++) {
    const teamIndex = draftOrder[i];
    teams[teamIndex].players.push(sortedPlayers[i]);
  }

  // Calculate totals
  teams.forEach(team => {
    team.totalRating = calculateTeamTotal(team.players);
  });

  return teams;
}

function optimizeWithSwaps(teams: Team[], maxIterations: number = 100): Team[] {
  let currentTeams = cloneTeams(teams);
  let iterations = 0;
  const TARGET_DEVIATION = 10;

  while (iterations < maxIterations) {
    const deviation = calculateDeviation(currentTeams);
    if (deviation <= TARGET_DEVIATION) {
      break;
    }

    // Find team with highest and lowest total
    let highTeamIdx = 0;
    let lowTeamIdx = 0;
    let maxTotal = currentTeams[0].totalRating;
    let minTotal = currentTeams[0].totalRating;

    for (let i = 1; i < currentTeams.length; i++) {
      if (currentTeams[i].totalRating > maxTotal) {
        maxTotal = currentTeams[i].totalRating;
        highTeamIdx = i;
      }
      if (currentTeams[i].totalRating < minTotal) {
        minTotal = currentTeams[i].totalRating;
        lowTeamIdx = i;
      }
    }

    // Try all possible swaps between high and low team
    let bestImprovement = 0;
    let bestSwap: { highPlayerIdx: number; lowPlayerIdx: number } | null = null;
    const currentDev = calculateDeviation(currentTeams);

    for (let hi = 0; hi < currentTeams[highTeamIdx].players.length; hi++) {
      for (let li = 0; li < currentTeams[lowTeamIdx].players.length; li++) {
        // Simulate swap
        const testTeams = cloneTeams(currentTeams);
        const highPlayer = testTeams[highTeamIdx].players[hi];
        const lowPlayer = testTeams[lowTeamIdx].players[li];

        testTeams[highTeamIdx].players[hi] = lowPlayer;
        testTeams[lowTeamIdx].players[li] = highPlayer;

        // Recalculate totals
        testTeams[highTeamIdx].totalRating = calculateTeamTotal(testTeams[highTeamIdx].players);
        testTeams[lowTeamIdx].totalRating = calculateTeamTotal(testTeams[lowTeamIdx].players);

        const newDev = calculateDeviation(testTeams);
        const improvement = currentDev - newDev;

        if (improvement > bestImprovement) {
          bestImprovement = improvement;
          bestSwap = { highPlayerIdx: hi, lowPlayerIdx: li };
        }
      }
    }

    // Execute best swap if found
    if (bestSwap && bestImprovement > 0) {
      const highPlayer = currentTeams[highTeamIdx].players[bestSwap.highPlayerIdx];
      const lowPlayer = currentTeams[lowTeamIdx].players[bestSwap.lowPlayerIdx];

      currentTeams[highTeamIdx].players[bestSwap.highPlayerIdx] = lowPlayer;
      currentTeams[lowTeamIdx].players[bestSwap.lowPlayerIdx] = highPlayer;

      // Recalculate totals
      currentTeams[highTeamIdx].totalRating = calculateTeamTotal(currentTeams[highTeamIdx].players);
      currentTeams[lowTeamIdx].totalRating = calculateTeamTotal(currentTeams[lowTeamIdx].players);
    } else {
      // No improvement possible, stop
      break;
    }

    iterations++;
  }

  return currentTeams;
}

export function balanceTeams(selectedPlayers: Player[], addRandomization: boolean = false): TeamResult {
  if (selectedPlayers.length !== 15) {
    throw new Error('Exactly 15 players are required for team balancing');
  }

  // Sort players by overall rating (highest to lowest)
  let sortedPlayers = [...selectedPlayers].sort((a, b) => b.overallRating - a.overallRating);

  // Optional: Add slight randomization for shuffle feature
  if (addRandomization) {
    // Group players by similar ratings and shuffle within groups
    const grouped: Player[][] = [];
    let currentGroup: Player[] = [];

    for (const player of sortedPlayers) {
      if (currentGroup.length === 0 ||
          Math.abs(player.overallRating - currentGroup[0].overallRating) <= 3) {
        currentGroup.push(player);
      } else {
        grouped.push(currentGroup);
        currentGroup = [player];
      }
    }
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }

    // Shuffle within groups
    sortedPlayers = grouped.flatMap(group => {
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [group[i], group[j]] = [group[j], group[i]];
      }
      return group;
    });
  }

  // Step 1: Snake draft
  let teams = snakeDraft(sortedPlayers);

  // Step 2: Optimize with greedy swaps
  teams = optimizeWithSwaps(teams);

  // Calculate final deviation
  const deviation = calculateDeviation(teams);

  return {
    teams,
    deviation,
    timestamp: new Date()
  };
}

export function getTeamColor(teamId: 'A' | 'B' | 'C'): string {
  switch (teamId) {
    case 'A': return '#3b82f6'; // Blue
    case 'B': return '#10b981'; // Green
    case 'C': return '#f59e0b'; // Orange
  }
}

export function getTeamBgClass(teamId: 'A' | 'B' | 'C'): string {
  switch (teamId) {
    case 'A': return 'bg-team-a';
    case 'B': return 'bg-team-b';
    case 'C': return 'bg-team-c';
  }
}
