import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedCourseRequest
} from '@repo/shared'; export class
CourseCacheKey extends BaseCacheKey { constructor(key: string) { super('course', key); } static byId(id: string): BaseCacheKey { return new
CourseCacheKey(id); } static paginated(data: PaginatedCourseRequest):
BaseCacheKey { return new
CourseCacheKey(`paginated:${data.toString()}`); } }