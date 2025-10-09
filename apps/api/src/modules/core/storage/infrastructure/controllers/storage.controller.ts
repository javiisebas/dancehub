import { CurrentUser } from '@api/common/decorators/current-user.decorator';
import { Serialize } from '@api/common/decorators/serialize.decorator';
import { JwtAuthGuard } from '@api/common/guards/jwt-auth.guard';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import {
    PaginatedStorageRequest,
    PresignedUrlResponse,
    StoragePaginatedResponse,
    StorageResponse,
    UpdateStorageRequest,
    UploadFileRequest,
    UploadFileResponse,
} from '@repo/shared';
import { CreateStorageHandler } from '../../application/commands/create-storage.handler';
import { DeleteStorageHandler } from '../../application/commands/delete-storage.handler';
import {
    UpdateStorageCommand,
    UpdateStorageHandler,
} from '../../application/commands/update-storage.handler';
import {
    GetPaginatedStoragesHandler,
    GetPaginatedStoragesQuery,
} from '../../application/queries/get-paginated-storages.handler';
import { GetStorageHandler, GetStorageQuery } from '../../application/queries/get-storage.handler';
import { StorageService } from '../../application/services/storage.service';
import { StorageAccessGuard } from '../guards/storage-access.guard';
import { StorageOwnershipGuard } from '../guards/storage-ownership.guard';
import { StorageUrlInterceptor } from '../interceptors/storage-url.interceptor';
import { FileTypeValidator } from '../validators/file-type.validator';
import { FileValidationPipe } from '../validators/file-validation.pipe';

@Controller('storage')
export class StorageController {
    constructor(
        private readonly createStorageHandler: CreateStorageHandler,
        private readonly deleteStorageHandler: DeleteStorageHandler,
        private readonly getStorageHandler: GetStorageHandler,
        private readonly getPaginatedStoragesHandler: GetPaginatedStoragesHandler,
        private readonly updateStorageHandler: UpdateStorageHandler,
        private readonly storageService: StorageService,
    ) {}

    @Post('upload')
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseInterceptors(FileInterceptor('file'), StorageUrlInterceptor)
    @Serialize(UploadFileResponse)
    async uploadFile(
        @UploadedFile(
            new FileValidationPipe({
                maxSizeInBytes: 50 * 1024 * 1024, // 50MB max
                required: true,
            }),
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileRequest,
        @CurrentUser('id') userId?: string,
    ) {
        return this.storageService.uploadFile(file, userId ?? null, dto);
    }

    @Post('upload/image')
    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @UseInterceptors(FileInterceptor('file'), StorageUrlInterceptor)
    @Serialize(UploadFileResponse)
    async uploadImage(
        @UploadedFile(
            new FileValidationPipe({
                maxSizeInBytes: 5 * 1024 * 1024, // 5MB for images
                allowedMimeTypes: FileTypeValidator.IMAGE_MIME_TYPES,
                allowedExtensions: FileTypeValidator.IMAGE_EXTENSIONS,
                required: true,
            }),
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileRequest,
        @CurrentUser('id') userId?: string,
    ) {
        return this.storageService.uploadFile(file, userId ?? null, dto);
    }

    @Post('upload/document')
    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @UseInterceptors(FileInterceptor('file'), StorageUrlInterceptor)
    @Serialize(UploadFileResponse)
    async uploadDocument(
        @UploadedFile(
            new FileValidationPipe({
                maxSizeInBytes: 10 * 1024 * 1024, // 10MB for documents
                allowedMimeTypes: FileTypeValidator.DOCUMENT_MIME_TYPES,
                allowedExtensions: FileTypeValidator.DOCUMENT_EXTENSIONS,
                required: true,
            }),
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileRequest,
        @CurrentUser('id') userId?: string,
    ) {
        return this.storageService.uploadFile(file, userId ?? null, dto);
    }

    @Post('upload/video')
    @UseGuards(JwtAuthGuard)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UseInterceptors(FileInterceptor('file'), StorageUrlInterceptor)
    @Serialize(UploadFileResponse)
    async uploadVideo(
        @UploadedFile(
            new FileValidationPipe({
                maxSizeInBytes: 1000 * 1024 * 1024, // 100MB for videos
                allowedMimeTypes: FileTypeValidator.VIDEO_MIME_TYPES,
                allowedExtensions: FileTypeValidator.VIDEO_EXTENSIONS,
                required: true,
            }),
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileRequest,
        @CurrentUser('id') userId?: string,
    ) {
        const uploadId = dto.metadata?.uploadId as string | undefined;
        return this.storageService.uploadFile(file, userId ?? null, dto, uploadId);
    }

    @Get()
    @UseInterceptors(StorageUrlInterceptor)
    @Serialize(StoragePaginatedResponse)
    async paginate(@Query() dto: PaginatedStorageRequest) {
        const query = new GetPaginatedStoragesQuery(dto);
        return this.getPaginatedStoragesHandler.execute(query);
    }

    @Get(':id')
    @UseGuards(StorageAccessGuard)
    @UseInterceptors(StorageUrlInterceptor)
    @Serialize(StorageResponse)
    async findById(@Param('id') id: string) {
        const query = new GetStorageQuery(id);
        return this.getStorageHandler.execute(query);
    }

    @Get(':id/presigned-url')
    @UseGuards(JwtAuthGuard, StorageAccessGuard)
    @Serialize(PresignedUrlResponse)
    async getPresignedUrl(
        @Param('id') id: string,
        @Query('expiresIn') expiresIn?: number,
        @CurrentUser('id') userId?: string,
    ) {
        const expires = expiresIn ? Number(expiresIn) : 3600;
        if (expires < 60 || expires > 604800) {
            throw new BadRequestException('expiresIn must be between 60 and 604800 seconds');
        }
        return this.storageService.getPresignedUrl(id, userId ?? null, expires);
    }

    @Get(':id/public-url')
    @UseGuards(StorageAccessGuard)
    async getPublicUrl(@Param('id') id: string) {
        const url = await this.storageService.getPublicUrl(id);
        return { url };
    }

    @Patch(':id')
    @UseGuards(StorageOwnershipGuard)
    @UseInterceptors(StorageUrlInterceptor)
    @Serialize(StorageResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateStorageRequest) {
        const command = new UpdateStorageCommand(id, dto);
        return this.updateStorageHandler.execute(command);
    }

    @Delete(':id')
    @UseGuards(StorageOwnershipGuard)
    @HttpCode(204)
    async delete(@Param('id') id: string, @CurrentUser('id') userId?: string): Promise<void> {
        await this.storageService.deleteFile(id, userId ?? null);
    }
}
