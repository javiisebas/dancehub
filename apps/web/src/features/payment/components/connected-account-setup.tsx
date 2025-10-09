'use client';

import {
    ConnectedAccountData,
    ConnectedAccountForm,
} from '@repo/ui/components/connected-account-form';
import { useCreateConnectedAccount } from '../hooks/use-payment-mutations';

interface ConnectedAccountSetupProps {
    onSuccess?: () => void;
}

export function ConnectedAccountSetup({ onSuccess }: ConnectedAccountSetupProps) {
    const { mutate: createAccount, isPending } = useCreateConnectedAccount();

    const handleSubmit = (data: ConnectedAccountData) => {
        createAccount(
            {
                businessName: data.businessName,
                email: data.email,
                country: data.country || 'US',
                businessType: (data.businessType as any) || 'individual',
            },
            {
                onSuccess,
            },
        );
    };

    return <ConnectedAccountForm onSubmit={handleSubmit} isSubmitting={isPending} />;
}
