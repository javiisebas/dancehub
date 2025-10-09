import { useCallback, useState } from 'react';
import { FileItem } from '../components/upload/file-list';

export interface UseFileUploadOptions {
    onUploadStart?: (file: File) => void;
    onUploadProgress?: (fileId: string, progress: number) => void;
    onUploadComplete?: (fileId: string, result?: any) => void;
    onUploadError?: (fileId: string, error: string) => void;
}

export interface UseFileUploadReturn {
    files: FileItem[];
    addFiles: (newFiles: File[]) => void;
    removeFile: (fileId: string) => void;
    updateFileProgress: (fileId: string, progress: number) => void;
    updateFileStatus: (
        fileId: string,
        status: FileItem['status'],
        message?: string,
        error?: string,
    ) => void;
    clearFiles: () => void;
    clearCompleted: () => void;
    isUploading: boolean;
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
    const [files, setFiles] = useState<FileItem[]>([]);

    const addFiles = useCallback(
        (newFiles: File[]) => {
            const fileItems: FileItem[] = newFiles.map((file) => {
                const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

                let preview: string | undefined;
                if (file.type.startsWith('image/')) {
                    preview = URL.createObjectURL(file);
                }

                options.onUploadStart?.(file);

                return {
                    id,
                    file,
                    preview,
                    progress: 0,
                    status: 'pending' as const,
                };
            });

            setFiles((prev) => [...prev, ...fileItems]);
        },
        [options],
    );

    const removeFile = useCallback((fileId: string) => {
        setFiles((prev) => {
            const file = prev.find((f) => f.id === fileId);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter((f) => f.id !== fileId);
        });
    }, []);

    const updateFileProgress = useCallback(
        (fileId: string, progress: number) => {
            setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)));
            options.onUploadProgress?.(fileId, progress);
        },
        [options],
    );

    const updateFileStatus = useCallback(
        (fileId: string, status: FileItem['status'], message?: string, error?: string) => {
            setFiles((prev) =>
                prev.map((f) => (f.id === fileId ? { ...f, status, message, error } : f)),
            );

            if (status === 'complete') {
                options.onUploadComplete?.(fileId);
            } else if (status === 'error' && error) {
                options.onUploadError?.(fileId, error);
            }
        },
        [options],
    );

    const clearFiles = useCallback(() => {
        files.forEach((file) => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        setFiles([]);
    }, [files]);

    const clearCompleted = useCallback(() => {
        setFiles((prev) => {
            const completed = prev.filter((f) => f.status === 'complete');
            completed.forEach((file) => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
            return prev.filter((f) => f.status !== 'complete');
        });
    }, []);

    const isUploading = files.some((f) => f.status === 'uploading' || f.status === 'processing');

    return {
        files,
        addFiles,
        removeFile,
        updateFileProgress,
        updateFileStatus,
        clearFiles,
        clearCompleted,
        isUploading,
    };
}
