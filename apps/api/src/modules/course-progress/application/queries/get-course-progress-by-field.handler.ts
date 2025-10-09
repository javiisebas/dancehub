import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { CourseProgress } from '../../domain/entities/course-progress.entity';
import {
    ICourseProgressRepository,
    COURSE_PROGRESS_REPOSITORY,
    CourseProgressField,
    CourseProgressRelations,
} from '../../domain/repositories/i-course-progress.repository';

export class GetCourseProgressByFieldQuery extends GetByFieldQuery<CourseProgressField, CourseProgressRelations> {}

@Injectable()
export class GetCourseProgressByFieldHandler extends BaseGetByFieldHandler<CourseProgress, CourseProgressField, CourseProgressRelations> {
    constructor(@Inject(COURSE_PROGRESS_REPOSITORY) repository: ICourseProgressRepository) {
        super(repository);
    }
}
