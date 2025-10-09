import { BaseCacheKey } from '@api/modules/core/cache'; import { PaginatedEnrollmentRequest
} from '@repo/shared'; export class
EnrollmentCacheKey extends BaseCacheKey { constructor(key: string) { super('enrollment', key); } static byId(id: string): BaseCacheKey { return new
EnrollmentCacheKey(id); } static paginated(data: PaginatedEnrollmentRequest):
BaseCacheKey { return new
EnrollmentCacheKey(`paginated:${data.toString()}`); } }