import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateEventRequest,
    PaginatedEventRequest,
    UpdateEventRequest,
    EventPaginatedResponse,
    EventResponse,
} from '@repo/shared';
import {
    CreateEventCommand,
    CreateEventHandler,
} from '../../application/commands/create-event.handler';
import {
    DeleteEventCommand,
    DeleteEventHandler,
} from '../../application/commands/delete-event.handler';
import {
    UpdateEventCommand,
    UpdateEventHandler,
} from '../../application/commands/update-event.handler';
import {
    FindManyEventsHandler,
    FindManyEventsQuery,
} from '../../application/queries/find-many-events.handler';
import {
    GetPaginatedEventsHandler,
    GetPaginatedEventsQuery,
} from '../../application/queries/get-paginated-events.handler';
import {
    GetEventByFieldHandler,
    GetEventByFieldQuery,
} from '../../application/queries/get-event-by-field.handler';

@Controller('events')
export class EventController {
    constructor(
        private readonly createEventHandler: CreateEventHandler,
        private readonly updateEventHandler: UpdateEventHandler,
        private readonly deleteEventHandler: DeleteEventHandler,
        private readonly getEventByFieldHandler: GetEventByFieldHandler,
        private readonly findManyEventsHandler: FindManyEventsHandler,
        private readonly getPaginatedEventsHandler: GetPaginatedEventsHandler,
    ) {}

    @Post()
    @Serialize(EventResponse)
    async create(@Body() dto: CreateEventRequest) {
        const command = new CreateEventCommand(dto);
        return this.createEventHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(EventResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateEventRequest) {
        const command = new UpdateEventCommand(id, dto);
        return this.updateEventHandler.execute(command);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteEventCommand(id);
        await this.deleteEventHandler.execute(command);
    }

    @Get('search')
    @Serialize(EventResponse)
    async search(@Query('limit') limit?: string) {
        const query = new FindManyEventsQuery({
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyEventsHandler.execute(query);
    }

    @Get()
    @Serialize(EventPaginatedResponse)
    async paginate(@Query() dto: PaginatedEventRequest) {
        const query = new GetPaginatedEventsQuery(dto);
        return this.getPaginatedEventsHandler.execute(query);
    }

    @Get(':id')
    @Serialize(EventResponse)
    async findById(@Param('id') id: string) {
        const query = new GetEventByFieldQuery('id', id);
        return this.getEventByFieldHandler.execute(query);
    }
}