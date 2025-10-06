import { BaseEntity } from '@api/common/abstract/domain';

export class Customer extends BaseEntity {
    constructor(
        id: string,
        public userId: string,
        public stripeCustomerId: string,
        public email: string,
        public name: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    updateEmail(email: string): void {
        this.email = email.toLowerCase().trim();
    }

    updateName(name: string): void {
        this.name = name.trim();
    }

    static create(
        userId: string,
        stripeCustomerId: string,
        email: string,
        name?: string,
    ): Customer {
        const now = new Date();
        return new Customer(
            crypto.randomUUID(),
            userId,
            stripeCustomerId,
            email.toLowerCase().trim(),
            name ?? null,
            now,
            now,
        );
    }
}
