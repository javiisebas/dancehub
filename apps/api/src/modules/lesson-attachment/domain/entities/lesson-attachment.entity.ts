import { BaseEntity } from '@api/common/abstract/domain';

interface LessonAttachmentProps {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number | null;
    lessonId: string;
}

interface CreateLessonAttachmentProps {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize?: number | null;
    lessonId: string;
}

export class LessonAttachment extends BaseEntity {
    public fileName: string;
    public fileUrl: string;
    public fileType: string;
    public fileSize: number | null;
    public lessonId: string;

    private constructor(props: LessonAttachmentProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.fileName = props.fileName;
        this.fileUrl = props.fileUrl;
        this.fileType = props.fileType;
        this.fileSize = props.fileSize;
        this.lessonId = props.lessonId;
    }

    static create(props: CreateLessonAttachmentProps): LessonAttachment {
        const now = new Date();
        return new LessonAttachment(
            {
                fileName: props.fileName.trim(),
                fileUrl: props.fileUrl.trim(),
                fileType: props.fileType.trim(),
                fileSize: props.fileSize || null,
                lessonId: props.lessonId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: LessonAttachmentProps & { id: string; createdAt: Date; updatedAt: Date },
    ): LessonAttachment {
        return new LessonAttachment(
            {
                fileName: props.fileName,
                fileUrl: props.fileUrl,
                fileType: props.fileType,
                fileSize: props.fileSize,
                lessonId: props.lessonId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }
}
