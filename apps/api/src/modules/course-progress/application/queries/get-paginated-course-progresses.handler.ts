import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedCourseProgressRequest } from '@repo/shared';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
    CourseProgressField,
    CourseProgressRelations,
} from '../../domain/repositories/i-course-progress.repository';

export class GetPaginatedCourseProgressesQuery extends GetPaginatedQueryEnhanced<PaginatedCourseProgressRequest> {}

@Injectable()
export class GetPaginatedCourseProgressesHandler extends BaseGetPaginatedHandler<
    CourseProgress,
    PaginatedCourseProgressRequest,
    CourseProgressField,
    CourseProgressRelations
> {
    constructor(@Inject(COURSE_PROGRESS_REPOSITORY) repository: ICourseProgressRepository) {
        super(repository);
    }
}
