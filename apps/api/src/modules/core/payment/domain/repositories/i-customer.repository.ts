import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import type { Customer } from '../entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface ICustomerRepository extends IBaseRepository<Customer, string> {
    findByUserId(userId: string): Promise<Customer | null>;
    findByStripeCustomerId(stripeCustomerId: string): Promise<Customer | null>;
}
