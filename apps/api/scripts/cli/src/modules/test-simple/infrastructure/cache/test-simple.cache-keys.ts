import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedTestSimpleRequest
} from '@repo/shared'; export class
TestSimpleCacheKey extends BaseCacheKey { constructor(key: string) { super('test-simple', key); } static byId(id: string): BaseCacheKey { return new
TestSimpleCacheKey(id); } static paginated(data: PaginatedTestSimpleRequest):
BaseCacheKey { return new
TestSimpleCacheKey(`paginated:${data.toString()}`); } }