import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

export class TestHelpers {
    static async createTestingApp(module: any): Promise<INestApplication> {
        const moduleRef: TestingModule = await Test.createTestingModule(module).compile();

        const app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        await app.init();
        return app;
    }

    static randomEmail(): string {
        return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@test.com`;
    }

    static randomString(length: number = 10): string {
        return Math.random()
            .toString(36)
            .substring(2, 2 + length);
    }

    static delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
