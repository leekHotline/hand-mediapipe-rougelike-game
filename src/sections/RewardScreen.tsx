import { useState } from 'react';
import { 
  Sparkles, 
  Coins, 
  Gem, 
  Swords, 
  Check
} from 'lucide-react';
import type { CardData, Relic } from '@/types/game';
import { generateRandomCard, generateRandomRelic } from '@/lib/gameData';

interface RewardScreenProps {
  onSelectReward: (type: 'card' | 'gold' | 'relic', value?: CardData | Relic | number) => void;
}

export function RewardScreen({ onSelectReward }: RewardScreenProps) {
  const [selectedType, setSelectedType] = useState<'card' | 'gold' | 'relic' | null>(null);
  const [rewardCard] = useState(() => generateRandomCard());
  const [rewardRelic] = useState(() => generateRandomRelic());
  const [goldAmount] = useState(() => 50 + Math.floor(Math.random() * 50));

  const handleSelect = (type: 'card' | 'gold' | 'relic') => {
    setSelectedType(type);
    
    setTimeout(() => {
      if (type === 'card') {
        onSelectReward('card', rewardCard);
      } else if (type === 'gold') {
        onSelectReward('gold', goldAmount);
      } else if (type === 'relic') {
        onSelectReward('relic', rewardRelic);
      }
    }, 500);
  };

  // 手势图标映射
  const gestureIcons: Record<string, string> = {
    'Closed_Fist': '✊',
    'Open_Palm': '✋',
    'Pointing_Up': '☝️',
    'Thumb_Up': '👍',
    'Victory': '✌️',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* 标题 */}
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            战斗胜利！
          </h2>
          <p className="text-slate-400 mt-2">选择你的奖励</p>
        </div>

        {/* 奖励选项 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 卡牌奖励 */}
          <button
            onClick={() => handleSelect('card')}
            disabled={selectedType !== null}
            className={`
              relative p-6 bg-slate-900/80 backdrop-blur-sm border-2 rounded-xl
              transition-all duration-300 text-left
              ${selectedType === 'card' 
                ? 'border-green-500 bg-green-900/20 scale-105' 
                : 'border-slate-700 hover:border-cyan-500 hover:bg-slate-800/80'}
              ${selectedType !== null && selectedType !== 'card' ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Swords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">新卡牌</h3>
                <p className="text-slate-400 text-sm">加入牌库</p>
              </div>
            </div>

            {/* 卡牌预览 */}
            <div 
              className="w-full h-48 rounded-lg overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${rewardCard.color}20 0%, ${rewardCard.color}40 100%)`,
                border: `2px solid ${rewardCard.color}`,
              }}
            >
              <div className="absolute top-2 left-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-sm">
                {rewardCard.cost}
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-4xl">
                {gestureIcons[rewardCard.gesture]}
              </div>
              <div className="absolute top-24 left-0 right-0 text-center">
                <span className="text-white font-bold">{rewardCard.name}</span>
              </div>
              <div className="absolute top-32 left-2 right-2 text-center">
                <span className="text-slate-300 text-xs">{rewardCard.description}</span>
              </div>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3">
                {rewardCard.damage > 0 && (
                  <span className="text-red-400 text-sm font-bold">⚔ {rewardCard.damage}</span>
                )}
                {rewardCard.block > 0 && (
                  <span className="text-blue-400 text-sm font-bold">🛡 {rewardCard.block}</span>
                )}
                {rewardCard.heal > 0 && (
                  <span className="text-green-400 text-sm font-bold">❤ {rewardCard.heal}</span>
                )}
              </div>
            </div>

            {selectedType === 'card' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <Check className="w-16 h-16 text-green-400" />
              </div>
            )}
          </button>

          {/* 金币奖励 */}
          <button
            onClick={() => handleSelect('gold')}
            disabled={selectedType !== null}
            className={`
              relative p-6 bg-slate-900/80 backdrop-blur-sm border-2 rounded-xl
              transition-all duration-300 text-left
              ${selectedType === 'gold' 
                ? 'border-green-500 bg-green-900/20 scale-105' 
                : 'border-slate-700 hover:border-yellow-500 hover:bg-slate-800/80'}
              ${selectedType !== null && selectedType !== 'gold' ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">金币</h3>
                <p className="text-slate-400 text-sm">用于商店</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-48">
              <Coins className="w-20 h-20 text-yellow-400 mb-4" />
              <span className="text-4xl font-bold text-yellow-400">{goldAmount}</span>
              <span className="text-slate-400 text-sm mt-2">金币</span>
            </div>

            {selectedType === 'gold' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <Check className="w-16 h-16 text-green-400" />
              </div>
            )}
          </button>

          {/* 遗物奖励 */}
          <button
            onClick={() => handleSelect('relic')}
            disabled={selectedType !== null}
            className={`
              relative p-6 bg-slate-900/80 backdrop-blur-sm border-2 rounded-xl
              transition-all duration-300 text-left
              ${selectedType === 'relic' 
                ? 'border-green-500 bg-green-900/20 scale-105' 
                : 'border-slate-700 hover:border-purple-500 hover:bg-slate-800/80'}
              ${selectedType !== null && selectedType !== 'relic' ? 'opacity-50' : ''}
            `}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold">遗物</h3>
                <p className="text-slate-400 text-sm">永久加成</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-48">
              <Gem className="w-20 h-20 text-purple-400 mb-4" />
              <span className="text-white font-bold text-center px-2">{rewardRelic.name}</span>
              <span className="text-slate-400 text-xs text-center mt-2 px-2">{rewardRelic.description}</span>
            </div>

            {selectedType === 'relic' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <Check className="w-16 h-16 text-green-400" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
