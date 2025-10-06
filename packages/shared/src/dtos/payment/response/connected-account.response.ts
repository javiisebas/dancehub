export class ConnectedAccountResponse {
    id!: string;
    userId!: string;
    stripeAccountId!: string;
    chargesEnabled!: boolean;
    payoutsEnabled!: boolean;
    detailsSubmitted!: boolean;
    onboardingUrl?: string;
    createdAt!: Date;
    updatedAt!: Date;
}
