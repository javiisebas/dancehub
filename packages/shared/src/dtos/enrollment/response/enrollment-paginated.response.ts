import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { EnrollmentResponse } from './enrollment.response';

export class EnrollmentPaginatedResponse extends PaginatedResponse<EnrollmentResponse> {
    @Expose()
    @Type(() => EnrollmentResponse)
    declare data: EnrollmentResponse[];
}
