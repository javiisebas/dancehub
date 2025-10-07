import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
    IUserRepository,
    USER_REPOSITORY,
    UserField,
    UserRelations,
} from '../../domain/repositories/i-user.repository';

export class FindManyUsersQuery extends FindManyQuery<UserField, UserRelations> {}

@Injectable()
export class FindManyUsersHandler extends BaseFindManyHandler<User, UserField, UserRelations> {
    constructor(@Inject(USER_REPOSITORY) repository: IUserRepository) {
        super(repository);
    }
}
