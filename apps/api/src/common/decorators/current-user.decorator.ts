import { User } from '@api/modules/user/domain/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext): User | any => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (data && user) {
            return user[data];
        }

        return user;
    },
);
