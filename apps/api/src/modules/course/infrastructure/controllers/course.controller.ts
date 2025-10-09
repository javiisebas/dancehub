import { CurrentLocale } from '@api/common/decorators/current-locale.decorator';
import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
    CreateCourseRequest,
    PaginatedCourseRequest,
    UpdateCourseRequest,
    CoursePaginatedResponse,
    CourseResponse,
} from '@repo/shared';
import {
    CreateCourseCommand,
    CreateCourseHandler,
} from '../../application/commands/create-course.handler';
import {
    DeleteCourseCommand,
    DeleteCourseHandler,
} from '../../application/commands/delete-course.handler';
import {
    UpdateCourseCommand,
    UpdateCourseHandler,
} from '../../application/commands/update-course.handler';
import {
    FindManyCoursesHandler,
    FindManyCoursesQuery,
} from '../../application/queries/find-many-courses.handler';
import {
    GetCourseByFieldHandler,
    GetCourseByFieldQuery,
} from '../../application/queries/get-course-by-field.handler';
import {
    GetPaginatedCoursesHandler,
    GetPaginatedCoursesQuery,
} from '../../application/queries/get-paginated-courses.handler';

@Controller('courses')
export class CourseController {
    constructor(
        private readonly createCourseHandler: CreateCourseHandler,
        private readonly updateCourseHandler: UpdateCourseHandler,
        private readonly deleteCourseHandler: DeleteCourseHandler,
        private readonly getCourseByFieldHandler: GetCourseByFieldHandler,
        private readonly findManyCoursesHandler: FindManyCoursesHandler,
        private readonly getPaginatedCoursesHandler: GetPaginatedCoursesHandler,
    ) {}

    @Post()
    @Serialize(CourseResponse)
    async create(@Body() dto: CreateCourseRequest) {
        const command = new CreateCourseCommand(dto);
        return this.createCourseHandler.execute(command);
    }

    @Patch(':id')
    @Serialize(CourseResponse)
    async update(@Param('id') id: string, @Body() dto: UpdateCourseRequest) {
        const command = new UpdateCourseCommand(id, dto);
        return this.updateCourseHandler.execute(command);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string): Promise<void> {
        const command = new DeleteCourseCommand(id);
        await this.deleteCourseHandler.execute(command);
    }

    @Get('search')
    @Serialize(CourseResponse)
    async search(
        @Query('locale') localeParam?: string,
        @Query('limit') limit?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const query = new FindManyCoursesQuery({
            locale: localeParam || localeHeader || undefined,
            limit: limit ? parseInt(limit) : undefined,
        });
        return this.findManyCoursesHandler.execute(query);
    }

    @Get('by-slug/:slug')
    @Serialize(CourseResponse)
    async findBySlug(
        @Param('slug') slug: string,
        @Query('locale') localeParam?: string,
        @Query('includeAllTranslations') includeAll?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const locale = localeParam || localeHeader;
        const includeAllTranslations = includeAll === 'true' || !locale;
        const query = new GetCourseByFieldQuery('slug', slug, {
            locale: locale || undefined,
            includeAllTranslations,
        });
        return this.getCourseByFieldHandler.execute(query);
    }

    @Get()
    @Serialize(CoursePaginatedResponse)
    async paginate(
        @Query() dto: PaginatedCourseRequest,
        @Query('locale') localeParam?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const query = new GetPaginatedCoursesQuery(dto, {
            locale: localeParam || localeHeader || undefined,
        });
        return this.getPaginatedCoursesHandler.execute(query);
    }

    @Get(':id')
    @Serialize(CourseResponse)
    async findById(
        @Param('id') id: string,
        @Query('locale') localeParam?: string,
        @Query('includeAllTranslations') includeAll?: string,
        @CurrentLocale() localeHeader?: string,
    ) {
        const locale = localeParam || localeHeader;
        const includeAllTranslations = includeAll === 'true' || !locale;
        const query = new GetCourseByFieldQuery('id', id, {
            locale: locale || undefined,
            includeAllTranslations,
        });
        return this.getCourseByFieldHandler.execute(query);
    }
}