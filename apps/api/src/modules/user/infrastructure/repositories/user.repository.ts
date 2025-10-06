import { BaseRepository, RepositoryRegistry } from '@api/modules/core/database/base';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { UnitOfWorkService } from '@api/modules/core/database/unit-of-work/unit-of-work.service';
import { LogService } from '@api/modules/core/logger/services/logger.service';
import { Injectable } from '@nestjs/common';
import { FilterOperator, UserField } from '@repo/shared';
import { sql } from 'drizzle-orm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { users } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryImpl
    extends BaseRepository<User, typeof users, UserField, {}>
    implements IUserRepository
{
    protected table = users;
    protected entityName = 'User';

    constructor(
        databaseService: DatabaseService,
        unitOfWorkService: UnitOfWorkService,
        logger: LogService,
        private readonly registry: RepositoryRegistry,
    ) {
        super(databaseService, unitOfWorkService, logger, registry);
        // Auto-register in repository registry for nested relations
        this.registry.register('User', this, USER_REPOSITORY);
    }

    protected toDomain(schema: typeof users.$inferSelect): User {
        return new User(
            schema.id,
            schema.email,
            schema.name,
            schema.password ?? null,
            schema.refreshToken ?? null,
            schema.status as any,
            schema.provider as any,
            schema.providerId ?? null,
            schema.firstName ?? null,
            schema.lastName ?? null,
            schema.displayName ?? null,
            schema.image ?? null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: User): any {
        return {
            email: entity.email,
            name: entity.name,
            ...(entity.password !== null && { password: entity.password }),
            ...(entity.refreshToken !== null && { refreshToken: entity.refreshToken }),
            status: entity.status,
            provider: entity.provider,
            ...(entity.providerId && { providerId: entity.providerId }),
            ...(entity.firstName && { firstName: entity.firstName }),
            ...(entity.lastName && { lastName: entity.lastName }),
            ...(entity.displayName && { displayName: entity.displayName }),
            ...(entity.image && { image: entity.image }),
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({
            filter: {
                field: 'email',
                operator: FilterOperator.EQ,
                value: email.toLowerCase(),
            },
        });
    }

    async emailExists(email: string): Promise<boolean> {
        return this.exists({
            field: 'email',
            operator: FilterOperator.EQ,
            value: email.toLowerCase(),
        });
    }

    async findByProviderId(provider: string, providerId: string): Promise<User | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(
                sql`${this.table.provider} = ${provider} AND ${this.table.providerId} = ${providerId}`,
            )
            .limit(1);

        return result.length > 0 ? this.toDomain(result[0]) : null;
    }
}
