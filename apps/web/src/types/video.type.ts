export interface Video {
    id: string;
    title: string;
    description?: string;
    storageId: string;
    url: string;
    posterUrl?: string;
    duration?: number;
    width?: number;
    height?: number;
    size?: number;
    mimeType: string;
    qualities?: VideoQuality[];
    captions?: VideoCaption[];
    createdAt: Date;
    updatedAt: Date;
}

export interface VideoQuality {
    resolution: number;
    url: string;
    size?: number;
    bitrate?: number;
}

export interface VideoCaption {
    language: string;
    label: string;
    url: string;
    default?: boolean;
}

export interface VideoMetadata {
    duration?: number;
    width?: number;
    height?: number;
    bitrate?: number;
    codec?: string;
    framerate?: number;
    aspectRatio?: string;
}

export interface VideoUploadProgress {
    uploadId: string;
    progress: number;
    status: 'uploading' | 'processing' | 'complete' | 'error';
    storageId?: string;
    error?: string;
}
