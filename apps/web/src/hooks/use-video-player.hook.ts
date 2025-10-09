import type Plyr from 'plyr';
import { useCallback, useRef, useState } from 'react';

export interface VideoPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    quality: number | null;
    speed: number;
}

export interface VideoPlayerControls {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    setQuality: (quality: number) => void;
    setSpeed: (speed: number) => void;
    restart: () => void;
}

export function useVideoPlayer() {
    const playerRef = useRef<Plyr | null>(null);

    const [state, setState] = useState<VideoPlayerState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isMuted: false,
        isFullscreen: false,
        quality: null,
        speed: 1,
    });

    const handleReady = useCallback((player: Plyr) => {
        playerRef.current = player;

        setState((prev) => ({
            ...prev,
            duration: player.duration,
            volume: player.volume,
            isMuted: player.muted,
            quality: player.quality,
            speed: player.speed,
        }));
    }, []);

    const handlePlay = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: true }));
    }, []);

    const handlePause = useCallback(() => {
        setState((prev) => ({ ...prev, isPlaying: false }));
    }, []);

    const handleTimeUpdate = useCallback((currentTime: number) => {
        setState((prev) => ({ ...prev, currentTime }));
    }, []);

    const controls: VideoPlayerControls = {
        play: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.play();
            }
        }, []),

        pause: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.pause();
            }
        }, []),

        togglePlay: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.togglePlay();
            }
        }, []),

        seek: useCallback((time: number) => {
            if (playerRef.current) {
                playerRef.current.currentTime = time;
            }
        }, []),

        setVolume: useCallback((volume: number) => {
            if (playerRef.current) {
                playerRef.current.volume = volume;
                setState((prev) => ({ ...prev, volume }));
            }
        }, []),

        toggleMute: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.muted = !playerRef.current.muted;
                setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
            }
        }, []),

        toggleFullscreen: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.fullscreen.toggle();
            }
        }, []),

        setQuality: useCallback((quality: number) => {
            if (playerRef.current) {
                playerRef.current.quality = quality;
                setState((prev) => ({ ...prev, quality }));
            }
        }, []),

        setSpeed: useCallback((speed: number) => {
            if (playerRef.current) {
                playerRef.current.speed = speed;
                setState((prev) => ({ ...prev, speed }));
            }
        }, []),

        restart: useCallback(() => {
            if (playerRef.current) {
                playerRef.current.restart();
            }
        }, []),
    };

    return {
        state,
        controls,
        handlers: {
            onReady: handleReady,
            onPlay: handlePlay,
            onPause: handlePause,
            onTimeUpdate: handleTimeUpdate,
        },
        playerRef,
    };
}
