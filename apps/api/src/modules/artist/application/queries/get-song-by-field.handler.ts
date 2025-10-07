import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Song } from '../../domain/entities/song.entity';
import {
    SONG_REPOSITORY,
    SongField,
    SongRelations,
    ISongRepository,
} from '../../domain/repositories/i-song.repository';

export class GetSongByFieldQuery extends GetByFieldQuery<SongField, SongRelations> {}

@Injectable()
export class GetSongByFieldHandler extends BaseGetByFieldHandler<Song, SongField, SongRelations> {
    constructor(@Inject(SONG_REPOSITORY) repository: ISongRepository) {
        super(repository);
    }
}
