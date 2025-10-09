'use client';

import {
    AlertCircle,
    CheckCircle2,
    File as FileIcon,
    Image as ImageIcon,
    Loader2,
    Video as VideoIcon,
    X,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../button';
import { Progress } from '../progress';
import { ScrollArea } from '../scroll-area';

export interface FileItem {
    id: string;
    file: File;
    preview?: string;
    progress: number;
    status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
    message?: string;
    error?: string;
}

export interface FileListProps {
    files: FileItem[];
    onRemove?: (fileId: string) => void;
    showPreview?: boolean;
    maxHeight?: string;
    className?: string;
    variant?: 'default' | 'compact';
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const getFileIcon = (type: string, className?: string) => {
    if (type.startsWith('image/')) return <ImageIcon className={className} />;
    if (type.startsWith('video/')) return <VideoIcon className={className} />;
    return <FileIcon className={className} />;
};

const getStatusIcon = (status: FileItem['status']) => {
    switch (status) {
        case 'complete':
            return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
        case 'error':
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        case 'uploading':
        case 'processing':
            return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
        default:
            return null;
    }
};

const getStatusColor = (status: FileItem['status']) => {
    switch (status) {
        case 'complete':
            return 'text-emerald-600 dark:text-emerald-400';
        case 'error':
            return 'text-destructive';
        case 'uploading':
        case 'processing':
            return 'text-primary';
        default:
            return 'text-muted-foreground';
    }
};

const getProgressColor = (status: FileItem['status']) => {
    switch (status) {
        case 'complete':
            return 'bg-emerald-500';
        case 'error':
            return 'bg-destructive';
        default:
            return 'bg-primary';
    }
};

export function FileList({
    files,
    onRemove,
    showPreview = true,
    maxHeight = '400px',
    className,
    variant = 'default',
}: FileListProps) {
    if (files.length === 0) {
        return null;
    }

    if (variant === 'compact') {
        return (
            <div className={cn('space-y-2', className)}>
                <div className="flex items-center justify-between px-1">
                    <p className="text-sm font-medium text-muted-foreground">
                        {files.length} {files.length === 1 ? 'file' : 'files'}
                    </p>
                </div>
                <div className="space-y-2">
                    {files.map((item) => (
                        <div
                            key={item.id}
                            className="group relative flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3 shadow-sm transition-all hover:shadow-md"
                        >
                            {showPreview && item.preview && item.file.type.startsWith('image/') ? (
                                <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded border bg-muted">
                                    <img
                                        src={item.preview}
                                        alt={item.file.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border bg-muted">
                                    {getFileIcon(item.file.type, 'h-4 w-4 text-muted-foreground')}
                                </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-sm font-medium">{item.file.name}</p>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(item.status)}
                                        {onRemove && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={() => onRemove(item.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{formatFileSize(item.file.size)}</span>
                                    {item.status !== 'pending' && (
                                        <>
                                            <span>•</span>
                                            <span
                                                className={cn(
                                                    'font-medium',
                                                    getStatusColor(item.status),
                                                )}
                                            >
                                                {item.message || item.status}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {(item.status === 'uploading' || item.status === 'processing') && (
                                    <div className="flex items-center gap-2">
                                        <Progress value={item.progress} className="h-1 flex-1" />
                                        <span className="text-xs font-medium tabular-nums text-muted-foreground">
                                            {item.progress}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex items-center justify-between px-1">
                <p className="text-sm font-semibold">
                    Files <span className="text-muted-foreground">({files.length})</span>
                </p>
            </div>
            <ScrollArea style={{ maxHeight }} className="rounded-lg border border-border/50">
                <div className="space-y-2 p-4">
                    {files.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-lg border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                {showPreview &&
                                item.preview &&
                                item.file.type.startsWith('image/') ? (
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 border-border/50 bg-muted shadow-sm">
                                        <img
                                            src={item.preview}
                                            alt={item.file.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg border-2 border-border/50 bg-muted shadow-sm">
                                        {getFileIcon(
                                            item.file.type,
                                            'h-6 w-6 text-muted-foreground',
                                        )}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {item.file.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {formatFileSize(item.file.size)}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(item.status)}
                                            {onRemove && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                                                    onClick={() => onRemove(item.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {item.status !== 'pending' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span
                                                    className={cn(
                                                        'text-xs font-medium',
                                                        getStatusColor(item.status),
                                                    )}
                                                >
                                                    {item.message || item.status}
                                                </span>
                                                {(item.status === 'uploading' ||
                                                    item.status === 'processing') && (
                                                    <span className="text-xs font-medium tabular-nums text-muted-foreground">
                                                        {item.progress}%
                                                    </span>
                                                )}
                                            </div>
                                            {(item.status === 'uploading' ||
                                                item.status === 'processing') && (
                                                <Progress
                                                    value={item.progress}
                                                    className="h-1.5"
                                                    indicatorClassName={getProgressColor(
                                                        item.status,
                                                    )}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {item.error && (
                                        <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-2">
                                            <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-destructive" />
                                            <p className="text-xs text-destructive">{item.error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
