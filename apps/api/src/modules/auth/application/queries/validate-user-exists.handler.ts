import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import {
    GetUserByFieldHandler,
    GetUserByFieldQuery,
} from '@api/modules/user/application/queries/get-user-by-field.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

export class ValidateUserExistsQuery {
    constructor(public readonly userId: string) {}
}

@Injectable()
export class ValidateUserExistsHandler {
    constructor(private readonly getUserByFieldHandler: GetUserByFieldHandler) {}

    async execute({ userId }: ValidateUserExistsQuery): Promise<User> {
        const user = await this.getUserByFieldHandler.execute(
            new GetUserByFieldQuery('id', userId),
        );

        if (!user) {
            throw new NotFoundException('User');
        }

        return user;
    }
}
