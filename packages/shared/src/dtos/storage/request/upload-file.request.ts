import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { StorageVisibilityEnum } from '../../../enums';

export class UploadFileRequest {
    @Expose()
    @IsOptional()
    @IsEnum(StorageVisibilityEnum)
    visibility?: StorageVisibilityEnum;

    @Expose()
    @IsOptional()
    @IsObject()
    @Type(() => Object)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        }
        return value;
    })
    metadata?: Record<string, any>;
}
