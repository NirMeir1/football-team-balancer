# Football Team Balancer / מחלק קבוצות כדורגל

A React PWA that divides 15 weekly football players into 3 balanced teams of 5, based on skill ratings.

## Features

- **Player Management**: Add, edit, and delete players with technical and fitness skill ratings
- **Team Balancing**: Uses a snake draft algorithm with greedy optimization to create balanced teams
- **Hebrew RTL Support**: Full right-to-left Hebrew interface
- **PWA**: Works offline and can be installed on iOS/Android devices
- **LocalStorage**: All data persists locally in the browser

## Tech Stack

- React 18+ with TypeScript
- Vite (build tool)
- Tailwind CSS v4 (with RTL support)
- LocalStorage (data persistence)
- PWA with Workbox

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Algorithm

The team balancing uses a **Greedy Snake Draft** algorithm:

1. Sort all 15 selected players by overall rating (highest to lowest)
2. Distribute players using zigzag pattern:
   - Round 1: Team A, B, C
   - Round 2: Team C, B, A (reverse)
   - And so on...
3. Optimize with greedy swaps to minimize deviation between teams
4. Target deviation: < 15 points

## Project Structure

```
src/
├── components/
│   ├── PlayerList.tsx      # Display & manage players
│   ├── PlayerForm.tsx      # Add/edit player form
│   ├── TeamSelector.tsx    # Select 15 players
│   └── TeamResults.tsx     # Display balanced teams
├── services/
│   ├── playerService.ts    # CRUD operations
│   ├── teamBalancer.ts     # Balancing algorithm
│   └── storageService.ts   # LocalStorage operations
├── data/
│   └── initialPlayers.json # Initial 20 players
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app with navigation
└── main.tsx              # Entry point
```
