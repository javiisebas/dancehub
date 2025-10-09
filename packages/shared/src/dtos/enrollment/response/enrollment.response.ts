import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
EnrollmentResponse extends BaseResponse {
        @Expose()
        enrolledAt:
        Date;

        @Expose()
        expiresAt?:
        Date;

        @Expose()
        paymentId?:
        string;

        @Expose()
        addedByArtist:
        boolean;

        @Expose()
        userId: string;

        @Expose()
        courseId: string;

}