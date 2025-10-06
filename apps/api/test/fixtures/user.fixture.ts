import { ProvidersEnum, UserStatusEnum } from '@repo/shared';
import { User } from '../../dist/modules/user/domain/entities/user.entity';

export class UserFixture {
    static createUser(overrides?: Partial<User>): User {
        return new User(
            overrides?.id || 'test-user-id',
            overrides?.email || 'test@example.com',
            overrides?.name || 'Test User',
            overrides?.password || '$argon2id$v=19$m=65536,t=3,p=4$testpassword',
            overrides?.refreshToken || null,
            overrides?.status || UserStatusEnum.VERIFIED,
            overrides?.provider || ProvidersEnum.LOCAL,
            overrides?.providerId || null,
            overrides?.firstName || 'Test',
            overrides?.lastName || 'User',
            overrides?.displayName || 'Test User',
            overrides?.image || null,
            overrides?.createdAt || new Date(),
            overrides?.updatedAt || new Date(),
        );
    }

    static createPendingUser(): User {
        return this.createUser({
            status: UserStatusEnum.PENDING,
        });
    }

    static createSuspendedUser(): User {
        return this.createUser({
            status: UserStatusEnum.SUSPENDED,
        });
    }

    static createGoogleUser(): User {
        return this.createUser({
            provider: ProvidersEnum.GOOGLE,
            providerId: 'google-123456',
            password: null,
        });
    }
}
