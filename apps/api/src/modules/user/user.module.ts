import { StorageModule } from '@api/modules/core/storage/storage.module';
import { Module } from '@nestjs/common';
import { CreateUserHandler } from './application/commands/create-user.handler';
import { DeleteUserHandler } from './application/commands/delete-user.handler';
import { UpdateUserHandler } from './application/commands/update-user.handler';
import { GetPaginatedUsersHandler } from './application/queries/get-paginated-users.handler';
import { GetUserHandler } from './application/queries/get-user.handler';
import { USER_REPOSITORY } from './domain/repositories/i-user.repository';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository';

@Module({
    imports: [StorageModule],
    controllers: [UserController],
    providers: [
        {
            provide: USER_REPOSITORY,
            useClass: UserRepositoryImpl,
        },
        CreateUserHandler,
        UpdateUserHandler,
        DeleteUserHandler,
        GetUserHandler,
        GetPaginatedUsersHandler,
    ],
    exports: [USER_REPOSITORY, CreateUserHandler, UpdateUserHandler, GetUserHandler],
})
export class UserModule {}
