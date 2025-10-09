import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedEnrollmentRequest } from '@repo/shared';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    IEnrollmentRepository,
    ENROLLMENT_REPOSITORY,
    EnrollmentField,
    EnrollmentRelations,
} from '../../domain/repositories/i-enrollment.repository';

export class GetPaginatedEnrollmentsQuery extends GetPaginatedQueryEnhanced<PaginatedEnrollmentRequest> {}

@Injectable()
export class GetPaginatedEnrollmentsHandler extends BaseGetPaginatedHandler<
    Enrollment,
    PaginatedEnrollmentRequest,
    EnrollmentField,
    EnrollmentRelations
> {
    constructor(@Inject(ENROLLMENT_REPOSITORY) repository: IEnrollmentRepository) {
        super(repository);
    }
}
