import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateTestSimpleRequest,
    PaginatedTestSimpleRequest,
    UpdateTestSimpleRequest,
    TestSimplePaginatedResponse,
    TestSimpleResponse,
} from '@repo/shared';
import {
    CreateTestSimpleCommand,
    CreateTestSimpleHandler,
} from '../../application/commands/create-test-simple.handler';
import {
    DeleteTestSimpleCommand,
    DeleteTestSimpleHandler,
} from '../../application/commands/delete-test-simple.handler';
import {
    UpdateTestSimpleCommand,
    UpdateTestSimpleHandler,
} from '../../application/commands/update-test-simple.handler';
import {
    FindManyTestSimplesHandler,
    FindManyTestSimplesQuery,
} from '../../application/queries/find-many-test-simples.handler';
import {
    GetPaginatedTestSimplesHandler,
    GetPaginatedTestSimplesQuery,
} from '../../application/queries/get-paginated-test-simples.handler';
import {
    GetTestSimpleByFieldHandler,
    GetTestSimpleByFieldQuery,
} from '../../application/queries/get-test-simple-by-field.handler';

@Controller('test-simples')
export class TestSimpleController {
    constructor(
        private readonly createTestSimpleHandler: CreateTestSimpleHandler,
        private readonly updateTestSimpleHandler: UpdateTestSimpleHandler,
        private readonly deleteTestSimpleHandler: DeleteTestSimpleHandler,
        private readonly getTestSimpleByFieldHandler: GetTestSimpleByFieldHandler,
        private readonly findManyTestSimplesHandler: FindManyTestSimplesHandler,
        private readonly getPaginatedTestSimplesHandler: GetPaginatedTestSimplesHandler,
    ) {}

    @Post()
    @Serialize(TestSimpleResponse)
    async create(@Body() dto: CreateTestSimpleRequest) {
        const command = new CreateTestSimpleCommand(dto);
        return this.createTestSimpleHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(TestSimpleResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateTestSimpleRequest) {
        const command = new UpdateTestSimpleCommand(id, dto);
        return this.updateTestSimpleHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteTestSimpleCommand(id);
        await this.deleteTestSimpleHandler.execute(command);
    }

    @Get('search')
    @Serialize(TestSimpleResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyTestSimplesQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyTestSimplesHandler.execute(query);
    }

    @Get()
    @Serialize(TestSimplePaginatedResponse)
    async paginate(@Query() dto: PaginatedTestSimpleRequest) {
        const query = new GetPaginatedTestSimplesQuery(dto);
        return this.getPaginatedTestSimplesHandler.execute(query);
    }

    @Get(':id')
    @Serialize(TestSimpleResponse)
    async findById(@Param('id') id: string) {
        const query = new GetTestSimpleByFieldQuery('id', id);
        return this.getTestSimpleByFieldHandler.execute(query);
    }
}