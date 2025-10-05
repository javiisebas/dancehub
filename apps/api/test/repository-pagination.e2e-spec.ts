import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FilterOperator, LogicalOperator, SortOrder, UserField } from '@repo/shared';
import { AppModule } from '../src/app.module';
import {
    IUserRepository,
    USER_REPOSITORY,
} from '../src/modules/user/domain/repositories/i-user.repository';

describe('Repository Pagination E2E Tests', () => {
    let app: INestApplication;
    let userRepository: IUserRepository;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();

        userRepository = app.get(USER_REPOSITORY);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Simple Pagination', () => {
        it('should paginate users with default values', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
            });

            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(typeof result.total).toBe('number');
            expect(typeof result.totalPages).toBe('number');
            expect(typeof result.hasNext).toBe('boolean');
            expect(typeof result.hasPrev).toBe('boolean');
        });

        it('should handle pagination metadata correctly', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 5,
            });

            expect(result.hasPrev).toBe(false);
            if (result.total > 5) {
                expect(result.hasNext).toBe(true);
                expect(result.totalPages).toBeGreaterThan(1);
            }
        });

        it('should paginate to second page', async () => {
            const result = await userRepository.paginate({
                page: 2,
                limit: 5,
            });

            expect(result.page).toBe(2);
            expect(result.hasPrev).toBe(true);
        });
    });

    describe('Simple Filters', () => {
        it('should filter by single field with EQ operator', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'name' as UserField,
                    operator: FilterOperator.EQ,
                    value: 'John Doe',
                },
            });

            expect(result.data.every((user) => user.name === 'John Doe')).toBe(true);
        });

        it('should filter with LIKE operator', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'email' as UserField,
                    operator: FilterOperator.LIKE,
                    value: '%@example.com',
                },
            });

            result.data.forEach((user) => {
                expect(user.email).toContain('@example.com');
            });
        });

        it('should filter with IN operator', async () => {
            const names = ['Alice', 'Bob', 'Charlie'];
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'name' as UserField,
                    operator: FilterOperator.IN,
                    value: names,
                },
            });

            result.data.forEach((user) => {
                expect(names).toContain(user.name);
            });
        });

        it('should filter with IS_NULL operator', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'password' as UserField,
                    operator: FilterOperator.IS_NULL,
                },
            });

            result.data.forEach((user) => {
                expect(user.password).toBeNull();
            });
        });

        it('should filter with GT operator on dates', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'createdAt' as UserField,
                    operator: FilterOperator.GT,
                    value: yesterday,
                },
            });

            result.data.forEach((user) => {
                expect(new Date(user.createdAt).getTime()).toBeGreaterThan(yesterday.getTime());
            });
        });
    });

    describe('Complex Filters with AND', () => {
        it('should filter with AND operator', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.AND,
                    conditions: [
                        {
                            field: 'email' as UserField,
                            operator: FilterOperator.LIKE,
                            value: '%@example.com',
                        },
                        {
                            field: 'password' as UserField,
                            operator: FilterOperator.IS_NOT_NULL,
                        },
                    ],
                },
            });

            result.data.forEach((user) => {
                expect(user.email).toContain('@example.com');
                expect(user.password).not.toBeNull();
            });
        });

        it('should handle multiple AND conditions', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.AND,
                    conditions: [
                        {
                            field: 'email' as UserField,
                            operator: FilterOperator.LIKE,
                            value: '%@gmail.com',
                        },
                        {
                            field: 'createdAt' as UserField,
                            operator: FilterOperator.GT,
                            value: yesterday,
                        },
                        {
                            field: 'password' as UserField,
                            operator: FilterOperator.IS_NOT_NULL,
                        },
                    ],
                },
            });

            result.data.forEach((user) => {
                expect(user.email).toContain('@gmail.com');
                expect(new Date(user.createdAt).getTime()).toBeGreaterThan(yesterday.getTime());
                expect(user.password).not.toBeNull();
            });
        });
    });

    describe('Complex Filters with OR', () => {
        it('should filter with OR operator', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.OR,
                    conditions: [
                        {
                            field: 'email' as UserField,
                            operator: FilterOperator.LIKE,
                            value: '%@gmail.com',
                        },
                        {
                            field: 'email' as UserField,
                            operator: FilterOperator.LIKE,
                            value: '%@yahoo.com',
                        },
                    ],
                },
            });

            result.data.forEach((user) => {
                const isGmail = user.email.includes('@gmail.com');
                const isYahoo = user.email.includes('@yahoo.com');
                expect(isGmail || isYahoo).toBe(true);
            });
        });
    });

    describe('Nested Filters (AND with OR)', () => {
        it('should handle nested filters', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.AND,
                    conditions: [
                        {
                            field: 'createdAt' as UserField,
                            operator: FilterOperator.GT,
                            value: yesterday,
                        },
                        {
                            operator: LogicalOperator.OR,
                            conditions: [
                                {
                                    field: 'email' as UserField,
                                    operator: FilterOperator.LIKE,
                                    value: '%@gmail.com',
                                },
                                {
                                    field: 'email' as UserField,
                                    operator: FilterOperator.LIKE,
                                    value: '%@yahoo.com',
                                },
                            ],
                        },
                    ],
                },
            });

            result.data.forEach((user) => {
                expect(new Date(user.createdAt).getTime()).toBeGreaterThan(yesterday.getTime());
                const isGmail = user.email.includes('@gmail.com');
                const isYahoo = user.email.includes('@yahoo.com');
                expect(isGmail || isYahoo).toBe(true);
            });
        });

        it('should handle deeply nested filters', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.AND,
                    conditions: [
                        {
                            field: 'password' as UserField,
                            operator: FilterOperator.IS_NOT_NULL,
                        },
                        {
                            operator: LogicalOperator.OR,
                            conditions: [
                                {
                                    operator: LogicalOperator.AND,
                                    conditions: [
                                        {
                                            field: 'email' as UserField,
                                            operator: FilterOperator.LIKE,
                                            value: '%@gmail.com',
                                        },
                                        {
                                            field: 'name' as UserField,
                                            operator: FilterOperator.LIKE,
                                            value: 'John%',
                                        },
                                    ],
                                },
                                {
                                    field: 'email' as UserField,
                                    operator: FilterOperator.LIKE,
                                    value: '%@yahoo.com',
                                },
                            ],
                        },
                    ],
                },
            });

            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
        });
    });

    describe('Sorting', () => {
        it('should sort by single field ASC', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                sort: {
                    field: 'name' as UserField,
                    order: SortOrder.ASC,
                },
            });

            if (result.data.length > 1) {
                for (let i = 0; i < result.data.length - 1; i++) {
                    expect(
                        result.data[i].name.localeCompare(result.data[i + 1].name),
                    ).toBeLessThanOrEqual(0);
                }
            }
        });

        it('should sort by single field DESC', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                sort: {
                    field: 'createdAt' as UserField,
                    order: SortOrder.DESC,
                },
            });

            if (result.data.length > 1) {
                for (let i = 0; i < result.data.length - 1; i++) {
                    const current = new Date(result.data[i].createdAt).getTime();
                    const next = new Date(result.data[i + 1].createdAt).getTime();
                    expect(current).toBeGreaterThanOrEqual(next);
                }
            }
        });

        it('should sort by multiple fields', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                sort: [
                    {
                        field: 'name' as UserField,
                        order: SortOrder.ASC,
                    },
                    {
                        field: 'createdAt' as UserField,
                        order: SortOrder.DESC,
                    },
                ],
            });

            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
        });
    });

    describe('Combined Filters and Sorting', () => {
        it('should filter and sort simultaneously', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'email' as UserField,
                    operator: FilterOperator.LIKE,
                    value: '%@example.com',
                },
                sort: {
                    field: 'name' as UserField,
                    order: SortOrder.ASC,
                },
            });

            result.data.forEach((user) => {
                expect(user.email).toContain('@example.com');
            });

            if (result.data.length > 1) {
                for (let i = 0; i < result.data.length - 1; i++) {
                    expect(
                        result.data[i].name.localeCompare(result.data[i + 1].name),
                    ).toBeLessThanOrEqual(0);
                }
            }
        });

        it('should handle complex filters with multi-sort', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    operator: LogicalOperator.AND,
                    conditions: [
                        {
                            field: 'createdAt' as UserField,
                            operator: FilterOperator.GT,
                            value: yesterday,
                        },
                        {
                            operator: LogicalOperator.OR,
                            conditions: [
                                {
                                    field: 'email' as UserField,
                                    operator: FilterOperator.LIKE,
                                    value: '%@gmail.com',
                                },
                                {
                                    field: 'email' as UserField,
                                    operator: FilterOperator.LIKE,
                                    value: '%@yahoo.com',
                                },
                            ],
                        },
                    ],
                },
                sort: [
                    {
                        field: 'name' as UserField,
                        order: SortOrder.ASC,
                    },
                    {
                        field: 'createdAt' as UserField,
                        order: SortOrder.DESC,
                    },
                ],
            });

            expect(result).toBeDefined();
            expect(result.data).toBeInstanceOf(Array);
            result.data.forEach((user) => {
                expect(new Date(user.createdAt).getTime()).toBeGreaterThan(yesterday.getTime());
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty results', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 10,
                filter: {
                    field: 'email' as UserField,
                    operator: FilterOperator.EQ,
                    value: 'nonexistent@email.com',
                },
            });

            expect(result.data).toHaveLength(0);
            expect(result.total).toBe(0);
            expect(result.totalPages).toBe(0);
            expect(result.hasNext).toBe(false);
            expect(result.hasPrev).toBe(false);
        });

        it('should handle large page sizes', async () => {
            const result = await userRepository.paginate({
                page: 1,
                limit: 100,
            });

            expect(result.limit).toBe(100);
            expect(result.data.length).toBeLessThanOrEqual(100);
        });

        it('should handle page beyond available data', async () => {
            const result = await userRepository.paginate({
                page: 999,
                limit: 10,
            });

            expect(result.data).toHaveLength(0);
            expect(result.hasNext).toBe(false);
            expect(result.hasPrev).toBe(true);
        });
    });
});
