import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import type { ConnectedAccount } from '../entities/connected-account.entity';

export const CONNECTED_ACCOUNT_REPOSITORY = Symbol('CONNECTED_ACCOUNT_REPOSITORY');

export interface IConnectedAccountRepository extends IBaseRepository<ConnectedAccount, string> {
    findByUserId(userId: string): Promise<ConnectedAccount | null>;
    findByStripeAccountId(stripeAccountId: string): Promise<ConnectedAccount | null>;
}
