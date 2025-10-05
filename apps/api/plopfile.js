const { execSync } = require('child_process');
const {
    parseSchema,
    generateValidators,
    readSchemaFile,
    prepareTemplateData,
} = require('./scripts/schema-parser');
const fs = require('fs');
const path = require('path');

module.exports = function (plop) {
    plop.setActionType('prettier', function (answers, config, plop) {
        const pattern = config.pattern || 'src/**/*.ts';
        try {
            execSync(`npx prettier --write "${pattern}"`, {
                cwd: plop.getPlopfilePath(),
                stdio: 'inherit',
            });
            return 'Code formatted successfully';
        } catch (error) {
            throw `Failed to format code: ${error.message}`;
        }
    });

    plop.setHelper('pascalCase', (text) => {
        return text
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    });

    plop.setHelper('camelCase', (text) => {
        const pascal = text
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });

    plop.setHelper('kebabCase', (text) => {
        return text.toLowerCase().replace(/\s+/g, '-');
    });

    plop.setHelper('snakeCase', (text) => {
        return text.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
    });

    plop.setHelper('constantCase', (text) => {
        return text.toUpperCase().replace(/\s+/g, '_').replace(/-/g, '_');
    });

    plop.setHelper('pluralize', (text) => {
        if (text.endsWith('y')) {
            return text.slice(0, -1) + 'ies';
        }
        if (text.endsWith('s') || text.endsWith('x') || text.endsWith('z')) {
            return text + 'es';
        }
        return text + 's';
    });

    plop.setHelper('eq', (a, b) => a === b);
    plop.setHelper('ne', (a, b) => a !== b);
    plop.setHelper('or', (...args) => {
        return Array.prototype.slice.call(args, 0, -1).some(Boolean);
    });
    plop.setHelper('and', (...args) => {
        return Array.prototype.slice.call(args, 0, -1).every(Boolean);
    });

    plop.setGenerator('module', {
        description: 'Generate a new module with complete CQRS structure',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Module name (kebab-case):',
            },
            {
                type: 'confirm',
                name: 'translatable',
                message: 'Is this a translatable module?',
                default: false,
            },
            {
                type: 'input',
                name: 'schemaFile',
                message: 'Schema file path (or press enter to skip):',
                default: '',
            },
        ],
        actions: (data) => {
            const actions = [];
            const modulePath = `src/modules/{{kebabCase name}}`;
            const isTranslatable = data.translatable;

            // Si se proporciona un schema (archivo), parsearlo
            let schemaData = null;

            if (data.schemaFile && data.schemaFile.trim() !== '') {
                try {
                    const schemaPath = path.resolve(process.cwd(), data.schemaFile);
                    const schemaDefinition = readSchemaFile(schemaPath);
                    schemaData = prepareTemplateData(
                        isTranslatable && schemaDefinition.entity
                            ? schemaDefinition.entity
                            : schemaDefinition,
                        data.name,
                        isTranslatable,
                    );
                } catch (error) {
                    console.warn(`Warning: Could not read schema file: ${error.message}`);
                    console.warn('Generating module with TODO comments instead.');
                }
            }

            actions.push(
                {
                    type: 'add',
                    path: `${modulePath}/{{kebabCase name}}.module.ts`,
                    templateFile: 'plop-templates/module/module.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/entities/{{kebabCase name}}.entity.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/entity.translatable.hbs'
                        : 'plop-templates/module/entity.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/repositories/i-{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/repository.interface.translatable.hbs'
                        : 'plop-templates/module/repository.interface.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/repository.translatable.hbs'
                        : 'plop-templates/module/repository.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}.schema.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/schema.translatable.hbs'
                        : 'plop-templates/module/schema.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/controllers/{{kebabCase name}}.controller.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/controller.translatable.hbs'
                        : 'plop-templates/module/controller.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/cache/{{kebabCase name}}.cache-keys.ts`,
                    templateFile: 'plop-templates/module/cache-keys.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/create-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/create-handler.translatable.hbs'
                        : 'plop-templates/module/create-handler.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/update-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/update-handler.translatable.hbs'
                        : 'plop-templates/module/update-handler.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/delete-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/delete-handler.translatable.hbs'
                        : 'plop-templates/module/delete-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/get-handler.translatable.hbs'
                        : 'plop-templates/module/get-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/module/paginate-handler.translatable.hbs'
                        : 'plop-templates/module/paginate-handler.hbs',
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/{{kebabCase name}}-translation.entity.ts`,
                        templateFile: 'plop-templates/module/translation-entity.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/index.ts`,
                        templateFile: 'plop-templates/module/entity-index.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}-translation.schema.ts`,
                        templateFile: 'plop-templates/module/translation-schema.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/index.ts`,
                        templateFile: 'plop-templates/module/schema-index.hbs',
                    },
                );
            }

            actions.push({
                type: 'modify',
                path: 'src/app.module.ts',
                pattern: /(imports: \[[\s\S]*?)(])/,
                template: '$1, {{pascalCase name}}Module$2',
            });

            actions.push({
                type: 'modify',
                path: 'src/app.module.ts',
                pattern: /(import { Module } from '@nestjs\/common';)/,
                template:
                    "$1\nimport { {{pascalCase name}}Module } from './modules/{{kebabCase name}}/{{kebabCase name}}.module';",
            });

            // Add schemas to schema.ts
            if (isTranslatable) {
                actions.push({
                    type: 'modify',
                    path: 'src/modules/core/database/schema.ts',
                    pattern: /([\s\S]*)/,
                    template:
                        "$1export * from '../../{{kebabCase name}}/infrastructure/schemas/{{kebabCase name}}.schema';\nexport * from '../../{{kebabCase name}}/infrastructure/schemas/{{kebabCase name}}-translation.schema';\n",
                });
            } else {
                actions.push({
                    type: 'modify',
                    path: 'src/modules/core/database/schema.ts',
                    pattern: /([\s\S]*)/,
                    template:
                        "$1export * from '../../{{kebabCase name}}/infrastructure/schemas/{{kebabCase name}}.schema';\n",
                });
            }

            // Generate DTOs in shared package
            const sharedPath = `../../packages/shared/src/dtos/{{kebabCase name}}`;

            actions.push(
                {
                    type: 'add',
                    path: `${sharedPath}/request/create-{{kebabCase name}}.request.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/shared-dtos/create-request-translatable.hbs'
                        : 'plop-templates/shared-dtos/create-request.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/request/update-{{kebabCase name}}.request.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/shared-dtos/update-request-translatable.hbs'
                        : 'plop-templates/shared-dtos/update-request.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/request/paginate-{{kebabCase name}}.request.ts`,
                    templateFile: 'plop-templates/shared-dtos/paginate-request.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPath}/response/{{kebabCase name}}.response.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/shared-dtos/response-translatable.hbs'
                        : 'plop-templates/shared-dtos/response.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/response/{{kebabCase name}}-paginated.response.ts`,
                    templateFile: 'plop-templates/shared-dtos/paginated-response.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPath}/types/{{kebabCase name}}-field.type.ts`,
                    templateFile: 'plop-templates/shared-dtos/field-type.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${sharedPath}/request/{{kebabCase name}}-translation.dto.ts`,
                        templateFile: 'plop-templates/shared-dtos/translation-dto.hbs',
                    },
                    {
                        type: 'add',
                        path: `${sharedPath}/response/{{kebabCase name}}-translation.response.ts`,
                        templateFile: 'plop-templates/shared-dtos/translation-response.hbs',
                    },
                );
            }

            // Generate index files for shared package
            actions.push(
                {
                    type: 'add',
                    path: `${sharedPath}/request/index.ts`,
                    template: `export * from './create-{{kebabCase name}}.request';\nexport * from './update-{{kebabCase name}}.request';\nexport * from './paginate-{{kebabCase name}}.request';${
                        isTranslatable
                            ? "\nexport * from './{{kebabCase name}}-translation.dto';"
                            : ''
                    }\n`,
                },
                {
                    type: 'add',
                    path: `${sharedPath}/response/index.ts`,
                    template: `export * from './{{kebabCase name}}.response';\nexport * from './{{kebabCase name}}-paginated.response';${
                        isTranslatable
                            ? "\nexport * from './{{kebabCase name}}-translation.response';"
                            : ''
                    }\n`,
                },
                {
                    type: 'add',
                    path: `${sharedPath}/types/index.ts`,
                    template: "export * from './{{kebabCase name}}-field.type';\n",
                },
                {
                    type: 'add',
                    path: `${sharedPath}/index.ts`,
                    template:
                        "export * from './request';\nexport * from './response';\nexport * from './types';\n",
                },
            );

            // Update main index in shared/src/dtos
            actions.push({
                type: 'modify',
                path: '../../packages/shared/src/dtos/index.ts',
                pattern: /([\s\S]*)/,
                template: "$1export * from './{{kebabCase name}}';\n",
            });

            actions.push(function (answers) {
                return {
                    type: 'prettier',
                    pattern: `src/modules/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
                };
            });

            actions.push({
                type: 'prettier',
                pattern: 'src/app.module.ts',
            });

            actions.push(function (answers) {
                return {
                    type: 'prettier',
                    pattern: `../../packages/shared/src/dtos/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
                };
            });

            return actions;
        },
    });

    plop.setGenerator('entity', {
        description: 'Generate a new entity within an existing module',
        prompts: [
            {
                type: 'input',
                name: 'module',
                message: 'Module name (kebab-case):',
            },
            {
                type: 'input',
                name: 'name',
                message: 'Entity name (kebab-case):',
            },
            {
                type: 'confirm',
                name: 'translatable',
                message: 'Is this a translatable entity?',
                default: false,
            },
            {
                type: 'input',
                name: 'schemaFile',
                message: 'Schema file path (or press enter to skip):',
                default: '',
            },
        ],
        actions: (data) => {
            const actions = [];
            const modulePath = `src/modules/{{kebabCase module}}`;
            const isTranslatable = data.translatable;

            // Si se proporciona un schema (archivo), parsearlo
            let schemaData = null;

            if (data.schemaFile && data.schemaFile.trim() !== '') {
                try {
                    const schemaPath = path.resolve(process.cwd(), data.schemaFile);
                    const schemaDefinition = readSchemaFile(schemaPath);
                    schemaData = prepareTemplateData(
                        isTranslatable && schemaDefinition.entity
                            ? schemaDefinition.entity
                            : schemaDefinition,
                        data.name,
                        isTranslatable,
                    );
                } catch (error) {
                    console.warn(`Warning: Could not read schema file: ${error.message}`);
                    console.warn('Generating entity with TODO comments instead.');
                }
            }

            actions.push(
                {
                    type: 'add',
                    path: `${modulePath}/domain/entities/{{kebabCase name}}.entity.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/entity.translatable.hbs'
                        : 'plop-templates/entity/entity.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/repositories/i-{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/repository.interface.translatable.hbs'
                        : 'plop-templates/entity/repository.interface.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/repository.translatable.hbs'
                        : 'plop-templates/entity/repository.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}.schema.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/schema.translatable.hbs'
                        : 'plop-templates/entity/schema.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/controllers/{{kebabCase name}}.controller.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/controller.translatable.hbs'
                        : 'plop-templates/entity/controller.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/create-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/create-handler.translatable.hbs'
                        : 'plop-templates/entity/create-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/update-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/update-handler.translatable.hbs'
                        : 'plop-templates/entity/update-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/delete-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/delete-handler.translatable.hbs'
                        : 'plop-templates/entity/delete-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/get-handler.translatable.hbs'
                        : 'plop-templates/entity/get-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'plop-templates/entity/paginate-handler.translatable.hbs'
                        : 'plop-templates/entity/paginate-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/cache/{{kebabCase name}}.cache-keys.ts`,
                    templateFile: 'plop-templates/entity/cache-keys.hbs',
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/{{kebabCase name}}-translation.entity.ts`,
                        templateFile: 'plop-templates/entity/translation-entity.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}-translation.schema.ts`,
                        templateFile: 'plop-templates/entity/translation-schema.hbs',
                    },
                );
            }

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(controllers: \[)([\s\S]*?)(\])/,
                template: '$1$2    {{pascalCase name}}Controller,\n$3',
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(providers: \[[\s\S]*?)(])/,
                template:
                    '$1        {\n            provide: {{constantCase name}}_REPOSITORY,\n            useClass: {{pascalCase name}}RepositoryImpl,\n        },\n        Create{{pascalCase name}}Handler,\n        Update{{pascalCase name}}Handler,\n        Delete{{pascalCase name}}Handler,\n        Get{{pascalCase name}}Handler,\n        GetPaginated{{pascalCase (pluralize name)}}Handler,\n$2',
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(exports: \[[\s\S]*?)(])/,
                template: '$1    {{constantCase name}}_REPOSITORY,\n$2',
            });

            // Add schemas to schema.ts
            if (isTranslatable) {
                actions.push({
                    type: 'modify',
                    path: 'src/modules/core/database/schema.ts',
                    pattern: /([\s\S]*)/,
                    template:
                        "$1export * from '../../{{kebabCase module}}/infrastructure/schemas/{{kebabCase name}}.schema';\nexport * from '../../{{kebabCase module}}/infrastructure/schemas/{{kebabCase name}}-translation.schema';\n",
                });
            } else {
                actions.push({
                    type: 'modify',
                    path: 'src/modules/core/database/schema.ts',
                    pattern: /([\s\S]*)/,
                    template:
                        "$1export * from '../../{{kebabCase module}}/infrastructure/schemas/{{kebabCase name}}.schema';\n",
                });
            }

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(import { Module } from '@nestjs\/common';)/,
                template:
                    "$1\nimport { {{pascalCase name}}Controller } from './infrastructure/controllers/{{kebabCase name}}.controller';\n" +
                    "import { {{pascalCase name}}RepositoryImpl } from './infrastructure/repositories/{{kebabCase name}}.repository';\n" +
                    "import { {{constantCase name}}_REPOSITORY } from './domain/repositories/i-{{kebabCase name}}.repository';\n" +
                    "import { Create{{pascalCase name}}Handler } from './application/commands/create-{{kebabCase name}}.handler';\n" +
                    "import { Update{{pascalCase name}}Handler } from './application/commands/update-{{kebabCase name}}.handler';\n" +
                    "import { Delete{{pascalCase name}}Handler } from './application/commands/delete-{{kebabCase name}}.handler';\n" +
                    "import { Get{{pascalCase name}}Handler } from './application/queries/get-{{kebabCase name}}.handler';\n" +
                    "import { GetPaginated{{pascalCase (pluralize name)}}Handler } from './application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler';\n",
            });

            // Generate DTOs in shared package for entity generator
            const sharedPathEntity = `../../packages/shared/src/dtos/{{kebabCase name}}`;

            // Templates consolidados que manejan ambos casos (con/sin fields)
            const createRequestTemplateEntity = isTranslatable
                ? 'plop-templates/shared-dtos/create-request-translatable.hbs'
                : 'plop-templates/shared-dtos/create-request.hbs';

            const updateRequestTemplateEntity = isTranslatable
                ? 'plop-templates/shared-dtos/update-request-translatable.hbs'
                : 'plop-templates/shared-dtos/update-request.hbs';

            const responseTemplateEntity = isTranslatable
                ? 'plop-templates/shared-dtos/response-translatable.hbs'
                : 'plop-templates/shared-dtos/response.hbs';

            const fieldTypeTemplateEntity = 'plop-templates/shared-dtos/field-type.hbs';

            actions.push(
                {
                    type: 'add',
                    path: `${sharedPathEntity}/request/create-{{kebabCase name}}.request.ts`,
                    templateFile: createRequestTemplateEntity,
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/request/update-{{kebabCase name}}.request.ts`,
                    templateFile: updateRequestTemplateEntity,
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/request/paginate-{{kebabCase name}}.request.ts`,
                    templateFile: 'plop-templates/shared-dtos/paginate-request.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/response/{{kebabCase name}}.response.ts`,
                    templateFile: responseTemplateEntity,
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/response/{{kebabCase name}}-paginated.response.ts`,
                    templateFile: 'plop-templates/shared-dtos/paginated-response.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/types/{{kebabCase name}}-field.type.ts`,
                    templateFile: fieldTypeTemplateEntity,
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${sharedPathEntity}/request/{{kebabCase name}}-translation.dto.ts`,
                        templateFile: 'plop-templates/shared-dtos/translation-dto.hbs',
                    },
                    {
                        type: 'add',
                        path: `${sharedPathEntity}/response/{{kebabCase name}}-translation.response.ts`,
                        templateFile: 'plop-templates/shared-dtos/translation-response.hbs',
                    },
                );
            }

            // Generate index files for shared package
            actions.push(
                {
                    type: 'add',
                    path: `${sharedPathEntity}/request/index.ts`,
                    template: `export * from './create-{{kebabCase name}}.request';\nexport * from './update-{{kebabCase name}}.request';\nexport * from './paginate-{{kebabCase name}}.request';${
                        isTranslatable
                            ? "\nexport * from './{{kebabCase name}}-translation.dto';"
                            : ''
                    }\n`,
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/response/index.ts`,
                    template: `export * from './{{kebabCase name}}.response';\nexport * from './{{kebabCase name}}-paginated.response';${
                        isTranslatable
                            ? "\nexport * from './{{kebabCase name}}-translation.response';"
                            : ''
                    }\n`,
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/types/index.ts`,
                    template: "export * from './{{kebabCase name}}-field.type';\n",
                },
                {
                    type: 'add',
                    path: `${sharedPathEntity}/index.ts`,
                    template:
                        "export * from './request';\nexport * from './response';\nexport * from './types';\n",
                },
            );

            // Update main index in shared/src/dtos
            actions.push({
                type: 'modify',
                path: '../../packages/shared/src/dtos/index.ts',
                pattern: /([\s\S]*)/,
                template: "$1export * from './{{kebabCase name}}';\n",
            });

            actions.push(function (answers) {
                return {
                    type: 'prettier',
                    pattern: `src/modules/${plop.getHelper('kebabCase')(answers.module)}/**/*.ts`,
                };
            });

            actions.push(function (answers) {
                return {
                    type: 'prettier',
                    pattern: `../../packages/shared/src/dtos/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
                };
            });

            return actions;
        },
    });

    plop.setGenerator('handler', {
        description: 'Generate a new command or query handler',
        prompts: [
            {
                type: 'input',
                name: 'module',
                message: 'Module name (kebab-case):',
            },
            {
                type: 'list',
                name: 'type',
                message: 'Handler type:',
                choices: ['command', 'query'],
            },
            {
                type: 'input',
                name: 'name',
                message: 'Handler name (e.g., "verify-email", "get-by-email"):',
            },
        ],
        actions: (data) => {
            const actions = [];
            const modulePath = `src/modules/{{kebabCase module}}`;
            const handlerPath = data.type === 'command' ? 'commands' : 'queries';

            actions.push({
                type: 'add',
                path: `${modulePath}/application/${handlerPath}/{{kebabCase name}}.handler.ts`,
                templateFile: `plop-templates/handler/${data.type}.hbs`,
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(providers: \[[\s\S]*?)(])/,
                template: '$1        {{pascalCase name}}Handler,\n$2',
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(import { Module } from '@nestjs\/common';)/,
                template: `$1\nimport { {{pascalCase name}}Handler } from './application/${handlerPath}/{{kebabCase name}}.handler';`,
            });

            return actions;
        },
    });

    plop.setGenerator('service', {
        description: 'Generate a new domain or application service',
        prompts: [
            {
                type: 'input',
                name: 'module',
                message: 'Module name (kebab-case):',
            },
            {
                type: 'list',
                name: 'layer',
                message: 'Service layer:',
                choices: ['domain', 'application'],
            },
            {
                type: 'input',
                name: 'name',
                message: 'Service name (e.g., "email-validator", "password-hasher"):',
            },
        ],
        actions: (data) => {
            const actions = [];
            const modulePath = `src/modules/{{kebabCase module}}`;
            const servicesDir =
                data.layer === 'domain' ? 'domain/services' : 'application/services';

            actions.push({
                type: 'add',
                path: `${modulePath}/${servicesDir}/{{kebabCase name}}.service.ts`,
                templateFile: `plop-templates/service/${data.layer}.hbs`,
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(providers: \[[\s\S]*?)(])/,
                template: '$1        {{pascalCase name}}Service,\n$2',
            });

            actions.push({
                type: 'modify',
                path: `${modulePath}/{{kebabCase module}}.module.ts`,
                pattern: /(import { Module } from '@nestjs\/common';)/,
                template: `$1\nimport { {{pascalCase name}}Service } from './${servicesDir}/{{kebabCase name}}.service';`,
            });

            return actions;
        },
    });

    plop.setGenerator('module-container', {
        description: 'Generate an empty container module (for multiple entities)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Container module name (kebab-case):',
            },
        ],
        actions: (data) => {
            const actions = [];

            actions.push({
                type: 'add',
                path: `src/modules/{{kebabCase name}}/{{kebabCase name}}.module.ts`,
                template: `import { Module } from '@nestjs/common';

@Module({
    controllers: [],
    providers: [],
    exports: [],
})
export class {{pascalCase name}}Module {}`,
            });

            actions.push({
                type: 'modify',
                path: 'src/app.module.ts',
                pattern: /(imports: \[[\s\S]*?)(])/,
                template: '$1, {{pascalCase name}}Module$2',
            });

            actions.push({
                type: 'modify',
                path: 'src/app.module.ts',
                pattern: /(import { Module } from '@nestjs\/common';)/,
                template:
                    "$1\nimport { {{pascalCase name}}Module } from './modules/{{kebabCase name}}/{{kebabCase name}}.module';",
            });

            return actions;
        },
    });
};
