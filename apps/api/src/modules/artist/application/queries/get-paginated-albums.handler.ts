import {
    BaseGetPaginatedHandler,
    GetPaginatedQueryEnhanced,
} from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { PaginatedAlbumRequest } from '@repo/shared';
import { Album } from '../../domain/entities/album.entity';
import {
    ALBUM_REPOSITORY,
    AlbumField,
    AlbumRelations,
    IAlbumRepository,
} from '../../domain/repositories/i-album.repository';

export class GetPaginatedAlbumsQuery extends GetPaginatedQueryEnhanced<PaginatedAlbumRequest> {}

@Injectable()
export class GetPaginatedAlbumsHandler extends BaseGetPaginatedHandler<
    Album,
    PaginatedAlbumRequest,
    AlbumField,
    AlbumRelations
> {
    constructor(@Inject(ALBUM_REPOSITORY) repository: IAlbumRepository) {
        super(repository);
    }
}
