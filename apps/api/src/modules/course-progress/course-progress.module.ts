import { Module } from '@nestjs/common';
import { CreateCourseProgressHandler } from './application/commands/create-course-progress.handler';
import { DeleteCourseProgressHandler } from './application/commands/delete-course-progress.handler';
import { UpdateCourseProgressHandler } from './application/commands/update-course-progress.handler';
import { UpdateLessonProgressHandler } from './application/commands/update-lesson-progress.handler';
import { FindManyCourseProgressesHandler } from './application/queries/find-many-course-progresses.handler';
import { GetCourseProgressByFieldHandler } from './application/queries/get-course-progress-by-field.handler';
import { GetPaginatedCourseProgressesHandler } from './application/queries/get-paginated-course-progresses.handler';
import { COURSE_PROGRESS_REPOSITORY } from './domain/repositories/i-course-progress.repository';
import { CourseProgressController } from './infrastructure/controllers/course-progress.controller';
import { CourseProgressRepositoryImpl } from './infrastructure/repositories/course-progress.repository';

@Module({
    controllers: [CourseProgressController],
    providers: [
        {
            provide: COURSE_PROGRESS_REPOSITORY,
            useClass: CourseProgressRepositoryImpl,
        },
        CreateCourseProgressHandler,
        UpdateCourseProgressHandler,
        DeleteCourseProgressHandler,
        GetCourseProgressByFieldHandler,
        FindManyCourseProgressesHandler,
        GetPaginatedCourseProgressesHandler,
        UpdateLessonProgressHandler,
    ],
    exports: [COURSE_PROGRESS_REPOSITORY],
})
export class CourseProgressModule {}
