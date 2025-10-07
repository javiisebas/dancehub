const fs = require('fs');
const path = require('path');

function parseField(fieldName, fieldDefinition) {
    const field = {
        name: fieldName,
        drizzleType: null,
        drizzleDefinition: fieldDefinition,
        tsType: 'any',
        required: false,
        unique: false,
        maxLength: null,
        minLength: null,
        isEmail: false,
        isUUID: false,
        isDate: false,
        isEnum: false,
        enumName: null,
        enumValues: [],
        default: null,
        isForeignKey: false,
    };

    const typeMatch = fieldDefinition.match(
        /^(varchar|text|char|integer|smallint|bigint|serial|decimal|numeric|real|double|boolean|timestamp|date|time|uuid|json|jsonb)\(/,
    );
    if (typeMatch) {
        field.drizzleType = typeMatch[1];
    }

    const typeMapping = {
        varchar: 'string',
        text: 'string',
        char: 'string',
        integer: 'number',
        smallint: 'number',
        bigint: 'number',
        serial: 'number',
        decimal: 'number',
        numeric: 'number',
        real: 'number',
        double: 'number',
        boolean: 'boolean',
        timestamp: 'Date',
        date: 'Date',
        time: 'Date',
        uuid: 'string',
        json: 'any',
        jsonb: 'any',
    };
    field.tsType = typeMapping[field.drizzleType] || 'any';

    const lengthMatch = fieldDefinition.match(/length:\s*(\d+)/);
    if (lengthMatch) {
        field.maxLength = parseInt(lengthMatch[1]);
    }

    field.required = fieldDefinition.includes('.notNull()');
    field.unique = fieldDefinition.includes('.unique()');
    field.isUUID = field.drizzleType === 'uuid';
    field.isDate = ['timestamp', 'date', 'time'].includes(field.drizzleType);
    field.isEmail = fieldName.toLowerCase().includes('email');
    field.isForeignKey = fieldDefinition.includes('.references(');

    const defaultMatch = fieldDefinition.match(/\.default\(([^)]+)\)/);
    if (defaultMatch) {
        field.default = defaultMatch[1];
    }

    return field;
}

function parseRelation(relationName, relationDef) {
    const relation = {
        name: relationName,
        type: null,
        entity: null,
        table: null,
        foreignKey: null,
        references: null,
        through: null,
    };

    if (typeof relationDef === 'string') {
        const oneToOneMatch = relationDef.match(/oneToOne\((\w+),\s*'(\w+)'\)/);
        const oneToManyMatch = relationDef.match(/oneToMany\((\w+),\s*'(\w+)'\)/);
        const manyToOneMatch = relationDef.match(/manyToOne\((\w+),\s*'(\w+)'\)/);
        const manyToManyMatch = relationDef.match(/manyToMany\((\w+),\s*(\w+)\)/);

        if (oneToOneMatch) {
            relation.type = 'oneToOne';
            relation.entity = oneToOneMatch[1];
            relation.foreignKey = oneToOneMatch[2];
        } else if (oneToManyMatch) {
            relation.type = 'oneToMany';
            relation.entity = oneToManyMatch[1];
            relation.references = oneToManyMatch[2];
        } else if (manyToOneMatch) {
            relation.type = 'manyToOne';
            relation.entity = manyToOneMatch[1];
            relation.foreignKey = manyToOneMatch[2];
        } else if (manyToManyMatch) {
            relation.type = 'manyToMany';
            relation.entity = manyToManyMatch[1];
            relation.through = manyToManyMatch[2];
        }
    } else if (typeof relationDef === 'object') {
        relation.type = relationDef.type;
        relation.entity = relationDef.entity;
        relation.table = relationDef.table;
        relation.foreignKey = relationDef.foreignKey;
        relation.references = relationDef.references;
        relation.through = relationDef.through;
    }

    return relation;
}

function parseEnum(enumDef) {
    const enumData = {
        name: null,
        values: [],
        description: null,
    };

    if (typeof enumDef === 'object' && enumDef.name && enumDef.values) {
        enumData.name = enumDef.name;
        enumData.values = Array.isArray(enumDef.values) ? enumDef.values : [];
        enumData.description = enumDef.description || null;
    } else if (typeof enumDef === 'string') {
        const match = enumDef.match(/pgEnum\('(\w+)',\s*\[([^\]]+)\]\)/);
        if (match) {
            enumData.name = match[1];
            enumData.values = match[2].split(',').map((v) => v.trim().replace(/['"]/g, ''));
        }
    }

    return enumData;
}

function parseForeignKey(fkDef) {
    const foreignKey = {
        name: null,
        refTable: null,
        refColumn: 'id',
        onDelete: 'cascade',
        onUpdate: 'cascade',
    };

    if (typeof fkDef === 'object') {
        foreignKey.name = fkDef.name;
        foreignKey.refTable = fkDef.refTable;
        foreignKey.refColumn = fkDef.refColumn || 'id';
        foreignKey.onDelete = fkDef.onDelete || 'cascade';
        foreignKey.onUpdate = fkDef.onUpdate || 'cascade';
    }

    return foreignKey;
}

function parseSchema(schemaDefinition) {
    const fields = [];
    const imports = new Set(['pgTable', 'timestamp', 'uuid']);
    const relations = [];
    const enums = [];
    const foreignKeys = [];

    for (const [key, value] of Object.entries(schemaDefinition)) {
        if (['id', 'createdAt', 'updatedAt'].includes(key)) {
            continue;
        }

        if (typeof value === 'string') {
            const field = parseField(key, value);
            fields.push(field);

            if (field.drizzleType) {
                imports.add(field.drizzleType);
            }

            if (field.isForeignKey) {
                const fkMatch = value.match(/references\(\(\)\s*=>\s*(\w+)\.(\w+)/);
                if (fkMatch) {
                    foreignKeys.push({
                        name: key,
                        refTable: fkMatch[1],
                        refColumn: fkMatch[2],
                        onDelete: value.includes('onDelete:')
                            ? value.match(/onDelete:\s*'(\w+)'/)[1]
                            : 'cascade',
                    });
                }
            }
        }
    }

    return {
        fields,
        imports: Array.from(imports).sort(),
        relations,
        enums,
        foreignKeys,
    };
}

function parseSchemaEnhanced(schemaDefinition) {
    const result = {
        fields: [],
        relations: [],
        enums: [],
        foreignKeys: [],
        imports: new Set(['pgTable', 'timestamp', 'uuid']),
    };

    if (schemaDefinition.fields) {
        for (const [fieldName, fieldDef] of Object.entries(schemaDefinition.fields)) {
            if (['id', 'createdAt', 'updatedAt'].includes(fieldName)) {
                continue;
            }

            const field = parseField(fieldName, fieldDef);
            result.fields.push(field);

            if (field.drizzleType) {
                result.imports.add(field.drizzleType);
            }
        }
    }

    if (schemaDefinition.relations) {
        for (const [relationName, relationDef] of Object.entries(schemaDefinition.relations)) {
            const relation = parseRelation(relationName, relationDef);
            if (relation.type) {
                result.relations.push(relation);
            }
        }
    }

    if (schemaDefinition.enums) {
        if (Array.isArray(schemaDefinition.enums)) {
            schemaDefinition.enums.forEach((enumDef) => {
                const parsedEnum = parseEnum(enumDef);
                if (parsedEnum.name && parsedEnum.values.length > 0) {
                    result.enums.push(parsedEnum);
                }
            });
        } else {
            for (const [enumName, enumDef] of Object.entries(schemaDefinition.enums)) {
                const parsedEnum = parseEnum({ name: enumName, ...enumDef });
                if (parsedEnum.values.length > 0) {
                    result.enums.push(parsedEnum);
                }
            }
        }
    }

    if (schemaDefinition.foreignKeys) {
        if (Array.isArray(schemaDefinition.foreignKeys)) {
            schemaDefinition.foreignKeys.forEach((fkDef) => {
                const foreignKey = parseForeignKey(fkDef);
                if (foreignKey.name && foreignKey.refTable) {
                    result.foreignKeys.push(foreignKey);
                }
            });
        }
    }

    return {
        ...result,
        imports: Array.from(result.imports).sort(),
    };
}

function generateValidators(field, isUpdate = false) {
    const validators = [];

    if (field.tsType === 'string') {
        validators.push(`@IsString({ message: '${field.name} must be a string' })`);
    } else if (field.tsType === 'number') {
        if (
            field.drizzleType === 'integer' ||
            field.drizzleType === 'smallint' ||
            field.drizzleType === 'bigint'
        ) {
            validators.push(`@IsInt({ message: '${field.name} must be an integer' })`);
        } else {
            validators.push(`@IsNumber({}, { message: '${field.name} must be a number' })`);
        }
    } else if (field.tsType === 'boolean') {
        validators.push(`@IsBoolean({ message: '${field.name} must be a boolean' })`);
    } else if (field.tsType === 'Date') {
        validators.push(`@IsDate({ message: '${field.name} must be a date' })`);
    }

    if (field.isEmail) {
        validators.push(`@IsEmail({}, { message: 'Invalid email format' })`);
    }

    if (field.isUUID) {
        validators.push(`@IsUUID('4', { message: 'Invalid UUID format' })`);
    }

    if (field.isEnum && field.enumName) {
        validators.push(`@IsEnum(${field.enumName}, { message: 'Invalid ${field.name} value' })`);
    }

    if (field.required && !isUpdate) {
        validators.push(`@IsNotEmpty({ message: '${field.name} cannot be empty' })`);
    } else {
        validators.push('@IsOptional()');
    }

    if (field.maxLength) {
        validators.push(
            `@MaxLength(${field.maxLength}, { message: '${field.name} cannot exceed ${field.maxLength} characters' })`,
        );
    }

    if (field.minLength) {
        validators.push(
            `@MinLength(${field.minLength}, { message: '${field.name} must be at least ${field.minLength} characters long' })`,
        );
    }

    return validators;
}

function readSchemaFile(filePath) {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Schema file not found: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');

    try {
        return JSON.parse(content);
    } catch (e) {
        try {
            delete require.cache[require.resolve(absolutePath)];
            return require(absolutePath);
        } catch (err) {
            throw new Error(`Failed to parse schema file: ${err.message}`);
        }
    }
}

function prepareTemplateData(schemaDefinition, name, translatable = false) {
    let result;

    if (schemaDefinition.fields || schemaDefinition.relations || schemaDefinition.enums) {
        result = parseSchemaEnhanced(schemaDefinition);
    } else {
        result = parseSchema(schemaDefinition);
    }

    const fieldsWithValidators = result.fields.map((field) => ({
        ...field,
        validators: generateValidators(field, false),
        validatorsUpdate: generateValidators(field, true),
    }));

    return {
        name,
        translatable,
        fields: fieldsWithValidators,
        relations: result.relations || [],
        enums: result.enums || [],
        foreignKeys: result.foreignKeys || [],
        imports: result.imports,
    };
}

function generateEnumFile(enumData, targetPath) {
    const pascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const content = `export enum ${pascalCase(enumData.name)} {
${enumData.values.map((v) => `    ${v.toUpperCase()} = '${v}',`).join('\n')}
}
`;

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf-8');

    console.log(`✅ Enum ${pascalCase(enumData.name)} created at ${targetPath}`);
}

module.exports = {
    parseField,
    parseSchema,
    parseSchemaEnhanced,
    parseRelation,
    parseEnum,
    parseForeignKey,
    generateValidators,
    readSchemaFile,
    prepareTemplateData,
    generateEnumFile,
};
