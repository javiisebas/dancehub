'use client';

import { cn } from '../utils/cn';
import {
    AlertCircle,
    CheckCircle2,
    File as FileIconLucide,
    Image,
    Upload,
    Video,
    X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { Button } from './button';
import { Progress } from './progress';
import { ScrollArea } from './scroll-area';

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

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileIconLucide className="h-4 w-4" />;
};

const getStatusColor = (status: FileUploadItem['status']) => {
    switch (status) {
        case 'complete':
            return 'text-green-500';
        case 'error':
            return 'text-destructive';
        case 'uploading':
        case 'processing':
            return 'text-blue-500';
        default:
            return 'text-muted-foreground';
    }
};

const getStatusIcon = (status: FileUploadItem['status']) => {
    switch (status) {
        case 'complete':
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case 'error':
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        default:
            return null;
    }
};

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
    const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setRejectedFiles(fileRejections);

            if (acceptedFiles.length > 0) {
                onFilesSelected?.(acceptedFiles);
            }
        },
        [onFilesSelected],
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
        multiple,
        disabled,
    });

    const handleRemove = (fileId: string) => {
        onFileRemove?.(fileId);
    };

    return (
        <div className={cn('w-full space-y-4', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors',
                    isDragActive && !isDragReject && 'border-primary bg-primary/5',
                    isDragReject && 'border-destructive bg-destructive/5',
                    !isDragActive &&
                        'border-muted-foreground/25 hover:border-primary hover:bg-accent',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="rounded-full border p-3">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Drop files here...'
                                : 'Drag & drop files here, or click to browse'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {accept
                                ? `Accepted: ${Object.values(accept).flat().join(', ')}`
                                : 'Any file type'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max size: {formatFileSize(maxSize)}
                            {multiple && ` • Max files: ${maxFiles}`}
                        </p>
                    </div>
                </div>
            </div>

            {rejectedFiles.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <p className="text-sm font-medium text-destructive">
                            {rejectedFiles.length} file{rejectedFiles.length > 1 ? 's' : ''}{' '}
                            rejected
                        </p>
                    </div>
                    <ul className="mt-2 space-y-1">
                        {rejectedFiles.map((rejection, index) => (
                            <li key={index} className="text-xs text-destructive/80">
                                {rejection.file.name}:{' '}
                                {rejection.errors.map((e) => e.message).join(', ')}
                            </li>
                        ))}
                    </ul>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRejectedFiles([])}
                        className="mt-2 h-7 text-xs"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Files ({files.length})</p>
                    </div>
                    <ScrollArea className="h-[300px] rounded-lg border">
                        <div className="space-y-2 p-4">
                            {files.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-lg border bg-card p-3 transition-colors hover:bg-accent"
                                >
                                    <div className="flex items-start gap-3">
                                        {showPreview &&
                                        item.preview &&
                                        item.file.type.startsWith('image/') ? (
                                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border">
                                                <img
                                                    src={item.preview}
                                                    alt={item.file.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border bg-muted">
                                                {getFileIcon(item.file.type)}
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {item.file.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(item.file.size)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(item.status)}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                        onClick={() => handleRemove(item.id)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {item.status !== 'pending' && (
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className={cn(
                                                                'text-xs',
                                                                getStatusColor(item.status),
                                                            )}
                                                        >
                                                            {item.message || item.status}
                                                        </span>
                                                        {(item.status === 'uploading' ||
                                                            item.status === 'processing') && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {item.progress}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(item.status === 'uploading' ||
                                                        item.status === 'processing') && (
                                                        <Progress
                                                            value={item.progress}
                                                            className="h-1"
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {item.error && (
                                                <p className="text-xs text-destructive">
                                                    {item.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
