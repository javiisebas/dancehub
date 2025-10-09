import { BaseEntity } from '@api/common/abstract/domain';

interface LessonCommentProps {
    content: string;
    timestamp: number | null;
    parentId: string | null;
    userId: string;
    lessonId: string;
}

interface CreateLessonCommentProps {
    id: string;
    content: string;
    timestamp?: number | null;
    parentId?: string | null;
    userId: string;
    lessonId: string;
}

export class LessonComment extends BaseEntity {
    public content: string;
    public timestamp: number | null;
    public parentId: string | null;
    public userId: string;
    public lessonId: string;

    private constructor(props: LessonCommentProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.content = props.content;
        this.timestamp = props.timestamp;
        this.parentId = props.parentId;
        this.userId = props.userId;
        this.lessonId = props.lessonId;
    }

    static create(props: CreateLessonCommentProps): LessonComment {
        const now = new Date();
        return new LessonComment(
            {
                content: props.content.trim(),
                timestamp: props.timestamp || null,
                parentId: props.parentId || null,
                userId: props.userId,
                lessonId: props.lessonId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: LessonCommentProps & { id: string; createdAt: Date; updatedAt: Date },
    ): LessonComment {
        return new LessonComment(
            {
                content: props.content,
                timestamp: props.timestamp,
                parentId: props.parentId,
                userId: props.userId,
                lessonId: props.lessonId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }

    isReply(): boolean {
        return this.parentId !== null;
    }

    updateContent(content: string): void {
        this.content = content.trim();
    }
}
