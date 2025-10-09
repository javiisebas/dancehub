import { Expose, Transform, Type } from 'class-transformer';
import { BaseResponse } from '../../common';
import { CourseTranslationResponse } from './course-translation.response';
import { CourseLevelEnum } from '../../../enums/course-level.enum';

export class CourseResponse extends BaseResponse {
    @Expose()
    @Transform(({ obj }) => obj.entity?.id || obj.id)
    declare id: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.slug || obj.slug)
    slug!: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.level || obj.level)
    level: CourseLevelEnum;

    @Expose()
    @Transform(({ obj }) => obj.entity?.duration || obj.duration)
    duration: number;

    @Expose()
    @Transform(({ obj }) => obj.entity?.price || obj.price)
    price: number;

    @Expose()
    @Transform(({ obj }) => obj.entity?.instructorId || obj.instructorId)
    instructorId: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.danceStyleId || obj.danceStyleId)
    danceStyleId: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.createdAt || obj.createdAt)
    declare createdAt: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.updatedAt || obj.updatedAt)
    declare updatedAt: string;

    @Expose()
    @Type(() => CourseTranslationResponse)
    translation?: CourseTranslationResponse;

    @Expose()
    @Type(() => CourseTranslationResponse)
    translations?: CourseTranslationResponse[];
}
