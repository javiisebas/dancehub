import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { users } from '../../infrastructure/schemas/user.schema';
import type { User } from '../entities/user.entity';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export type UserField = InferFields<typeof users>;
export type UserRelations = {};

export interface IUserRepository extends IBaseRepository<User, UserField, UserRelations> {
    findByEmail(email: string): Promise<User | null>;
    emailExists(email: string): Promise<boolean>;
    findByProviderId(provider: string, providerId: string): Promise<User | null>;
}
