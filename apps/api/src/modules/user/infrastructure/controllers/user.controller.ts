import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateUserRequest,
    PaginatedUserRequest,
    UpdateUserRequest,
    UserPaginatedResponse,
    UserResponse,
} from '@repo/shared';
import {
    CreateUserCommand,
    CreateUserHandler,
} from '../../application/commands/create-user.handler';
import {
    DeleteUserCommand,
    DeleteUserHandler,
} from '../../application/commands/delete-user.handler';
import {
    UpdateUserCommand,
    UpdateUserHandler,
} from '../../application/commands/update-user.handler';
import {
    GetPaginatedUsersHandler,
    GetPaginatedUsersQuery,
} from '../../application/queries/get-paginated-users.handler';
import { GetUserHandler, GetUserQuery } from '../../application/queries/get-user.handler';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserHandler: CreateUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly deleteUserHandler: DeleteUserHandler,
        private readonly getUserHandler: GetUserHandler,
        private readonly paginateUsersHandler: GetPaginatedUsersHandler,
    ) {}

    @Post()
    @Serialize(UserResponse)
    async create(@Body() dto: CreateUserRequest) {
        const command = new CreateUserCommand(dto);
        return this.createUserHandler.execute(command);
    }

    @Get()
    @Serialize(UserPaginatedResponse)
    async paginate(@Query() dto: PaginatedUserRequest) {
        const query = new GetPaginatedUsersQuery(dto);
        return this.paginateUsersHandler.execute(query);
    }

    @Get(':id')
    @Serialize(UserResponse)
    async findById(@Param('id') id: string) {
        const query = new GetUserQuery(id);
        return this.getUserHandler.execute(query);
    }

    @Patch(':id')
    @Serialize(UserResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateUserRequest) {
        const command = new UpdateUserCommand(id, dto);
        return this.updateUserHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteUserCommand(id);
        await this.deleteUserHandler.execute(command);
    }
}
