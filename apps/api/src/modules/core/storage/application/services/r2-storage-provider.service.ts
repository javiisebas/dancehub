import { TypedConfigService } from '@api/modules/core/config/config.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { IStorageProvider, UploadResult } from './storage-provider.interface';

@Injectable()
export class R2StorageProviderService implements IStorageProvider {
    private client: S3Client;
    private bucket: string;
    private publicUrl: string;

    constructor(
        private readonly configService: TypedConfigService,
        private readonly logger: LogService,
    ) {
        this.initializeClient();
    }

    private initializeClient(): void {
        const storageConfig = this.configService.get('storage');
        const r2Config = storageConfig?.r2;

        const accountId = r2Config?.accountId;
        const accessKeyId = r2Config?.accessKeyId;
        const secretAccessKey = r2Config?.secretAccessKey;
        this.bucket = r2Config?.bucket || '';
        this.publicUrl = r2Config?.publicUrl || '';

        if (!accountId || !accessKeyId || !secretAccessKey || !this.bucket) {
            this.logger.warn('R2 storage provider not configured', 'R2StorageProviderService');
            return;
        }

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.logger.log('R2 storage provider initialized', 'R2StorageProviderService');
    }

    async upload(file: Express.Multer.File, path: string): Promise<UploadResult> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: path,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await this.client.send(command);

            return {
                path,
                size: file.size,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to upload file to R2: ${errorMessage}`,
                errorStack,
                'R2StorageProviderService',
            );
            throw error;
        }
    }

    async delete(path: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: path,
            });

            await this.client.send(command);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to delete file from R2: ${errorMessage}`,
                errorStack,
                'R2StorageProviderService',
            );
            throw error;
        }
    }

    async getPresignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: path,
            });

            return await getSignedUrl(this.client, command, { expiresIn });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to generate presigned URL: ${errorMessage}`,
                errorStack,
                'R2StorageProviderService',
            );
            throw error;
        }
    }

    getPublicUrl(path: string): string {
        if (!this.publicUrl) {
            throw new Error('Public URL not configured for R2 storage');
        }
        return `${this.publicUrl}/${path}`;
    }
}
