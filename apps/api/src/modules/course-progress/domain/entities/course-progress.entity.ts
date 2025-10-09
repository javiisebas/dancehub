import { BaseEntity } from '@api/common/abstract/domain';

interface CourseProgressProps {
    completed: boolean;
    progressPercentage: number;
    lastWatchedAt: Date | null;
    watchTimeSeconds: number;
    userId: string;
    lessonId: string;
}

interface CreateCourseProgressProps {
    id: string;
    completed: boolean;
    progressPercentage: number;
    lastWatchedAt: Date | null;
    watchTimeSeconds: number;
    userId: string;
    lessonId: string;
}

export class CourseProgress extends BaseEntity {
    public completed: boolean;
    public progressPercentage: number;
    public lastWatchedAt: Date | null;
    public watchTimeSeconds: number;
    public userId: string;
    public lessonId: string;

    private constructor(props: CourseProgressProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.completed = props.completed;
        this.progressPercentage = props.progressPercentage;
        this.lastWatchedAt = props.lastWatchedAt;
        this.watchTimeSeconds = props.watchTimeSeconds;
        this.userId = props.userId;
        this.lessonId = props.lessonId;
    }

    static create(props: CreateCourseProgressProps): CourseProgress {
        const now = new Date();
        return new CourseProgress(
            {
                completed: props.completed,
                progressPercentage: props.progressPercentage,
                lastWatchedAt: props.lastWatchedAt,
                watchTimeSeconds: props.watchTimeSeconds,
                userId: props.userId,
                lessonId: props.lessonId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: CourseProgressProps & { id: string; createdAt: Date; updatedAt: Date },
    ): CourseProgress {
        return new CourseProgress(
            {
                completed: props.completed,
                progressPercentage: props.progressPercentage,
                lastWatchedAt: props.lastWatchedAt,
                watchTimeSeconds: props.watchTimeSeconds,
                userId: props.userId,
                lessonId: props.lessonId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }

    markAsCompleted(): void {
        this.completed = true;
        this.progressPercentage = 100;
    }

    updateProgress(percentage: number, watchTime: number): void {
        this.progressPercentage = Math.min(100, Math.max(0, percentage));
        this.watchTimeSeconds = watchTime;
        this.lastWatchedAt = new Date();

        if (this.progressPercentage >= 90) {
            this.completed = true;
        }
    }
}
