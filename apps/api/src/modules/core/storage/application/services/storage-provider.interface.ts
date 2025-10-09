export interface IStorageProvider {
    upload(
        file: Express.Multer.File,
        path: string,
        onProgress?: (progress: number) => void,
    ): Promise<UploadResult>;
    delete(path: string): Promise<void>;
    getPresignedUrl(path: string, expiresIn: number): Promise<string>;
    getPublicUrl(path: string): string;
}

export interface UploadResult {
    path: string;
    providerId?: string;
    size: number;
}
