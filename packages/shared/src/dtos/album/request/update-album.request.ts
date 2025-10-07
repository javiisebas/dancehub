import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateAlbumRequest {
    @IsString()
    @IsOptional()
    @MaxLength(256)
    title?: string;

    @IsInt()
    @IsOptional()
    @Min(1900)
    releaseYear?: number;
}
