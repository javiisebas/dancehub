'use client';

import { Progress } from './progress';

export interface UploadProgressProps {
    message: string;
    percentage: number;
    details?: string;
    showSpinner?: boolean;
    className?: string;
}

export function UploadProgress({
    message,
    percentage,
    details,
    showSpinner = true,
    className,
}: UploadProgressProps) {
    return (
        <div
            className={`space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4 ${className || ''}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {showSpinner && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    <span className="text-sm font-medium text-primary">{message}</span>
                </div>
                {percentage > 0 && (
                    <span className="text-sm font-semibold tabular-nums text-primary">
                        {percentage}%
                    </span>
                )}
            </div>
            <Progress value={percentage || 0} className="h-2" />
            {details && <p className="text-xs text-muted-foreground">{details}</p>}
        </div>
    );
}
