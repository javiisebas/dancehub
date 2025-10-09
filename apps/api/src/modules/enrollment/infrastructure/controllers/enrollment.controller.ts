import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateEnrollmentRequest,
    PaginatedEnrollmentRequest,
    UpdateEnrollmentRequest,
    EnrollmentPaginatedResponse,
    EnrollmentResponse,
} from '@repo/shared';
import {
    CreateEnrollmentCommand,
    CreateEnrollmentHandler,
} from '../../application/commands/create-enrollment.handler';
import {
    DeleteEnrollmentCommand,
    DeleteEnrollmentHandler,
} from '../../application/commands/delete-enrollment.handler';
import {
    UpdateEnrollmentCommand,
    UpdateEnrollmentHandler,
} from '../../application/commands/update-enrollment.handler';
import {
    FindManyEnrollmentsHandler,
    FindManyEnrollmentsQuery,
} from '../../application/queries/find-many-enrollments.handler';
import {
    GetPaginatedEnrollmentsHandler,
    GetPaginatedEnrollmentsQuery,
} from '../../application/queries/get-paginated-enrollments.handler';
import {
    GetEnrollmentByFieldHandler,
    GetEnrollmentByFieldQuery,
} from '../../application/queries/get-enrollment-by-field.handler';

@Controller('enrollments')
export class EnrollmentController {
    constructor(
        private readonly createEnrollmentHandler: CreateEnrollmentHandler,
        private readonly updateEnrollmentHandler: UpdateEnrollmentHandler,
        private readonly deleteEnrollmentHandler: DeleteEnrollmentHandler,
        private readonly getEnrollmentByFieldHandler: GetEnrollmentByFieldHandler,
        private readonly findManyEnrollmentsHandler: FindManyEnrollmentsHandler,
        private readonly getPaginatedEnrollmentsHandler: GetPaginatedEnrollmentsHandler,
    ) {}

    @Post()
    @Serialize(EnrollmentResponse)
    async create(@Body() dto: CreateEnrollmentRequest) {
        const command = new CreateEnrollmentCommand(dto);
        return this.createEnrollmentHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(EnrollmentResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateEnrollmentRequest) {
        const command = new UpdateEnrollmentCommand(id, dto);
        return this.updateEnrollmentHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteEnrollmentCommand(id);
        await this.deleteEnrollmentHandler.execute(command);
    }

    @Get('search')
    @Serialize(EnrollmentResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyEnrollmentsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyEnrollmentsHandler.execute(query);
    }

    @Get()
    @Serialize(EnrollmentPaginatedResponse)
    async paginate(@Query() dto: PaginatedEnrollmentRequest) {
        const query = new GetPaginatedEnrollmentsQuery(dto);
        return this.getPaginatedEnrollmentsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(EnrollmentResponse)
    async findById(@Param('id') id: string) {
        const query = new GetEnrollmentByFieldQuery('id', id);
        return this.getEnrollmentByFieldHandler.execute(query);
    }
}