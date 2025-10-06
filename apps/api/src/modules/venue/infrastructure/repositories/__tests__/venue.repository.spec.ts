import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { VenueRepositoryImpl } from '../venue.repository';
import { Venue } from '../../../domain/entities/venue.entity';
import { FilterOperator } from '@repo/shared';

describe('VenueRepository - Relations', () => {
    let repository: VenueRepositoryImpl;
    let mockDb: any;
    let mockUnitOfWork: any;
    let mockLogger: any;

    beforeEach(async () => {
        mockDb = {
            select: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            innerJoin: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            values: jest.fn().mockReturnThis(),
            returning: jest.fn().mockReturnThis(),
        };

        mockUnitOfWork = {
            getTransaction: jest.fn().mockReturnValue(null),
        };

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VenueRepositoryImpl,
                {
                    provide: DatabaseService,
                    useValue: { db: mockDb },
                },
                {
                    provide: UnitOfWorkService,
                    useValue: mockUnitOfWork,
                },
                {
                    provide: LogService,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        repository = module.get<VenueRepositoryImpl>(VenueRepositoryImpl);
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    it('should have relations configured', () => {
        expect(repository['relations']).toBeDefined();
        expect(repository['relations']?.owner).toBeDefined();
        expect(repository['relations']?.danceStyles).toBeDefined();
    });

    it('should define MANY_TO_ONE relation for owner', () => {
        const ownerRelation = repository['relations']?.owner;
        expect(ownerRelation?.type).toBe('many-to-one');
        expect(ownerRelation?.relationName).toBe('ownerId');
    });

    it('should define MANY_TO_MANY relation for danceStyles', () => {
        const danceStylesRelation = repository['relations']?.danceStyles;
        expect(danceStylesRelation?.type).toBe('many-to-many');
        expect(danceStylesRelation?.relationName).toBe('danceStyles');
    });

    it('should have findByIdWithRelations method', () => {
        expect(repository.findByIdWithRelations).toBeDefined();
        expect(typeof repository.findByIdWithRelations).toBe('function');
    });

    it('should have findOneWithRelations method', () => {
        expect(repository.findOneWithRelations).toBeDefined();
        expect(typeof repository.findOneWithRelations).toBe('function');
    });

    it('should have findManyWithRelations method', () => {
        expect(repository.findManyWithRelations).toBeDefined();
        expect(typeof repository.findManyWithRelations).toBe('function');
    });

    it('should have paginateWithRelations method', () => {
        expect(repository.paginateWithRelations).toBeDefined();
        expect(typeof repository.paginateWithRelations).toBe('function');
    });

    it('should have loadRelation method', () => {
        expect(repository.loadRelation).toBeDefined();
        expect(typeof repository.loadRelation).toBe('function');
    });

    it('should have loadRelations method', () => {
        expect(repository.loadRelations).toBeDefined();
        expect(typeof repository.loadRelations).toBe('function');
    });

    describe('toDomain', () => {
        it('should convert schema to Venue entity', () => {
            const schema = {
                id: '123',
                name: 'Test Venue',
                slug: 'test-venue',
                address: '123 Main St',
                city: 'Madrid',
                country: 'Spain',
                capacity: 100,
                hasParking: true,
                ownerId: 'owner-123',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const entity = repository['toDomain'](schema);

            expect(entity).toBeInstanceOf(Venue);
            expect(entity.id).toBe(schema.id);
            expect(entity.name).toBe(schema.name);
            expect(entity.slug).toBe(schema.slug);
            expect(entity.ownerId).toBe(schema.ownerId);
        });
    });

    describe('toSchema', () => {
        it('should convert Venue entity to schema', () => {
            const venue = new Venue(
                '123',
                'Test Venue',
                'test-venue',
                '123 Main St',
                'Madrid',
                'Spain',
                100,
                true,
                'owner-123',
                new Date(),
                new Date(),
            );

            const schema = repository['toSchema'](venue);

            expect(schema.name).toBe(venue.name);
            expect(schema.slug).toBe(venue.slug);
            expect(schema.ownerId).toBe(venue.ownerId);
        });
    });
});

