import { Module } from '@nestjs/common';
import { CreateDanceStyleHandler } from './application/commands/create-dance-style.handler';
import { DeleteDanceStyleHandler } from './application/commands/delete-dance-style.handler';
import { UpdateDanceStyleHandler } from './application/commands/update-dance-style.handler';
import { FindManyDanceStylesHandler } from './application/queries/find-many-dance-styles.handler';
import { GetDanceStyleByFieldHandler } from './application/queries/get-dance-style-by-field.handler';
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
        // Commands
        CreateDanceStyleHandler,
        UpdateDanceStyleHandler,
        DeleteDanceStyleHandler,
        // Queries (3 powerful queries for all operations)
        GetDanceStyleByFieldHandler,
        FindManyDanceStylesHandler,
        GetPaginatedDanceStylesHandler,
    ],
    exports: [DANCE_STYLE_REPOSITORY],
})
export class DanceStyleModule {}
