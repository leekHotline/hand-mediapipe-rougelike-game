import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Zap, 
  Heart, 
  SkipForward
} from 'lucide-react';
import type { 
  PlayerState, 
  EnemyData, 
  Turn,
  Particle,
  FloatingText,
  GestureType 
} from '@/types/game';

interface BattleScreenProps {
  player: PlayerState;
  enemies: EnemyData[];
  turn: Turn;
  turnNumber: number;
  particles: Particle[];
  floatingTexts: FloatingText[];
  cameraShake: number;
  gestureProgress: Record<string, number>;
  currentGesture: GestureType;
  gestureConfidence: number;
  onEndTurn: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

// 手势图标映射
const GESTURE_ICONS: Record<GestureType, string> = {
  'Closed_Fist': '✊',
  'Open_Palm': '✋',
  'Pointing_Up': '☝️',
  'Thumb_Up': '👍',
  'Victory': '✌️',
  'None': '❓',
};

// 手势颜色映射
const GESTURE_COLORS: Record<GestureType, string> = {
  'Closed_Fist': '#ff4444',
  'Open_Palm': '#4488ff',
  'Pointing_Up': '#ff8844',
  'Thumb_Up': '#44ff44',
  'Victory': '#ff44ff',
  'None': '#666666',
};

export function BattleScreen({
  player,
  enemies,
  turn,
  turnNumber,
  particles,
  floatingTexts,
  cameraShake,
  gestureProgress,
  currentGesture,
  gestureConfidence,
  onEndTurn,
  videoRef,
}: BattleScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制粒子和浮动文字
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 应用相机抖动
    ctx.save();
    if (cameraShake > 0.5) {
      ctx.translate(
        (Math.random() - 0.5) * cameraShake,
        (Math.random() - 0.5) * cameraShake
      );
    }

    // 绘制粒子
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    ctx.globalAlpha = 1;

    // 绘制浮动文字
    floatingTexts.forEach(t => {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);
      ctx.globalAlpha = t.life;
      ctx.fillStyle = t.color;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = t.color;
      ctx.fillText(t.text, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }, [particles, floatingTexts, cameraShake]);

  // 获取卡牌位置
  const getCardPosition = (index: number, total: number) => {
    const spacing = 160;
    const startX = (window.innerWidth - (total - 1) * spacing) / 2;
    return {
      x: startX + index * spacing,
      y: window.innerHeight - 200,
      rotation: (index - (total - 1) / 2) * 0.08,
    };
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 背景网格 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* 粒子画布 */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none z-50"
      />

      {/* 回合指示器 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <div className={`px-6 py-2 rounded-full font-bold text-lg ${
          turn === 'player' 
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
            : 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
        }`}>
          {turn === 'player' ? '◀ 玩家回合 ▶' : '◀ 敌方回合 ▶'}
        </div>
        <div className="text-center text-slate-500 text-sm mt-1">
          第 {turnNumber} 回合
        </div>
      </div>

      {/* 玩家状态面板 */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 min-w-[240px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-cyan-400 font-bold">赛博法师</span>
            <span className="text-slate-400 text-sm">Lv.{player.level}</span>
          </div>

          {/* 生命值 */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" /> HP
              </span>
              <span className="text-slate-300">{player.hp}/{player.maxHp}</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* 能量 */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" /> 能量
              </span>
              <span className="text-slate-300">{player.energy}/{player.maxEnergy}</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}
              />
            </div>
          </div>

          {/* 格挡 */}
          {player.block > 0 && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>格挡: {player.block}</span>
            </div>
          )}

          {/* 状态效果 */}
          <div className="flex gap-2 mt-2">
            {player.strength > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                力量 {player.strength}
              </span>
            )}
            {player.dexterity > 0 && (
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                敏捷 {player.dexterity}
              </span>
            )}
            {player.vulnerable > 0 && (
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                易伤 {player.vulnerable}
              </span>
            )}
            {player.weak > 0 && (
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                虚弱 {player.weak}
              </span>
            )}
          </div>

          {/* 牌堆信息 */}
          <div className="mt-3 pt-3 border-t border-slate-700 flex justify-between text-xs text-slate-500">
            <span>牌库: {player.deck.length}</span>
            <span>弃牌: {player.discard.length}</span>
            <span>抽牌: {player.drawPile.length}</span>
          </div>
        </div>
      </div>

      {/* 手势指示器 */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-pink-500/30 rounded-xl p-4 text-center">
          <div className="text-xs text-slate-400 mb-2">GESTURE LOCK</div>
          <div 
            className="text-6xl mb-2 transition-all duration-200"
            style={{ 
              color: GESTURE_COLORS[currentGesture],
              textShadow: currentGesture !== 'None' ? `0 0 20px ${GESTURE_COLORS[currentGesture]}` : 'none',
              transform: currentGesture !== 'None' ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {GESTURE_ICONS[currentGesture]}
          </div>
          <div className="text-sm text-slate-300 font-medium">
            {currentGesture === 'None' ? '等待手势...' : currentGesture.replace(/_/g, ' ')}
          </div>
          {currentGesture !== 'None' && (
            <div className="text-xs text-slate-500 mt-1">
              置信度: {Math.floor(gestureConfidence * 100)}%
            </div>
          )}
        </div>
      </div>

      {/* 摄像头预览 */}
      <div className="absolute bottom-4 left-4 z-30">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-2 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-36 object-cover rounded-lg opacity-70"
            style={{ transform: 'scaleX(-1)' }}
          />
          <div className="absolute bottom-3 left-3 text-xs text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded">
            NEURAL LINK: <span className="text-green-400">ONLINE</span>
          </div>
        </div>
      </div>

      {/* 敌人区域 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-16 z-20">
        {enemies.map((enemy) => (
          <div key={enemy.id} className="relative">
            {/* 敌人意图 */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center">
              <div className="text-3xl mb-1">
                {enemy.intent === 'attack' ? '⚔️' : enemy.intent === 'defend' ? '🛡️' : '✨'}
              </div>
              <div className="text-xs text-slate-400">
                {enemy.intent === 'attack' ? `${enemy.nextDamage} 伤害` : 
                 enemy.intent === 'defend' ? `${enemy.nextBlock} 格挡` : '强化'}
              </div>
            </div>

            {/* 敌人本体 */}
            <div 
              className="relative w-32 h-32"
              style={{
                filter: enemy.hp <= 0 ? 'grayscale(100%)' : 'none',
              }}
            >
              {/* 发光效果 */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-50"
                style={{ background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)' }}
              />
              
              {/* 核心 */}
              <div className="absolute inset-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-lg shadow-purple-500/50 flex items-center justify-center">
                <span className="text-4xl">👾</span>
              </div>

              {/* 状态效果 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {enemy.vulnerable > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-500/80 text-white text-[10px] rounded">
                    易伤
                  </span>
                )}
                {enemy.weak > 0 && (
                  <span className="px-1.5 py-0.5 bg-purple-500/80 text-white text-[10px] rounded">
                    虚弱
                  </span>
                )}
                {enemy.strength > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500/80 text-white text-[10px] rounded">
                    力量
                  </span>
                )}
              </div>
            </div>

            {/* 血条 */}
            <div className="mt-4 w-32">
              <div className="text-xs text-slate-400 text-center mb-1">{enemy.name}</div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300"
                  style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-500 text-center mt-0.5">
                {enemy.hp}/{enemy.maxHp}
              </div>
              {enemy.block > 0 && (
                <div className="text-xs text-blue-400 text-center mt-0.5">
                  🛡️ {enemy.block}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 手牌区域 */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-40">
        <div className="relative w-full h-full flex items-end justify-center pb-4">
          {player.hand.map((card, index) => {
            const pos = getCardPosition(index, player.hand.length);
            const progress = gestureProgress[card.id] || 0;
            const isCharging = progress > 0;

            return (
              <div
                key={card.id}
                className="absolute transition-all duration-200"
                style={{
                  left: pos.x,
                  bottom: 20,
                  transform: `translateX(-50%) rotate(${pos.rotation}rad) scale(${1 + progress * 0.1})`,
                  zIndex: isCharging ? 50 : index,
                }}
              >
                {/* 卡牌 */}
                <div 
                  className="relative w-36 h-52 rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    boxShadow: isCharging 
                      ? `0 0 ${20 + progress * 30}px ${card.color}, 0 0 40px ${card.color}` 
                      : '0 4px 20px rgba(0,0,0,0.5)',
                    border: `2px solid ${isCharging ? '#fff' : card.color}`,
                  }}
                >
                  {/* 背景 */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}20 0%, ${card.color}40 100%)`,
                    }}
                  />

                  {/* 蓄力进度条 */}
                  {isCharging && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                      <div 
                        className="h-full bg-white transition-all duration-75"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  )}

                  {isCharging && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold bg-white/90 text-slate-900 rounded-full">
                      SELECTED
                    </div>
                  )}

                  {/* 费用 */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-slate-900">
                    {card.cost}
                  </div>

                  {/* 手势图标 */}
                  <div 
                    className="absolute top-12 left-1/2 -translate-x-1/2 text-5xl"
                    style={{ 
                      color: isCharging ? '#fff' : card.color,
                      textShadow: isCharging ? `0 0 20px ${card.color}` : 'none',
                    }}
                  >
                    {GESTURE_ICONS[card.gesture]}
                  </div>

                  {/* 名称 */}
                  <div className="absolute top-28 left-0 right-0 text-center">
                    <span className="text-white font-bold text-sm">{card.name}</span>
                  </div>

                  {/* 描述 */}
                  <div className="absolute top-36 left-2 right-2 text-center">
                    <span className="text-slate-300 text-xs leading-tight">{card.description}</span>
                  </div>

                  {/* 数值 */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
                    {card.damage > 0 && (
                      <span className="text-red-400 text-sm font-bold">⚔ {card.damage}</span>
                    )}
                    {card.block > 0 && (
                      <span className="text-blue-400 text-sm font-bold">🛡 {card.block}</span>
                    )}
                    {card.heal > 0 && (
                      <span className="text-green-400 text-sm font-bold">❤ {card.heal}</span>
                    )}
                  </div>

                  {/* 稀有度 */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{
                      background: card.rarity === 'legendary' ? '#ffd700' :
                                  card.rarity === 'epic' ? '#ff00ff' :
                                  card.rarity === 'rare' ? '#0088ff' : '#888888',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 结束回合按钮 */}
      {turn === 'player' && (
        <div className="absolute bottom-72 right-8 z-50">
          <Button
            onClick={onEndTurn}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold px-6 py-3 shadow-lg shadow-orange-500/25"
          >
            <SkipForward className="w-5 h-5 mr-2" />
            结束回合
          </Button>
        </div>
      )}

      {/* 提示文字 */}
      <div className="absolute bottom-72 left-1/2 -translate-x-1/2 text-slate-500 text-sm">
        做出对应手势来打出卡牌
      </div>
    </div>
  );
}
