import { RelationshipManager } from '../relationship-manager';

describe('RelationshipManager', () => {
    let manager: RelationshipManager;

    beforeEach(() => {
        manager = new RelationshipManager();
    });

    describe('registerRelationship', () => {
        it('should register a one-to-many relationship', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'posts',
                relatedEntity: 'Post',
                type: 'one-to-many',
            });

            const relationship = manager.getRelationship('User', 'posts');
            expect(relationship).toBeDefined();
            expect(relationship?.relatedEntity).toBe('Post');
            expect(relationship?.type).toBe('one-to-many');
        });

        it('should register bidirectional relationship with inverseSide', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'posts',
                relatedEntity: 'Post',
                type: 'one-to-many',
                inverseSide: 'author',
            });

            const userRelation = manager.getRelationship('User', 'posts');
            const postRelation = manager.getRelationship('Post', 'author');

            expect(userRelation).toBeDefined();
            expect(postRelation).toBeDefined();
            expect(postRelation?.type).toBe('many-to-one');
        });

        it('should handle many-to-many relationships', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'danceStyles',
                relatedEntity: 'DanceStyle',
                type: 'many-to-many',
                inverseSide: 'users',
            });

            const userRelation = manager.getRelationship('User', 'danceStyles');
            const styleRelation = manager.getRelationship('DanceStyle', 'users');

            expect(userRelation?.type).toBe('many-to-many');
            expect(styleRelation?.type).toBe('many-to-many');
        });
    });

    describe('getRelationship', () => {
        it('should return undefined for non-existent relationship', () => {
            const relationship = manager.getRelationship('User', 'nonExistent');
            expect(relationship).toBeUndefined();
        });

        it('should retrieve registered relationship', () => {
            manager.registerRelationship({
                entity: 'Post',
                relation: 'comments',
                relatedEntity: 'Comment',
                type: 'one-to-many',
            });

            const relationship = manager.getRelationship('Post', 'comments');
            expect(relationship?.entity).toBe('Post');
            expect(relationship?.relation).toBe('comments');
        });
    });

    describe('getEntityRelationships', () => {
        it('should return all relationships for an entity', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'posts',
                relatedEntity: 'Post',
                type: 'one-to-many',
            });

            manager.registerRelationship({
                entity: 'User',
                relation: 'comments',
                relatedEntity: 'Comment',
                type: 'one-to-many',
            });

            const relationships = manager.getEntityRelationships('User');
            expect(relationships).toHaveLength(2);
        });

        it('should return empty array for entity with no relationships', () => {
            const relationships = manager.getEntityRelationships('UnknownEntity');
            expect(relationships).toEqual([]);
        });
    });

    describe('getAffectedEntities', () => {
        it('should return entity itself', () => {
            const affected = manager.getAffectedEntities('User', '123');
            expect(affected).toHaveLength(1);
            expect(affected[0].entity).toBe('User');
        });

        it('should return affected entities through relationships', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'posts',
                relatedEntity: 'Post',
                type: 'one-to-many',
                inverseSide: 'author',
            });

            const affected = manager.getAffectedEntities('User', '123');

            expect(affected.length).toBeGreaterThan(1);
            expect(affected).toContainEqual({ entity: 'User' });
            expect(affected).toContainEqual({
                entity: 'Post',
                relation: 'author',
            });
        });

        it('should handle many-to-many relationships', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'danceStyles',
                relatedEntity: 'DanceStyle',
                type: 'many-to-many',
                inverseSide: 'users',
            });

            const affected = manager.getAffectedEntities('User', '123');

            expect(affected).toContainEqual({
                entity: 'DanceStyle',
                relation: 'users',
            });
        });
    });

    describe('inverse type calculation', () => {
        it('should correctly invert one-to-one', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'profile',
                relatedEntity: 'Profile',
                type: 'one-to-one',
                inverseSide: 'user',
            });

            const inverseRelation = manager.getRelationship('Profile', 'user');
            expect(inverseRelation?.type).toBe('one-to-one');
        });

        it('should correctly invert one-to-many to many-to-one', () => {
            manager.registerRelationship({
                entity: 'User',
                relation: 'posts',
                relatedEntity: 'Post',
                type: 'one-to-many',
                inverseSide: 'author',
            });

            const inverseRelation = manager.getRelationship('Post', 'author');
            expect(inverseRelation?.type).toBe('many-to-one');
        });

        it('should correctly invert many-to-one to one-to-many', () => {
            manager.registerRelationship({
                entity: 'Post',
                relation: 'author',
                relatedEntity: 'User',
                type: 'many-to-one',
                inverseSide: 'posts',
            });

            const inverseRelation = manager.getRelationship('User', 'posts');
            expect(inverseRelation?.type).toBe('one-to-many');
        });
    });
});
