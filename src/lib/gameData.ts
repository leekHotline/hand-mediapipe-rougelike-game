import type { CardData, EnemyData, MapNode, Relic } from '@/types/game';

export const CARD_DATABASE: Omit<CardData, 'id'>[] = [
  {
    name: 'Strike',
    cost: 1,
    damage: 12,
    block: 0,
    heal: 0,
    gesture: 'Closed_Fist',
    color: '#ff4444',
    description: 'Deal 12 damage.',
    rarity: 'common',
  },
  {
    name: 'Combo',
    cost: 1,
    damage: 6,
    block: 0,
    heal: 0,
    gesture: 'Victory',
    color: '#ff44ff',
    description: 'Deal 6 damage. Draw 1 card.',
    rarity: 'common',
    effects: [{ type: 'draw', value: 1 }],
  },
  {
    name: 'Pierce',
    cost: 1,
    damage: 8,
    block: 0,
    heal: 0,
    gesture: 'Pointing_Up',
    color: '#ff8844',
    description: 'Deal 8 damage.',
    rarity: 'common',
  },
  {
    name: 'Guard',
    cost: 1,
    damage: 0,
    block: 10,
    heal: 0,
    gesture: 'Open_Palm',
    color: '#4488ff',
    description: 'Gain 10 block.',
    rarity: 'common',
  },
  {
    name: 'Iron Wall',
    cost: 2,
    damage: 0,
    block: 18,
    heal: 0,
    gesture: 'Open_Palm',
    color: '#4488ff',
    description: 'Gain 18 block.',
    rarity: 'rare',
  },
  {
    name: 'Heal Protocol',
    cost: 1,
    damage: 0,
    block: 4,
    heal: 6,
    gesture: 'Thumb_Up',
    color: '#44ff44',
    description: 'Heal 6 HP and gain 4 block.',
    rarity: 'common',
  },
  {
    name: 'Emergency Repair',
    cost: 2,
    damage: 0,
    block: 0,
    heal: 15,
    gesture: 'Thumb_Up',
    color: '#44ff88',
    description: 'Heal 15 HP.',
    rarity: 'rare',
  },
  {
    name: 'Energy Burst',
    cost: 0,
    damage: 5,
    block: 0,
    heal: 0,
    gesture: 'Closed_Fist',
    color: '#ffff44',
    description: 'Deal 5 damage. Gain 2 energy.',
    rarity: 'rare',
    effects: [{ type: 'energy', value: 2 }],
  },
  {
    name: 'Double Strike',
    cost: 2,
    damage: 20,
    block: 0,
    heal: 0,
    gesture: 'Victory',
    color: '#ff00ff',
    description: 'Deal 20 damage.',
    rarity: 'rare',
  },
  {
    name: 'Precision Shot',
    cost: 1,
    damage: 15,
    block: 0,
    heal: 0,
    gesture: 'Pointing_Up',
    color: '#ff6644',
    description: 'Deal 15 damage.',
    rarity: 'rare',
  },
  {
    name: 'Inferno Fist',
    cost: 3,
    damage: 35,
    block: 0,
    heal: 0,
    gesture: 'Closed_Fist',
    color: '#ff0000',
    description: 'Deal 35 damage.',
    rarity: 'epic',
  },
  {
    name: 'Absolute Guard',
    cost: 2,
    damage: 0,
    block: 25,
    heal: 5,
    gesture: 'Open_Palm',
    color: '#0088ff',
    description: 'Gain 25 block and heal 5 HP.',
    rarity: 'epic',
  },
  {
    name: 'Full Stance',
    cost: 2,
    damage: 10,
    block: 10,
    heal: 10,
    gesture: 'Thumb_Up',
    color: '#00ff88',
    description: 'Deal 10 damage, gain 10 block, heal 10 HP.',
    rarity: 'epic',
  },
];

export function generateInitialDeck(): CardData[] {
  const deck: CardData[] = [];

  for (let i = 0; i < 4; i++) {
    const template = CARD_DATABASE.find(c => c.name === 'Strike')!;
    deck.push({ ...template, id: `card_${Date.now()}_${i}` });
  }

  for (let i = 0; i < 3; i++) {
    const template = CARD_DATABASE.find(c => c.name === 'Guard')!;
    deck.push({ ...template, id: `card_${Date.now()}_d${i}` });
  }

  for (let i = 0; i < 2; i++) {
    const template = CARD_DATABASE.find(c => c.name === 'Heal Protocol')!;
    deck.push({ ...template, id: `card_${Date.now()}_h${i}` });
  }

  const comboTemplate = CARD_DATABASE.find(c => c.name === 'Combo')!;
  deck.push({ ...comboTemplate, id: `card_${Date.now()}_combo` });

  return deck;
}

export function generateRandomCard(rarity?: CardData['rarity']): CardData {
  let pool = CARD_DATABASE;

  if (rarity) {
    pool = CARD_DATABASE.filter(c => c.rarity === rarity);
  } else {
    const rand = Math.random();
    if (rand < 0.6) {
      pool = CARD_DATABASE.filter(c => c.rarity === 'common');
    } else if (rand < 0.85) {
      pool = CARD_DATABASE.filter(c => c.rarity === 'rare');
    } else {
      pool = CARD_DATABASE.filter(c => c.rarity === 'epic');
    }
  }

  const template = pool[Math.floor(Math.random() * pool.length)];
  return { ...template, id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` };
}

export function generateEnemy(type: MapNode['type']): EnemyData {
  const isBoss = type === 'boss';
  const isElite = type === 'elite';

  const baseHp = isBoss ? 200 : isElite ? 100 : 50;
  const hpVariation = Math.floor(Math.random() * 30);

  const patterns = isBoss
    ? [
        { type: 'attack' as const, value: 20, weight: 40 },
        { type: 'defend' as const, value: 15, weight: 25 },
        { type: 'buff' as const, value: 5, weight: 20 },
        { type: 'debuff' as const, value: 2, weight: 15 },
      ]
    : isElite
      ? [
          { type: 'attack' as const, value: 15, weight: 50 },
          { type: 'defend' as const, value: 10, weight: 30 },
          { type: 'buff' as const, value: 3, weight: 20 },
        ]
      : [
          { type: 'attack' as const, value: 10, weight: 60 },
          { type: 'defend' as const, value: 8, weight: 40 },
        ];

  const names = isBoss
    ? ['Neon Colossus', 'Data Devourer', 'Storm Tyrant']
    : isElite
      ? ['Elite Sentry', 'Armored Raider', 'Cipher Operative']
      : ['Virus Script', 'Security Drone', 'Net Spider', 'Data Wisp'];

  const name = names[Math.floor(Math.random() * names.length)];

  return {
    id: `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    maxHp: baseHp + hpVariation,
    hp: baseHp + hpVariation,
    block: 0,
    intent: 'attack',
    nextDamage: patterns[0].value,
    nextBlock: 0,
    vulnerable: 0,
    weak: 0,
    strength: 0,
    patterns,
  };
}

export function generateMap(): MapNode[] {
  type GeneratedNode = MapNode & { lane: number };
  const rows = 8;
  const lanes = 3;
  const nodesByRow: GeneratedNode[][] = [];

  const minX = 140;
  const maxX = 660;
  const laneXs = Array.from({ length: lanes }, (_, i) =>
    minX + (i * (maxX - minX)) / (lanes - 1)
  );

  const rowY = (row: number) => 100 + row * 80;
  const pick = <T,>(pool: T[]) => pool[Math.floor(Math.random() * pool.length)];

  for (let row = 0; row < rows; row++) {
    const rowNodes: GeneratedNode[] = [];
    const laneIndices =
      row === 0 || row === rows - 1
        ? [Math.floor(lanes / 2)]
        : (() => {
            const count = Math.random() < 0.5 ? 2 : 3;
            const indices = new Set<number>();
            while (indices.size < count) {
              indices.add(Math.floor(Math.random() * lanes));
            }
            return Array.from(indices).sort((a, b) => a - b);
          })();

    let hasBattle = false;

    laneIndices.forEach((lane, index) => {
      let type: MapNode['type'];
      if (row === 0) {
        type = 'battle';
      } else if (row === rows - 1) {
        type = 'boss';
      } else {
        const stage = row / (rows - 1);
        const pool =
          stage < 0.35
            ? (['battle', 'battle', 'event', 'rest'] as MapNode['type'][])
            : stage < 0.7
              ? (['battle', 'elite', 'shop', 'rest'] as MapNode['type'][])
              : (['battle', 'elite', 'rest', 'shop'] as MapNode['type'][]);
        type = pick(pool);
      }

      if (index === laneIndices.length - 1 && !hasBattle && row !== rows - 1) {
        type = 'battle';
      }
      if (type === 'battle') hasBattle = true;

      rowNodes.push({
        id: `node_${row}_${lane}`,
        type,
        x: laneXs[lane] + (Math.random() - 0.5) * 40,
        y: rowY(row),
        connections: [],
        visited: false,
        current: false,
        lane,
      });
    });

    nodesByRow.push(rowNodes);
  }

  const incomingCount: Record<string, number> = {};

  for (let row = 0; row < rows - 1; row++) {
    const currentRowNodes = nodesByRow[row];
    const nextRowNodes = nodesByRow[row + 1];

    currentRowNodes.forEach(node => {
      const nearby = nextRowNodes.filter(n => Math.abs(n.lane - node.lane) <= 1);
      const candidates = nearby.length > 0 ? nearby : nextRowNodes;
      const connectionCount = candidates.length === 1 ? 1 : Math.random() < 0.4 ? 2 : 1;

      const selected = new Set<GeneratedNode>();
      while (selected.size < Math.min(connectionCount, candidates.length)) {
        selected.add(pick(candidates));
      }

      selected.forEach(target => {
        if (!node.connections.includes(target.id)) {
          node.connections.push(target.id);
          incomingCount[target.id] = (incomingCount[target.id] || 0) + 1;
        }
      });
    });

    nextRowNodes.forEach(target => {
      if (incomingCount[target.id]) return;
      const closest = currentRowNodes.reduce((best, node) => {
        const bestDelta = Math.abs(best.lane - target.lane);
        const nodeDelta = Math.abs(node.lane - target.lane);
        return nodeDelta < bestDelta ? node : best;
      }, currentRowNodes[0]);

      if (!closest.connections.includes(target.id)) {
        closest.connections.push(target.id);
        incomingCount[target.id] = 1;
      }
    });
  }

  return nodesByRow.flat().map(({ lane, ...node }) => node);
}

export const RELIC_DATABASE: Relic[] = [
  {
    id: 'relic_1',
    name: 'Energy Core',
    description: 'Gain 1 extra energy at the start of each turn.',
    rarity: 'common',
    effect: { type: 'start_turn', value: 1 },
  },
  {
    id: 'relic_2',
    name: 'Nano Repair Kit',
    description: 'Heal 10 HP after each battle.',
    rarity: 'common',
    effect: { type: 'end_battle', value: 10 },
  },
  {
    id: 'relic_3',
    name: 'Power Amplifier',
    description: 'All attacks deal +2 damage.',
    rarity: 'rare',
    effect: { type: 'on_damage', value: 2 },
  },
  {
    id: 'relic_4',
    name: 'Shield Generator',
    description: 'All block values +3.',
    rarity: 'rare',
    effect: { type: 'on_block', value: 3 },
  },
  {
    id: 'relic_5',
    name: 'Neon Heart',
    description: 'Increase max HP by 20.',
    rarity: 'epic',
    effect: { type: 'start_battle', value: 20 },
  },
];

export function generateRandomRelic(): Relic {
  const rand = Math.random();
  let pool = RELIC_DATABASE.filter(r => r.rarity === 'common');

  if (rand > 0.7) {
    pool = RELIC_DATABASE.filter(r => r.rarity === 'rare');
  } else if (rand > 0.9) {
    pool = RELIC_DATABASE.filter(r => r.rarity === 'epic');
  }

  const relic = pool[Math.floor(Math.random() * pool.length)];
  return { ...relic, id: `relic_${Date.now()}` };
}
