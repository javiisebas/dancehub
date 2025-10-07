import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateSongRequest {
    @IsUUID()
    @IsNotEmpty()
    albumId!: string;

    @IsUUID()
    @IsNotEmpty()
    artistId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    title!: string;

    @IsInt()
    @Min(1)
    duration!: number;
}
