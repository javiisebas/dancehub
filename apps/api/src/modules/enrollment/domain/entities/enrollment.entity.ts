import { BaseEntity } from '@api/common/abstract/domain';
import { EnrollmentStatusEnum, PaymentTypeEnum } from '@repo/shared';

interface EnrollmentProps {
    enrolledAt: Date;
    expiresAt: Date | null;
    paymentId: string | null;
    addedByArtist: boolean;
    status: EnrollmentStatusEnum;
    paymentType: PaymentTypeEnum;
    userId: string;
    courseId: string;
}

interface CreateEnrollmentProps {
    id: string;
    enrolledAt: Date;
    expiresAt: Date | null;
    paymentId: string | null;
    addedByArtist: boolean;
    status: EnrollmentStatusEnum;
    paymentType: PaymentTypeEnum;
    userId: string;
    courseId: string;
}

export class Enrollment extends BaseEntity {
    public enrolledAt: Date;
    public expiresAt: Date | null;
    public paymentId: string | null;
    public addedByArtist: boolean;
    public status: EnrollmentStatusEnum;
    public paymentType: PaymentTypeEnum;
    public userId: string;
    public courseId: string;

    private constructor(props: EnrollmentProps, id: string, createdAt: Date, updatedAt: Date) {
        super(id, createdAt, updatedAt);
        this.enrolledAt = props.enrolledAt;
        this.expiresAt = props.expiresAt;
        this.paymentId = props.paymentId;
        this.addedByArtist = props.addedByArtist;
        this.status = props.status;
        this.paymentType = props.paymentType;
        this.userId = props.userId;
        this.courseId = props.courseId;
    }

    static create(props: CreateEnrollmentProps): Enrollment {
        const now = new Date();
        return new Enrollment(
            {
                enrolledAt: props.enrolledAt,
                expiresAt: props.expiresAt,
                paymentId: props.paymentId ? props.paymentId.trim() : null,
                addedByArtist: props.addedByArtist,
                status: props.status,
                paymentType: props.paymentType,
                userId: props.userId,
                courseId: props.courseId,
            },
            props.id,
            now,
            now,
        );
    }

    static fromPersistence(
        props: EnrollmentProps & { id: string; createdAt: Date; updatedAt: Date },
    ): Enrollment {
        return new Enrollment(
            {
                enrolledAt: props.enrolledAt,
                expiresAt: props.expiresAt,
                paymentId: props.paymentId,
                addedByArtist: props.addedByArtist,
                status: props.status,
                paymentType: props.paymentType,
                userId: props.userId,
                courseId: props.courseId,
            },
            props.id,
            props.createdAt,
            props.updatedAt,
        );
    }

    isActive(): boolean {
        if (this.status !== EnrollmentStatusEnum.ACTIVE) {
            return false;
        }

        if (this.expiresAt) {
            return new Date() <= this.expiresAt;
        }

        return true;
    }

    cancel(): void {
        this.status = EnrollmentStatusEnum.CANCELED;
    }

    expire(): void {
        this.status = EnrollmentStatusEnum.EXPIRED;
    }
}
