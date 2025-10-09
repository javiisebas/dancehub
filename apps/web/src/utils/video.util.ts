import type { VideoSource, VideoTrack } from '@repo/ui/components';
import type { VideoCaption, VideoQuality } from '@/types/video.type';

export function createVideoSource(url: string, quality?: number, type?: string): VideoSource {
    return {
        src: url,
        type: type || detectVideoType(url),
        size: quality,
    };
}

export function createVideoSources(baseUrl: string, qualities: VideoQuality[]): VideoSource[] {
    return qualities.map((quality) =>
        createVideoSource(quality.url, quality.resolution, detectVideoType(quality.url)),
    );
}

export function createVideoTrack(caption: VideoCaption): VideoTrack {
    return {
        kind: 'subtitles',
        label: caption.label,
        srclang: caption.language,
        src: caption.url,
        default: caption.default,
    };
}

export function detectVideoType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'ogg':
            return 'video/ogg';
        case 'mov':
            return 'video/quicktime';
        case 'avi':
            return 'video/x-msvideo';
        case 'm3u8':
            return 'application/x-mpegURL';
        case 'mpd':
            return 'application/dash+xml';
        default:
            return 'video/mp4';
    }
}

export function formatVideoDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatVideoSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

export function getVideoResolutionLabel(height: number): string {
    if (height >= 2160) return '4K';
    if (height >= 1440) return '2K';
    if (height >= 1080) return 'Full HD';
    if (height >= 720) return 'HD';
    if (height >= 480) return 'SD';
    return 'Low';
}

export function isVideoSupported(mimeType: string): boolean {
    const video = document.createElement('video');
    return video.canPlayType(mimeType) !== '';
}

export function getOptimalQuality(
    qualities: VideoQuality[],
    maxResolution?: number,
): VideoQuality | undefined {
    if (!qualities.length) return undefined;

    const sorted = [...qualities].sort((a, b) => b.resolution - a.resolution);

    if (!maxResolution) {
        return sorted[0];
    }

    const suitable = sorted.find((q) => q.resolution <= maxResolution);
    return suitable || sorted[sorted.length - 1];
}

export function buildR2VideoUrl(
    storageUrl: string,
    quality?: 'original' | '1080p' | '720p' | '480p' | '360p',
): string {
    if (!quality || quality === 'original') {
        return storageUrl;
    }

    const qualityMap: Record<string, number> = {
        '1080p': 1080,
        '720p': 720,
        '480p': 480,
        '360p': 360,
    };

    const resolution = qualityMap[quality];
    const pathParts = storageUrl.split('/');
    const filename = pathParts[pathParts.length - 1];
    if (!filename) return storageUrl;

    const basePath = pathParts.slice(0, -1).join('/');
    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) return storageUrl;

    const name = filename.substring(0, dotIndex);
    const ext = filename.substring(dotIndex + 1);

    return `${basePath}/${name}_${resolution}p.${ext}`;
}
