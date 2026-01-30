// 游戏类型定义

export type GestureType = 
  | 'Closed_Fist' 
  | 'Open_Palm' 
  | 'Pointing_Up' 
  | 'Thumb_Up' 
  | 'Victory'
  | 'None';

export interface CardData {
  id: string;
  name: string;
  cost: number;
  damage: number;
  block: number;
  heal: number;
  gesture: GestureType;
  color: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects?: CardEffect[];
}

export interface CardEffect {
  type: 'draw' | 'energy' | 'vulnerable' | 'weak' | 'strength' | 'dexterity';
  value: number;
}

export interface EnemyData {
  id: string;
  name: string;
  maxHp: number;
  hp: number;
  block: number;
  intent: 'attack' | 'defend' | 'buff' | 'debuff';
  nextDamage: number;
  nextBlock: number;
  vulnerable: number;
  weak: number;
  strength: number;
  patterns: EnemyPattern[];
  x?: number;
  y?: number;
}

export interface EnemyPattern {
  type: 'attack' | 'defend' | 'buff' | 'debuff';
  value: number;
  weight: number;
}

export interface PlayerState {
  maxHp: number;
  hp: number;
  maxEnergy: number;
  energy: number;
  block: number;
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  drawPile: CardData[];
  level: number;
  gold: number;
  strength: number;
  dexterity: number;
  vulnerable: number;
  weak: number;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect: RelicEffect;
}

export interface RelicEffect {
  type: 'start_battle' | 'end_battle' | 'on_damage' | 'on_block' | 'on_heal' | 'start_turn';
  value: number;
}

export type GameState = 'START' | 'MAP' | 'BATTLE' | 'SHOP' | 'REST' | 'REWARD' | 'GAME_OVER' | 'VICTORY';

export type Turn = 'player' | 'enemy';

export interface MapNode {
  id: string;
  type: 'battle' | 'elite' | 'shop' | 'rest' | 'boss' | 'event';
  x: number;
  y: number;
  connections: string[];
  visited: boolean;
  current: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'damage' | 'heal' | 'block' | 'sparkle';
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  scale: number;
}
