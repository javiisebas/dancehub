import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';

/**
 * Service responsible for generating storage paths
 * Centralized logic for consistent path generation
 */
@Injectable()
export class StoragePathService {
    /**
     * Generate a unique filename with proper extension
     */
    generateFilename(originalFilename: string, newExtension?: string): string {
        const uniqueId = randomUUID();
        const ext = newExtension || extname(originalFilename).slice(1);
        return `${uniqueId}.${ext}`;
    }

    /**
     * Generate storage path with date-based organization
     * Format: users/{userId}/{year}/{month}/{filename} or public/{year}/{month}/{filename}
     */
    generatePath(userId: string | null, filename: string): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        if (userId) {
            return `users/${userId}/${year}/${month}/${filename}`;
        }

        return `public/${year}/${month}/${filename}`;
    }

    /**
     * Generate path for thumbnails
     */
    generateThumbnailPath(originalPath: string, size: string): string {
        const ext = extname(originalPath);
        const pathWithoutExt = originalPath.substring(0, originalPath.length - ext.length);
        return `${pathWithoutExt}_thumb_${size}${ext}`;
    }

    /**
     * Extract user ID from path if present
     */
    extractUserIdFromPath(path: string): string | null {
        const match = path.match(/^users\/([^/]+)\//);
        return match ? match[1] : null;
    }

    /**
     * Check if path is for a public file
     */
    isPublicPath(path: string): boolean {
        return path.startsWith('public/');
    }
}
