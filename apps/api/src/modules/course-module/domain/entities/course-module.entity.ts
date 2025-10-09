import { BaseEntity } from '@api/common/abstract/domain';

interface CourseModuleProps {
    name: string;
    description: string | null;
    order: number;
    courseId: string;
}

interface CreateCourseModuleProps {
    id: string;
    name: string;
    description?: string | null;
    order: number;
    courseId: string;
}

export class CourseModule extends BaseEntity {
    public name: string;
    public description: string | null;
    public order: number;
    public courseId: string;

    private constructor(props: CourseModuleProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.name = props.name;
        this.description = props.description;
        this.order = props.order;
        this.courseId = props.courseId;
    }

    static create(props: CreateCourseModuleProps): CourseModule {
        const now = new Date();
        return new CourseModule(
            {
                name: props.name.trim(),
                description: props.description ? props.description.trim() : null,
                order: props.order,
                courseId: props.courseId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: CourseModuleProps & { id: string; createdAt: Date; updatedAt: Date },
    ): CourseModule {
        return new CourseModule(
            {
                name: props.name,
                description: props.description,
                order: props.order,
                courseId: props.courseId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }

    updateOrder(order: number): void {
        this.order = order;
    }
}
