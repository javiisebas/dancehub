import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FilterOperator, LogicalOperator } from '@repo/shared';
import {
    ENROLLMENT_REPOSITORY,
    IEnrollmentRepository,
} from '../../domain/repositories/i-enrollment.repository';

export class CheckCourseAccessQuery {
    constructor(
        public readonly userId: string,
        public readonly courseId: string,
    ) {}
}

@QueryHandler(CheckCourseAccessQuery)
export class CheckCourseAccessHandler implements IQueryHandler<CheckCourseAccessQuery> {
    constructor(
        @Inject(ENROLLMENT_REPOSITORY)
        private readonly enrollmentRepository: IEnrollmentRepository,
    ) {}

    async execute(query: CheckCourseAccessQuery): Promise<{ hasAccess: boolean }> {
        const enrollment = await this.enrollmentRepository.findOne({
            filter: {
                operator: LogicalOperator.AND,
                conditions: [
                    { field: 'userId', operator: FilterOperator.EQ, value: query.userId },
                    { field: 'courseId', operator: FilterOperator.EQ, value: query.courseId },
                    { field: 'status', operator: FilterOperator.EQ, value: 'active' },
                ],
            },
        });

        const hasAccess = !!enrollment;

        if (enrollment?.expiresAt) {
            const isExpired = new Date() > enrollment.expiresAt;
            return { hasAccess: hasAccess && !isExpired };
        }

        return { hasAccess };
    }
}
