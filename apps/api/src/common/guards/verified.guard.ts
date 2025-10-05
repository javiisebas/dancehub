import { User } from '@api/modules/user/domain/entities/user.entity';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserStatusEnum } from '@repo/shared';
import { VERIFIED_KEY } from '../decorators/verified.decorator';

@Injectable()
export class VerifiedGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredStatus = this.reflector.getAllAndOverride<UserStatusEnum>(VERIFIED_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredStatus) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        if (user.status !== requiredStatus) {
            throw new ForbiddenException(`User must have status: ${requiredStatus}`);
        }

        return true;
    }
}
