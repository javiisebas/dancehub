import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedCourseRequest } from '@repo/shared';
import { Course } from '../../domain/entities/course.entity';
import {
    ICourseRepository,
    COURSE_REPOSITORY,
    CourseField,
    CourseRelations,
} from '../../domain/repositories/i-course.repository';

export class GetPaginatedCoursesQuery extends GetPaginatedQueryEnhanced<PaginatedCourseRequest> {}

@Injectable()
export class GetPaginatedCoursesHandler extends BaseGetPaginatedHandler<
    Course,
    PaginatedCourseRequest,
    CourseField,
    CourseRelations
> {
    constructor(@Inject(COURSE_REPOSITORY) repository: ICourseRepository) {
        super(repository);
    }
}
