export class CacheTag {
    constructor(
        private readonly namespace: string,
        private readonly value: string,
    ) {}

    toString(): string {
        return `${this.namespace}:${this.value}`;
    }

    static entity(entityName: string, id: string | number): CacheTag {
        return new CacheTag('entity', `${entityName}:${id}`);
    }

    static entityCollection(entityName: string): CacheTag {
        return new CacheTag('collection', entityName);
    }

    static entityRelation(entityName: string, id: string | number, relation: string): CacheTag {
        return new CacheTag('relation', `${entityName}:${id}:${relation}`);
    }

    static custom(namespace: string, value: string): CacheTag {
        return new CacheTag(namespace, value);
    }
}

export interface CacheEntry {
    key: string;
    tags: string[];
}

export class CacheTagsManager {
    private readonly tagToKeysMap = new Map<string, Set<string>>();
    private readonly keyToTagsMap = new Map<string, Set<string>>();

    registerKey(key: string, tags: CacheTag[]): void {
        const tagStrings = tags.map((t) => t.toString());

        this.keyToTagsMap.set(key, new Set(tagStrings));

        for (const tag of tagStrings) {
            if (!this.tagToKeysMap.has(tag)) {
                this.tagToKeysMap.set(tag, new Set());
            }
            this.tagToKeysMap.get(tag)!.add(key);
        }
    }

    getKeysByTag(tag: CacheTag): string[] {
        const keys = this.tagToKeysMap.get(tag.toString());
        return keys ? Array.from(keys) : [];
    }

    getKeysByTags(tags: CacheTag[]): string[] {
        const allKeys = new Set<string>();
        for (const tag of tags) {
            const keys = this.getKeysByTag(tag);
            keys.forEach((key) => allKeys.add(key));
        }
        return Array.from(allKeys);
    }

    removeKey(key: string): void {
        const tags = this.keyToTagsMap.get(key);
        if (tags) {
            tags.forEach((tag) => {
                const keys = this.tagToKeysMap.get(tag);
                if (keys) {
                    keys.delete(key);
                    if (keys.size === 0) {
                        this.tagToKeysMap.delete(tag);
                    }
                }
            });
            this.keyToTagsMap.delete(key);
        }
    }

    clear(): void {
        this.tagToKeysMap.clear();
        this.keyToTagsMap.clear();
    }
}
