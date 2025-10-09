import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedCourseProgressRequest
} from '@repo/shared'; export class
CourseProgressCacheKey extends BaseCacheKey { constructor(key: string) { super('course-progress', key); } static byId(id: string): BaseCacheKey { return new
CourseProgressCacheKey(id); } static paginated(data: PaginatedCourseProgressRequest):
BaseCacheKey { return new
CourseProgressCacheKey(`paginated:${data.toString()}`); } }