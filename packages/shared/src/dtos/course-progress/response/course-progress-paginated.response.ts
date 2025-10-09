import { Expose, Type } from 'class-transformer';
import { PaginatedResponse } from '../../common';
import { CourseProgressResponse } from './course-progress.response';

export class CourseProgressPaginatedResponse extends PaginatedResponse<CourseProgressResponse> {
    @Expose()
    @Type(() => CourseProgressResponse)
    declare data: CourseProgressResponse[];
}
