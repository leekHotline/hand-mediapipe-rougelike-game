import { Button } from '@/components/ui/button';
import { Loader2, Camera, Gamepad2, Sparkles } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  isLoading: boolean;
  error: string | null;
}

export function StartScreen({ onStart, isLoading, error }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* CRT 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }} />
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-7xl md:text-8xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NEON
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ARCANA
            </span>
          </h1>
          <p className="text-xl text-cyan-300/70 tracking-[0.3em] uppercase font-light">
            Gesture-Based Cyber Roguelike
          </p>
        </div>

        {/* 副标题 */}
        <div className="mb-12 flex items-center justify-center gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            <span className="text-sm">手势识别</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm">卡牌策略</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">Roguelike</span>
          </div>
        </div>

        {/* 手势说明 */}
        <div className="mb-12 p-6 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl">
          <h3 className="text-cyan-400 font-bold mb-4 text-lg">手势指令表</h3>
          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✊</span>
              <span className="text-xs text-slate-400">拳头</span>
              <span className="text-xs text-red-400">攻击</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✋</span>
              <span className="text-xs text-slate-400">手掌</span>
              <span className="text-xs text-blue-400">防御</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">☝️</span>
              <span className="text-xs text-slate-400">食指</span>
              <span className="text-xs text-orange-400">穿刺</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✌️</span>
              <span className="text-xs text-slate-400">剪刀</span>
              <span className="text-xs text-purple-400">连击</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">👍</span>
              <span className="text-xs text-slate-400">拇指</span>
              <span className="text-xs text-green-400">治疗</span>
            </div>
          </div>
        </div>

        {/* 开始按钮 */}
        <Button
          onClick={onStart}
          disabled={isLoading}
          className="relative group px-12 py-6 text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 border-0 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              初始化神经连接...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3" />
              初始化神经连接
            </>
          )}
        </Button>

        {/* 错误提示 */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-500/50 rounded-lg text-red-400 max-w-lg mx-auto">
            <p className="font-medium mb-2">连接失败</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-red-400/70">
              请确保：1. 使用 Chrome/Edge 浏览器 2. 允许摄像头权限 3. 使用 HTTPS 或 localhost
            </p>
          </div>
        )}

        {/* 技术说明 */}
        <div className="mt-12 text-xs text-slate-500 max-w-2xl mx-auto">
          <p className="mb-2">
            <span className="text-cyan-500">手势识别：</span>
            MediaPipe Tasks Vision 本地运行，通过 WebAssembly 执行 TensorFlow Lite 模型，无需云端 API
          </p>
          <p className="mb-2">
            <span className="text-purple-500">音频合成：</span>
            Tone.js 调用 Web Audio API 实时生成音效
          </p>
          <p>
            <span className="text-pink-500">游戏逻辑：</span>
            纯前端实现，可完全离线运行
          </p>
        </div>
      </div>
    </div>
  );
}
