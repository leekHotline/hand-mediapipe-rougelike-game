import { useEffect, useRef, useCallback, useState } from 'react';
import { StartScreen } from '@/sections/StartScreen';
import { BattleScreen } from '@/sections/BattleScreen';
import { MapScreen } from '@/sections/MapScreen';
import { RewardScreen } from '@/sections/RewardScreen';
import { RestScreen } from '@/sections/RestScreen';
import { GameOverScreen } from '@/sections/GameOverScreen';
import { useGameState } from '@/hooks/useGameState';
import { useGestureRecognition } from '@/hooks/useGestureRecognition';
import { useAudio } from '@/hooks/useAudio';
import './App.css';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastGestureRef = useRef<string>('None');
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [isGestureReady, setIsGestureReady] = useState(false);

  const {
    gameState,
    turn,
    turnNumber,
    battleCount,
    player,
    enemies,
    mapNodes,
    currentNode,
    particles,
    floatingTexts,
    cameraShake,
    gestureProgress,
    initMap,
    endTurn,
    updateEffects,
    processGesture,
    resetGestureProgress,
    selectMapNode,
    rest,
    selectReward,
    restart,
  } = useGameState();

  const audio = useAudio();

  // 手势检测回调
  const handleGestureDetected = useCallback((gesture: string, _confidence: number) => {
    if (lastGestureRef.current !== gesture) {
      audio.playGestureLock();
      lastGestureRef.current = gesture;
    }
    audio.playCharge(gestureProgress[Object.keys(gestureProgress)[0]] || 0);
  }, [audio, gestureProgress]);

  const handleGestureLost = useCallback((gesture: string) => {
    resetGestureProgress(gesture as any);
    lastGestureRef.current = 'None';
  }, [resetGestureProgress]);

  // 手势识别
  const gesture = useGestureRecognition(handleGestureDetected, handleGestureLost);

  // 初始化游戏
  const handleStart = useCallback(async () => {
    console.log('[App] Starting game initialization...');
    setIsInitializing(true);
    setInitError(null);

    try {
      // 初始化音频
      console.log('[App] Initializing audio...');
      await audio.init();
      console.log('[App] Audio initialized!');

      // 初始化地图（不在这里初始化手势，等 BattleScreen 渲染后再初始化）
      console.log('[App] Initializing map...');
      initMap();
      console.log('[App] Map initialized!');
    } catch (error) {
      console.error('[App] Initialization error:', error);
      setInitError(error instanceof Error ? error.message : '初始化失败');
    } finally {
      setIsInitializing(false);
    }
  }, [audio, initMap]);

  // 当进入战斗界面时，初始化手势识别
  useEffect(() => {
    const initGesture = async () => {
      if (gameState === 'BATTLE' && !isGestureReady && !gesture.isLoading && videoRef.current) {
        console.log('[App] Battle started, initializing gesture recognition...');
        const success = await gesture.init(videoRef.current);
        if (success) {
          console.log('[App] Gesture recognition initialized!');
          setIsGestureReady(true);
        } else if (gesture.error) {
          console.error('[App] Gesture recognition failed:', gesture.error);
        }
      }
    };

    initGesture();
  }, [gameState, isGestureReady, gesture]);

  useEffect(() => {
    if (gameState !== 'BATTLE' && isGestureReady) {
      gesture.stop();
      setIsGestureReady(false);
      lastGestureRef.current = 'None';
    }
  }, [gameState, isGestureReady, gesture]);

  // 游戏循环
  useEffect(() => {
    let animationId: number;

    const gameLoop = () => {
      updateEffects();
      if (gesture.currentGesture !== 'None') {
        processGesture(gesture.currentGesture as any, gesture.confidence);
      }
      animationId = requestAnimationFrame(gameLoop);
    };

    if (gameState === 'BATTLE') {
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState, updateEffects, processGesture, gesture.currentGesture, gesture.confidence]);

  // 检查游戏结束
  useEffect(() => {
    if (player.hp <= 0 && gameState === 'BATTLE') {
      setTimeout(() => {
        // 游戏结束逻辑
      }, 1000);
    }
  }, [player.hp, gameState]);

  // 渲染当前屏幕
  const renderScreen = () => {
    switch (gameState) {
      case 'START':
        return (
          <StartScreen
            onStart={handleStart}
            isLoading={isInitializing}
            error={initError}
          />
        );

      case 'MAP':
        return (
          <MapScreen
            nodes={mapNodes}
            currentNode={currentNode}
            onSelectNode={selectMapNode}
          />
        );

      case 'BATTLE':
        return (
          <BattleScreen
            player={player}
            enemies={enemies}
            turn={turn}
            turnNumber={turnNumber}
            particles={particles}
            floatingTexts={floatingTexts}
            cameraShake={cameraShake}
            gestureProgress={gestureProgress}
            currentGesture={gesture.currentGesture}
            gestureConfidence={gesture.confidence}
            onEndTurn={endTurn}
            videoRef={videoRef}
          />
        );

      case 'REWARD':
        return (
          <RewardScreen
            onSelectReward={selectReward}
          />
        );

      case 'REST':
        return (
          <RestScreen
            playerHp={player.hp}
            playerMaxHp={player.maxHp}
            onRest={rest}
            onSkip={() => selectMapNode(currentNode)}
          />
        );

      case 'GAME_OVER':
        return (
          <GameOverScreen
            isVictory={false}
            battleCount={battleCount}
            onRestart={restart}
          />
        );

      case 'VICTORY':
        return (
          <GameOverScreen
            isVictory={true}
            battleCount={battleCount}
            onRestart={restart}
          />
        );

      default:
        return <StartScreen onStart={handleStart} isLoading={false} error={null} />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}
    </div>
  );
}

export default App;
