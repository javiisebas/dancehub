import { BaseCacheKey } from '@api/modules/core/cache/base-cache-key';
import { CacheDomain } from '@api/modules/core/cache/constants';
import { PaginatedArtistRequest } from '@repo/shared';

export class ArtistCacheKey {
    static byId(id: string): BaseCacheKey {
        return new BaseCacheKey(CacheDomain.ARTIST, 'id', id);
    }

    static paginated(request: PaginatedArtistRequest): BaseCacheKey {
        return new BaseCacheKey(
            CacheDomain.ARTIST,
            'paginated',
            JSON.stringify({
                page: request.page,
                limit: request.limit,
                sort: request.sort,
                filter: request.filter,
            }),
        );
    }
}
