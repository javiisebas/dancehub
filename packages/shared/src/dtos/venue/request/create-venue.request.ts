import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateVenueRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    capacity?: number;

    @IsBoolean()
    @IsOptional()
    hasParking?: boolean;

    @IsUUID()
    @IsNotEmpty()
    ownerId: string;

    @IsUUID('4', { each: true })
    @IsOptional()
    danceStyleIds?: string[];
}
