import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { UploadProgressEvent } from '@repo/shared';
import { Server, Socket } from 'socket.io';

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
        this.logger.log('Storage Progress WebSocket Gateway initialized', 'StorageProgressGateway');
        console.log('[WebSocket] Storage Progress Gateway initialized and ready');
    }

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        console.log('[WebSocket] Connection attempt:', { clientId: client.id, userId });

        if (!userId) {
            this.logger.warn(
                `Client ${client.id} connected without userId`,
                'StorageProgressGateway',
            );
            console.warn('[WebSocket] Rejected connection - no userId provided');
            client.disconnect();
            return;
        }

        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }

        this.userSockets.get(userId)!.add(client.id);
        client.join(`user:${userId}`);

        const activeConnections = this.userSockets.get(userId)!.size;
        this.logger.log(
            `Client ${client.id} connected for user ${userId} (${activeConnections} active)`,
            'StorageProgressGateway',
        );
        console.log(
            `[WebSocket] ✓ Client connected - User: ${userId}, Active connections: ${activeConnections}`,
        );
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId)!.delete(client.id);

            const activeConnections = this.userSockets.get(userId)!.size;
            if (activeConnections === 0) {
                this.userSockets.delete(userId);
            }

            this.logger.log(
                `Client ${client.id} disconnected for user ${userId} (${activeConnections} remaining)`,
                'StorageProgressGateway',
            );
            console.log(
                `[WebSocket] Client disconnected - User: ${userId}, Remaining: ${activeConnections}`,
            );
        } else {
            console.log('[WebSocket] Client disconnected - No userId found');
        }
    }

    emitProgress(userId: string, event: UploadProgressEvent) {
        const room = `user:${userId}`;
        const clientsInRoom = this.server.sockets.adapter.rooms.get(room)?.size || 0;

        console.log(
            `[WebSocket] Emitting progress to ${clientsInRoom} client(s) in room '${room}'`,
        );
        console.log(`  ├─ UploadId: ${event.uploadId}`);
        console.log(`  ├─ Type: ${event.type}`);
        console.log(`  ├─ Phase: ${event.phase}`);
        console.log(`  └─ Progress: ${event.progress}%`);

        this.server.to(room).emit('upload-progress', event);

        this.logger.debug(
            `Progress emitted to user ${userId}: ${event.type} - ${event.progress}% (${clientsInRoom} clients)`,
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
