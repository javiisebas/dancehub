import { LogService } from '@api/modules/core/logger/services/logger.service';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import {
    SWAGGER_API_CURRENT_VERSION,
    SWAGGER_API_DESCRIPTION,
    SWAGGER_API_NAME,
    SWAGGER_API_ROOT,
} from './constants';

export const setupSwagger = (app: INestApplication) => {
    const options = new DocumentBuilder()
        .setTitle(SWAGGER_API_NAME)
        .setDescription(SWAGGER_API_DESCRIPTION)
        .setVersion(SWAGGER_API_CURRENT_VERSION)
        .addCookieAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

    const outputPath = path.join(__dirname, '../../../public/swagger.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));

    const logService = app.get(LogService);
    logService.log(`API Documentation is available at "${SWAGGER_API_ROOT}"`);
};
