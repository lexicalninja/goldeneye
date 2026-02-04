import type { Agent } from '../types.js';

// GoldenEye 64 playable characters
const GOLDENEYE_CHARACTERS = [
  'Oddjob',
  'Jaws',
  'Baron Samedi',
  'Xenia',
  'Natalya',
  'Boris',
  'Trevelyan',
  'Ourumov',
  'Mayday',
  'Mishkin',
  'Valentin',
  'James Bond',
  'Russian Soldier',
  'Russian Infantry',
  'Siberian Guard',
  'Naval Officer',
  'Helicopter Pilot',
  'Moonraker Elite',
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function assignCharacters(agents: Agent[]): Agent[] {
  const shuffled = shuffleArray(GOLDENEYE_CHARACTERS);

  return agents.map((agent, index) => ({
    ...agent,
    displayName: `${shuffled[index % shuffled.length]} (${agent.name})`,
  }));
}
