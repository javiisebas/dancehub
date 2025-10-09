'use client';

import { UPLOAD_CONFIG } from '@/config/upload.config';
import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import { FileItem, VideoUploadZone } from '@repo/ui/components';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFileUpload } from '../hooks/use-file-upload.hook';

export interface InlineVideoUploadProps {
    onFilesUploaded?: (results: UploadFileResponse[]) => void;
    maxFiles?: number;
    maxSize?: number;
    acceptedFormats?: string[];
    multiple?: boolean;
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, unknown>;
    showPreview?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
}

export function InlineVideoUpload({
    onFilesUploaded,
    maxFiles = 5,
    maxSize = UPLOAD_CONFIG.MAX_VIDEO_SIZE,
    acceptedFormats,
    multiple = true,
    visibility = StorageVisibilityEnum.PRIVATE,
    metadata,
    showPreview = true,
    className,
    variant = 'default',
}: InlineVideoUploadProps) {
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
        return uploads.map((upload) => ({
            id: upload.uploadId,
            file: upload.file,
            progress: upload.progress,
            status: upload.status,
            message: upload.message,
            error: upload.error,
        }));
    }, [uploads]);

    useEffect(() => {
        return () => {
            previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
            previewUrlsRef.current.clear();
        };
    }, []);

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
        <VideoUploadZone
            files={fileItems}
            onFilesSelected={handleFilesSelected}
            onFileRemove={handleFileRemove}
            maxFiles={maxFiles}
            maxSize={maxSize}
            acceptedFormats={acceptedFormats}
            multiple={multiple}
            disabled={isUploading}
            showPreview={showPreview}
            className={className}
            variant={variant}
        />
    );
}
