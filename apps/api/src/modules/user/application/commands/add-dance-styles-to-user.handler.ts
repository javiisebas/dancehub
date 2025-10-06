import { CacheService } from '@api/modules/core/cache';
import { DatabaseService } from '@api/modules/core/database/services/database.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
    DANCE_STYLE_REPOSITORY,
    IDanceStyleRepository,
} from '../../../dance-style/domain/repositories/i-dance-style.repository';
import { IUserRepository, USER_REPOSITORY } from '../../domain/repositories/i-user.repository';
import { userDanceStyles } from '../../infrastructure/schemas/user-dance-style.schema';

export class AddDanceStylesToUserCommand {
    constructor(
        public readonly userId: string,
        public readonly danceStyleIds: string[],
    ) {}
}

@Injectable()
export class AddDanceStylesToUserHandler {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        @Inject(DANCE_STYLE_REPOSITORY)
        private readonly danceStyleRepository: IDanceStyleRepository,
        private readonly databaseService: DatabaseService,
        private readonly cache: CacheService,
    ) {}

    async execute(command: AddDanceStylesToUserCommand): Promise<void> {
        const { userId, danceStyleIds } = command;

        await this.userRepository.findById(userId);

        if (danceStyleIds.length === 0) {
            throw new BadRequestException('No dance styles provided');
        }

        const uniqueIds = [...new Set(danceStyleIds)];

        const validationPromises = uniqueIds.map((id) => this.danceStyleRepository.findById(id));
        await Promise.all(validationPromises);

        const values = uniqueIds.map((danceStyleId) => ({
            userId,
            danceStyleId,
        }));

        await this.databaseService.db.insert(userDanceStyles).values(values).onConflictDoNothing();

        await this.cache.invalidateEntity('User', userId, { includeRelations: true });

        for (const danceStyleId of uniqueIds) {
            await this.cache.invalidateEntity('DanceStyle', danceStyleId, {
                includeRelations: true,
            });
        }
    }
}
