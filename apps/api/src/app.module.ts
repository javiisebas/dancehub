import { Module } from '@nestjs/common';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoreModule } from './modules/core/core.module';
import { DatabaseModule } from './modules/core/database/database.module';
import { CourseModuleModule } from './modules/course-module/course-module.module';
import { CourseProgressModule } from './modules/course-progress/course-progress.module';
import { CourseModule } from './modules/course/course.module';
import { DanceStyleModule } from './modules/dance-style/dance-style.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { EventModule } from './modules/event/event.module';
import { LessonAttachmentModule } from './modules/lesson-attachment/lesson-attachment.module';
import { LessonCommentModule } from './modules/lesson-comment/lesson-comment.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        CoreModule,
        DatabaseModule,
        ArtistModule,
        AuthModule,
        UserModule,
        DanceStyleModule,
        EventModule,
        CourseModuleModule,
        LessonModule,
        LessonAttachmentModule,
        EnrollmentModule,
        CourseProgressModule,
        LessonCommentModule,
        CourseModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
