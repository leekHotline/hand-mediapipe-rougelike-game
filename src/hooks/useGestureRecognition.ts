import { useState, useRef, useCallback, useEffect } from 'react';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import type { GestureType } from '@/types/game';

interface GestureState {
  currentGesture: GestureType;
  confidence: number;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useGestureRecognition(
  onGestureDetected: (gesture: GestureType, confidence: number) => void,
  onGestureLost: (gesture: GestureType) => void
) {
  const [state, setState] = useState<GestureState>({
    currentGesture: 'None',
    confidence: 0,
    isReady: false,
    isLoading: false,
    error: null,
  });

  const recognizerRef = useRef<GestureRecognizer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gestureHistoryRef = useRef<GestureType[]>([]);
  const lastGestureRef = useRef<GestureType>('None');
  const lastEmitTimeRef = useRef(0);
  const lastSeenTimeRef = useRef(0);
  const isRunningRef = useRef(false);

  const ensureVideoReady = useCallback(async (videoElement: HTMLVideoElement) => {
    if (videoElement.readyState >= 2) {
      try {
        await videoElement.play();
      } catch (playErr) {
        console.warn('[Gesture] Video play blocked:', playErr);
      }
      return;
    }

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const handleLoaded = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      };
      const handleError = () => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Video failed to load'));
      };
      const timeoutId = window.setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error('Video load timeout'));
      }, 10000);

      const cleanup = () => {
        window.clearTimeout(timeoutId);
        videoElement.removeEventListener('loadeddata', handleLoaded);
        videoElement.removeEventListener('error', handleError);
      };

      videoElement.addEventListener('loadeddata', handleLoaded);
      videoElement.addEventListener('error', handleError);
    });

    try {
      await videoElement.play();
    } catch (playErr) {
      console.warn('[Gesture] Video play blocked:', playErr);
    }
  }, []);

  const attachStreamToVideo = useCallback(async (videoElement: HTMLVideoElement, stream: MediaStream) => {
    videoElement.srcObject = stream;
    videoElement.muted = true;
    videoElement.setAttribute('playsinline', 'true');
    await ensureVideoReady(videoElement);
  }, [ensureVideoReady]);

  const handleNoGesture = useCallback(() => {
    gestureHistoryRef.current = [];
    if (lastGestureRef.current !== 'None') {
      onGestureLost(lastGestureRef.current);
      lastGestureRef.current = 'None';
      lastEmitTimeRef.current = 0;
      setState(prev => ({
        ...prev,
        currentGesture: 'None',
        confidence: 0,
      }));
    }
  }, [onGestureLost]);

  const startDetectionLoop = useCallback(() => {
    if (!isRunningRef.current) return;
    if (animationFrameRef.current !== null) return;

    const detect = () => {
      if (!isRunningRef.current) {
        animationFrameRef.current = null;
        return;
      }
      if (!recognizerRef.current || !videoRef.current) {
        animationFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      try {
        const results = recognizerRef.current.recognizeForVideo(
          videoRef.current,
          performance.now()
        );

        if (results.gestures.length > 0) {
          const gestureData = results.gestures[0][0];
          const gestureName = gestureData.categoryName as GestureType;
          const confidence = gestureData.score;
          lastSeenTimeRef.current = performance.now();

          if (confidence > 0.5) {
            gestureHistoryRef.current.push(gestureName);
            if (gestureHistoryRef.current.length > 5) {
              gestureHistoryRef.current.shift();
            }

            const allSame = gestureHistoryRef.current.every(g => g === gestureName);
            if (allSame && gestureHistoryRef.current.length === 5) {
              const now = performance.now();
              if (lastGestureRef.current !== gestureName) {
                if (lastGestureRef.current !== 'None') {
                  onGestureLost(lastGestureRef.current);
                }
                lastGestureRef.current = gestureName;
              }

              if (now - lastEmitTimeRef.current >= 80) {
                onGestureDetected(gestureName, confidence);
                lastEmitTimeRef.current = now;
              }

              setState(prev => ({
                ...prev,
                currentGesture: gestureName,
                confidence,
              }));
            }
          } else {
            const now = performance.now();
            if (now - lastSeenTimeRef.current > 250) {
              handleNoGesture();
            }
          }
        } else {
          const now = performance.now();
          if (now - lastSeenTimeRef.current > 250) {
            handleNoGesture();
          }
        }
      } catch (error) {
        console.warn('[Gesture] Detection error:', error);
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [handleNoGesture, onGestureDetected, onGestureLost]);

  const init = useCallback(async (videoElement: HTMLVideoElement) => {
    console.log('[Gesture] Starting initialization...');

    if (state.isLoading) {
      console.log('[Gesture] Already loading, skipping...');
      return false;
    }

    if (recognizerRef.current && streamRef.current) {
      console.log('[Gesture] Already initialized, reusing recognizer...');
      videoRef.current = videoElement;
      try {
        await attachStreamToVideo(videoElement, streamRef.current);
        isRunningRef.current = true;
        if (animationFrameRef.current === null) {
          startDetectionLoop();
        }
        setState(prev => ({
          ...prev,
          isReady: true,
          isLoading: false,
          error: null,
        }));
        return true;
      } catch (error) {
        console.error('[Gesture] Failed to reattach stream:', error);
      }
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    videoRef.current = videoElement;

    try {
      console.log('[Gesture] Requesting camera permission...');
      console.log('[Gesture] Video element:', videoElement);
      console.log('[Gesture] isSecureContext:', window.isSecureContext);
      console.log('[Gesture] mediaDevices:', navigator.mediaDevices);

      if (!navigator.mediaDevices) {
        throw new Error('Camera API not available (mediaDevices missing)');
      }

      if (!window.isSecureContext) {
        console.warn('[Gesture] Insecure context detected. Camera access may fail.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user',
          },
          audio: false,
        });
        console.log('[Gesture] Camera permission granted!');
      } catch (cameraErr) {
        console.error('[Gesture] Camera permission denied:', cameraErr);
        throw new Error(`Camera permission denied: ${cameraErr instanceof Error ? cameraErr.message : 'Unknown error'}`);
      }

      streamRef.current = stream;
      await attachStreamToVideo(videoElement, stream);
      console.log('[Gesture] Video ready!');

      console.log('[Gesture] Loading MediaPipe...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
      );

      console.log('[Gesture] Creating gesture recognizer...');
      let recognizer: GestureRecognizer;
      try {
        recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      } catch (modelErr) {
        console.warn('[Gesture] GPU delegate failed, retrying with CPU:', modelErr);
        recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      }

      recognizerRef.current = recognizer;
      isRunningRef.current = true;

      setState(prev => ({
        ...prev,
        isReady: true,
        isLoading: false,
      }));

      console.log('[Gesture] Starting detection loop...');
      if (animationFrameRef.current === null) {
        startDetectionLoop();
      }

      return true;
    } catch (error) {
      console.error('[Gesture] Initialization error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      return false;
    }
  }, [attachStreamToVideo, startDetectionLoop, state.isLoading]);

  const stop = useCallback(() => {
    console.log('[Gesture] Stopping...');
    isRunningRef.current = false;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    recognizerRef.current = null;
    gestureHistoryRef.current = [];
    lastGestureRef.current = 'None';
    lastSeenTimeRef.current = 0;

    setState({
      currentGesture: 'None',
      confidence: 0,
      isReady: false,
      isLoading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    ...state,
    init,
    stop,
    videoRef,
  };
}
