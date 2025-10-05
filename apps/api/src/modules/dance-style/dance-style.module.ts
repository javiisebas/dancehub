import { Module } from '@nestjs/common';
import { CreateDanceStyleHandler } from './application/commands/create-dance-style.handler';
import { DeleteDanceStyleHandler } from './application/commands/delete-dance-style.handler';
import { UpdateDanceStyleHandler } from './application/commands/update-dance-style.handler';
import { GetDanceStyleHandler } from './application/queries/get-dance-style.handler';
import { GetPaginatedDanceStylesHandler } from './application/queries/get-paginated-dance-styles.handler';
import { DANCE_STYLE_REPOSITORY } from './domain/repositories/i-dance-style.repository';
import { DanceStyleController } from './infrastructure/controllers/dance-style.controller';
import { DanceStyleRepositoryImpl } from './infrastructure/repositories/dance-style.repository';

@Module({
    controllers: [DanceStyleController],
    providers: [
        {
            provide: DANCE_STYLE_REPOSITORY,
            useClass: DanceStyleRepositoryImpl,
        },
        CreateDanceStyleHandler,
        UpdateDanceStyleHandler,
        DeleteDanceStyleHandler,
        GetDanceStyleHandler,
        GetPaginatedDanceStylesHandler,
    ],
    exports: [DANCE_STYLE_REPOSITORY],
})
export class DanceStyleModule {}
