import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';

export interface VideoMetadata {
    duration: number;
    width: number;
    height: number;
    codec: string;
    bitrate: number;
    fps: number;
    size: number;
    format: string;
}

export interface VideoThumbnail {
    buffer: Buffer;
    timestamp: number;
    width: number;
    height: number;
}

export interface VideoOptimizationResult {
    buffer: Buffer;
    originalSize: number;
    optimizedSize: number;
    metadata: VideoMetadata;
}

@Injectable()
export class VideoProcessorService {
    constructor(private readonly logger: LogService) {}

    async getMetadata(buffer: Buffer): Promise<VideoMetadata> {
        return new Promise((resolve, reject) => {
            const tempPath = `/tmp/video-${Date.now()}.mp4`;
            require('fs').writeFileSync(tempPath, buffer);

            ffmpeg.ffprobe(tempPath, (err, metadata) => {
                require('fs').unlinkSync(tempPath);

                if (err) {
                    this.logger.error(
                        `Failed to extract video metadata: ${err.message}`,
                        err.stack || '',
                        'VideoProcessorService',
                    );
                    reject(err);
                    return;
                }

                const videoStream = metadata.streams.find((s) => s.codec_type === 'video');

                if (!videoStream) {
                    reject(new Error('No video stream found'));
                    return;
                }

                resolve({
                    duration: metadata.format.duration || 0,
                    width: videoStream.width || 0,
                    height: videoStream.height || 0,
                    codec: videoStream.codec_name || 'unknown',
                    bitrate: parseInt(String(metadata.format.bit_rate || '0')),
                    fps: this.parseFps(videoStream.r_frame_rate),
                    size: metadata.format.size || 0,
                    format: metadata.format.format_name || 'unknown',
                });
            });
        });
    }

    async extractThumbnails(
        buffer: Buffer,
        count: number = 3,
        width: number = 1280,
    ): Promise<VideoThumbnail[]> {
        try {
            const metadata = await this.getMetadata(buffer);
            const duration = metadata.duration;

            if (duration <= 0) {
                throw new Error('Invalid video duration');
            }

            const timestamps = this.calculateTimestamps(duration, count);
            const thumbnails: VideoThumbnail[] = [];

            for (const timestamp of timestamps) {
                const thumbnail = await this.extractSingleThumbnail(buffer, timestamp, width);
                thumbnails.push(thumbnail);
            }

            this.logger.log(
                `Extracted ${thumbnails.length} thumbnails from video`,
                'VideoProcessorService',
            );

            return thumbnails;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to extract thumbnails: ${errorMessage}`,
                errorStack,
                'VideoProcessorService',
            );
            throw error;
        }
    }

    async extractSingleThumbnail(
        buffer: Buffer,
        timestamp: number,
        width: number = 1280,
    ): Promise<VideoThumbnail> {
        return new Promise((resolve, reject) => {
            const tempInputPath = `/tmp/video-${Date.now()}.mp4`;
            const tempOutputPath = `/tmp/thumb-${Date.now()}.jpg`;

            require('fs').writeFileSync(tempInputPath, buffer);

            ffmpeg(tempInputPath)
                .screenshots({
                    timestamps: [timestamp],
                    filename: require('path').basename(tempOutputPath),
                    folder: require('path').dirname(tempOutputPath),
                    size: `${width}x?`,
                })
                .on('end', () => {
                    try {
                        const thumbnailBuffer = require('fs').readFileSync(tempOutputPath);
                        require('fs').unlinkSync(tempInputPath);
                        require('fs').unlinkSync(tempOutputPath);

                        const dimensions = this.getImageDimensions(thumbnailBuffer);

                        resolve({
                            buffer: thumbnailBuffer,
                            timestamp,
                            width: dimensions.width,
                            height: dimensions.height,
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    try {
                        require('fs').unlinkSync(tempInputPath);
                        if (require('fs').existsSync(tempOutputPath)) {
                            require('fs').unlinkSync(tempOutputPath);
                        }
                    } catch {}
                    reject(error);
                });
        });
    }

    async optimizeVideo(buffer: Buffer, maxWidth: number = 1920): Promise<VideoOptimizationResult> {
        try {
            const metadata = await this.getMetadata(buffer);

            if (metadata.width <= maxWidth && metadata.codec === 'h264') {
                this.logger.log('Video already optimized, skipping', 'VideoProcessorService');
                return {
                    buffer,
                    originalSize: buffer.length,
                    optimizedSize: buffer.length,
                    metadata,
                };
            }

            const optimizedBuffer = await this.transcodeVideo(buffer, maxWidth);

            const optimizedMetadata = await this.getMetadata(optimizedBuffer);

            this.logger.log(
                `Video optimized: ${this.formatBytes(buffer.length)} → ${this.formatBytes(optimizedBuffer.length)} (${this.calculateReduction(buffer.length, optimizedBuffer.length)}% reduction)`,
                'VideoProcessorService',
            );

            return {
                buffer: optimizedBuffer,
                originalSize: buffer.length,
                optimizedSize: optimizedBuffer.length,
                metadata: optimizedMetadata,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack || '' : '';
            this.logger.error(
                `Failed to optimize video: ${errorMessage}`,
                errorStack,
                'VideoProcessorService',
            );
            throw error;
        }
    }

    private async transcodeVideo(buffer: Buffer, maxWidth: number): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const tempInputPath = `/tmp/video-in-${Date.now()}.mp4`;
            const tempOutputPath = `/tmp/video-out-${Date.now()}.mp4`;

            require('fs').writeFileSync(tempInputPath, buffer);

            ffmpeg(tempInputPath)
                .outputOptions([
                    '-c:v libx264',
                    '-preset medium',
                    '-crf 23',
                    `-vf scale=${maxWidth}:-2`,
                    '-c:a aac',
                    '-b:a 128k',
                    '-movflags +faststart',
                ])
                .output(tempOutputPath)
                .on('end', () => {
                    try {
                        const optimizedBuffer = require('fs').readFileSync(tempOutputPath);
                        require('fs').unlinkSync(tempInputPath);
                        require('fs').unlinkSync(tempOutputPath);
                        resolve(optimizedBuffer);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    try {
                        require('fs').unlinkSync(tempInputPath);
                        if (require('fs').existsSync(tempOutputPath)) {
                            require('fs').unlinkSync(tempOutputPath);
                        }
                    } catch {}
                    reject(error);
                });
        });
    }

    isVideoOptimizable(mimeType: string): boolean {
        const optimizableTypes = [
            'video/mp4',
            'video/quicktime',
            'video/x-msvideo',
            'video/x-matroska',
            'video/webm',
        ];
        return optimizableTypes.includes(mimeType);
    }

    private calculateTimestamps(duration: number, count: number): number[] {
        if (count === 1) {
            return [Math.floor(duration / 2)];
        }

        const timestamps: number[] = [];
        const interval = duration / (count + 1);

        for (let i = 1; i <= count; i++) {
            timestamps.push(Math.floor(interval * i));
        }

        return timestamps;
    }

    private parseFps(fpsString?: string): number {
        if (!fpsString) return 0;

        const parts = fpsString.split('/');
        if (parts.length === 2) {
            return parseInt(parts[0]) / parseInt(parts[1]);
        }

        return parseFloat(fpsString);
    }

    private getImageDimensions(buffer: Buffer): { width: number; height: number } {
        const sharp = require('sharp');
        return sharp(buffer)
            .metadata()
            .then((metadata: any) => ({
                width: metadata.width || 0,
                height: metadata.height || 0,
            }));
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    private calculateReduction(original: number, optimized: number): number {
        return Math.round(((original - optimized) / original) * 100);
    }
}
