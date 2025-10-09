import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
LessonAttachmentResponse extends BaseResponse {
        @Expose()
        fileName:
        string;

        @Expose()
        fileUrl:
        string;

        @Expose()
        fileType:
        string;

        @Expose()
        fileSize?:
        number;

        @Expose()
        lessonId: string;

}