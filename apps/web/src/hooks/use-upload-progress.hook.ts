import { UploadProgressTypeEnum } from '@repo/shared';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface UploadProgressEvent {
    uploadId: string;
    type: UploadProgressTypeEnum;
    progress: number;
    message: string;
    data?: {
        storageId?: string;
        url?: string;
        filename?: string;
        error?: string;
        type?: string;
        phase?: string;
        r2Progress?: number;
    };
}

export interface UseUploadProgressOptions {
    userId?: string;
    onProgress?: (event: UploadProgressEvent) => void;
    onComplete?: (storageId: string, url?: string) => void;
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
        if (!userId) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const baseUrl = apiUrl.replace('/api', '');

        const socket = io(`${baseUrl}/storage`, {
            query: { userId },
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('upload-progress', (event: UploadProgressEvent) => {
            setUploadProgress((prev) => ({
                ...prev,
                [event.uploadId]: event,
            }));

            onProgressRef.current?.(event);

            if (event.type === UploadProgressTypeEnum.COMPLETE) {
                onCompleteRef.current?.(event.data?.storageId!, event.data?.url);
            }

            if (event.type === UploadProgressTypeEnum.ERROR) {
                onErrorRef.current?.(event.data?.error || event.message);
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [userId]);

    const getProgress = (uploadId: string) => uploadProgress[uploadId];

    const clearProgress = (uploadId: string) => {
        setUploadProgress((prev) => {
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
