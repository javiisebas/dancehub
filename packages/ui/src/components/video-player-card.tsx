'use client';

import { cn } from '../utils/cn';
import { Card } from './card';
import { VideoPlayer, VideoSource, VideoTrack } from './video-player';

interface VideoPlayerCardProps {
    title?: string;
    description?: string;
    sources: VideoSource | VideoSource[];
    poster?: string;
    tracks?: VideoTrack[];
    autoplay?: boolean;
    muted?: boolean;
    className?: string;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
}

export function VideoPlayerCard({
    title,
    description,
    sources,
    poster,
    tracks,
    autoplay = false,
    muted = false,
    className,
    onPlay,
    onPause,
    onEnded,
}: VideoPlayerCardProps) {
    return (
        <Card className={cn('overflow-hidden', className)}>
            {(title || description) && (
                <div className="p-4">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
            <VideoPlayer
                sources={sources}
                poster={poster}
                tracks={tracks}
                autoplay={autoplay}
                muted={muted}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
            />
        </Card>
    );
}
