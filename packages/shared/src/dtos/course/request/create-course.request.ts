import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
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

export class CreateCourseRequest {
    @IsString({ message: 'Slug must be a string' })
    @IsNotEmpty({ message: 'Slug cannot be empty' })
    @MinLength(2, { message: 'Slug must be at least 2 characters long' })
    @MaxLength(255, { message: 'Slug cannot exceed 255 characters' })
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'Slug must be lowercase, alphanumeric and can contain hyphens',
    })
    slug!: string;

    @IsNotEmpty()
    @IsEnum(CourseLevelEnum)
    level: CourseLevelEnum;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    duration: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsNotEmpty()
    instructorId: string;

    @IsString()
    @IsNotEmpty()
    danceStyleId: string;

    @IsArray({ message: 'Translations must be an array' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: 'At least one translation is required' })
    @Type(() => CourseTranslationDto)
    translations!: CourseTranslationDto[];
}
