import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface FileValidationOptions {
    maxSizeInBytes?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
    required?: boolean;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly maxSize: number;
    private readonly allowedMimeTypes: string[];
    private readonly allowedExtensions: string[];
    private readonly required: boolean;

    constructor(options: FileValidationOptions = {}) {
        this.maxSize = options.maxSizeInBytes || 200 * 1024 * 1024; // 200MB default
        this.allowedMimeTypes = options.allowedMimeTypes || [];
        this.allowedExtensions = options.allowedExtensions || [];
        this.required = options.required !== undefined ? options.required : true;
    }

    transform(file: Express.Multer.File): Express.Multer.File {
        if (!file) {
            if (this.required) {
                throw new BadRequestException('File is required');
            }
            return file;
        }

        if (file.size > this.maxSize) {
            const maxSizeMB = (this.maxSize / (1024 * 1024)).toFixed(2);
            throw new BadRequestException(
                `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
            );
        }

        if (this.allowedMimeTypes.length > 0 && !this.allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
                `File type not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
            );
        }

        if (this.allowedExtensions.length > 0) {
            const extension = file.originalname.split('.').pop()?.toLowerCase();
            if (!extension || !this.allowedExtensions.includes(extension)) {
                throw new BadRequestException(
                    `File extension not allowed. Allowed extensions: ${this.allowedExtensions.join(', ')}`,
                );
            }
        }

        return file;
    }
}
