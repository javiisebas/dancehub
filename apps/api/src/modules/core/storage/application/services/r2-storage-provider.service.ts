import { TypedConfigService } from '@api/modules/core/config/config.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import {
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
    UploadPartCommand,
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

    async upload(
        file: Express.Multer.File,
        path: string,
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult> {
        try {
            const CHUNK_SIZE = 5 * 1024 * 1024;
            const useMultipart = file.size > CHUNK_SIZE;

            this.logger.log(
                `Starting upload: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)}MB) - Multipart: ${useMultipart}`,
                'R2StorageProviderService',
            );

            if (useMultipart) {
                return await this.uploadMultipart(file, path, onProgress);
            }

            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: path,
                Body: file.buffer,
                ContentType: file.mimetype,
                CacheControl: 'public, max-age=31536000, immutable',
                Metadata: {
                    'original-name': file.originalname,
                    'content-length': file.size.toString(),
                },
            });

            if (onProgress) {
                onProgress(0);
                this.logger.debug('R2 upload progress: 0%', 'R2StorageProviderService');
            }

            await this.client.send(command);

            if (onProgress) {
                onProgress(100);
                this.logger.debug('R2 upload progress: 100%', 'R2StorageProviderService');
            }

            this.logger.log(
                `Successfully uploaded ${file.originalname} to ${path}`,
                'R2StorageProviderService',
            );

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

    private async uploadMultipart(
        file: Express.Multer.File,
        path: string,
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult> {
        const CHUNK_SIZE = 5 * 1024 * 1024;
        const chunks = Math.ceil(file.size / CHUNK_SIZE);

        this.logger.log(
            `Initiating multipart upload: ${chunks} chunks for ${file.originalname}`,
            'R2StorageProviderService',
        );

        const createCommand = new CreateMultipartUploadCommand({
            Bucket: this.bucket,
            Key: path,
            ContentType: file.mimetype,
            CacheControl: 'public, max-age=31536000, immutable',
            Metadata: {
                'original-name': file.originalname,
                'content-length': file.size.toString(),
            },
        });

        const { UploadId } = await this.client.send(createCommand);

        if (!UploadId) {
            throw new Error('Failed to initiate multipart upload');
        }

        this.logger.log(
            `Multipart upload initiated with ID: ${UploadId}`,
            'R2StorageProviderService',
        );

        try {
            const uploadedParts: { ETag: string | undefined; PartNumber: number }[] = [];

            if (onProgress) {
                onProgress(0);
            }

            for (let i = 0; i < chunks; i++) {
                const start = i * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.buffer.slice(start, end);

                this.logger.debug(
                    `Uploading part ${i + 1}/${chunks} (${(chunk.length / 1024 / 1024).toFixed(2)}MB)`,
                    'R2StorageProviderService',
                );

                const uploadPartCommand = new UploadPartCommand({
                    Bucket: this.bucket,
                    Key: path,
                    UploadId,
                    PartNumber: i + 1,
                    Body: chunk,
                });

                const partResult = await this.client.send(uploadPartCommand);

                uploadedParts.push({
                    ETag: partResult.ETag,
                    PartNumber: i + 1,
                });

                const progress = Math.round(((i + 1) / chunks) * 100);
                if (onProgress) {
                    onProgress(progress);
                    this.logger.debug(
                        `Part ${i + 1}/${chunks} uploaded - Progress: ${progress}%`,
                        'R2StorageProviderService',
                    );
                }
            }

            this.logger.log('Completing multipart upload...', 'R2StorageProviderService');

            const completeCommand = new CompleteMultipartUploadCommand({
                Bucket: this.bucket,
                Key: path,
                UploadId,
                MultipartUpload: {
                    Parts: uploadedParts,
                },
            });

            await this.client.send(completeCommand);

            if (onProgress) {
                onProgress(100);
            }

            this.logger.log(
                `Successfully uploaded ${(file.size / 1024 / 1024).toFixed(2)}MB in ${chunks} chunks to ${path}`,
                'R2StorageProviderService',
            );

            return {
                path,
                size: file.size,
            };
        } catch (error) {
            this.logger.error(
                `Multipart upload failed, aborting: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack || '' : '',
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
                ResponseCacheControl: 'public, max-age=31536000, immutable',
                ResponseContentDisposition: 'inline',
            });

            const url = await getSignedUrl(this.client, command, {
                expiresIn,
            });

            return url;
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
