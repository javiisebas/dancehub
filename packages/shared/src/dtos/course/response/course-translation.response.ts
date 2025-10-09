import { Expose } from 'class-transformer';
import { BaseTranslationResponse } from '../../common';

export class CourseTranslationResponse extends BaseTranslationResponse {
    @Expose()
    name!: string;

    @Expose()
    description?: string;
}
