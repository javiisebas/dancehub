import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    IEnrollmentRepository,
    ENROLLMENT_REPOSITORY,
    EnrollmentField,
    EnrollmentRelations,
} from '../../domain/repositories/i-enrollment.repository';

export class FindManyEnrollmentsQuery extends FindManyQuery<EnrollmentField, EnrollmentRelations> {}

@Injectable()
export class FindManyEnrollmentsHandler extends BaseFindManyHandler<Enrollment, EnrollmentField, EnrollmentRelations> {
    constructor(@Inject(ENROLLMENT_REPOSITORY) repository: IEnrollmentRepository) {
        super(repository);
    }
}
