import { PaginatedRequest } from '@repo/shared';
import { CacheTag } from './cache-tags';

export class BaseCacheKey {
    private readonly tags: CacheTag[] = [];
    private readonly relations: string[] = [];

    constructor(
        protected readonly namespace: string,
        protected readonly identifier: string,
        protected readonly suffix?: string,
    ) {}

    toString(): string {
        const parts = [this.namespace, this.identifier];
        if (this.suffix) {
            parts.push(this.suffix);
        }
        if (this.relations.length > 0) {
            parts.push(`with:${this.relations.sort().join(',')}`);
        }
        return parts.join(':');
    }

    toPattern(): string {
        return `${this.namespace}:${this.identifier}*`;
    }

    static namespacePattern(namespace: string): string {
        return `${namespace}:*`;
    }

    getNamespace(): string {
        return this.namespace;
    }

    getIdentifier(): string {
        return this.identifier;
    }

    getSuffix(): string | undefined {
        return this.suffix;
    }

    getTags(): CacheTag[] {
        return [...this.tags];
    }

    getRelations(): string[] {
        return [...this.relations];
    }

    withTags(...tags: CacheTag[]): this {
        this.tags.push(...tags);
        return this;
    }

    withRelations(...relations: string[]): this {
        this.relations.push(...relations);
        return this;
    }

    static byId(id: string): BaseCacheKey {
        return new BaseCacheKey('id', id);
    }

    static paginated(data: PaginatedRequest): BaseCacheKey {
        return new BaseCacheKey('paginated', data.toString());
    }
}
