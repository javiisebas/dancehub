import { IsInt, IsNotEmpty, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateAlbumRequest {
    @IsUUID()
    @IsNotEmpty()
    artistId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    title!: string;

    @IsInt()
    @Min(1900)
    releaseYear!: number;
}
