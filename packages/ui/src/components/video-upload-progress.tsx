'use client';

import { Progress } from './progress';

export interface VideoUploadPhase {
    phase: 'uploading' | 'processing' | 'r2-upload' | 'complete';
    percentage: number;
    message: string;
    bytesLoaded?: number;
    bytesTotal?: number;
    uploadSpeed?: string;
    estimatedTime?: string;
}

export interface VideoUploadProgressProps {
    currentPhase: VideoUploadPhase;
    className?: string;
}

export function VideoUploadProgress({ currentPhase, className }: VideoUploadProgressProps) {
    const { phase, percentage, message, bytesLoaded, bytesTotal, uploadSpeed, estimatedTime } =
        currentPhase;

    return (
        <div className={`space-y-4 ${className || ''}`}>
            {phase === 'uploading' && (
                <>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <span className="font-medium text-primary">{message}</span>
                        </div>
                        <span className="font-semibold tabular-nums">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                        {bytesLoaded !== undefined && bytesTotal !== undefined && (
                            <span className="text-muted-foreground">
                                {formatFileSize(bytesLoaded)} / {formatFileSize(bytesTotal)}
                            </span>
                        )}
                        {(uploadSpeed || estimatedTime) && (
                            <div className="flex items-center gap-4">
                                {uploadSpeed && (
                                    <div className="flex items-center gap-1.5">
                                        <svg
                                            className="h-3.5 w-3.5 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                        <span className="font-medium tabular-nums">
                                            {uploadSpeed}
                                        </span>
                                    </div>
                                )}
                                {estimatedTime && (
                                    <div className="flex items-center gap-1.5">
                                        <svg
                                            className="h-3.5 w-3.5 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <span className="font-medium tabular-nums">
                                            {estimatedTime}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}

            {(phase === 'processing' || phase === 'r2-upload') && (
                <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm font-medium text-primary">{message}</span>
                        </div>
                        {percentage > 0 && (
                            <span className="text-sm font-semibold tabular-nums text-primary">
                                {percentage}%
                            </span>
                        )}
                    </div>
                    {percentage > 0 && <Progress value={percentage} className="h-2" />}
                    {phase === 'processing' && (
                        <p className="text-xs text-muted-foreground">
                            Extrayendo metadata y generando thumbnails...
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
