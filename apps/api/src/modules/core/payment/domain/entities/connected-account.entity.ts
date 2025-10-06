import { BaseEntity } from '@api/common/abstract/domain';

export class ConnectedAccount extends BaseEntity {
    constructor(
        id: string,
        public userId: string,
        public stripeAccountId: string,
        public chargesEnabled: boolean,
        public payoutsEnabled: boolean,
        public detailsSubmitted: boolean,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateCapabilities(
        chargesEnabled: boolean,
        payoutsEnabled: boolean,
        detailsSubmitted: boolean,
    ): void {
        this.chargesEnabled = chargesEnabled;
        this.payoutsEnabled = payoutsEnabled;
        this.detailsSubmitted = detailsSubmitted;
    }

    canAcceptPayments(): boolean {
        return this.chargesEnabled && this.detailsSubmitted;
    }

    canReceivePayouts(): boolean {
        return this.payoutsEnabled && this.detailsSubmitted;
    }

    isFullyOnboarded(): boolean {
        return this.chargesEnabled && this.payoutsEnabled && this.detailsSubmitted;
    }

    static create(userId: string, stripeAccountId: string): ConnectedAccount {
        const now = new Date();
        return new ConnectedAccount(
            crypto.randomUUID(),
            userId,
            stripeAccountId,
            false,
            false,
            false,
            now,
            now,
        );
    }
}
