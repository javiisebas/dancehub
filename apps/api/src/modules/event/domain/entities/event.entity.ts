import { BaseEntity } from '@api/common/abstract/domain';
import { EventStatusEnum } from '@repo/shared';
import { EventCategoryEnum } from '@repo/shared';

interface EventProps {
    title: string;
    slug: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    status: EventStatusEnum;
    category: EventCategoryEnum;
    maxAttendees: number | null;
    price: number | null;
    isFeatured: boolean;
    organizerId: string;
    danceStyleId: string;
}

interface CreateEventProps {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    status: EventStatusEnum;
    category: EventCategoryEnum;
    maxAttendees: number | null;
    price: number | null;
    isFeatured: boolean;
    organizerId: string;
    danceStyleId: string;
}

export class Event extends BaseEntity {
    public title: string;
    public slug: string;
    public description: string | null;
    public startDate: Date;
    public endDate: Date;
    public status: EventStatusEnum;
    public category: EventCategoryEnum;
    public maxAttendees: number | null;
    public price: number | null;
    public isFeatured: boolean;
    public organizerId: string;
    public danceStyleId: string;

    private constructor(props: EventProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.title = props.title;
        this.slug = props.slug;
        this.description = props.description;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.category = props.category;
        this.maxAttendees = props.maxAttendees;
        this.price = props.price;
        this.isFeatured = props.isFeatured;
        this.organizerId = props.organizerId;
        this.danceStyleId = props.danceStyleId;
    }

    static create(props: CreateEventProps): Event {
        const now = new Date();
        return new Event(
            {
                title: props.title.trim(),
                slug: props.slug.trim(),
                description: props.description ? props.description.trim() : null,
                startDate: props.startDate,
                endDate: props.endDate,
                status: props.status,
                category: props.category,
                maxAttendees: props.maxAttendees,
                price: props.price,
                isFeatured: props.isFeatured,
                organizerId: props.organizerId,
                danceStyleId: props.danceStyleId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: EventProps & { id: string; createdAt: Date; updatedAt: Date },
    ): Event {
        return new Event(
            {
                title: props.title,
                slug: props.slug,
                description: props.description,
                startDate: props.startDate,
                endDate: props.endDate,
                status: props.status,
                category: props.category,
                maxAttendees: props.maxAttendees,
                price: props.price,
                isFeatured: props.isFeatured,
                organizerId: props.organizerId,
                danceStyleId: props.danceStyleId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }
}
