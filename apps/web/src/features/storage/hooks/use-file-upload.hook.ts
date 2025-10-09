import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import { useMutation } from '@tanstack/react-query';
import { useUploadProgress } from '@web/hooks/use-upload-progress.hook';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StorageService, UploadOptions } from '../api/storage.service';

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
    metadata?: Record<string, any>;
    onSuccess?: (result: UploadFileResponse) => void;
    onError?: (error: Error) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
    const { data: session } = useSession();
    const [uploads, setUploads] = useState<Record<string, FileUploadState>>({});

    const { uploadProgress, isConnected } = useUploadProgress({
        userId: (session?.user as any)?.id,
        onProgress: (event) => {
            setUploads((prev) => {
                const upload = prev[event.uploadId];
                if (!upload) return prev;

                return {
                    ...prev,
                    [event.uploadId]: {
                        ...upload,
                        progress: event.progress,
                        status:
                            event.type === 'upload'
                                ? 'uploading'
                                : event.type === 'processing' || event.type === 'thumbnail'
                                  ? 'processing'
                                  : event.type === 'complete'
                                    ? 'complete'
                                    : 'error',
                        message: event.message,
                    },
                };
            });
        },
        onComplete: (storageId, url) => {
            const upload = Object.values(uploads).find(
                (u) => u.result?.id === storageId || u.status === 'processing',
            );
            if (upload) {
                setUploads((prev) => ({
                    ...prev,
                    [upload.uploadId]: {
                        ...upload,
                        status: 'complete',
                        progress: 100,
                        message: 'Upload complete!',
                    },
                }));
            }
        },
        onError: (error) => {
            toast.error(error);
        },
    });

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

                        return {
                            ...prev,
                            [uploadId]: {
                                ...current,
                                progress: progressEvent.percentage,
                                status: 'uploading' as const,
                                message: `Uploading... ${progressEvent.percentage}%`,
                            },
                        };
                    });
                },
            };

            return StorageService.uploadFile(file, uploadOptions);
        },
        onSuccess: (result, { uploadId }) => {
            setUploads((prev) => {
                const current = prev[uploadId];
                if (!current) return prev;

                return {
                    ...prev,
                    [uploadId]: {
                        ...current,
                        result,
                        status: 'processing' as const,
                        message: 'Processing...',
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
            await mutation.mutateAsync({ file, uploadId });
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    const uploadFiles = async (files: File[]) => {
        await Promise.all(files.map((file) => uploadFile(file)));
    };

    const clearUpload = (uploadId: string) => {
        setUploads((prev) => {
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
