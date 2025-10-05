import { NotFoundException } from '@api/common/exceptions/not-found.exception';
import {
    GetUserHandler,
    GetUserQuery,
} from '@api/modules/user/application/queries/get-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { Injectable } from '@nestjs/common';

export class ValidateUserExistsQuery {
    constructor(public readonly userId: string) {}
}

@Injectable()
export class ValidateUserExistsHandler {
    constructor(private readonly getUserHandler: GetUserHandler) {}

    async execute({ userId }: ValidateUserExistsQuery): Promise<User> {
        const user = await this.getUserHandler.execute(new GetUserQuery(userId));

        if (!user) {
            throw new NotFoundException('User');
        }

        return user;
    }
}
