import { Injectable } from '@nestjs/common';
import { BaseFileProcessor, ProcessedFile } from '../file-processor.strategy';
import { VideoProcessorService } from '../video-processor.service';

@Injectable()
export class VideoProcessor extends BaseFileProcessor {
    constructor(private readonly videoProcessor: VideoProcessorService) {
        super();
    }

    canProcess(mimeType: string): boolean {
        return this.videoProcessor.isVideoOptimizable(mimeType);
    }

    async process(file: Express.Multer.File): Promise<ProcessedFile> {
        const optimized = await this.videoProcessor.optimizeVideo(file.buffer);

        return this.createProcessedFile(optimized.buffer, 'mp4', 'video/mp4', {
            originalSize: file.size,
            optimizedSize: optimized.optimizedSize,
            duration: optimized.metadata.duration,
            width: optimized.metadata.width,
            height: optimized.metadata.height,
            codec: optimized.metadata.codec,
            bitrate: optimized.metadata.bitrate,
            fps: optimized.metadata.fps,
        });
    }

    getName(): string {
        return 'VideoProcessor';
    }
}
