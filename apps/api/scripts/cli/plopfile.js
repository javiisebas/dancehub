const { execSync } = require('child_process');
const {
    parseSchema,
    generateValidators,
    readSchemaFile,
    prepareTemplateData,
    generateEnumFile,
} = require('./schema-parser');
const fs = require('fs');
const path = require('path');

function parseInlineFields(inlineFields) {
    const fields = {};
    const parts = inlineFields.split(',').map((p) => p.trim());

    parts.forEach((part) => {
        const [name, type, ...modifiers] = part.split(':').map((s) => s.trim());
        let drizzleType = 'varchar';
        let length = null;

        if (type) {
            const typeMatch = type.match(/(\w+)(?:\((\d+)\))?/);
            if (typeMatch) {
                drizzleType = typeMatch[1];
                length = typeMatch[2] ? parseInt(typeMatch[2]) : null;
            }
        }

        let definition = '';
        if (drizzleType === 'varchar' || drizzleType === 'char') {
            definition = `${drizzleType}('${name}', { length: ${length || 255} })`;
        } else if (drizzleType === 'text') {
            definition = `text('${name}')`;
        } else if (drizzleType === 'integer' || drizzleType === 'bigint') {
            definition = `${drizzleType}('${name}')`;
        } else if (drizzleType === 'boolean') {
            definition = `boolean('${name}')`;
        } else if (drizzleType === 'timestamp') {
            definition = `timestamp('${name}')`;
        } else if (drizzleType === 'uuid') {
            definition = `uuid('${name}')`;
        } else {
            definition = `${drizzleType}('${name}')`;
        }

        if (modifiers.includes('required')) {
            definition += '.notNull()';
        }
        if (modifiers.includes('unique')) {
            definition += '.unique()';
        }

        fields[name] = definition;
    });

    return { fields };
}

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
        // If already PascalCase or contains no separators, just ensure first char is uppercase
        if (!/[-_\s]/.test(text)) {
            return text.charAt(0).toUpperCase() + text.slice(1);
        }
        // Otherwise, convert from kebab-case, snake_case, or space-separated
        return text
            .split(/[-_\s]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    });

    plop.setHelper('camelCase', (text) => {
        // If already camelCase or contains no separators, just ensure first char is lowercase
        if (!/[-_\s]/.test(text)) {
            return text.charAt(0).toLowerCase() + text.slice(1);
        }
        // Otherwise, convert from kebab-case, snake_case, or space-separated
        const pascal = text
            .split(/[-_\s]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });

    plop.setHelper('kebabCase', (text) => {
        return text
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    });

    plop.setHelper('eq', (a, b) => {
        return a === b;
    });

    plop.setHelper('snakeCase', (text) => {
        return text
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[\s-]+/g, '_')
            .toLowerCase();
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

    plop.setHelper('singularize', (text) => {
        if (text.endsWith('ies')) {
            return text.slice(0, -3) + 'y';
        }
        if (text.endsWith('ses') || text.endsWith('xes') || text.endsWith('zes')) {
            return text.slice(0, -2);
        }
        if (text.endsWith('s') && !text.endsWith('ss')) {
            return text.slice(0, -1);
        }
        return text;
    });

    plop.setHelper('eq', (a, b) => a === b);
    plop.setHelper('ne', (a, b) => a !== b);
    plop.setHelper('or', (...args) => {
        return Array.prototype.slice.call(args, 0, -1).some(Boolean);
    });
    plop.setHelper('uniqueDrizzleTypes', (fields) => {
        if (!fields || !Array.isArray(fields)) return [];
        const types = new Set();
        fields.forEach((field) => {
            if (
                field.drizzleType &&
                field.drizzleType !== 'uuid' &&
                field.drizzleType !== 'timestamp'
            ) {
                types.add(field.drizzleType);
            }
        });
        return Array.from(types);
    });
    plop.setHelper('enumFileName', (enumName) => {
        const name = enumName.replace(/Enum$/i, '');
        return name
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
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

            let schemaData = null;

            if (data.schemaFile && data.schemaFile.trim() !== '' && data.schemaFile !== 'none') {
                try {
                    let schemaDefinition;

                    if (data.schemaFile.includes(':')) {
                        console.log('📝 Parsing inline fields...');
                        schemaDefinition = parseInlineFields(data.schemaFile);
                    } else {
                        console.log('📂 Reading schema file...');
                        const schemaPath = path.resolve(process.cwd(), data.schemaFile);
                        schemaDefinition = readSchemaFile(schemaPath);
                    }

                    schemaData = prepareTemplateData(schemaDefinition, data.name, isTranslatable);

                    if (schemaData.enums && schemaData.enums.length > 0) {
                        console.log('🎨 Generating enums...');
                        schemaData.enums.forEach((enumData) => {
                            const enumPath = path.resolve(
                                process.cwd(),
                                `../../packages/shared/src/enums/${plop.getHelper('kebabCase')(enumData.name)}.enum.ts`,
                            );
                            generateEnumFile(enumData, enumPath);

                            // Add enum export to index.ts
                            actions.push({
                                type: 'modify',
                                path: '../../packages/shared/src/enums/index.ts',
                                pattern: /(export \* from '\.\/currency\.enum';)/,
                                template: `$1\nexport * from './${plop.getHelper('kebabCase')(enumData.name)}.enum';`,
                            });
                        });
                    }

                    if (schemaData.relations && schemaData.relations.length > 0) {
                        console.log(
                            '🔗 Found relations:',
                            schemaData.relations.map((r) => r.name).join(', '),
                        );
                    }

                    if (schemaData.foreignKeys && schemaData.foreignKeys.length > 0) {
                        console.log(
                            '🔑 Found foreign keys:',
                            schemaData.foreignKeys.map((fk) => fk.name).join(', '),
                        );
                    }
                } catch (error) {
                    console.warn(`⚠️  Warning: Could not read schema file: ${error.message}`);
                    console.warn('Generating module with TODO comments instead.');
                }
            }

            actions.push(
                {
                    type: 'add',
                    path: `${modulePath}/{{kebabCase name}}.module.ts`,
                    templateFile: 'templates/module/module.hbs',
                    force: true,
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/entities/{{kebabCase name}}.entity.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/entity.translatable.hbs'
                        : 'templates/module/entity.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/repositories/i-{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/repository.interface.translatable.hbs'
                        : 'templates/module/repository.interface.hbs',
                    data: schemaData || {},
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/repository.translatable.hbs'
                        : 'templates/module/repository.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}.schema.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/schema.translatable.hbs'
                        : 'templates/module/schema.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/controllers/{{kebabCase name}}.controller.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/controller.translatable.hbs'
                        : 'templates/module/controller.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/cache/{{kebabCase name}}.cache-keys.ts`,
                    templateFile: 'templates/module/cache-keys.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/create-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/create-handler.translatable.hbs'
                        : 'templates/module/create-handler.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/update-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/update-handler.translatable.hbs'
                        : 'templates/module/update-handler.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/delete-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/module/delete-handler.translatable.hbs'
                        : 'templates/module/delete-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-{{kebabCase name}}-by-field.handler.ts`,
                    templateFile: 'templates/module/get-by-field-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/find-many-{{pluralize (kebabCase name)}}.handler.ts`,
                    templateFile: 'templates/module/find-many-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler.ts`,
                    templateFile: 'templates/module/get-paginated-handler.hbs',
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/{{kebabCase name}}-translation.entity.ts`,
                        templateFile: 'templates/module/translation-entity.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/index.ts`,
                        templateFile: 'templates/module/entity-index.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}-translation.schema.ts`,
                        templateFile: 'templates/module/translation-schema.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/index.ts`,
                        templateFile: 'templates/module/schema-index.hbs',
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
                        ? 'templates/shared-dtos/create-request-translatable.hbs'
                        : 'templates/shared-dtos/create-request.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/request/update-{{kebabCase name}}.request.ts`,
                    templateFile: isTranslatable
                        ? 'templates/shared-dtos/update-request-translatable.hbs'
                        : 'templates/shared-dtos/update-request.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/request/paginate-{{kebabCase name}}.request.ts`,
                    templateFile: 'templates/shared-dtos/paginate-request.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPath}/response/{{kebabCase name}}.response.ts`,
                    templateFile: isTranslatable
                        ? 'templates/shared-dtos/response-translatable.hbs'
                        : 'templates/shared-dtos/response.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${sharedPath}/response/{{kebabCase name}}-paginated.response.ts`,
                    templateFile: 'templates/shared-dtos/paginated-response.hbs',
                },
                {
                    type: 'add',
                    path: `${sharedPath}/types/{{kebabCase name}}-field.type.ts`,
                    templateFile: 'templates/shared-dtos/field-type.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${sharedPath}/request/{{kebabCase name}}-translation.dto.ts`,
                        templateFile: 'templates/shared-dtos/translation-dto.hbs',
                    },
                    {
                        type: 'add',
                        path: `${sharedPath}/response/{{kebabCase name}}-translation.response.ts`,
                        templateFile: 'templates/shared-dtos/translation-response.hbs',
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

            // actions.push(function (answers) {
            //     return {
            //         type: 'prettier',
            //         pattern: `src/modules/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
            //     };
            // });

            // actions.push(function (answers) {
            //     return {
            //         type: 'prettier',
            //         pattern: `../../packages/shared/src/dtos/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
            //     };
            // });

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

            let schemaData = null;

            if (data.schemaFile && data.schemaFile.trim() !== '' && data.schemaFile !== 'none') {
                try {
                    let schemaDefinition;

                    if (data.schemaFile.includes(':')) {
                        console.log('📝 Parsing inline fields...');
                        schemaDefinition = parseInlineFields(data.schemaFile);
                    } else {
                        console.log('📂 Reading schema file...');
                        const schemaPath = path.resolve(process.cwd(), data.schemaFile);
                        schemaDefinition = readSchemaFile(schemaPath);
                    }

                    schemaData = prepareTemplateData(schemaDefinition, data.name, isTranslatable);

                    if (schemaData.enums && schemaData.enums.length > 0) {
                        console.log('🎨 Generating enums...');
                        schemaData.enums.forEach((enumData) => {
                            const enumPath = path.resolve(
                                process.cwd(),
                                `../../packages/shared/src/enums/${plop.getHelper('kebabCase')(enumData.name)}.enum.ts`,
                            );
                            generateEnumFile(enumData, enumPath);

                            // Add enum export to index.ts
                            actions.push({
                                type: 'modify',
                                path: '../../packages/shared/src/enums/index.ts',
                                pattern: /(export \* from '\.\/currency\.enum';)/,
                                template: `$1\nexport * from './${plop.getHelper('kebabCase')(enumData.name)}.enum';`,
                            });
                        });
                    }

                    if (schemaData.relations && schemaData.relations.length > 0) {
                        console.log(
                            '🔗 Found relations:',
                            schemaData.relations.map((r) => r.name).join(', '),
                        );
                    }

                    if (schemaData.foreignKeys && schemaData.foreignKeys.length > 0) {
                        console.log(
                            '🔑 Found foreign keys:',
                            schemaData.foreignKeys.map((fk) => fk.name).join(', '),
                        );
                    }
                } catch (error) {
                    console.warn(`⚠️  Warning: Could not read schema file: ${error.message}`);
                    console.warn('Generating entity with TODO comments instead.');
                }
            }

            actions.push(
                {
                    type: 'add',
                    path: `${modulePath}/domain/entities/{{kebabCase name}}.entity.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/entity.translatable.hbs'
                        : 'templates/entity/entity.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/domain/repositories/i-{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/repository.interface.translatable.hbs'
                        : 'templates/entity/repository.interface.hbs',
                    data: schemaData || {},
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/repositories/{{kebabCase name}}.repository.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/repository.translatable.hbs'
                        : 'templates/entity/repository.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}.schema.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/schema.translatable.hbs'
                        : 'templates/entity/schema.hbs',
                    data: { ...(schemaData || {}), fields: schemaData?.fields },
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/controllers/{{kebabCase name}}.controller.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/controller.translatable.hbs'
                        : 'templates/entity/controller.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/create-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/create-handler.translatable.hbs'
                        : 'templates/entity/create-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/update-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/update-handler.translatable.hbs'
                        : 'templates/entity/update-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/commands/delete-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/delete-handler.translatable.hbs'
                        : 'templates/entity/delete-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-{{kebabCase name}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/get-handler.translatable.hbs'
                        : 'templates/entity/get-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler.ts`,
                    templateFile: isTranslatable
                        ? 'templates/entity/paginate-handler.translatable.hbs'
                        : 'templates/entity/paginate-handler.hbs',
                },
                {
                    type: 'add',
                    path: `${modulePath}/infrastructure/cache/{{kebabCase name}}.cache-keys.ts`,
                    templateFile: 'templates/entity/cache-keys.hbs',
                },
            );

            if (isTranslatable) {
                actions.push(
                    {
                        type: 'add',
                        path: `${modulePath}/domain/entities/{{kebabCase name}}-translation.entity.ts`,
                        templateFile: 'templates/entity/translation-entity.hbs',
                    },
                    {
                        type: 'add',
                        path: `${modulePath}/infrastructure/schemas/{{kebabCase name}}-translation.schema.ts`,
                        templateFile: 'templates/entity/translation-schema.hbs',
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
                    '$1        {\n            provide: {{constantCase name}}_REPOSITORY,\n            useClass: {{pascalCase name}}RepositoryImpl,\n        },\n        Create{{pascalCase name}}Handler,\n        Update{{pascalCase name}}Handler,\n        Delete{{pascalCase name}}Handler,\n        Get{{pascalCase name}}ByFieldHandler,\n        FindMany{{pascalCase (pluralize name)}}Handler,\n        GetPaginated{{pascalCase (pluralize name)}}Handler,\n$2',
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
                    "import { Get{{pascalCase name}}ByFieldHandler } from './application/queries/get-{{kebabCase name}}-by-field.handler';\n" +
                    "import { FindMany{{pascalCase (pluralize name)}}Handler } from './application/queries/find-many-{{pluralize (kebabCase name)}}.handler';\n" +
                    "import { GetPaginated{{pascalCase (pluralize name)}}Handler } from './application/queries/get-paginated-{{pluralize (kebabCase name)}}.handler';\n",
            });

            // Generate DTOs in shared package for entity generator
            const sharedPathEntity = `../../packages/shared/src/dtos/{{kebabCase name}}`;

            // Templates consolidados que manejan ambos casos (con/sin fields)
            const createRequestTemplateEntity = isTranslatable
                ? 'templates/shared-dtos/create-request-translatable.hbs'
                : 'templates/shared-dtos/create-request.hbs';

            const updateRequestTemplateEntity = isTranslatable
                ? 'templates/shared-dtos/update-request-translatable.hbs'
                : 'templates/shared-dtos/update-request.hbs';

            const responseTemplateEntity = isTranslatable
                ? 'templates/shared-dtos/response-translatable.hbs'
                : 'templates/shared-dtos/response.hbs';

            const fieldTypeTemplateEntity = 'templates/shared-dtos/field-type.hbs';

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
                    templateFile: 'templates/shared-dtos/paginate-request.hbs',
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
                    templateFile: 'templates/shared-dtos/paginated-response.hbs',
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
                        templateFile: 'templates/shared-dtos/translation-dto.hbs',
                    },
                    {
                        type: 'add',
                        path: `${sharedPathEntity}/response/{{kebabCase name}}-translation.response.ts`,
                        templateFile: 'templates/shared-dtos/translation-response.hbs',
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

            // actions.push(function (answers) {
            //     return {
            //         type: 'prettier',
            //         pattern: `src/modules/${plop.getHelper('kebabCase')(answers.module)}/**/*.ts`,
            //     };
            // });

            // actions.push(function (answers) {
            //     return {
            //         type: 'prettier',
            //         pattern: `../../packages/shared/src/dtos/${plop.getHelper('kebabCase')(answers.name)}/**/*.ts`,
            //     };
            // });

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
                templateFile: `templates/handler/${data.type}.hbs`,
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
                templateFile: `templates/service/${data.layer}.hbs`,
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

            return actions;
        },
    });
};
