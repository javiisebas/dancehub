import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedCourseModuleRequest
} from '@repo/shared'; export class
CourseModuleCacheKey extends BaseCacheKey { constructor(key: string) { super('course-module', key); } static byId(id: string): BaseCacheKey { return new
CourseModuleCacheKey(id); } static paginated(data: PaginatedCourseModuleRequest):
BaseCacheKey { return new
CourseModuleCacheKey(`paginated:${data.toString()}`); } }