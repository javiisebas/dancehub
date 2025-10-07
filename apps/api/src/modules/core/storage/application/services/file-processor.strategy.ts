/**
 * Strategy Pattern for file processing
 * Makes it easy to add new file types without modifying existing code
 */

export interface ProcessedFile {
    buffer: Buffer;
    size: number;
    extension: string;
    mimeType: string;
    metadata?: Record<string, any>;
}

export interface IFileProcessor {
    /**
     * Check if this processor can handle the given MIME type
     */
    canProcess(mimeType: string): boolean;

    /**
     * Process the file and return optimized version
     */
    process(file: Express.Multer.File): Promise<ProcessedFile>;

    /**
     * Get processor name for logging/tracking
     */
    getName(): string;
}

/**
 * Base class for file processors
 * Provides common functionality
 */
export abstract class BaseFileProcessor implements IFileProcessor {
    abstract canProcess(mimeType: string): boolean;
    abstract process(file: Express.Multer.File): Promise<ProcessedFile>;
    abstract getName(): string;

    protected createProcessedFile(
        buffer: Buffer,
        extension: string,
        mimeType: string,
        metadata?: Record<string, any>,
    ): ProcessedFile {
        return {
            buffer,
            size: buffer.length,
            extension,
            mimeType,
            metadata,
        };
    }
}

/**
 * Registry for file processors
 * Automatically selects the right processor based on MIME type
 */
export class FileProcessorRegistry {
    private processors: IFileProcessor[] = [];

    register(processor: IFileProcessor): void {
        this.processors.push(processor);
    }

    getProcessor(mimeType: string): IFileProcessor | null {
        return this.processors.find((p) => p.canProcess(mimeType)) || null;
    }

    hasProcessor(mimeType: string): boolean {
        return this.getProcessor(mimeType) !== null;
    }

    async process(file: Express.Multer.File): Promise<ProcessedFile> {
        const processor = this.getProcessor(file.mimetype);

        if (!processor) {
            // Return original file if no processor available
            return {
                buffer: file.buffer,
                size: file.size,
                extension: file.originalname.split('.').pop() || '',
                mimeType: file.mimetype,
            };
        }

        return processor.process(file);
    }
}
