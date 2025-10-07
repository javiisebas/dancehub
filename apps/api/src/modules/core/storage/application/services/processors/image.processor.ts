import { Injectable } from '@nestjs/common';
import { BaseFileProcessor, ProcessedFile } from '../file-processor.strategy';
import { ImageOptimizerService } from '../image-optimizer.service';

@Injectable()
export class ImageProcessor extends BaseFileProcessor {
    constructor(private readonly optimizer: ImageOptimizerService) {
        super();
    }

    canProcess(mimeType: string): boolean {
        return this.optimizer.isImageOptimizable(mimeType);
    }

    async process(file: Express.Multer.File): Promise<ProcessedFile> {
        const optimized = await this.optimizer.optimizeImage(file.buffer, file.mimetype);

        return this.createProcessedFile(
            optimized.buffer,
            optimized.format,
            `image/${optimized.format}`,
            {
                originalSize: file.size,
                optimizedSize: optimized.optimizedSize,
                compressionRatio: ((file.size - optimized.optimizedSize) / file.size) * 100,
            },
        );
    }

    getName(): string {
        return 'ImageProcessor';
    }
}
