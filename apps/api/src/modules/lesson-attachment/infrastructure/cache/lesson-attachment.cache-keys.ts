import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedLessonAttachmentRequest
} from '@repo/shared'; export class
LessonAttachmentCacheKey extends BaseCacheKey { constructor(key: string) { super('lesson-attachment', key); } static byId(id: string): BaseCacheKey { return new
LessonAttachmentCacheKey(id); } static paginated(data: PaginatedLessonAttachmentRequest):
BaseCacheKey { return new
LessonAttachmentCacheKey(`paginated:${data.toString()}`); } }