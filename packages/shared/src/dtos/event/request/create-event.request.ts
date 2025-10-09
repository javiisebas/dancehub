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

export class CreateEventRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsNotEmpty()
    @IsEnum(EventStatusEnum)
    status: EventStatusEnum;

    @IsNotEmpty()
    @IsEnum(EventCategoryEnum)
    category: EventCategoryEnum;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxAttendees?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsBoolean()
    isFeatured: boolean;

    @IsString()
    @IsNotEmpty()
    organizerId: string;

    @IsString()
    @IsNotEmpty()
    danceStyleId: string;

}
