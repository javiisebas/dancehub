import { SetMetadata } from '@nestjs/common';

export interface CacheInvalidateMetadata {
    entity: string;
    idParam?: string;
    includeRelations?: boolean;
}

export const CACHE_INVALIDATE_KEY = 'cache:invalidate';

export const CacheInvalidate = (metadata: CacheInvalidateMetadata) =>
    SetMetadata(CACHE_INVALIDATE_KEY, metadata);
