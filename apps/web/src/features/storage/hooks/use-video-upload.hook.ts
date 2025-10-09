import type { UploadFileResponse } from '@repo/shared';
import { StorageVisibilityEnum, UploadProgressTypeEnum } from '@repo/shared';
import { useUploadProgress } from '@web/hooks/use-upload-progress.hook';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { videoService } from '../api/video.service';

interface VideoMetadata {
    lessonId?: string;
    courseId?: string;
    type?: string;
    [key: string]: string | number | boolean | undefined;
}

interface UseVideoUploadOptions {
    onSuccess?: (result: UploadFileResponse) => void;
    onError?: (error: Error) => void;
    metadata?: VideoMetadata;
    visibility?: StorageVisibilityEnum;
}

interface VideoUploadProgress {
    loaded: number;
    total: number;
    percentage: number;
    phase: 'uploading' | 'processing';
    message?: string;
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<VideoUploadProgress | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [result, setResult] = useState<UploadFileResponse | null>(null);
    const [currentUploadId, setCurrentUploadId] = useState<string | null>(null);

    const { uploadProgress } = useUploadProgress({
        userId: (session?.user as any)?.id,
        onProgress: (event) => {
            if (!currentUploadId || event.uploadId !== currentUploadId) {
                return;
            }

            if (
                event.type === UploadProgressTypeEnum.PROCESSING &&
                event.data &&
                event.data.phase === 'r2-upload' &&
                event.data.r2Progress !== undefined
            ) {
                setProgress((prev) => ({
                    loaded: prev?.loaded || 0,
                    total: prev?.total || 0,
                    percentage: event.data.r2Progress,
                    phase: 'processing',
                    message: event.message,
                }));
            }
        },
    });

    useEffect(() => {
        if (currentUploadId && uploadProgress[currentUploadId]) {
            const event = uploadProgress[currentUploadId];
            if (
                event.type === UploadProgressTypeEnum.PROCESSING &&
                event.data &&
                event.data.phase === 'r2-upload' &&
                event.data.r2Progress !== undefined
            ) {
                setProgress((prev) => ({
                    loaded: prev?.loaded || 0,
                    total: prev?.total || 0,
                    percentage: event.data.r2Progress,
                    phase: 'processing',
                    message: event.message,
                }));
            }
        }
    }, [uploadProgress, currentUploadId]);

    const uploadVideo = async (file: File) => {
        try {
            setIsUploading(true);
            setProgress({
                loaded: 0,
                total: file.size,
                percentage: 0,
                phase: 'uploading',
                message: 'Iniciando subida...',
            });
            setError(null);

            const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            setCurrentUploadId(uploadId);

            const uploadResult = await videoService.uploadVideo(file, {
                metadata: { ...options.metadata, uploadId },
                visibility: options.visibility,
                onProgress: (progressPercentage) => {
                    setProgress((prev) => ({
                        ...prev,
                        loaded: (file.size * progressPercentage) / 100,
                        total: file.size,
                        percentage: progressPercentage,
                        phase: progressPercentage === 100 ? 'processing' : 'uploading',
                        message:
                            progressPercentage === 100
                                ? 'Procesando video...'
                                : `Subiendo... ${progressPercentage}%`,
                    }));
                },
            });

            setResult(uploadResult);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (options.onSuccess) {
                options.onSuccess(uploadResult);
            }

            return uploadResult;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Upload failed');
            setError(error);

            if (options.onError) {
                options.onError(error);
            }

            throw error;
        } finally {
            setIsUploading(false);
            setTimeout(() => {
                setCurrentUploadId(null);
            }, 3000);
        }
    };

    const reset = () => {
        setIsUploading(false);
        setProgress(null);
        setError(null);
        setResult(null);
    };

    return {
        uploadVideo,
        isUploading,
        progress,
        error,
        result,
        reset,
    };
}
