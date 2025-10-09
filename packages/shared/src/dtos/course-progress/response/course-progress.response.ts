import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
CourseProgressResponse extends BaseResponse {
        @Expose()
        completed:
        boolean;

        @Expose()
        progressPercentage:
        number;

        @Expose()
        lastWatchedAt?:
        Date;

        @Expose()
        watchTimeSeconds:
        number;

        @Expose()
        userId: string;

        @Expose()
        lessonId: string;

}