import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    IEnrollmentRepository,
    ENROLLMENT_REPOSITORY,
    EnrollmentField,
    EnrollmentRelations,
} from '../../domain/repositories/i-enrollment.repository';

export class GetEnrollmentByFieldQuery extends GetByFieldQuery<EnrollmentField, EnrollmentRelations> {}

@Injectable()
export class GetEnrollmentByFieldHandler extends BaseGetByFieldHandler<Enrollment, EnrollmentField, EnrollmentRelations> {
    constructor(@Inject(ENROLLMENT_REPOSITORY) repository: IEnrollmentRepository) {
        super(repository);
    }
}
