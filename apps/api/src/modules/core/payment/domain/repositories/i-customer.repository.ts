import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { customers } from '../../infrastructure/schemas/customer.schema';
import type { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export type CustomerField = InferFields<typeof customers>;
export type CustomerRelations = {};

export interface ICustomerRepository
    extends IBaseRepository<Customer, CustomerField, CustomerRelations> {
    findByUserId(userId: string): Promise<Customer | null>;
    findByStripeCustomerId(stripeCustomerId: string): Promise<Customer | null>;
}
