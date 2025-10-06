import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Customer } from '../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../domain/repositories/i-customer.repository';
import { customers } from '../schemas/customer.schema';

@Injectable()
export class CustomerRepositoryImpl
    extends BaseRepository<Customer, typeof customers, string>
    implements ICustomerRepository
{
    protected table = customers;
    protected entityName = 'Customer';

    protected toDomain(schema: typeof customers.$inferSelect): Customer {
        return new Customer(
            schema.id,
            schema.userId,
            schema.stripeCustomerId,
            schema.email,
            schema.name ?? null,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: Customer): any {
        return {
            userId: entity.userId,
            stripeCustomerId: entity.stripeCustomerId,
            email: entity.email,
            ...(entity.name && { name: entity.name }),
        };
    }

    async findByUserId(userId: string): Promise<Customer | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.userId, userId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findByStripeCustomerId(stripeCustomerId: string): Promise<Customer | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.stripeCustomerId, stripeCustomerId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }
}
