import { Module } from '@nestjs/common';
import { CreateEnrollmentHandler } from './application/commands/create-enrollment.handler';
import { DeleteEnrollmentHandler } from './application/commands/delete-enrollment.handler';
import { EnrollUserHandler } from './application/commands/enroll-user.handler';
import { UpdateEnrollmentHandler } from './application/commands/update-enrollment.handler';
import { CheckCourseAccessHandler } from './application/queries/check-course-access.handler';
import { FindManyEnrollmentsHandler } from './application/queries/find-many-enrollments.handler';
import { GetEnrollmentByFieldHandler } from './application/queries/get-enrollment-by-field.handler';
import { GetPaginatedEnrollmentsHandler } from './application/queries/get-paginated-enrollments.handler';
import { GetUserEnrollmentsHandler } from './application/queries/get-user-enrollments.handler';
import { ENROLLMENT_REPOSITORY } from './domain/repositories/i-enrollment.repository';
import { EnrollmentController } from './infrastructure/controllers/enrollment.controller';
import { EnrollmentRepositoryImpl } from './infrastructure/repositories/enrollment.repository';

@Module({
    controllers: [EnrollmentController],
    providers: [
        {
            provide: ENROLLMENT_REPOSITORY,
            useClass: EnrollmentRepositoryImpl,
        },
        CreateEnrollmentHandler,
        UpdateEnrollmentHandler,
        DeleteEnrollmentHandler,
        GetEnrollmentByFieldHandler,
        FindManyEnrollmentsHandler,
        GetPaginatedEnrollmentsHandler,
        EnrollUserHandler,
        GetUserEnrollmentsHandler,
        CheckCourseAccessHandler,
    ],
    exports: [ENROLLMENT_REPOSITORY],
})
export class EnrollmentModule {}
