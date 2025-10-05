import { IBaseRepository } from '@api/modules/core/database/base/base.repository.interface';
import type { UserField } from '@repo/shared';
import type { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface IUserRepository extends IBaseRepository<User, UserField> {
    findByEmail(email: string): Promise<User | null>;
    emailExists(email: string): Promise<boolean>;
    findByProviderId(provider: string, providerId: string): Promise<User | null>;
}
