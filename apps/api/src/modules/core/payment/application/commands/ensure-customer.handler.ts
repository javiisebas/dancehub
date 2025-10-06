import {
    IUserRepository,
    USER_REPOSITORY,
} from '@api/modules/user/domain/repositories/i-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import {
    CUSTOMER_REPOSITORY,
    ICustomerRepository,
} from '../../domain/repositories/i-customer.repository';
import { StripeService } from '../../domain/services/stripe.service';

@Injectable()
export class EnsureCustomerHandler {
    constructor(
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: ICustomerRepository,
        @Inject(USER_REPOSITORY)
        private readonly userRepository: IUserRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute(userId: string): Promise<Customer> {
        let customer = await this.customerRepository.findByUserId(userId);

        if (customer) {
            return customer;
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const stripeCustomer = await this.stripeService.createCustomer({
            email: user.email,
            name: user.name,
            metadata: {
                userId: user.id,
            },
        });

        customer = Customer.create(userId, stripeCustomer.id, user.email, user.name);

        return this.customerRepository.save(customer);
    }
}
