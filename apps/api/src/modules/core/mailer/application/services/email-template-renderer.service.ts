import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { EmailTemplateEnum } from '../../domain/enums/email-templates.enum';
import { TemplateDataMap } from '../../domain/types/template-data.type';

@Injectable()
export class EmailTemplateRendererService {
    private readonly templatesDir: string;
    private compiledTemplates: Map<EmailTemplateEnum, Handlebars.TemplateDelegate<any>> = new Map();

    constructor() {
        this.templatesDir = path.join(__dirname, '../../infrastructure', 'templates');
    }

    private async loadTemplate(templateName: EmailTemplateEnum): Promise<string> {
        const filePath = path.join(this.templatesDir, `${templateName}/${templateName}.hbs`);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return content;
        } catch (error: any) {
            throw error;
        }
    }

    private async getCompiledTemplate(
        templateName: EmailTemplateEnum,
    ): Promise<Handlebars.TemplateDelegate<any>> {
        if (this.compiledTemplates.has(templateName)) {
            return this.compiledTemplates.get(templateName)!;
        }
        const templateContent = await this.loadTemplate(templateName);
        const compiled = Handlebars.compile(templateContent);
        this.compiledTemplates.set(templateName, compiled);
        return compiled;
    }

    async render<T extends EmailTemplateEnum>(
        template: T,
        data: TemplateDataMap[T],
    ): Promise<string> {
        try {
            const compiled = await this.getCompiledTemplate(template);
            return compiled(data);
        } catch (error) {
            throw error;
        }
    }

    async renderFromString(templateString: string, data: any): Promise<string> {
        try {
            const compiled = Handlebars.compile(templateString);
            return compiled(data);
        } catch (error) {
            throw error;
        }
    }
}
