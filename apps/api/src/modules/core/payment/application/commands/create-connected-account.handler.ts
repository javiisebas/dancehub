import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateConnectedAccountRequest } from '@repo/shared';
import { ConnectedAccount } from '../../domain/entities/connected-account.entity';
import {
    CONNECTED_ACCOUNT_REPOSITORY,
    IConnectedAccountRepository,
} from '../../domain/repositories/i-connected-account.repository';
import { StripeService } from '../../domain/services/stripe.service';

export class CreateConnectedAccountCommand extends CreateCommand<CreateConnectedAccountRequest> {}

@Injectable()
export class CreateConnectedAccountHandler {
    constructor(
        @Inject(CONNECTED_ACCOUNT_REPOSITORY)
        private readonly connectedAccountRepository: IConnectedAccountRepository,
        private readonly stripeService: StripeService,
    ) {}

    async execute({ data, userId }: CreateConnectedAccountCommand & { userId: string }): Promise<{
        account: ConnectedAccount;
        onboardingUrl: string;
    }> {
        const existingAccount = await this.connectedAccountRepository.findByUserId(userId);
        if (existingAccount) {
            throw new Error('Connected account already exists');
        }

        const stripeAccount = await this.stripeService.createAccount({
            type: 'express',
            country: data.country || 'US',
            email: data.email,
            business_type: data.businessType || 'individual',
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            metadata: {
                userId,
                businessName: data.businessName,
            },
        });

        const connectedAccount = ConnectedAccount.create(userId, stripeAccount.id);
        const savedAccount = await this.connectedAccountRepository.save(connectedAccount);

        const accountLink = await this.stripeService.createAccountLink({
            account: stripeAccount.id,
            refresh_url: `${process.env.API_URL}/api/payment/connect/refresh`,
            return_url: `${process.env.API_URL}/api/payment/connect/return`,
            type: 'account_onboarding',
        });

        return {
            account: savedAccount,
            onboardingUrl: accountLink.url,
        };
    }
}
