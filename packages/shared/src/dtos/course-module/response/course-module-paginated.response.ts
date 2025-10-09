import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { CourseModuleResponse } from './course-module.response';

export class CourseModulePaginatedResponse extends PaginatedResponse<CourseModuleResponse> {
    @Expose()
    @Type(() => CourseModuleResponse)
    declare data: CourseModuleResponse[];
}
