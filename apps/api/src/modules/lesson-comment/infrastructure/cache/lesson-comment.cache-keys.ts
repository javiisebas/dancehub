import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedLessonCommentRequest
} from '@repo/shared'; export class
LessonCommentCacheKey extends BaseCacheKey { constructor(key: string) { super('lesson-comment', key); } static byId(id: string): BaseCacheKey { return new
LessonCommentCacheKey(id); } static paginated(data: PaginatedLessonCommentRequest):
BaseCacheKey { return new
LessonCommentCacheKey(`paginated:${data.toString()}`); } }