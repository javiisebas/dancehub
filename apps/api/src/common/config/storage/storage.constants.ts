export const STORAGE_CONSTANTS = {
    MAX_FILE_SIZE: {
        IMAGE: 5 * 1024 * 1024, // 5MB
        DOCUMENT: 10 * 1024 * 1024, // 10MB
        VIDEO: 100 * 1024 * 1024, // 100MB
        AUDIO: 20 * 1024 * 1024, // 20MB
        DEFAULT: 10 * 1024 * 1024, // 10MB
    },
    PRESIGNED_URL: {
        DEFAULT_EXPIRES_IN: 3600, // 1 hour
        MAX_EXPIRES_IN: 604800, // 7 days
    },
    RATE_LIMIT: {
        UPLOAD: {
            LIMIT: 10,
            TTL: 60000, // 1 minute
        },
        UPLOAD_IMAGE: {
            LIMIT: 20,
            TTL: 60000, // 1 minute
        },
    },
} as const;
