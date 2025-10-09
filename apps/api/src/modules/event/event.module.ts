import { Module } from '@nestjs/common'; import {
EventController } from './infrastructure/controllers/event.controller';
import {
EventRepositoryImpl } from './infrastructure/repositories/event.repository'; import {
EVENT_REPOSITORY } from './domain/repositories/i-event.repository';
import { CreateEventHandler } from './application/commands/create-event.handler'; import { UpdateEventHandler } from './application/commands/update-event.handler'; import { DeleteEventHandler } from './application/commands/delete-event.handler'; import { GetEventByFieldHandler } from './application/queries/get-event-by-field.handler'; import { FindManyEventsHandler } from
'./application/queries/find-many-events.handler'; import { GetPaginatedEventsHandler } from './application/queries/get-paginated-events.handler';
@Module({ controllers: [EventController], providers: [ { provide:
EVENT_REPOSITORY, useClass:
EventRepositoryImpl, }, CreateEventHandler, UpdateEventHandler, DeleteEventHandler, GetEventByFieldHandler, FindManyEventsHandler, GetPaginatedEventsHandler, ], exports: [EVENT_REPOSITORY], }) export class
EventModule {}