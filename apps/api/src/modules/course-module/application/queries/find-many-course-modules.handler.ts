import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { CourseModule } from '../../domain/entities/course-module.entity';
import {
    ICourseModuleRepository,
    COURSE_MODULE_REPOSITORY,
    CourseModuleField,
    CourseModuleRelations,
} from '../../domain/repositories/i-course-module.repository';

export class FindManyCourseModulesQuery extends FindManyQuery<CourseModuleField, CourseModuleRelations> {}

@Injectable()
export class FindManyCourseModulesHandler extends BaseFindManyHandler<CourseModule, CourseModuleField, CourseModuleRelations> {
    constructor(@Inject(COURSE_MODULE_REPOSITORY) repository: ICourseModuleRepository) {
        super(repository);
    }
}
