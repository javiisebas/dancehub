import { Expose, Transform, Type } from 'class-transformer';
import { BaseResponse } from '../../common';
import { DanceStyleTranslationResponse } from './dance-style-translation.response';

export class DanceStyleResponse extends BaseResponse {
    @Expose()
    @Transform(({ obj }) => obj.entity?.id || obj.id)
    declare id: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.slug || obj.slug)
    slug!: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.createdAt || obj.createdAt)
    declare createdAt: string;

    @Expose()
    @Transform(({ obj }) => obj.entity?.updatedAt || obj.updatedAt)
    declare updatedAt: string;

    @Expose()
    @Type(() => DanceStyleTranslationResponse)
    translation?: DanceStyleTranslationResponse;

    @Expose()
    @Type(() => DanceStyleTranslationResponse)
    translations?: DanceStyleTranslationResponse[];
}
