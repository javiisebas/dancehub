import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateArtistRequest {
    @IsString()
    @IsOptional()
    @MaxLength(256)
    name?: string;
}
