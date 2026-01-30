import { useState, useCallback, useRef } from 'react';
import type { 
  GameState, 
  PlayerState, 
  EnemyData, 
  MapNode, 
  Turn,
  Relic,
  Particle,
  FloatingText,
  GestureType 
} from '@/types/game';
import { generateInitialDeck, generateEnemy, generateMap } from '@/lib/gameData';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [turn, setTurn] = useState<Turn>('player');
  const [turnNumber, setTurnNumber] = useState(1);
  const [battleCount, setBattleCount] = useState(0);
  
  const [player, setPlayer] = useState<PlayerState>({
    maxHp: 80,
    hp: 80,
    maxEnergy: 3,
    energy: 3,
    block: 0,
    deck: generateInitialDeck(),
    hand: [],
    discard: [],
    drawPile: [],
    level: 1,
    gold: 100,
    strength: 0,
    dexterity: 0,
    vulnerable: 0,
    weak: 0,
  });

  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [mapNodes, setMapNodes] = useState<MapNode[]>([]);
  const [currentNode, setCurrentNode] = useState<string>('');
  const [relics, setRelics] = useState<Relic[]>([]);
  
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [cameraShake, setCameraShake] = useState(0);
  
  const [gestureProgress, setGestureProgress] = useState<Record<string, number>>({});
  const gestureHoldStartRef = useRef<Record<string, number>>({});

  // 初始化地图
  const initMap = useCallback(() => {
    const nodes = generateMap();
    setMapNodes(nodes);
    setCurrentNode(nodes[0].id);
    nodes[0].current = true;
    setMapNodes([...nodes]);
    setGameState('MAP');
  }, []);

  // 开始战斗
  const startBattle = useCallback((nodeType: MapNode['type']) => {
    const enemyCount = nodeType === 'elite' ? 2 : nodeType === 'boss' ? 1 : 1;
    const newEnemies: EnemyData[] = [];
    
    for (let i = 0; i < enemyCount; i++) {
      newEnemies.push(generateEnemy(nodeType));
    }
    
    setEnemies(newEnemies);
    setGameState('BATTLE');
    setTurn('player');
    setTurnNumber(1);
    
    // 重置玩家状态
    setPlayer(prev => ({
      ...prev,
      energy: prev.maxEnergy,
      block: 0,
      drawPile: [...prev.deck],
      hand: [],
      discard: [],
      vulnerable: Math.max(0, prev.vulnerable - 1),
      weak: Math.max(0, prev.weak - 1),
    }));
    
    // 抽牌
    setTimeout(() => drawCards(5), 300);
  }, []);

  // 抽牌
  const drawCards = useCallback((count: number) => {
    setPlayer(prev => {
      const newHand = [...prev.hand];
      const newDrawPile = [...prev.drawPile];
      const newDiscard = [...prev.discard];
      
      for (let i = 0; i < count; i++) {
        if (newDrawPile.length === 0 && newDiscard.length > 0) {
          // 洗牌
          newDrawPile.push(...newDiscard);
          newDiscard.length = 0;
          // 随机排序
          for (let j = newDrawPile.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [newDrawPile[j], newDrawPile[k]] = [newDrawPile[k], newDrawPile[j]];
          }
        }
        
        if (newDrawPile.length > 0) {
          newHand.push(newDrawPile.pop()!);
        }
      }
      
      return {
        ...prev,
        hand: newHand,
        drawPile: newDrawPile,
        discard: newDiscard,
      };
    });
  }, []);

  // 打出卡牌
  const playCard = useCallback((cardId: string, targetIndex: number = 0) => {
    const card = player.hand.find(c => c.id === cardId);
    if (!card || player.energy < card.cost || turn !== 'player') return false;
    
    const enemy = enemies[targetIndex];
    if (!enemy && card.damage > 0) return false;
    
    setPlayer(prev => {
      const newHand = prev.hand.filter(c => c.id !== cardId);
      const newDiscard = [...prev.discard, card];
      
      // 计算实际伤害
      let actualDamage = card.damage;
      if (prev.strength > 0) actualDamage += prev.strength;
      if (prev.weak > 0) actualDamage = Math.floor(actualDamage * 0.75);
      
      // 计算实际格挡
      let actualBlock = card.block;
      if (prev.dexterity > 0) actualBlock += prev.dexterity;
      
      // 应用到敌人
      if (actualDamage > 0 && enemy) {
        const finalDamage = Math.max(0, actualDamage - enemy.block);
        const blockedDamage = Math.min(actualDamage, enemy.block);
        
        setEnemies(prevEnemies => {
          const newEnemies = [...prevEnemies];
          newEnemies[targetIndex] = {
            ...newEnemies[targetIndex],
            hp: newEnemies[targetIndex].hp - finalDamage,
            block: newEnemies[targetIndex].block - blockedDamage,
          };
          return newEnemies;
        });
        
        // 添加粒子效果
        addParticles(400 + targetIndex * 200, 200, '#ff4444', 15, 'damage');
        addFloatingText(400 + targetIndex * 200, 200, finalDamage.toString(), '#ff4444');
        setCameraShake(8);
      }
      
      // 应用到玩家
      let newHp = prev.hp;
      let newBlock = prev.block + actualBlock;
      
      if (card.heal > 0) {
        newHp = Math.min(prev.maxHp, prev.hp + card.heal);
        addParticles(400, 500, '#44ff44', 12, 'heal');
        addFloatingText(400, 400, `+${card.heal}`, '#44ff44');
      }
      
      if (actualBlock > 0) {
        addParticles(400, 500, '#4488ff', 10, 'block');
        addFloatingText(400, 450, `+${actualBlock}`, '#4488ff');
      }
      
      // 处理卡牌效果
      if (card.effects) {
        card.effects.forEach(effect => {
          if (effect.type === 'draw') {
            setTimeout(() => drawCards(effect.value), 200);
          }
        });
      }
      
      return {
        ...prev,
        hp: newHp,
        block: newBlock,
        energy: prev.energy - card.cost + (card.effects?.find(e => e.type === 'energy')?.value || 0),
        hand: newHand,
        discard: newDiscard,
      };
    });
    
    // 清除手势进度
    setGestureProgress(prev => ({ ...prev, [cardId]: 0 }));
    delete gestureHoldStartRef.current[cardId];
    
    // 检查战斗结束
    setTimeout(() => checkBattleEnd(), 300);
    
    return true;
  }, [player.hand, player.energy, enemies, turn, drawCards]);

  // 检查战斗结束
  const checkBattleEnd = useCallback(() => {
    const allEnemiesDead = enemies.every(e => e.hp <= 0);
    if (allEnemiesDead && enemies.length > 0) {
      setTimeout(() => {
        setGameState('REWARD');
        setBattleCount(prev => prev + 1);
      }, 1000);
    }
  }, [enemies]);

  // 敌人回合
  const enemyTurn = useCallback(() => {
    setTurn('enemy');
    
    setTimeout(() => {
      enemies.forEach((enemy, index) => {
        if (enemy.hp <= 0) return;
        
        // 执行意图
        if (enemy.intent === 'attack' && enemy.nextDamage > 0) {
          let damage = enemy.nextDamage;
          if (enemy.strength > 0) damage += enemy.strength;
          if (enemy.weak > 0) damage = Math.floor(damage * 0.75);
          
          const finalDamage = Math.max(0, damage - player.block);
          const blockedDamage = Math.min(damage, player.block);
          
          setPlayer(prev => ({
            ...prev,
            hp: prev.hp - finalDamage,
            block: prev.block - blockedDamage,
          }));
          
          addParticles(400, 400, '#ff0000', 20, 'damage');
          addFloatingText(400, 350, `-${finalDamage}`, '#ff0000');
          setCameraShake(12);
        } else if (enemy.intent === 'defend' && enemy.nextBlock > 0) {
          setEnemies(prev => {
            const newEnemies = [...prev];
            newEnemies[index] = { ...newEnemies[index], block: newEnemies[index].block + enemy.nextBlock };
            return newEnemies;
          });
        }
        
        // 更新敌人意图
        setEnemies(prev => {
          const newEnemies = [...prev];
          const patterns = enemy.patterns;
          const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
          let random = Math.random() * totalWeight;
          let selectedPattern = patterns[0];
          
          for (const pattern of patterns) {
            random -= pattern.weight;
            if (random <= 0) {
              selectedPattern = pattern;
              break;
            }
          }
          
          newEnemies[index] = {
            ...newEnemies[index],
            intent: selectedPattern.type,
            nextDamage: selectedPattern.type === 'attack' ? selectedPattern.value : 0,
            nextBlock: selectedPattern.type === 'defend' ? selectedPattern.value : 0,
            vulnerable: Math.max(0, newEnemies[index].vulnerable - 1),
            weak: Math.max(0, newEnemies[index].weak - 1),
          };
          
          return newEnemies;
        });
      });
      
      // 新回合
      setTimeout(() => {
        setTurn('player');
        setTurnNumber(prev => prev + 1);
        setPlayer(prev => ({
          ...prev,
          energy: prev.maxEnergy,
          block: 0,
          vulnerable: Math.max(0, prev.vulnerable - 1),
          weak: Math.max(0, prev.weak - 1),
        }));
        drawCards(5);
      }, 1500);
    }, 800);
  }, [enemies, player.block, drawCards]);

  // 结束回合
  const endTurn = useCallback(() => {
    if (turn === 'player') {
      // 弃掉所有手牌
      setPlayer(prev => ({
        ...prev,
        discard: [...prev.discard, ...prev.hand],
        hand: [],
      }));
      enemyTurn();
    }
  }, [turn, enemyTurn]);

  // 添加粒子
  const addParticles = useCallback((x: number, y: number, color: string, count: number, type: Particle['type']) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;
      newParticles.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: 3 + Math.random() * 5,
        type,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // 添加浮动文字
  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    setFloatingTexts(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      text,
      color,
      life: 1,
      scale: 1,
    }]);
  }, []);

  // 更新粒子和浮动文字
  const updateEffects = useCallback(() => {
    setParticles(prev => prev
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vx: p.vx * 0.95,
        vy: p.vy * 0.95 + 0.1,
        life: p.life - 0.02,
      }))
      .filter(p => p.life > 0)
    );
    
    setFloatingTexts(prev => prev
      .map(t => ({
        ...t,
        y: t.y - 2,
        life: t.life - 0.015,
        scale: t.scale + 0.02,
      }))
      .filter(t => t.life > 0)
    );
    
    setCameraShake(prev => prev * 0.9);
  }, []);

  // 处理手势
  const processGesture = useCallback((gesture: GestureType, _confidence: number) => {
    if (turn !== 'player' || gameState !== 'BATTLE') return;
    
    // 查找匹配的卡牌
    const matchingCards = player.hand.filter(card => 
      card.gesture === gesture && 
      player.energy >= card.cost
    );
    
    if (matchingCards.length === 0) {
      setGestureProgress(prev => {
        const hasProgress = Object.values(prev).some(value => value > 0);
        if (!hasProgress) return prev;
        gestureHoldStartRef.current = {};
        const cleared: Record<string, number> = {};
        player.hand.forEach(card => {
          cleared[card.id] = 0;
        });
        return cleared;
      });
      return;
    }

    const targetCard = matchingCards[0];

    setGestureProgress(prev => {
      const now = performance.now();
      const start = gestureHoldStartRef.current[targetCard.id] ?? now;

      if (!gestureHoldStartRef.current[targetCard.id]) {
        gestureHoldStartRef.current[targetCard.id] = start;
      }

      const newProgress = Math.min(1, (now - start) / 2000);
      const current = prev[targetCard.id] || 0;

      if (newProgress >= 1 && current < 1) {
        setTimeout(() => playCard(targetCard.id), 50);
      }

      const nextProgress: Record<string, number> = {};
      player.hand.forEach(card => {
        if (card.id === targetCard.id) {
          nextProgress[card.id] = newProgress;
        } else {
          nextProgress[card.id] = 0;
          delete gestureHoldStartRef.current[card.id];
        }
      });

      return nextProgress;
    });
  }, [turn, gameState, player.hand, player.energy, playCard]);

  // 重置手势进度（当手势不匹配时）
  const resetGestureProgress = useCallback((_gesture: GestureType) => {
    gestureHoldStartRef.current = {};
    setGestureProgress(() => {
      const cleared: Record<string, number> = {};
      player.hand.forEach(card => {
        cleared[card.id] = 0;
      });
      return cleared;
    });
  }, [player.hand]);

  // 选择地图节点
  const selectMapNode = useCallback((nodeId: string) => {
    const node = mapNodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // 标记当前节点为已访问
    setMapNodes(prev => prev.map(n => ({
      ...n,
      visited: n.id === currentNode ? true : n.visited,
      current: n.id === nodeId,
    })));
    
    setCurrentNode(nodeId);
    
    switch (node.type) {
      case 'battle':
      case 'elite':
      case 'boss':
        startBattle(node.type);
        break;
      case 'shop':
        setGameState('SHOP');
        break;
      case 'rest':
        setGameState('REST');
        break;
      case 'event':
        // 随机事件
        startBattle('battle');
        break;
    }
  }, [mapNodes, currentNode, startBattle]);

  // 休息恢复
  const rest = useCallback(() => {
    setPlayer(prev => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + Math.floor(prev.maxHp * 0.3)),
    }));
    setGameState('MAP');
  }, []);

  // 选择奖励
  const selectReward = useCallback((rewardType: 'card' | 'gold' | 'relic', value?: any) => {
    if (rewardType === 'card' && value) {
      setPlayer(prev => ({
        ...prev,
        deck: [...prev.deck, value],
      }));
    } else if (rewardType === 'gold') {
      setPlayer(prev => ({
        ...prev,
        gold: prev.gold + value,
      }));
    } else if (rewardType === 'relic' && value) {
      setRelics(prev => [...prev, value]);
    }
    setGameState('MAP');
  }, []);

  // 重新开始
  const restart = useCallback(() => {
    setGameState('START');
    setPlayer({
      maxHp: 80,
      hp: 80,
      maxEnergy: 3,
      energy: 3,
      block: 0,
      deck: generateInitialDeck(),
      hand: [],
      discard: [],
      drawPile: [],
      level: 1,
      gold: 100,
      strength: 0,
      dexterity: 0,
      vulnerable: 0,
      weak: 0,
    });
    setEnemies([]);
    setRelics([]);
    setBattleCount(0);
    setTurnNumber(1);
    setParticles([]);
    setFloatingTexts([]);
    setGestureProgress({});
  }, []);

  return {
    gameState,
    turn,
    turnNumber,
    battleCount,
    player,
    enemies,
    mapNodes,
    currentNode,
    relics,
    particles,
    floatingTexts,
    cameraShake,
    gestureProgress,
    setGameState,
    initMap,
    startBattle,
    playCard,
    endTurn,
    drawCards,
    addParticles,
    addFloatingText,
    updateEffects,
    processGesture,
    resetGestureProgress,
    selectMapNode,
    rest,
    selectReward,
    restart,
  };
}
