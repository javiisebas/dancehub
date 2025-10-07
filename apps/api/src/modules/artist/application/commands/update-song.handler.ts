import { UpdateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateSongRequest } from '@repo/shared';
import { SONG_REPOSITORY, ISongRepository } from '../../domain/repositories/i-song.repository';

export class UpdateSongCommand extends UpdateCommand<UpdateSongRequest> {}

@Injectable()
export class UpdateSongHandler {
    constructor(@Inject(SONG_REPOSITORY) private readonly repository: ISongRepository) {}

    async execute(command: UpdateSongCommand) {
        const { id, data } = command;
        const song = await this.repository.findById(id);

        if (data.title) {
            song.updateTitle(data.title);
        }
        if (data.duration !== undefined) {
            song.updateDuration(data.duration);
        }

        return this.repository.save(song);
    }
}
