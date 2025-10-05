import { Injectable } from '@nestjs/common';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import sharp from 'sharp';

export interface OptimizedImageResult {
    buffer: Buffer;
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    format: string;
}

export interface ThumbnailResult {
    buffer: Buffer;
    width: number;
    height: number;
    size: number;
}

@Injectable()
export class ImageOptimizerService {
    private readonly MAX_WIDTH = 2048;
    private readonly MAX_HEIGHT = 2048;
    private readonly QUALITY = 85;

    private readonly THUMBNAIL_SIZES = {
        small: { width: 150, height: 150 },
        medium: { width: 300, height: 300 },
        large: { width: 600, height: 600 },
    };

    constructor(private readonly logger: LogService) {}

    async optimizeImage(buffer: Buffer, mimeType: string): Promise<OptimizedImageResult> {
        try {
            const originalSize = buffer.length;
            const image = sharp(buffer);
            const metadata = await image.metadata();

            let optimizedBuffer: Buffer;
            let format = 'webp';

            if (mimeType === 'image/gif') {
                format = 'gif';
                optimizedBuffer = await image.gif().toBuffer();
            } else if (mimeType === 'image/png' && metadata.hasAlpha) {
                format = 'png';
                optimizedBuffer = await image
                    .png({
                        quality: this.QUALITY,
                        compressionLevel: 9,
                        adaptiveFiltering: true,
                    })
                    .toBuffer();
            } else {
                format = 'webp';
                optimizedBuffer = await image
                    .resize({
                        width: this.MAX_WIDTH,
                        height: this.MAX_HEIGHT,
                        fit: 'inside',
                        withoutEnlargement: true,
                    })
                    .webp({
                        quality: this.QUALITY,
                        effort: 6,
                    })
                    .toBuffer();
            }

            const optimizedSize = optimizedBuffer.length;
            const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;

            this.logger.log(
                `Image optimized: ${(originalSize / 1024).toFixed(2)}KB → ${(optimizedSize / 1024).toFixed(2)}KB (${compressionRatio.toFixed(1)}% reduction)`,
                'ImageOptimizerService',
            );

            return {
                buffer: optimizedBuffer,
                originalSize,
                optimizedSize,
                compressionRatio,
                format,
            };
        } catch (error) {
            this.logger.error(
                'Failed to optimize image, returning original',
                error instanceof Error ? error.stack || '' : '',
                'ImageOptimizerService',
            );
            return {
                buffer,
                originalSize: buffer.length,
                optimizedSize: buffer.length,
                compressionRatio: 0,
                format: mimeType.split('/')[1],
            };
        }
    }

    async generateThumbnails(
        buffer: Buffer,
    ): Promise<{ small: ThumbnailResult; medium: ThumbnailResult; large: ThumbnailResult }> {
        try {
            const [small, medium, large] = await Promise.all([
                this.generateThumbnail(buffer, this.THUMBNAIL_SIZES.small),
                this.generateThumbnail(buffer, this.THUMBNAIL_SIZES.medium),
                this.generateThumbnail(buffer, this.THUMBNAIL_SIZES.large),
            ]);

            return { small, medium, large };
        } catch (error) {
            this.logger.error(
                'Failed to generate thumbnails',
                error instanceof Error ? error.stack || '' : '',
                'ImageOptimizerService',
            );
            throw error;
        }
    }

    private async generateThumbnail(
        buffer: Buffer,
        size: { width: number; height: number },
    ): Promise<ThumbnailResult> {
        const thumbnailBuffer = await sharp(buffer)
            .resize(size.width, size.height, {
                fit: 'cover',
                position: 'center',
            })
            .webp({ quality: 80 })
            .toBuffer();

        return {
            buffer: thumbnailBuffer,
            width: size.width,
            height: size.height,
            size: thumbnailBuffer.length,
        };
    }

    async extractVideoThumbnail(videoBuffer: Buffer): Promise<Buffer> {
        throw new Error('Video thumbnail extraction not implemented yet. Use FFmpeg in future.');
    }

    isImageOptimizable(mimeType: string): boolean {
        return [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/tiff',
        ].includes(mimeType);
    }
}
