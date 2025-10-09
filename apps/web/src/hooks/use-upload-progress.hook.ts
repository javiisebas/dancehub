import { UploadProgressEvent, UploadProgressTypeEnum } from '@repo/shared';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface UseUploadProgressOptions {
    userId?: string;
    onProgress?: (event: UploadProgressEvent) => void;
    onComplete?: (event: UploadProgressEvent) => void;
    onError?: (error: string) => void;
}

export const useUploadProgress = (options: UseUploadProgressOptions = {}) => {
    const { userId, onProgress, onComplete, onError } = options;
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressEvent>>({});

    const onProgressRef = useRef(onProgress);
    const onCompleteRef = useRef(onComplete);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onProgressRef.current = onProgress;
        onCompleteRef.current = onComplete;
        onErrorRef.current = onError;
    }, [onProgress, onComplete, onError]);

    useEffect(() => {
        if (!userId) {
            console.log('[WebSocket] Not connecting - no userId provided');
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const baseUrl = apiUrl.replace('/api', '');

        console.log('[WebSocket] Connecting to upload progress gateway...');
        console.log(`  URL: ${baseUrl}/storage`);
        console.log(`  User ID: ${userId}`);

        const socket = io(`${baseUrl}/storage`, {
            query: { userId },
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[WebSocket] ✓ Connected to upload progress gateway');
            console.log(`  Socket ID: ${socket.id}`);
            console.log(`  Transport: ${socket.io.engine.transport.name}`);
            setIsConnected(true);
        });

        socket.on('disconnect', (reason) => {
            console.log('[WebSocket] Disconnected from upload progress gateway');
            console.log(`  Reason: ${reason}`);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('[WebSocket] Connection error:', error);
        });

        socket.on('upload-progress', (event: UploadProgressEvent) => {
            console.log('[WebSocket] Progress event received:', {
                uploadId: event.uploadId,
                type: event.type,
                phase: event.phase,
                progress: event.progress,
                message: event.defaultMessage,
            });

            setUploadProgress((prev) => ({
                ...prev,
                [event.uploadId]: event,
            }));

            if (event.type === UploadProgressTypeEnum.COMPLETE) {
                console.log(`[WebSocket] Upload complete - ${event.uploadId}`);
                onCompleteRef.current?.(event);
            } else if (event.type === UploadProgressTypeEnum.ERROR) {
                console.error(`[WebSocket] Upload error - ${event.uploadId}:`, event.data?.error);
                onErrorRef.current?.(event.data?.error || event.message);
            } else {
                onProgressRef.current?.(event);
            }
        });

        return () => {
            console.log('[WebSocket] Cleaning up connection');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId]);

    const getProgress = (uploadId: string) => uploadProgress[uploadId];

    const clearProgress = (uploadId: string) => {
        setUploadProgress((prev) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [uploadId]: _, ...rest } = prev;
            return rest;
        });
    };

    return {
        isConnected,
        uploadProgress,
        getProgress,
        clearProgress,
    };
};
