import { Button } from '@/components/ui/button';
import { Skull, Trophy, RotateCcw } from 'lucide-react';

interface GameOverScreenProps {
  isVictory: boolean;
  battleCount: number;
  onRestart: () => void;
}

export function GameOverScreen({ isVictory, battleCount, onRestart }: GameOverScreenProps) {
  return (
    <div className={`
      min-h-screen flex items-center justify-center p-8
      ${isVictory 
        ? 'bg-gradient-to-br from-yellow-950 via-orange-950 to-slate-950' 
        : 'bg-gradient-to-br from-red-950 via-slate-950 to-slate-950'}
    `}>
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {isVictory ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />
          </>
        )}
      </div>

      <div className="relative z-10 text-center max-w-2xl">
        {/* 图标 */}
        <div className="mb-8">
          {isVictory ? (
            <Trophy className="w-32 h-32 text-yellow-400 mx-auto animate-bounce" />
          ) : (
            <Skull className="w-32 h-32 text-red-400 mx-auto" />
          )}
        </div>

        {/* 标题 */}
        <h1 className={`
          text-6xl font-black mb-4
          ${isVictory 
            ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent' 
            : 'bg-gradient-to-r from-red-400 to-slate-400 bg-clip-text text-transparent'}
        `}>
          {isVictory ? 'VICTORY!' : 'GAME OVER'}
        </h1>

        {/* 描述 */}
        <p className="text-xl text-slate-400 mb-8">
          {isVictory 
            ? '你击败了所有敌人，成为了传说中的赛博法师！' 
            : '你的旅程在这里结束了...'}
        </p>

        {/* 统计 */}
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{battleCount}</div>
              <div className="text-slate-400 text-sm">战斗场次</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {isVictory ? 'BOSS' : '-'}
              </div>
              <div className="text-slate-400 text-sm">最高进度</div>
            </div>
          </div>
        </div>

        {/* 重新开始按钮 */}
        <Button
          onClick={onRestart}
          className={`
            px-12 py-6 text-xl font-bold
            ${isVictory 
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500' 
              : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500'}
            transition-all duration-300 hover:scale-105
          `}
        >
          <RotateCcw className="w-6 h-6 mr-3" />
          再次挑战
        </Button>
      </div>
    </div>
  );
}
