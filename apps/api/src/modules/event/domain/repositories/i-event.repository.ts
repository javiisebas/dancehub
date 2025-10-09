import { InferFields } from '@api/modules/core/database/base';
import { IBaseRepository } from '@api/modules/core/database/interfaces/i-base.repository';
import { Event } from '../entities/event.entity';
import { events } from '../../infrastructure/schemas/event.schema';
import { User } from '../../../user/domain/entities/user.entity';
import { DanceStyle } from '../../../dance-style/domain/entities/dance-style.entity';

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');

export type EventField = InferFields<typeof events>;
export type EventRelations = {
    organizer?: User | User[];
    danceStyle?: DanceStyle | DanceStyle[];
};

export interface IEventRepository extends IBaseRepository<Event, EventField, EventRelations> {}
