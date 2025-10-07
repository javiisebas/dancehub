import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateArtistRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    name!: string;
}
