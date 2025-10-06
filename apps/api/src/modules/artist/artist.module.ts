import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../core/database/database.module';
import { GetArtistHandler } from './application/queries/get-artist.handler';
import { ARTIST_REPOSITORY } from './domain/repositories/i-artist.repository';
import { ArtistController } from './infrastructure/controllers/artist.controller';
import { AlbumRepositoryImpl } from './infrastructure/repositories/album.repository';
import { ArtistRepositoryImpl } from './infrastructure/repositories/artist.repository';
import { SongRepositoryImpl } from './infrastructure/repositories/song.repository';

const queryHandlers = [GetArtistHandler];

@Module({
    imports: [CqrsModule, DatabaseModule],
    controllers: [ArtistController],
    providers: [
        ...queryHandlers,
        {
            provide: ARTIST_REPOSITORY,
            useClass: ArtistRepositoryImpl,
        },
        AlbumRepositoryImpl,
        SongRepositoryImpl,
    ],
    exports: [ARTIST_REPOSITORY],
})
export class ArtistModule {}
