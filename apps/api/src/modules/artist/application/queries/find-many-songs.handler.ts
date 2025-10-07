import { BaseFindManyHandler, FindManyQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Song } from '../../domain/entities/song.entity';
import {
    SONG_REPOSITORY,
    SongField,
    SongRelations,
    ISongRepository,
} from '../../domain/repositories/i-song.repository';

export class FindManySongsQuery extends FindManyQuery<SongField, SongRelations> {}

@Injectable()
export class FindManySongsHandler extends BaseFindManyHandler<Song, SongField, SongRelations> {
    constructor(@Inject(SONG_REPOSITORY) repository: ISongRepository) {
        super(repository);
    }
}
