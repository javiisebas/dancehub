import { Expose } from 'class-transformer';
import { BaseResponse } from './base.response';

export abstract class BaseTranslationResponse extends BaseResponse {
    @Expose()
    locale!: string;
}
