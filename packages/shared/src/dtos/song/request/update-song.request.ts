import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateSongRequest {
    @IsString()
    @IsOptional()
    @MaxLength(256)
    title?: string;

    @IsInt()
    @IsOptional()
    @Min(1)
    duration?: number;
}
