import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedCourseModuleRequest } from '@repo/shared';
import { CourseModule } from '../../domain/entities/course-module.entity';
import {
    ICourseModuleRepository,
    COURSE_MODULE_REPOSITORY,
    CourseModuleField,
    CourseModuleRelations,
} from '../../domain/repositories/i-course-module.repository';

export class GetPaginatedCourseModulesQuery extends GetPaginatedQueryEnhanced<PaginatedCourseModuleRequest> {}

@Injectable()
export class GetPaginatedCourseModulesHandler extends BaseGetPaginatedHandler<
    CourseModule,
    PaginatedCourseModuleRequest,
    CourseModuleField,
    CourseModuleRelations
> {
    constructor(@Inject(COURSE_MODULE_REPOSITORY) repository: ICourseModuleRepository) {
        super(repository);
    }
}
