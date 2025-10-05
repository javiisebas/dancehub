import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { LocalesEnum } from '../../../enums';

export abstract class BaseTranslationDto {
    @IsEnum(LocalesEnum, { message: 'Invalid locale' })
    @IsNotEmpty({ message: 'Locale cannot be empty' })
    locale!: LocalesEnum;
}

export abstract class BaseNamedTranslationDto extends BaseTranslationDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
    name!: string;

    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    @MaxLength(2000, { message: 'Description cannot exceed 2000 characters' })
    description?: string;
}
