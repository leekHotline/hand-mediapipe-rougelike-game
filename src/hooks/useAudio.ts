import { useRef, useCallback, useState } from 'react';
import * as Tone from 'tone';

export function useAudio() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const noiseRef = useRef<Tone.NoiseSynth | null>(null);
  const membraneRef = useRef<Tone.MembraneSynth | null>(null);
  const metalRef = useRef<Tone.MetalSynth | null>(null);

  // 初始化音频
  const init = useCallback(async () => {
    if (isInitialized) return;

    try {
      await Tone.start();

      // 主合成器 - 用于卡牌音效
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();
      synthRef.current.volume.value = -12;

      // 噪音合成器 - 用于打击音效
      noiseRef.current = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0,
        },
      }).toDestination();
      noiseRef.current.volume.value = -15;

      // 鼓膜合成器 - 用于重击音效
      membraneRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
        },
      }).toDestination();
      membraneRef.current.volume.value = -10;

      // 金属合成器 - 用于格挡音效
      metalRef.current = new Tone.MetalSynth({
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.01,
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).toDestination();
      metalRef.current.volume.value = -20;

      setIsInitialized(true);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, [isInitialized]);

  // 播放卡牌音效
  const playCardPlay = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    synthRef.current.triggerAttackRelease(['C5', 'E5'], '8n');
  }, [isInitialized, isMuted]);

  // 播放伤害音效
  const playDamage = useCallback(() => {
    if (!isInitialized || isMuted || !noiseRef.current) return;
    noiseRef.current.triggerAttackRelease('16n');
    if (membraneRef.current) {
      membraneRef.current.triggerAttackRelease('C2', '8n');
    }
  }, [isInitialized, isMuted]);

  // 播放治疗音效
  const playHeal = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    synthRef.current.triggerAttackRelease(['G4', 'C5', 'E5'], '4n');
  }, [isInitialized, isMuted]);

  // 播放格挡音效
  const playBlock = useCallback(() => {
    if (!isInitialized || isMuted || !metalRef.current) return;
    metalRef.current.triggerAttackRelease('C5', '32n');
  }, [isInitialized, isMuted]);

  // 播放手势锁定音效
  const playGestureLock = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    synthRef.current.triggerAttackRelease('A5', '32n');
  }, [isInitialized, isMuted]);

  // 播放蓄力音效
  const playCharge = useCallback((progress: number) => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    if (progress > 0.8) {
      synthRef.current.triggerAttackRelease('E6', '64n', undefined, 0.3);
    }
  }, [isInitialized, isMuted]);

  // 播放回合开始音效
  const playTurnStart = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    synthRef.current.triggerAttackRelease(['C4', 'G4'], '8n');
  }, [isInitialized, isMuted]);

  // 播放胜利音效
  const playVictory = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    const now = Tone.now();
    synthRef.current.triggerAttackRelease('C4', '8n', now);
    synthRef.current.triggerAttackRelease('E4', '8n', now + 0.1);
    synthRef.current.triggerAttackRelease('G4', '8n', now + 0.2);
    synthRef.current.triggerAttackRelease('C5', '4n', now + 0.3);
  }, [isInitialized, isMuted]);

  // 播放失败音效
  const playDefeat = useCallback(() => {
    if (!isInitialized || isMuted || !synthRef.current) return;
    const now = Tone.now();
    synthRef.current.triggerAttackRelease('C4', '8n', now);
    synthRef.current.triggerAttackRelease('B3', '8n', now + 0.2);
    synthRef.current.triggerAttackRelease('A3', '4n', now + 0.4);
  }, [isInitialized, isMuted]);

  // 切换静音
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    Tone.Destination.mute = !isMuted;
  }, [isMuted]);

  return {
    isInitialized,
    isMuted,
    init,
    playCardPlay,
    playDamage,
    playHeal,
    playBlock,
    playGestureLock,
    playCharge,
    playTurnStart,
    playVictory,
    playDefeat,
    toggleMute,
  };
}
