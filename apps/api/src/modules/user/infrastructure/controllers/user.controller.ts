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
    FindManyUsersHandler,
    FindManyUsersQuery,
} from '../../application/queries/find-many-users.handler';
import {
    GetPaginatedUsersHandler,
    GetPaginatedUsersQuery,
} from '../../application/queries/get-paginated-users.handler';
import {
    GetUserByFieldHandler,
    GetUserByFieldQuery,
} from '../../application/queries/get-user-by-field.handler';

@Controller('users')
export class UserController {
    constructor(
        private readonly createUserHandler: CreateUserHandler,
        private readonly updateUserHandler: UpdateUserHandler,
        private readonly deleteUserHandler: DeleteUserHandler,
        private readonly getUserByFieldHandler: GetUserByFieldHandler,
        private readonly findManyUsersHandler: FindManyUsersHandler,
        private readonly paginateUsersHandler: GetPaginatedUsersHandler,
    ) {}

    @Post()
    @Serialize(UserResponse)
    async create(@Body() dto: CreateUserRequest) {
        const command = new CreateUserCommand(dto);
        return this.createUserHandler.execute(command);
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

    @Get('search')
    @Serialize(UserResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyUsersQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyUsersHandler.execute(query);
    }

    @Get('by-email/:email')
    @Serialize(UserResponse)
    async findByEmail(@Param('email') email: string) {
        const query = new GetUserByFieldQuery('email', email);
        return this.getUserByFieldHandler.execute(query);
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
        const query = new GetUserByFieldQuery('id', id);
        return this.getUserByFieldHandler.execute(query);
    }
}
