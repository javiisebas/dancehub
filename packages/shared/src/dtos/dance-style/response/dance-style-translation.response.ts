import { Expose } from 'class-transformer';
import { BaseTranslationResponse } from '../../common';

export class DanceStyleTranslationResponse extends BaseTranslationResponse {
    @Expose()
    name!: string;

    @Expose()
    description!: string | null;
}
