import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetPresignedUrlRequest {
    @Expose()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(60) // Min 1 minute
    @Max(604800) // Max 7 days
    expiresIn?: number;
}
