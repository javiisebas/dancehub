export const UPLOAD_CONFIG = {
    MAX_FILE_SIZE: Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || 200) * 1024 * 1024,
    MAX_IMAGE_SIZE: Number(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE || 50) * 1024 * 1024,
    MAX_VIDEO_SIZE: Number(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE || 2000) * 1024 * 1024,
} as const;



