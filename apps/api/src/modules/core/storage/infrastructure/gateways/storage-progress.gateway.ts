import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { UploadProgressTypeEnum } from '@repo/shared';
import { Server, Socket } from 'socket.io';

export interface UploadProgressEvent {
    uploadId: string;
    type: UploadProgressTypeEnum;
    progress: number;
    message: string;
    data?: any;
}

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: '/storage',
})
@Injectable()
export class StorageProgressGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    private userSockets: Map<string, Set<string>> = new Map();

    constructor(private readonly logger: LogService) {}

    afterInit(server: Server) {
        this.logger.log('Storage WebSocket Gateway initialized', 'StorageProgressGateway');
    }

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (!userId) {
            this.logger.warn(
                `Client ${client.id} connected without userId`,
                'StorageProgressGateway',
            );
            client.disconnect();
            return;
        }

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)!.add(client.id);

        client.join(`user:${userId}`);

        this.logger.log(
            `Client ${client.id} connected for user ${userId}`,
            'StorageProgressGateway',
        );
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId)!.delete(client.id);

            if (this.userSockets.get(userId)!.size === 0) {
                this.userSockets.delete(userId);
            }
        }

        this.logger.log(
            `Client ${client.id} disconnected for user ${userId}`,
            'StorageProgressGateway',
        );
    }

    emitProgress(userId: string, event: UploadProgressEvent) {
        this.server.to(`user:${userId}`).emit('upload-progress', event);

        this.logger.debug(
            `Progress emitted to user ${userId}: ${event.type} - ${event.progress}%`,
            'StorageProgressGateway',
        );
    }

    emitToUpload(uploadId: string, event: UploadProgressEvent) {
        this.server.to(`upload:${uploadId}`).emit('upload-progress', event);
    }

    joinUploadRoom(client: Socket, uploadId: string) {
        client.join(`upload:${uploadId}`);
    }
}
