import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
LessonResponse extends BaseResponse {
        @Expose()
        name:
        string;

        @Expose()
        description?:
        string;

        @Expose()
        content?:
        string;

        @Expose()
        videoUrl?:
        string;

        @Expose()
        duration?:
        number;

        @Expose()
        order:
        number;

        @Expose()
        moduleId: string;

}