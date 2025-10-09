import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    MinLength,
    MaxLength,
    Min,
    Max,
} from 'class-validator';
import { EventStatusEnum } from '../../../enums/event-status.enum';
import { EventCategoryEnum } from '../../../enums/event-category.enum';

export class UpdateEventRequest {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    slug?: string;

    @IsOptional()
    @IsString()
    description?: string | null;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @IsOptional()
    @IsEnum(EventStatusEnum)
    status?: EventStatusEnum;

    @IsOptional()
    @IsEnum(EventCategoryEnum)
    category?: EventCategoryEnum;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxAttendees?: number | null;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number | null;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsString()
    @IsOptional()
    organizerId?: string;

    @IsString()
    @IsOptional()
    danceStyleId?: string;

}
