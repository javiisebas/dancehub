import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';

export class CreateUserCommand extends CreateCommand<CreateUserRequest> {}

@Injectable()
export class CreateUserHandler {
    constructor(@Inject(USER_REPOSITORY) private readonly repository: IUserRepository) {}

    async execute({ data }: CreateUserCommand): Promise<User> {
        const emailExists = await this.repository.emailExists(data.email);
        if (emailExists) {
            throw new ConflictException('Email already exists');
        }

        const user = User.create(randomUUID(), data.email, data.name, data.password);

        const savedUser = await this.repository.save(user);

        return savedUser;
    }
}
