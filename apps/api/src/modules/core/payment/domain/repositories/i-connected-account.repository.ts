import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { connectedAccounts } from '../../infrastructure/schemas/connected-account.schema';
import type { ConnectedAccount } from '../entities/connected-account.entity';

export const CONNECTED_ACCOUNT_REPOSITORY = Symbol('CONNECTED_ACCOUNT_REPOSITORY');

export type ConnectedAccountField = InferFields<typeof connectedAccounts>;
export type ConnectedAccountRelations = {};

export interface IConnectedAccountRepository
    extends IBaseRepository<ConnectedAccount, ConnectedAccountField, ConnectedAccountRelations> {
    findByUserId(userId: string): Promise<ConnectedAccount | null>;
    findByStripeAccountId(stripeAccountId: string): Promise<ConnectedAccount | null>;
}
