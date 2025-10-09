'use client';

import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { cn } from '../../utils/cn';

export interface FileDropzoneProps {
    onFilesAccepted?: (files: File[]) => void;
    onFilesRejected?: (rejections: FileRejection[]) => void;
    maxFiles?: number;
    maxSize?: number;
    accept?: Accept;
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    variant?: 'default' | 'compact' | 'minimal';
    children?: React.ReactNode;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const getAcceptLabel = (accept?: Accept): string => {
    if (!accept) return 'Any file type';
    const extensions = Object.values(accept).flat();
    if (extensions.length <= 3) {
        return extensions.join(', ');
    }
    return `${extensions.slice(0, 3).join(', ')} +${extensions.length - 3} more`;
};

export function FileDropzone({
    onFilesAccepted,
    onFilesRejected,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept,
    multiple = true,
    disabled = false,
    className,
    variant = 'default',
    children,
}: FileDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (acceptedFiles.length > 0) {
                onFilesAccepted?.(acceptedFiles);
            }
            if (fileRejections.length > 0) {
                onFilesRejected?.(fileRejections);
            }
        },
        [onFilesAccepted, onFilesRejected],
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
        multiple,
        disabled,
    });

    if (children) {
        return (
            <div {...getRootProps()} className={cn('outline-none', className)}>
                <input {...getInputProps()} />
                {children}
            </div>
        );
    }

    if (variant === 'minimal') {
        return (
            <div
                {...getRootProps()}
                className={cn(
                    'group relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all',
                    isDragActive && !isDragReject && 'border-primary bg-primary/5 shadow-sm',
                    isDragReject && 'border-destructive bg-destructive/5',
                    !isDragActive &&
                        !isDragReject &&
                        'border-border/60 hover:border-primary hover:bg-accent/50 hover:shadow-sm',
                    disabled &&
                        'cursor-not-allowed opacity-50 hover:border-border/60 hover:bg-transparent',
                    className,
                )}
            >
                <input {...getInputProps()} />
                <div className="flex items-center gap-3">
                    <div className="rounded-full border border-border/60 p-2 group-hover:border-primary group-hover:bg-primary/5 transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {getAcceptLabel(accept)} • Max {formatFileSize(maxSize)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div
                {...getRootProps()}
                className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-lg border-2 border-dashed p-6 transition-all',
                    isDragActive && !isDragReject && 'border-primary bg-primary/5',
                    isDragReject && 'border-destructive bg-destructive/5',
                    !isDragActive && 'border-border/60 hover:border-primary hover:bg-accent/50',
                    disabled && 'cursor-not-allowed opacity-50',
                    className,
                )}
            >
                <input {...getInputProps()} />
                <div className="rounded-full border border-border/60 p-3 bg-muted/50">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">
                        {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {getAcceptLabel(accept)} • Max {formatFileSize(maxSize)}
                        {multiple && ` • Up to ${maxFiles} files`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-all',
                isDragActive &&
                    !isDragReject &&
                    'border-primary bg-primary/5 shadow-lg scale-[1.02]',
                isDragReject && 'border-destructive bg-destructive/5',
                !isDragActive &&
                    'border-border/60 hover:border-primary hover:bg-accent/50 hover:shadow-md',
                disabled && 'cursor-not-allowed opacity-50 hover:scale-100',
                className,
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="rounded-full border border-border/60 p-4 bg-muted/30 shadow-sm">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold">
                        {isDragActive ? 'Drop your files here' : 'Drag & drop files here'}
                    </p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                </div>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Accepted:</span>
                        <span>{getAcceptLabel(accept)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Max size:</span>
                        <span>{formatFileSize(maxSize)}</span>
                        {multiple && (
                            <>
                                <span>•</span>
                                <span className="font-medium">Max files:</span>
                                <span>{maxFiles}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
