import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
    CourseProgressField,
    CourseProgressRelations,
} from '../../domain/repositories/i-course-progress.repository';

export class FindManyCourseProgressesQuery extends FindManyQuery<CourseProgressField, CourseProgressRelations> {}

@Injectable()
export class FindManyCourseProgressesHandler extends BaseFindManyHandler<CourseProgress, CourseProgressField, CourseProgressRelations> {
    constructor(@Inject(COURSE_PROGRESS_REPOSITORY) repository: ICourseProgressRepository) {
        super(repository);
    }
}
