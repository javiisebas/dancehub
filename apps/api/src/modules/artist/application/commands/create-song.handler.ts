import { CreateCommand } from '@api/common/abstract/application/commands.abstract';
import { Inject, Injectable } from '@nestjs/common';
import { CreateSongRequest } from '@repo/shared';
import { randomUUID } from 'crypto';
import { Song } from '../../domain/entities/song.entity';
import { SONG_REPOSITORY, ISongRepository } from '../../domain/repositories/i-song.repository';

export class CreateSongCommand extends CreateCommand<CreateSongRequest> {}

@Injectable()
export class CreateSongHandler {
    constructor(@Inject(SONG_REPOSITORY) private readonly repository: ISongRepository) {}

    async execute({ data }: CreateSongCommand) {
        const song = Song.create(
            randomUUID(),
            data.albumId,
            data.artistId,
            data.title,
            data.duration,
        );
        return this.repository.save(song);
    }
}
