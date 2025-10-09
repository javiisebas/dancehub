import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FilterOperator } from '@repo/shared';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
    ENROLLMENT_REPOSITORY,
    IEnrollmentRepository,
} from '../../domain/repositories/i-enrollment.repository';

export class GetUserEnrollmentsQuery {
    constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserEnrollmentsQuery)
export class GetUserEnrollmentsHandler implements IQueryHandler<GetUserEnrollmentsQuery> {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY)
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) {}

    async execute(query: GetUserEnrollmentsQuery): Promise<Enrollment[]> {
        return this.enrollmentRepository.findMany({
            filter: {
                field: 'userId',
                operator: FilterOperator.EQ,
                value: query.userId,
            },
            limit: 100,
        });
    }
}
