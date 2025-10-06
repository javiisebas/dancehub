import { BaseRepository, RelationHelpers } from '@api/modules/core/database/base';
import { CUSTOMER_REPOSITORY } from '@api/modules/core/payment/domain/repositories/i-customer.repository';
import { SUBSCRIPTION_REPOSITORY } from '@api/modules/core/payment/domain/repositories/i-subscription.repository';
import { STORAGE_REPOSITORY } from '@api/modules/core/storage/domain/repositories/i-storage.repository';
import { Inject, Injectable } from '@nestjs/common';
import { FilterOperator, UserField } from '@repo/shared';
import { sql } from 'drizzle-orm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/i-user.repository';
import { users } from '../schemas/user.schema';

@Injectable()
export class UserRepositoryImpl
    extends BaseRepository<User, typeof users, UserField>
    implements IUserRepository
{
    protected table = users;
    protected entityName = 'User';

    constructor(
        databaseService: any,
        unitOfWorkService: any,
        logger: any,
        @Inject(CUSTOMER_REPOSITORY) private readonly customerRepository: any,
        @Inject(SUBSCRIPTION_REPOSITORY) private readonly subscriptionRepository: any,
        @Inject(STORAGE_REPOSITORY) private readonly storageRepository: any,
    ) {
        super(databaseService, unitOfWorkService, logger);
    }

    protected configureRelations(): void {
        this.relation('customer').one(RelationHelpers.oneToOne(this.customerRepository, 'userId'));

        this.relation('subscriptions').many(
            RelationHelpers.oneToMany(this.subscriptionRepository, 'userId'),
        );

        this.relation('storages').many(RelationHelpers.oneToMany(this.storageRepository, 'userId'));
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
            field: 'email',
            operator: FilterOperator.EQ,
            value: email.toLowerCase(),
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
