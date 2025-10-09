import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsOptional,
    IsString,
    IsNumber,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    Matches,
    MaxLength,
    MinLength,
    Min,
    Max,
    ValidateNested,
} from 'class-validator';
import { CourseTranslationDto } from './course-translation.dto';
import { CourseLevelEnum } from '../../../enums/course-level.enum';

export class UpdateCourseRequest {
    @IsString({ message: 'Slug must be a string' })
    @IsOptional()
    @MinLength(2, { message: 'Slug must be at least 2 characters long' })
    @MaxLength(255, { message: 'Slug cannot exceed 255 characters' })
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase, alphanumeric and can contain hyphens',
    })
    slug?: string;

    @IsOptional()
    @IsEnum(CourseLevelEnum)
    level?: CourseLevelEnum;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    instructorId?: string;

    @IsOptional()
    @IsString()
    danceStyleId?: string;

    @IsArray({ message: 'Translations must be an array' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: 'At least one translation is required' })
    @Type(() => CourseTranslationDto)
    @IsOptional()
    translations?: CourseTranslationDto[];
}
