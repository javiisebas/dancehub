import { BaseEntity } from '@api/common/abstract/domain';

interface LessonProps {
    name: string;
    description: string | null;
    content: string | null;
    videoUrl: string | null;
    duration: number | null;
    order: number;
    moduleId: string;
}

interface CreateLessonProps {
    id: string;
    name: string;
    description?: string | null;
    content?: string | null;
    videoUrl?: string | null;
    duration?: number | null;
    order: number;
    moduleId: string;
}

export class Lesson extends BaseEntity {
    public name: string;
    public description: string | null;
    public content: string | null;
    public videoUrl: string | null;
    public duration: number | null;
    public order: number;
    public moduleId: string;

    private constructor(props: LessonProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.name = props.name;
        this.description = props.description;
        this.content = props.content;
        this.videoUrl = props.videoUrl;
        this.duration = props.duration;
        this.order = props.order;
        this.moduleId = props.moduleId;
    }

    static create(props: CreateLessonProps): Lesson {
        const now = new Date();
        return new Lesson(
            {
                name: props.name.trim(),
                description: props.description ? props.description.trim() : null,
                content: props.content || null,
                videoUrl: props.videoUrl || null,
                duration: props.duration || null,
                order: props.order,
                moduleId: props.moduleId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: LessonProps & { id: string; createdAt: Date; updatedAt: Date },
    ): Lesson {
        return new Lesson(
            {
                name: props.name,
                description: props.description,
                content: props.content,
                videoUrl: props.videoUrl,
                duration: props.duration,
                order: props.order,
                moduleId: props.moduleId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }

    updateOrder(order: number): void {
        this.order = order;
    }

    updateVideo(videoUrl: string, duration?: number): void {
        this.videoUrl = videoUrl;
        if (duration !== undefined) {
            this.duration = duration;
        }
    }
}
