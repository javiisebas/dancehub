import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedLessonRequest
} from '@repo/shared'; export class
LessonCacheKey extends BaseCacheKey { constructor(key: string) { super('lesson', key); } static byId(id: string): BaseCacheKey { return new
LessonCacheKey(id); } static paginated(data: PaginatedLessonRequest):
BaseCacheKey { return new
LessonCacheKey(`paginated:${data.toString()}`); } }