import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
LessonCommentResponse extends BaseResponse {
        @Expose()
        content:
        string;

        @Expose()
        timestamp?:
        number;

        @Expose()
        parentId?:
        string;

        @Expose()
        userId: string;

        @Expose()
        lessonId: string;

}