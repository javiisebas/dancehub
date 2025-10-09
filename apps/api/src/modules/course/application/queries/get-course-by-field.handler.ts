import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Course } from '../../domain/entities/course.entity';
import {
    ICourseRepository,
    COURSE_REPOSITORY,
    CourseField,
    CourseRelations,
} from '../../domain/repositories/i-course.repository';

export class GetCourseByFieldQuery extends GetByFieldQuery<CourseField, CourseRelations> {}

@Injectable()
export class GetCourseByFieldHandler extends BaseGetByFieldHandler<Course, CourseField, CourseRelations> {
    constructor(@Inject(COURSE_REPOSITORY) repository: ICourseRepository) {
        super(repository);
    }
}
