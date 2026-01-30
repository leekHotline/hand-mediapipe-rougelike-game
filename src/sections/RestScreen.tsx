import { useState } from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

interface RestScreenProps {
  playerHp: number;
  playerMaxHp: number;
  onRest: () => void;
  onSkip: () => void;
}

export function RestScreen({ playerHp, playerMaxHp, onRest, onSkip }: RestScreenProps) {
  const [isResting, setIsResting] = useState(false);
  const healAmount = Math.floor(playerMaxHp * 0.3);

  const handleRest = () => {
    setIsResting(true);
    setTimeout(() => {
      onRest();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-slate-950 flex items-center justify-center p-8">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* 标题 */}
        <Heart className="w-20 h-20 text-green-400 mx-auto mb-6 animate-pulse" />
        <h2 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          安全区域
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          你可以在这里休息恢复生命值，或者继续前进
        </p>

        {/* 当前状态 */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">当前生命值</span>
            <span className="text-white font-bold">{playerHp} / {playerMaxHp}</span>
          </div>
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
            />
          </div>
        </div>

        {/* 选项 */}
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={handleRest}
            disabled={isResting}
            className={`
              relative p-8 bg-slate-900/80 backdrop-blur-sm border-2 border-green-500/50 rounded-xl
              hover:border-green-500 hover:bg-green-900/20 transition-all duration-300
              ${isResting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">休息恢复</h3>
            <p className="text-slate-400 text-sm mb-4">回复 {healAmount} 点生命值</p>
            <div className="text-green-400 font-bold">
              {playerHp + healAmount > playerMaxHp ? playerMaxHp : playerHp + healAmount} / {playerMaxHp}
            </div>
            
            {isResting && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                <Sparkles className="w-12 h-12 text-green-400 animate-spin" />
              </div>
            )}
          </button>

          <button
            onClick={onSkip}
            disabled={isResting}
            className="p-8 bg-slate-900/80 backdrop-blur-sm border-2 border-slate-700 rounded-xl
              hover:border-cyan-500 hover:bg-cyan-900/20 transition-all duration-300"
          >
            <ArrowRight className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">继续前进</h3>
            <p className="text-slate-400 text-sm">不恢复生命值，直接前往下一个区域</p>
          </button>
        </div>
      </div>
    </div>
  );
}
