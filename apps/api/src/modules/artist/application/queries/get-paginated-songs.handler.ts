import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedSongRequest } from '@repo/shared';
import { Song } from '../../domain/entities/song.entity';
import {
    SONG_REPOSITORY,
    SongField,
    SongRelations,
    ISongRepository,
} from '../../domain/repositories/i-song.repository';

export class GetPaginatedSongsQuery extends GetPaginatedQueryEnhanced<PaginatedSongRequest> {}

@Injectable()
export class GetPaginatedSongsHandler extends BaseGetPaginatedHandler<
    Song,
    PaginatedSongRequest,
    SongField,
    SongRelations
> {
    constructor(@Inject(SONG_REPOSITORY) repository: ISongRepository) {
        super(repository);
    }
}
