import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Course } from '../../domain/entities/course.entity';
import {
    ICourseRepository,
    COURSE_REPOSITORY,
    CourseField,
    CourseRelations,
} from '../../domain/repositories/i-course.repository';

export class FindManyCoursesQuery extends FindManyQuery<CourseField, CourseRelations> {}

@Injectable()
export class FindManyCoursesHandler extends BaseFindManyHandler<Course, CourseField, CourseRelations> {
    constructor(@Inject(COURSE_REPOSITORY) repository: ICourseRepository) {
        super(repository);
    }
}
