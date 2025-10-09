import { Expose } from 'class-transformer'; import { BaseResponse } from
'../../common/response/base.response';

export class
CourseModuleResponse extends BaseResponse {
        @Expose()
        name:
        string;

        @Expose()
        description?:
        string;

        @Expose()
        order:
        number;

        @Expose()
        courseId: string;

}