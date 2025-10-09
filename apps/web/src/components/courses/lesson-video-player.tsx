'use client';

import { useVideoPlayer } from '@/hooks/use-video-player.hook';
import { createVideoSource } from '@/utils/video.util';
import { Icon } from '@iconify/react';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VideoPlayerCard = dynamic(
    () => import('@repo/ui/components/client-only').then((m) => m.VideoPlayerCard),
    { ssr: false },
);

interface LessonVideoPlayerProps {
    lessonId: string;
    videoUrl: string;
    posterUrl?: string;
    title: string;
    description?: string;
    duration?: number;
    onComplete?: () => void;
    onProgress?: (progress: number) => void;
    autoplay?: boolean;
}

export function LessonVideoPlayer({
    lessonId,
    videoUrl,
    posterUrl,
    title,
    description,
    duration,
    onComplete,
    onProgress,
    autoplay = false,
}: LessonVideoPlayerProps) {
    const { state, controls, handlers } = useVideoPlayer();
    const [hasCompleted, setHasCompleted] = useState(false);
    const [watchProgress, setWatchProgress] = useState(0);

    useEffect(() => {
        if (state.duration > 0 && state.currentTime > 0) {
            const progress = (state.currentTime / state.duration) * 100;
            setWatchProgress(progress);

            if (onProgress) {
                onProgress(progress);
            }

            if (progress >= 90 && !hasCompleted) {
                setHasCompleted(true);
                if (onComplete) {
                    onComplete();
                }
            }
        }
    }, [state.currentTime, state.duration, hasCompleted, onComplete, onProgress]);

    const handleRestart = () => {
        controls.restart();
        setHasCompleted(false);
        setWatchProgress(0);
    };

    return (
        <div className="space-y-4">
            <VideoPlayerCard
                title={title}
                description={description}
                sources={createVideoSource(videoUrl)}
                poster={posterUrl}
                autoplay={autoplay}
                {...handlers}
            />

            <Card className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Progress</p>
                            <p className="text-xs text-muted-foreground">
                                {watchProgress.toFixed(1)}% completed
                            </p>
                        </div>
                        {hasCompleted && (
                            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <Icon icon="iconoir:check-circle" className="h-5 w-5" />
                                <span className="font-medium">Completed</span>
                            </div>
                        )}
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${watchProgress}%` }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={controls.togglePlay} size="sm" variant="outline">
                            <Icon
                                icon={
                                    state.isPlaying ? 'iconoir:pause-solid' : 'iconoir:play-solid'
                                }
                                className="mr-2 h-4 w-4"
                            />
                            {state.isPlaying ? 'Pause' : 'Play'}
                        </Button>

                        <Button onClick={handleRestart} size="sm" variant="outline">
                            <Icon icon="iconoir:restart" className="mr-2 h-4 w-4" />
                            Restart
                        </Button>

                        <Button
                            onClick={() => controls.seek(state.currentTime - 10)}
                            size="sm"
                            variant="outline"
                        >
                            <Icon icon="iconoir:rewind" className="mr-2 h-4 w-4" />
                            -10s
                        </Button>

                        <Button
                            onClick={() => controls.seek(state.currentTime + 10)}
                            size="sm"
                            variant="outline"
                        >
                            <Icon icon="iconoir:forward" className="mr-2 h-4 w-4" />
                            +10s
                        </Button>

                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Speed:</span>
                            <select
                                value={state.speed}
                                onChange={(e) => controls.setSpeed(Number(e.target.value))}
                                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={0.75}>0.75x</option>
                                <option value={1}>1x</option>
                                <option value={1.25}>1.25x</option>
                                <option value={1.5}>1.5x</option>
                                <option value={2}>2x</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
