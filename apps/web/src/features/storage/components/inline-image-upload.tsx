'use client';

import { UPLOAD_CONFIG } from '@/config/upload.config';
import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import { FileItem, ImageUploadZone } from '@repo/ui/components';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFileUpload } from '../hooks/use-file-upload.hook';

export interface InlineImageUploadProps {
    onFilesUploaded?: (results: UploadFileResponse[]) => void;
    maxFiles?: number;
    maxSize?: number;
    acceptedFormats?: string[];
    multiple?: boolean;
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, unknown>;
    className?: string;
    variant?: 'default' | 'compact';
}

export function InlineImageUpload({
    onFilesUploaded,
    maxFiles = 10,
    maxSize = UPLOAD_CONFIG.MAX_IMAGE_SIZE,
    acceptedFormats,
    multiple = true,
    visibility = StorageVisibilityEnum.PRIVATE,
    metadata,
    className,
    variant = 'default',
}: InlineImageUploadProps) {
    const previewUrlsRef = useRef<Map<string, string>>(new Map());
    const onFilesUploadedRef = useRef(onFilesUploaded);

    useEffect(() => {
        onFilesUploadedRef.current = onFilesUploaded;
    }, [onFilesUploaded]);

    const handleSuccess = useCallback((result: UploadFileResponse) => {
        onFilesUploadedRef.current?.([result]);
    }, []);

    const { uploadFiles, uploads, clearUpload, isUploading } = useFileUpload({
        visibility,
        metadata,
        onSuccess: handleSuccess,
    });

    const fileItems: FileItem[] = useMemo(() => {
        return uploads.map((upload) => {
            let preview: string | undefined;

            if (upload.file.type.startsWith('image/')) {
                if (!previewUrlsRef.current.has(upload.uploadId)) {
                    preview = URL.createObjectURL(upload.file);
                    previewUrlsRef.current.set(upload.uploadId, preview);
                } else {
                    preview = previewUrlsRef.current.get(upload.uploadId);
                }
            }

            return {
                id: upload.uploadId,
                file: upload.file,
                preview,
                progress: upload.progress,
                status: upload.status,
                message: upload.message,
                error: upload.error,
            };
        });
    }, [uploads]);

    useEffect(() => {
        const currentUploadIds = new Set(uploads.map((u) => u.uploadId));
        const urlsToRevoke: string[] = [];

        previewUrlsRef.current.forEach((url, id) => {
            if (!currentUploadIds.has(id)) {
                urlsToRevoke.push(url);
                previewUrlsRef.current.delete(id);
            }
        });

        urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));

        return () => {
            previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            previewUrlsRef.current.clear();
        };
    }, [uploads]);

    const handleFilesSelected = useCallback(
        async (files: File[]) => {
            await uploadFiles(files);
        },
        [uploadFiles],
    );

    const handleFileRemove = useCallback(
        (fileId: string) => {
            const previewUrl = previewUrlsRef.current.get(fileId);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                previewUrlsRef.current.delete(fileId);
            }
            clearUpload(fileId);
        },
        [clearUpload],
    );

    return (
        <ImageUploadZone
            files={fileItems}
            onFilesSelected={handleFilesSelected}
            onFileRemove={handleFileRemove}
            maxFiles={maxFiles}
            maxSize={maxSize}
            acceptedFormats={acceptedFormats}
            multiple={multiple}
            disabled={isUploading}
            className={className}
            variant={variant}
        />
    );
}
