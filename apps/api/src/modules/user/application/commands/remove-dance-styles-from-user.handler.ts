import { CacheService } from '@api/modules/core/cache';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { userDanceStyles } from '../../infrastructure/schemas/user-dance-style.schema';

export class RemoveDanceStylesFromUserCommand {
    constructor(
        public readonly userId: string,
        public readonly danceStyleIds: string[],
    ) {}
}

@Injectable()
export class RemoveDanceStylesFromUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly databaseService: DatabaseService,
        private readonly cache: CacheService,
    ) {}

    async execute(command: RemoveDanceStylesFromUserCommand): Promise<void> {
        const { userId, danceStyleIds } = command;

        await this.userRepository.findById(userId);

        if (danceStyleIds.length === 0) {
            return;
        }

        await this.databaseService.db
            .delete(userDanceStyles)
            .where(
                and(
                    eq(userDanceStyles.userId, userId),
                    inArray(userDanceStyles.danceStyleId, danceStyleIds),
                ),
            );

        await this.cache.invalidateEntity('User', userId, { includeRelations: true });

        for (const danceStyleId of danceStyleIds) {
            await this.cache.invalidateEntity('DanceStyle', danceStyleId, {
                includeRelations: true,
            });
        }
    }
}
