import { BaseEntity } from '@api/common/abstract/domain';
import { ProvidersEnum, UserStatusEnum } from '@repo/shared';

export class User extends BaseEntity {
    constructor(
        id: string,
        public email: string,
        public name: string,
        private _password: string | null,
        public refreshToken: string | null,
        public status: UserStatusEnum,
        public provider: ProvidersEnum,
        public providerId: string | null,
        public firstName: string | null,
        public lastName: string | null,
        public displayName: string | null,
        public image: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        super(id, createdAt, updatedAt);
    }

    hasPassword(): boolean {
        return this._password !== null && this._password !== undefined && this._password.length > 0;
    }

    updateEmail(email: string): void {
        this.email = email.toLowerCase().trim();
    }

    updateName(name: string): void {
        this.name = name.trim();
    }

    updatePassword(hashedPassword: string): void {
        this._password = hashedPassword;
    }

    updateRefreshToken(token: string | null): void {
        this.refreshToken = token;
    }

    updateStatus(status: UserStatusEnum): void {
        this.status = status;
    }

    markAsVerified(): void {
        this.status = UserStatusEnum.VERIFIED;
    }

    isVerified(): boolean {
        return this.status === UserStatusEnum.VERIFIED;
    }

    isPending(): boolean {
        return this.status === UserStatusEnum.PENDING;
    }

    isSuspended(): boolean {
        return this.status === UserStatusEnum.SUSPENDED;
    }

    isLocalProvider(): boolean {
        return this.provider === ProvidersEnum.LOCAL;
    }

    isRecentlyCreated(): boolean {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        return this.createdAt > oneDayAgo;
    }

    static create(
        id: string,
        email: string,
        name: string,
        hashedPassword?: string,
        provider: ProvidersEnum = ProvidersEnum.LOCAL,
        providerId?: string,
        firstName?: string,
        lastName?: string,
        displayName?: string,
        image?: string,
        status: UserStatusEnum = UserStatusEnum.PENDING,
    ): User {
        const now = new Date();
        return new User(
            id,
            email.toLowerCase().trim(),
            name.trim(),
            hashedPassword ?? null,
            null,
            status,
            provider,
            providerId ?? null,
            firstName ?? null,
            lastName ?? null,
            displayName ?? null,
            image ?? null,
            now,
            now,
        );
    }

    get password(): string | null {
        return this._password;
    }
}
