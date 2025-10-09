'use client';

import { StorageVisibilityEnum, UploadFileResponse } from '@repo/shared';
import { FileUploader, FileUploadItem } from '@repo/ui/components/file-uploader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Accept } from 'react-dropzone';
import { useFileUpload } from '../hooks/use-file-upload.hook';

export interface InlineFileUploadProps {
    onFilesUploaded?: (results: UploadFileResponse[]) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Accept;
    multiple?: boolean;
    visibility?: StorageVisibilityEnum;
    metadata?: Record<string, any>;
    showPreview?: boolean;
    className?: string;
}

export function InlineFileUpload({
    onFilesUploaded,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept,
    multiple = true,
    visibility = StorageVisibilityEnum.PRIVATE,
    metadata,
    showPreview = true,
    className,
}: InlineFileUploadProps) {
    const [completedFiles, setCompletedFiles] = useState<UploadFileResponse[]>([]);
    const previewUrlsRef = useRef<Map<string, string>>(new Map());

    const { uploadFiles, uploads, clearUpload, isUploading } = useFileUpload({
        visibility,
        metadata,
        onSuccess: (result) => {
            setCompletedFiles((prev) => [...prev, result]);
        },
    });

    useEffect(() => {
        if (completedFiles.length > 0) {
            onFilesUploaded?.(completedFiles);
        }
    }, [completedFiles, onFilesUploaded]);

    const fileItems: FileUploadItem[] = useMemo(() => {
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
        <FileUploader
            onFilesSelected={handleFilesSelected}
            onFileRemove={handleFileRemove}
            maxFiles={maxFiles}
            maxSize={maxSize}
            accept={accept}
            multiple={multiple}
            files={fileItems}
            disabled={isUploading}
            showPreview={showPreview}
            className={className}
        />
    );
}
