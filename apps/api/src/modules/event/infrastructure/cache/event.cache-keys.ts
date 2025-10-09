import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedEventRequest
} from '@repo/shared'; export class
EventCacheKey extends BaseCacheKey { constructor(key: string) { super('event', key); } static byId(id: string): BaseCacheKey { return new
EventCacheKey(id); } static paginated(data: PaginatedEventRequest):
BaseCacheKey { return new
EventCacheKey(`paginated:${data.toString()}`); } }