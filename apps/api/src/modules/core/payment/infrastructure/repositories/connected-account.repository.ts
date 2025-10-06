import { BaseRepository } from '@api/modules/core/database/base';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ConnectedAccount } from '../../domain/entities/connected-account.entity';
import { IConnectedAccountRepository } from '../../domain/repositories/i-connected-account.repository';
import { connectedAccounts } from '../schemas/connected-account.schema';

@Injectable()
export class ConnectedAccountRepositoryImpl
    extends BaseRepository<ConnectedAccount, typeof connectedAccounts, string>
    implements IConnectedAccountRepository
{
    protected table = connectedAccounts;
    protected entityName = 'ConnectedAccount';

    protected toDomain(schema: typeof connectedAccounts.$inferSelect): ConnectedAccount {
        return new ConnectedAccount(
            schema.id,
            schema.userId,
            schema.stripeAccountId,
            schema.chargesEnabled,
            schema.payoutsEnabled,
            schema.detailsSubmitted,
            schema.createdAt,
            schema.updatedAt,
        );
    }

    protected toSchema(entity: ConnectedAccount): any {
        return {
            userId: entity.userId,
            stripeAccountId: entity.stripeAccountId,
            chargesEnabled: entity.chargesEnabled,
            payoutsEnabled: entity.payoutsEnabled,
            detailsSubmitted: entity.detailsSubmitted,
        };
    }

    async findByUserId(userId: string): Promise<ConnectedAccount | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.userId, userId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }

    async findByStripeAccountId(stripeAccountId: string): Promise<ConnectedAccount | null> {
        const result = await this.db
            .select()
            .from(this.table)
            .where(eq(this.table.stripeAccountId, stripeAccountId))
            .limit(1);
        return result.length > 0 ? this.toDomain(result[0]) : null;
    }
}
