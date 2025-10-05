const fs = require('fs');
const path = require('path');

/**
 * Parsea un campo de schema de Drizzle y extrae información útil
 * Ejemplo: "varchar('name', { length: 255 }).notNull()"
 * -> { name: 'name', drizzleType: 'varchar', tsType: 'string', required: true, maxLength: 255 }
 */
function parseField(fieldName, fieldDefinition) {
    const field = {
        name: fieldName,
        drizzleType: null,
        drizzleDefinition: fieldDefinition, // Guardar la definición completa
        tsType: 'any',
        required: false,
        unique: false,
        maxLength: null,
        minLength: null,
        isEmail: false,
        isUUID: false,
        isDate: false,
        default: null,
    };

    // Extraer tipo de Drizzle
    const typeMatch = fieldDefinition.match(
        /^(varchar|text|char|integer|smallint|bigint|serial|decimal|numeric|real|double|boolean|timestamp|date|time|uuid|json|jsonb)\(/,
    );
    if (typeMatch) {
        field.drizzleType = typeMatch[1];
    }

    // Mapear tipo de Drizzle a TypeScript
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

    // Extraer longitud máxima para varchar
    const lengthMatch = fieldDefinition.match(/length:\s*(\d+)/);
    if (lengthMatch) {
        field.maxLength = parseInt(lengthMatch[1]);
    }

    // Detectar si es requerido
    field.required = fieldDefinition.includes('.notNull()');

    // Detectar si es único
    field.unique = fieldDefinition.includes('.unique()');

    // Detectar si es UUID
    field.isUUID = field.drizzleType === 'uuid';

    // Detectar si es fecha
    field.isDate = ['timestamp', 'date', 'time'].includes(field.drizzleType);

    // Detectar si es email (por convención en el nombre)
    field.isEmail = fieldName.toLowerCase().includes('email');

    // Extraer valor por defecto
    const defaultMatch = fieldDefinition.match(/\.default\(([^)]+)\)/);
    if (defaultMatch) {
        field.default = defaultMatch[1];
    }

    return field;
}

/**
 * Parsea un objeto de schema de Drizzle
 */
function parseSchema(schemaDefinition) {
    const fields = [];
    const imports = new Set(['pgTable', 'timestamp', 'uuid']);

    // El schema viene como un objeto donde cada key es el nombre del campo
    // y el value es la definición de Drizzle como string
    for (const [fieldName, fieldDef] of Object.entries(schemaDefinition)) {
        // Ignorar campos base (id, createdAt, updatedAt) si ya están
        if (['id', 'createdAt', 'updatedAt'].includes(fieldName)) {
            continue;
        }

        const field = parseField(fieldName, fieldDef);
        fields.push(field);

        // Agregar import necesario para el tipo de Drizzle
        if (field.drizzleType) {
            imports.add(field.drizzleType);
        }
    }

    return {
        fields,
        imports: Array.from(imports).sort(),
    };
}

/**
 * Genera validadores de class-validator basados en el campo
 */
function generateValidators(field, isUpdate = false) {
    const validators = [];

    // Tipo base
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

    // Validadores especiales
    if (field.isEmail) {
        validators.push(`@IsEmail({}, { message: 'Invalid email format' })`);
    }

    if (field.isUUID) {
        validators.push(`@IsUUID('4', { message: 'Invalid UUID format' })`);
    }

    // Required o Optional
    if (field.required && !isUpdate) {
        validators.push(`@IsNotEmpty({ message: '${field.name} cannot be empty' })`);
    } else {
        validators.push('@IsOptional()');
    }

    // Longitud
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

/**
 * Lee un archivo de schema y lo parsea
 */
function readSchemaFile(filePath) {
    const absolutePath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Schema file not found: ${absolutePath}`);
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');

    try {
        // Intentar como JSON primero
        return JSON.parse(content);
    } catch (e) {
        // Si falla, intentar como módulo JS
        try {
            delete require.cache[require.resolve(absolutePath)];
            return require(absolutePath);
        } catch (err) {
            throw new Error(`Failed to parse schema file: ${err.message}`);
        }
    }
}

/**
 * Prepara los datos para los templates de Plop
 */
function prepareTemplateData(schemaDefinition, name, translatable = false) {
    const result = parseSchema(schemaDefinition);

    // Añadir validadores a cada campo
    const fieldsWithValidators = result.fields.map((field) => ({
        ...field,
        validators: generateValidators(field, false),
        validatorsUpdate: generateValidators(field, true),
    }));

    return {
        name,
        translatable,
        fields: fieldsWithValidators,
        imports: result.imports,
    };
}

module.exports = {
    parseField,
    parseSchema,
    generateValidators,
    readSchemaFile,
    prepareTemplateData,
};
