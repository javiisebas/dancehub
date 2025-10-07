import { BaseGetByFieldHandler, GetByFieldQuery } from '@api/common/abstract/application';
import { Inject, Injectable } from '@nestjs/common';
import { Album } from '../../domain/entities/album.entity';
import {
    ALBUM_REPOSITORY,
    AlbumField,
    AlbumRelations,
    IAlbumRepository,
} from '../../domain/repositories/i-album.repository';

export class GetAlbumByFieldQuery extends GetByFieldQuery<AlbumField, AlbumRelations> {}

@Injectable()
export class GetAlbumByFieldHandler extends BaseGetByFieldHandler<Album, AlbumField, AlbumRelations> {
    constructor(@Inject(ALBUM_REPOSITORY) repository: IAlbumRepository) {
        super(repository);
    }
}
