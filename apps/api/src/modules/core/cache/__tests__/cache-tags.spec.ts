import { CacheTag, CacheTagsManager } from '../cache-tags';

describe('CacheTag', () => {
    describe('entity', () => {
        it('should create entity tag with correct format', () => {
            const tag = CacheTag.entity('User', '123');
            expect(tag.toString()).toBe('entity:User:123');
        });

        it('should handle numeric ids', () => {
            const tag = CacheTag.entity('Post', 456);
            expect(tag.toString()).toBe('entity:Post:456');
        });
    });

    describe('entityCollection', () => {
        it('should create collection tag', () => {
            const tag = CacheTag.entityCollection('User');
            expect(tag.toString()).toBe('collection:User');
        });
    });

    describe('entityRelation', () => {
        it('should create relation tag', () => {
            const tag = CacheTag.entityRelation('User', '123', 'posts');
            expect(tag.toString()).toBe('relation:User:123:posts');
        });
    });

    describe('custom', () => {
        it('should create custom tag', () => {
            const tag = CacheTag.custom('session', 'abc123');
            expect(tag.toString()).toBe('session:abc123');
        });
    });
});

describe('CacheTagsManager', () => {
    let manager: CacheTagsManager;

    beforeEach(() => {
        manager = new CacheTagsManager();
    });

    describe('registerKey', () => {
        it('should register key with tags', () => {
            const tag1 = CacheTag.entity('User', '1');
            const tag2 = CacheTag.entityCollection('User');

            manager.registerKey('user:1', [tag1, tag2]);

            const keys1 = manager.getKeysByTag(tag1);
            const keys2 = manager.getKeysByTag(tag2);

            expect(keys1).toContain('user:1');
            expect(keys2).toContain('user:1');
        });

        it('should handle multiple keys for same tag', () => {
            const tag = CacheTag.entityCollection('User');

            manager.registerKey('user:1', [tag]);
            manager.registerKey('user:2', [tag]);
            manager.registerKey('user:3', [tag]);

            const keys = manager.getKeysByTag(tag);
            expect(keys).toHaveLength(3);
            expect(keys).toContain('user:1');
            expect(keys).toContain('user:2');
            expect(keys).toContain('user:3');
        });

        it('should handle key with no tags', () => {
            manager.registerKey('some:key', []);
            expect(manager.getKeysByTag(CacheTag.entity('User', '1'))).toHaveLength(0);
        });
    });

    describe('getKeysByTag', () => {
        it('should return empty array for non-existent tag', () => {
            const keys = manager.getKeysByTag(CacheTag.entity('User', '999'));
            expect(keys).toEqual([]);
        });

        it('should return all keys for tag', () => {
            const tag = CacheTag.entityCollection('Post');

            manager.registerKey('post:list:1', [tag]);
            manager.registerKey('post:list:2', [tag]);

            const keys = manager.getKeysByTag(tag);
            expect(keys).toHaveLength(2);
        });
    });

    describe('getKeysByTags', () => {
        it('should return keys from multiple tags', () => {
            const tag1 = CacheTag.entity('User', '1');
            const tag2 = CacheTag.entity('User', '2');

            manager.registerKey('user:1', [tag1]);
            manager.registerKey('user:2', [tag2]);
            manager.registerKey('user:both', [tag1, tag2]);

            const keys = manager.getKeysByTags([tag1, tag2]);
            expect(keys).toHaveLength(3);
            expect(keys).toContain('user:1');
            expect(keys).toContain('user:2');
            expect(keys).toContain('user:both');
        });

        it('should not return duplicate keys', () => {
            const tag1 = CacheTag.entity('User', '1');
            const tag2 = CacheTag.entityCollection('User');

            manager.registerKey('user:1', [tag1, tag2]);

            const keys = manager.getKeysByTags([tag1, tag2]);
            expect(keys).toHaveLength(1);
            expect(keys[0]).toBe('user:1');
        });
    });

    describe('removeKey', () => {
        it('should remove key and cleanup tags', () => {
            const tag = CacheTag.entity('User', '1');
            manager.registerKey('user:1', [tag]);

            manager.removeKey('user:1');

            const keys = manager.getKeysByTag(tag);
            expect(keys).toHaveLength(0);
        });

        it('should not affect other keys with same tag', () => {
            const tag = CacheTag.entityCollection('User');

            manager.registerKey('user:1', [tag]);
            manager.registerKey('user:2', [tag]);

            manager.removeKey('user:1');

            const keys = manager.getKeysByTag(tag);
            expect(keys).toHaveLength(1);
            expect(keys).toContain('user:2');
        });

        it('should handle removing non-existent key', () => {
            expect(() => manager.removeKey('non:existent')).not.toThrow();
        });
    });

    describe('clear', () => {
        it('should clear all tags and keys', () => {
            const tag1 = CacheTag.entity('User', '1');
            const tag2 = CacheTag.entityCollection('Post');

            manager.registerKey('user:1', [tag1]);
            manager.registerKey('post:list', [tag2]);

            manager.clear();

            expect(manager.getKeysByTag(tag1)).toHaveLength(0);
            expect(manager.getKeysByTag(tag2)).toHaveLength(0);
        });
    });
});
