import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { CourseResponse } from './course.response';

export class CoursePaginatedResponse extends PaginatedResponse<CourseResponse> {
    @Expose()
    @Type(() => CourseResponse)
    declare data: CourseResponse[];
}
