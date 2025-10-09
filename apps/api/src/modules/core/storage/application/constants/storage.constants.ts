import { ThumbnailSizeEnum } from '@repo/shared';

export const STORAGE_CONSTANTS = {
    FILE_SIZE_LIMITS: {
        IMAGE: 50 * 1024 * 1024, // 50MB
        VIDEO: 2000 * 1024 * 1024, // 2GB
        DOCUMENT: 50 * 1024 * 1024, // 50MB
        AUDIO: 100 * 1024 * 1024, // 100MB
        DEFAULT: 200 * 1024 * 1024, // 200MB
    },

    THUMBNAIL_SIZES: {
        [ThumbnailSizeEnum.SMALL]: { width: 150, height: 150 },
        [ThumbnailSizeEnum.MEDIUM]: { width: 300, height: 300 },
        [ThumbnailSizeEnum.LARGE]: { width: 600, height: 600 },
    },

    IMAGE_OPTIMIZATION: {
        MAX_WIDTH: 2048,
        MAX_HEIGHT: 2048,
        QUALITY: 85,
        THUMBNAIL_QUALITY: 80,
        FORMAT: 'webp' as const,
    },

    VIDEO_OPTIMIZATION: {
        MAX_WIDTH: 1920,
        CRF: 23,
        AUDIO_BITRATE: '128k',
        PRESET: 'medium' as const,
        FORMAT: 'mp4' as const,
        VIDEO_CODEC: 'libx264',
        AUDIO_CODEC: 'aac',
        PIXEL_FORMAT: 'yuv420p',
    },

    PROGRESS_PERCENTAGES: {
        UPLOAD_START: 0,
        SERVER_RECEIVED: 10,
        PROCESSING_START: 10,
        PROCESSING_COMPLETE: 15,
        UPLOAD_TO_STORAGE_START: 15,
        UPLOAD_TO_STORAGE_END: 85,
        THUMBNAIL_GENERATION: 90,
        COMPLETE: 100,
    },

    CLEANUP: {
        SOFT_DELETE_RETENTION_DAYS: 30,
        FAILED_UPLOAD_RETENTION_HOURS: 24,
        BATCH_SIZE: 100,
    },

    PRESIGNED_URL: {
        DEFAULT_EXPIRATION_SECONDS: 3600, // 1 hour
        MAX_EXPIRATION_SECONDS: 86400, // 24 hours
    },
} as const;
