#!/usr/bin/env node

const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
Usage: pnpm generate <generator> [options]

Generators:
  module            Generate a new module with complete CQRS structure
  module-container  Generate an empty container module (for multiple entities)
  entity            Generate a new entity within an existing module
  handler           Generate a new command or query handler
  service           Generate a new domain or application service

Module Options:
  --name <name>           Module name (required, kebab-case)
  --translatable          Make it translatable (default: false)

Container Module Options:
  --name <name>           Container module name (required, kebab-case)

Entity Options:
  --module <module>       Module name (required, kebab-case)
  --name <name>           Entity name (required, kebab-case)
  --translatable          Make it translatable (default: false)

Handler Options:
  --module <module>       Module name (required, kebab-case)
  --type <type>           Handler type: command|query (required)
  --name <name>           Handler name (required, kebab-case)

Service Options:
  --module <module>       Module name (required, kebab-case)
  --layer <layer>         Service layer: domain|application (required)
  --name <name>           Service name (required, kebab-case)

Examples:
  pnpm generate module --name venue --translatable
  pnpm generate module-container --name geography
  pnpm generate entity --module geography --name country
  pnpm generate entity --module geography --name city
  pnpm generate handler --module user --type command --name verify-email
  pnpm generate service --module user --layer domain --name password-hasher
    `);
    process.exit(0);
}

const generator = args[0];
const validGenerators = ['module', 'module-container', 'entity', 'handler', 'service'];

if (!validGenerators.includes(generator)) {
    console.error(`Invalid generator: ${generator}`);
    console.error(`Valid generators: ${validGenerators.join(', ')}`);
    process.exit(1);
}

const options = {};

for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
        const key = args[i].substring(2);
        if (key === 'translatable') {
            options[key] = true;
        } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
            options[key] = args[i + 1];
            i++;
        }
    }
}

const plopArgs = [generator];

if (generator === 'module') {
    plopArgs.push(options.name || '');
    plopArgs.push(options.translatable ? 'true' : 'false');
    plopArgs.push(options.fields || options.schemaFile || '');
} else if (generator === 'module-container') {
    plopArgs.push(options.name || '');
} else if (generator === 'entity') {
    plopArgs.push(options.module || '');
    plopArgs.push(options.name || '');
    plopArgs.push(options.translatable ? 'true' : 'false');
    plopArgs.push(options.fields || options.schemaFile || '');
} else if (generator === 'handler') {
    plopArgs.push(options.module || '');
    plopArgs.push(options.type || '');
    plopArgs.push(options.name || '');
} else if (generator === 'service') {
    plopArgs.push(options.module || '');
    plopArgs.push(options.layer || '');
    plopArgs.push(options.name || '');
}

try {
    execSync(`plop ${plopArgs.join(' ')}`, {
        stdio: 'inherit',
        cwd: process.cwd(),
    });
} catch (error) {
    process.exit(1);
}
