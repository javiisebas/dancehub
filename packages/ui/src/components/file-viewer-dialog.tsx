'use client';

import { Download, ExternalLink, FileIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Badge } from './badge';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog';
import { Skeleton } from './skeleton';

const PDFViewer = dynamic(
    () => import('./pdf-viewer').then((mod) => ({ default: mod.PDFViewer })),
    {
        ssr: false,
        loading: () => <Skeleton className="h-[600px] w-full" />,
    },
);

export interface FileData {
    id: string;
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
    extension: string;
    visibility?: 'public' | 'private';
}

interface FileViewerDialogProps {
    file: FileData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload?: () => void;
    isDownloading?: boolean;
}

export function FileViewerDialog({
    file,
    open,
    onOpenChange,
    onDownload,
    isDownloading = false,
}: FileViewerDialogProps) {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const renderFileContent = () => {
        if (!file || !file.url) {
            return (
                <div className="flex h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">No file to display</p>
                </div>
            );
        }

        if (file.mimeType.startsWith('image/')) {
            return (
                <div className="flex items-center justify-center">
                    <Zoom>
                        <img
                            src={file.url}
                            alt={file.originalName}
                            className="max-h-[70vh] w-auto rounded-lg object-contain"
                        />
                    </Zoom>
                </div>
            );
        }

        if (file.mimeType === 'application/pdf') {
            return (
                <PDFViewer url={file.url} filename={file.originalName} onDownload={onDownload} />
            );
        }

        if (file.mimeType.startsWith('video/')) {
            return (
                <video controls className="w-full rounded-lg">
                    <source src={file.url} type={file.mimeType} />
                    Your browser does not support the video tag.
                </video>
            );
        }

        if (file.mimeType.startsWith('audio/')) {
            return (
                <div className="flex items-center justify-center p-8">
                    <audio controls className="w-full">
                        <source src={file.url} type={file.mimeType} />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            );
        }

        if (file.mimeType.startsWith('text/') || file.mimeType === 'application/json') {
            return (
                <iframe
                    src={file.url}
                    className="h-[600px] w-full rounded-lg border"
                    title={file.originalName}
                />
            );
        }

        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8">
                <FileIcon className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                    <p className="font-medium">Preview not available</p>
                    <p className="text-sm text-muted-foreground">
                        This file type cannot be previewed
                    </p>
                </div>
                <div className="flex gap-2">
                    {onDownload && (
                        <Button onClick={onDownload} disabled={isDownloading}>
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? 'Downloading...' : 'Download'}
                        </Button>
                    )}
                    {file.url && (
                        <Button variant="outline" asChild>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open in new tab
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    if (!file) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl p-0">
                <DialogHeader className="border-b p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <DialogTitle className="text-xl">{file.originalName}</DialogTitle>
                            <DialogDescription className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">{file.extension}</Badge>
                                <Badge variant="outline">{formatFileSize(file.size)}</Badge>
                                {file.visibility && (
                                    <Badge
                                        variant={
                                            file.visibility === 'public' ? 'default' : 'outline'
                                        }
                                    >
                                        {file.visibility}
                                    </Badge>
                                )}
                            </DialogDescription>
                        </div>
                        {!file.mimeType.includes('pdf') && (
                            <div className="flex gap-2">
                                {onDownload && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onDownload}
                                        disabled={isDownloading}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                )}
                                {file.url && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogHeader>
                <div className="max-h-[80vh] overflow-auto p-6">{renderFileContent()}</div>
            </DialogContent>
        </Dialog>
    );
}
