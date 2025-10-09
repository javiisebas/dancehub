import { StorageVisibilityEnum, UploadFileResponse, UploadProgressEvent } from '@repo/shared';
import { useMutation } from '@tanstack/react-query';
import { useUploadProgress } from '@web/hooks/use-upload-progress.hook';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { StorageService, UploadOptions } from '../api/storage.service';
import { formatUploadProgress } from '../utils/upload-progress-formatter';

export interface FileUploadState {
    uploadId: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    message: string;
    result?: UploadFileResponse;
    error?: string;
}

export interface UseFileUploadOptions {
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, unknown>;
    onSuccess?: (result: UploadFileResponse) => void;
    onError?: (error: Error) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
    const { data: session } = useSession();
    const [uploads, setUploads] = useState<Record<string, FileUploadState>>({});

    const handleProgress = useCallback((event: UploadProgressEvent) => {
        console.log(`[Frontend] Progress event for ${event.uploadId}:`, {
            type: event.type,
            phase: event.phase,
            progress: event.progress,
        });

        setUploads((prev) => {
            const upload = prev[event.uploadId];
            if (!upload) {
                console.warn(`[Frontend] Received progress for unknown upload: ${event.uploadId}`);
                console.log('  Known uploads:', Object.keys(prev));
                return prev;
            }

            const newStatus =
                event.type === 'upload'
                    ? 'uploading'
                    : event.type === 'processing' || event.type === 'thumbnail'
                      ? 'processing'
                      : event.type === 'complete'
                        ? 'complete'
                        : 'error';

            const formatted = formatUploadProgress(event);
            const displayMessage = `${formatted.title} ${formatted.subtitle}`;

            const hasChanged =
                upload.progress !== event.progress ||
                upload.status !== newStatus ||
                upload.message !== displayMessage;

            if (!hasChanged) {
                console.log(`[Frontend] No state change for ${event.uploadId}`);
                return prev;
            }

            console.log(`[Frontend] Updating state for ${event.uploadId}:`, {
                oldProgress: upload.progress,
                newProgress: event.progress,
                oldStatus: upload.status,
                newStatus,
            });

            return {
                ...prev,
                [event.uploadId]: {
                    ...upload,
                    progress: event.progress,
                    status: newStatus,
                    message: displayMessage,
                },
            };
        });
    }, []);

    const handleComplete = useCallback((event: UploadProgressEvent) => {
        const uploadId = event.uploadId;

        setUploads((prev) => {
            const upload = prev[uploadId];
            if (!upload) return prev;

            const formatted = formatUploadProgress(event);
            const displayMessage = `${formatted.title} ${formatted.subtitle}`;

            const hasChanged =
                upload.status !== 'complete' ||
                upload.progress !== 100 ||
                upload.message !== displayMessage;

            if (!hasChanged) return prev;

            return {
                ...prev,
                [uploadId]: {
                    ...upload,
                    status: 'complete',
                    progress: 100,
                    message: displayMessage,
                },
            };
        });
    }, []);

    const handleError = useCallback((error: string) => {
        toast.error(error);
    }, []);

    const { isConnected } = useUploadProgress({
        userId: (session?.user as { id: string })?.id,
        onProgress: handleProgress,
        onComplete: handleComplete,
        onError: handleError,
    });

    const handleProgressRef = useRef(handleProgress);
    const handleCompleteRef = useRef(handleComplete);

    useEffect(() => {
        handleProgressRef.current = handleProgress;
        handleCompleteRef.current = handleComplete;
    }, [handleProgress, handleComplete]);

    const mutation = useMutation({
        mutationFn: async ({ file, uploadId }: { file: File; uploadId: string }) => {
            const uploadOptions: UploadOptions = {
                visibility: options.visibility,
                metadata: {
                    ...options.metadata,
                    uploadId,
                },
                onUploadProgress: (progressEvent) => {
                    setUploads((prev) => {
                        const current = prev[uploadId];
                        if (!current) return prev;

                        const localProgress = Math.min(progressEvent.percentage, 10);

                        return {
                            ...prev,
                            [uploadId]: {
                                ...current,
                                progress: localProgress,
                                status: 'uploading' as const,
                                message: `Uploading to server (${progressEvent.percentage}%)`,
                            },
                        };
                    });
                },
            };

            return StorageService.uploadFile(file, uploadOptions);
        },
        onSuccess: (result, { uploadId }) => {
            console.log(`[Frontend] Mutation success for ${uploadId}`);
            console.log(`  Storage ID: ${result.id}`);
            console.log(`  Now waiting for WebSocket events...`);

            setUploads((prev) => {
                const current = prev[uploadId];
                if (!current) {
                    console.warn(`[Frontend] Upload ${uploadId} not found in state`);
                    return prev;
                }

                return {
                    ...prev,
                    [uploadId]: {
                        ...current,
                        result,
                        status: 'processing' as const,
                        progress: 10,
                        message: 'File received, starting cloud upload...',
                    },
                };
            });
            options.onSuccess?.(result);
        },
        onError: (error: Error, { uploadId }) => {
            setUploads((prev) => {
                const current = prev[uploadId];
                if (!current) return prev;

                return {
                    ...prev,
                    [uploadId]: {
                        ...current,
                        status: 'error' as const,
                        error: error.message,
                        message: `Error: ${error.message}`,
                    },
                };
            });
            toast.error(error.message);
            options.onError?.(error);
        },
    });

    const uploadFile = async (file: File) => {
        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        console.log('='.repeat(80));
        console.log('[Frontend] Starting file upload');
        console.log(`  File: ${file.name}`);
        console.log(`  Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  Type: ${file.type}`);
        console.log(`  Upload ID: ${uploadId}`);
        console.log(`  WebSocket connected: ${isConnected}`);
        console.log('='.repeat(80));

        setUploads((prev) => ({
            ...prev,
            [uploadId]: {
                uploadId,
                file,
                progress: 0,
                status: 'pending',
                message: 'Preparing...',
            },
        }));

        try {
            console.log(`[Frontend] Calling mutation for ${uploadId}`);
            await mutation.mutateAsync({ file, uploadId });
        } catch (error) {
            console.error('[Frontend] Upload error:', error);
        }
    };

    const uploadFiles = async (files: File[]) => {
        await Promise.all(files.map((file) => uploadFile(file)));
    };

    const clearUpload = (uploadId: string) => {
        setUploads((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [uploadId]: _, ...rest } = prev;
            return rest;
        });
    };

    const clearAllUploads = () => {
        setUploads({});
    };

    return {
        uploadFile,
        uploadFiles,
        uploads: Object.values(uploads),
        uploadsMap: uploads,
        clearUpload,
        clearAllUploads,
        isUploading:
            mutation.isPending || Object.values(uploads).some((u) => u.status === 'uploading'),
        isProcessing: Object.values(uploads).some(
            (u) => u.status === 'processing' || u.status === 'uploading',
        ),
        isConnected,
    };
};
