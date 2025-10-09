'use client';

import { Accept } from 'react-dropzone';
import { FileItem } from './upload/file-list';
import { FileUploadZone } from './upload/file-upload-zone';

export interface FileUploadItem {
    id: string;
    file: File;
    preview?: string;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    message?: string;
    error?: string;
}

export interface FileUploaderProps {
    onFilesSelected?: (files: File[]) => void;
    onFileRemove?: (fileId: string) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Accept;
    multiple?: boolean;
    files?: FileUploadItem[];
    disabled?: boolean;
    className?: string;
    showPreview?: boolean;
}

export function FileUploader({
    onFilesSelected,
    onFileRemove,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept,
    multiple = true,
    files = [],
    disabled = false,
    className,
    showPreview = true,
}: FileUploaderProps) {
    const fileItems: FileItem[] = files.map((item) => ({
        id: item.id,
        file: item.file,
        preview: item.preview,
        progress: item.progress,
        status: item.status,
        message: item.message,
        error: item.error,
    }));

    return (
        <FileUploadZone
            files={fileItems}
            onFilesSelected={onFilesSelected}
            onFileRemove={onFileRemove}
            maxFiles={maxFiles}
            maxSize={maxSize}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            showPreview={showPreview}
            className={className}
        />
    );
}
