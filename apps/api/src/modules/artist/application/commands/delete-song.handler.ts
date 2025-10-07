import { DeleteCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { SONG_REPOSITORY, ISongRepository } from '../../domain/repositories/i-song.repository';

export class DeleteSongCommand extends DeleteCommand {}

@Injectable()
export class DeleteSongHandler {
    constructor(@Inject(SONG_REPOSITORY) private readonly repository: ISongRepository) {}

    async execute({ id }: DeleteSongCommand): Promise<void> {
        await this.repository.delete(id);
    }
}
