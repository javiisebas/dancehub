'use client';

import { Badge } from '@repo/ui/components/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components/card';
import { useUploadProgress } from '@web/hooks/use-upload-progress.hook';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function UploadDebugPanel() {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string })?.id;
    const { isConnected, uploadProgress } = useUploadProgress({ userId });
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (userId) {
            addLog(`User ID: ${userId}`);
        }
    }, [userId]);

    useEffect(() => {
        if (isConnected) {
            addLog('✓ WebSocket connected');
        } else {
            addLog('✗ WebSocket disconnected');
        }
    }, [isConnected]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
    };

    const activeUploads = Object.values(uploadProgress);

    return (
        <Card className="border-dashed">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-sm">Debug Panel</CardTitle>
                    <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                </div>
                <CardDescription className="text-xs">
                    Upload progress tracking status
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
                <div>
                    <p className="mb-1 font-medium">User Info</p>
                    <p className="font-mono text-muted-foreground">
                        {userId ? `ID: ${userId.slice(0, 8)}...` : 'Not logged in'}
                    </p>
                </div>

                {activeUploads.length > 0 && (
                    <div>
                        <p className="mb-2 font-medium">Active Uploads ({activeUploads.length})</p>
                        <div className="space-y-1">
                            {activeUploads.map((upload) => (
                                <div
                                    key={upload.uploadId}
                                    className="rounded bg-muted p-2 font-mono text-xs"
                                >
                                    <div>ID: {upload.uploadId.slice(0, 20)}...</div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {upload.type}
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            {upload.progress}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <p className="mb-1 font-medium">Recent Logs</p>
                    <div className="max-h-40 overflow-y-auto rounded bg-muted p-2 font-mono text-xs">
                        {logs.length === 0 ? (
                            <p className="text-muted-foreground">No logs yet</p>
                        ) : (
                            logs.map((log, i) => (
                                <div
                                    key={i}
                                    className="border-b border-border/50 py-1 last:border-0"
                                >
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

