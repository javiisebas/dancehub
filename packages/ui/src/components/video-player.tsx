'use client';

import 'plyr/dist/plyr.css';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlyrInstance = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlyrOptions = any;

export interface VideoSource {
    src: string;
    type?: string;
    size?: number;
}

export interface VideoTrack {
    kind: 'captions' | 'subtitles';
    label: string;
    srclang: string;
    src: string;
    default?: boolean;
}

export interface VideoPlayerProps {
    sources: VideoSource | VideoSource[];
    poster?: string;
    tracks?: VideoTrack[];
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    className?: string;
    onReady?: (player: PlyrInstance) => void;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    onSeeked?: () => void;
    onError?: (error: Error | unknown) => void;
    options?: Partial<PlyrOptions>;
}

const defaultOptions: PlyrOptions = {
    controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'pip',
        'airplay',
        'fullscreen',
    ],
    settings: ['quality', 'speed'],
    speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    },
    autoplay: false,
    muted: false,
    blankVideo: '',
    loadSprite: true,
    iconUrl: 'https://cdn.plyr.io/3.7.8/plyr.svg',
    storage: { enabled: true, key: 'plyr_volume' },
    i18n: {
        restart: 'Restart',
        rewind: 'Rewind {seektime}s',
        play: 'Play',
        pause: 'Pause',
        fastForward: 'Forward {seektime}s',
        seek: 'Seek',
        seekLabel: '{currentTime} of {duration}',
        played: 'Played',
        buffered: 'Buffered',
        currentTime: 'Current time',
        duration: 'Duration',
        volume: 'Volume',
        mute: 'Mute',
        unmute: 'Unmute',
        enableCaptions: 'Enable captions',
        disableCaptions: 'Disable captions',
        download: 'Download',
        enterFullscreen: 'Enter fullscreen',
        exitFullscreen: 'Exit fullscreen',
        frameTitle: 'Player for {title}',
        captions: 'Captions',
        settings: 'Settings',
        pip: 'PIP',
        menuBack: 'Go back to previous menu',
        speed: 'Speed',
        normal: 'Normal',
        quality: 'Quality',
        loop: 'Loop',
    },
    ratio: '16:9',
    keyboard: { focused: true, global: false },
    tooltips: { controls: true, seek: true },
    hideControls: true,
    resetOnEnd: false,
    clickToPlay: true,
    disableContextMenu: true,
};

export function VideoPlayer({
    sources,
    poster,
    tracks = [],
    autoplay = false,
    muted = false,
    loop = false,
    controls = true,
    className,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onSeeked,
    onError,
    options = {},
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<PlyrInstance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [hasError, setHasError] = useState(false);
    const mountedRef = useRef(true);

    const sourcesArray = Array.isArray(sources) ? sources : [sources];
    const videoSource = sourcesArray[0];

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (!videoRef.current || !videoSource?.src) return;

        let player: PlyrInstance | null = null;
        let initTimeout: NodeJS.Timeout | null = null;

        const initializePlayer = async () => {
            try {
                if (playerRef.current) {
                    try {
                        playerRef.current.destroy();
                    } catch (e) {
                        console.warn('Failed to destroy previous player instance:', e);
                    }
                    playerRef.current = null;
                }

                await new Promise((resolve) => setTimeout(resolve, 50));

                if (!videoRef.current || !mountedRef.current) return;

                const mergedOptions: PlyrOptions = {
                    ...defaultOptions,
                    ...options,
                    controls: controls ? options.controls ?? defaultOptions.controls : [],
                    autoplay,
                    muted,
                    loop: { active: loop },
                };

                const Plyr = (await import('plyr')).default;

                initTimeout = setTimeout(() => {
                    if (!videoRef.current || !mountedRef.current) return;
                    player = new Plyr(videoRef.current!, mergedOptions);
                    playerRef.current = player;

                    player.on('ready', () => {
                        if (!mountedRef.current) return;
                        setIsLoading(false);
                        setHasError(false);
                        if (onReady) onReady(player);
                    });

                    player.on('canplay', () => {
                        if (!mountedRef.current) return;
                        setIsLoading(false);
                    });

                    player.on('loadeddata', () => {
                        if (!mountedRef.current) return;
                        setIsLoading(false);
                    });

                    player.on('loadedmetadata', () => {
                        if (!mountedRef.current) return;
                        setIsLoading(false);
                    });

                    player.on('waiting', () => {
                        if (!mountedRef.current) return;
                        setIsBuffering(true);
                    });

                    player.on('playing', () => {
                        if (!mountedRef.current) return;
                        setIsBuffering(false);
                    });

                    player.on('play', () => {
                        if (onPlay) onPlay();
                    });

                    player.on('pause', () => {
                        if (onPause) onPause();
                    });

                    player.on('ended', () => {
                        if (onEnded) onEnded();
                    });

                    player.on('timeupdate', () => {
                        if (onTimeUpdate && playerRef.current) {
                            onTimeUpdate(playerRef.current.currentTime);
                        }
                    });

                    player.on('seeked', () => {
                        if (onSeeked) onSeeked();
                    });

                    player.on('seeking', () => {
                        if (!mountedRef.current) return;
                        setIsBuffering(true);
                    });

                    player.on('error', (event: Event) => {
                        console.error('Video player error:', event);
                        if (!mountedRef.current) return;
                        setIsLoading(false);
                        setHasError(true);
                        if (onError) onError(event);
                    });

                    setTimeout(() => {
                        if (mountedRef.current) {
                            setIsLoading(false);
                        }
                    }, 5000);
                }, 100);
            } catch (error) {
                console.error('Failed to initialize Plyr:', error);
                if (mountedRef.current) {
                    setIsLoading(false);
                    setHasError(true);
                    if (onError) onError(error);
                }
            }
        };

        initializePlayer();

        return () => {
            if (initTimeout) {
                clearTimeout(initTimeout);
            }
            if (playerRef.current) {
                const currentPlayer = playerRef.current;
                playerRef.current = null;
                setTimeout(() => {
                    try {
                        currentPlayer.destroy();
                    } catch (e) {
                        console.warn('Failed to destroy player on cleanup:', e);
                    }
                }, 100);
            }
        };
    }, [
        videoSource?.src,
        autoplay,
        controls,
        loop,
        muted,
        onEnded,
        onError,
        onPause,
        onPlay,
        onReady,
        onSeeked,
        onTimeUpdate,
        options,
        poster,
        tracks,
    ]);

    return (
        <div className={cn('plyr-wrapper relative w-full overflow-hidden rounded-lg', className)}>
            {isLoading && !hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-sm text-white/80">Cargando video...</p>
                    </div>
                </div>
            )}
            {isBuffering && !isLoading && !hasError && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-transparent">
                    <div className="flex items-center gap-3 rounded-lg bg-black/60 px-4 py-3 backdrop-blur-sm">
                        <div className="border-3 h-6 w-6 animate-spin rounded-full border-white/30 border-t-white" />
                        <p className="text-sm font-medium text-white">Buffering...</p>
                    </div>
                </div>
            )}
            {hasError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
                    <div className="px-4 text-center text-white">
                        <p className="text-lg font-semibold">Error al cargar el video</p>
                        <p className="mt-2 text-sm text-white/70">
                            Por favor, intenta de nuevo más tarde
                        </p>
                    </div>
                </div>
            )}
            <video
                ref={videoRef}
                playsInline
                poster={poster}
                preload="metadata"
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%' }}
            >
                {videoSource?.src && (
                    <source src={videoSource.src} type={videoSource.type || 'video/mp4'} />
                )}
                {tracks.map((track, index) => (
                    <track
                        key={`track-${index}`}
                        kind={track.kind}
                        label={track.label}
                        srcLang={track.srclang}
                        src={track.src}
                        default={track.default}
                    />
                ))}
            </video>
        </div>
    );
}
