import { PaginatedRequest } from '@repo/shared';

export class BaseCacheKey {
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

    static byId(id: string): BaseCacheKey {
        return new BaseCacheKey('id', id);
    }

    static paginated(data: PaginatedRequest): BaseCacheKey {
        return new BaseCacheKey('paginated', data.toString());
    }
}
