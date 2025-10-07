#!/usr/bin/env node

const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
🚀 DanceHub Code Generator CLI

Usage: pnpm generate <generator> [options]

Generators:
  module            Generate a complete module with CQRS structure
  module-container  Generate an empty container module (for multiple entities)
  entity            Generate a new entity within an existing module
  handler           Generate a new command or query handler
  service           Generate a new domain or application service

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Module Options:
  --name <name>           Module name (required, kebab-case)
  --translatable          Make it translatable (default: false)
  --schema <path>         Path to schema definition file (JSON/JS)
  --fields <inline>       Inline field definitions (alternative to --schema)

  Example schema file (JSON):
  {
    "fields": {
      "name": "varchar('name', { length: 255 }).notNull()",
      "email": "varchar('email', { length: 255 }).notNull().unique()",
      "age": "integer('age')",
      "bio": "text('bio')"
    },
    "relations": {
      "posts": { "type": "oneToMany", "entity": "Post", "table": "posts", "foreignKey": "authorId" }
    },
    "enums": [
      { "name": "UserRole", "values": ["admin", "user", "guest"] }
    ],
    "foreignKeys": [
      { "name": "companyId", "refTable": "companies", "onDelete": "cascade" }
    ]
  }

  Inline fields example:
  --fields "name:varchar(255):required,email:varchar(255):required:unique,age:integer"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Container Module Options:
  --name <name>           Container module name (required, kebab-case)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Entity Options:
  --module <module>       Parent module name (required, kebab-case)
  --name <name>           Entity name (required, kebab-case)
  --translatable          Make it translatable (default: false)
  --schema <path>         Path to schema definition file (JSON/JS)
  --fields <inline>       Inline field definitions (alternative to --schema)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ Handler Options:
  --module <module>       Module name (required, kebab-case)
  --type <type>           Handler type: command|query (required)
  --name <name>           Handler name (required, kebab-case)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️  Service Options:
  --module <module>       Module name (required, kebab-case)
  --layer <layer>         Service layer: domain|application (required)
  --name <name>           Service name (required, kebab-case)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Examples:

  # Simple module (no translatable, no fields)
  pnpm generate module --name product

  # Translatable module with schema file
  pnpm generate module --name venue --translatable --schema ./venue-schema.json

  # Module with inline fields
  pnpm generate module --name order --fields "total:integer:required,status:varchar(50):required"

  # Container module for grouped entities
  pnpm generate module-container --name geography

  # Entity within existing module
  pnpm generate entity --module geography --name country --schema ./country-schema.json

  # Custom handler
  pnpm generate handler --module user --type command --name verify-email

  # Domain service
  pnpm generate service --module user --layer domain --name password-hasher

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tips:
  - Use kebab-case for all names (e.g., dance-style, not DanceStyle)
  - Schema files can be .json or .js (must export an object)
  - Enums are automatically created in packages/shared/src/enums
  - Relations are automatically configured in the repository
  - All files follow the established architecture patterns
  - Code is auto-formatted with Prettier after generation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
    process.exit(0);
}

const generator = args[0];
const validGenerators = ['module', 'module-container', 'entity', 'handler', 'service'];

if (!validGenerators.includes(generator)) {
    console.error(`❌ Invalid generator: ${generator}`);
    console.error(`✅ Valid generators: ${validGenerators.join(', ')}`);
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
    plopArgs.push(options.schema || options.schemaFile || options.fields || '');
} else if (generator === 'module-container') {
    plopArgs.push(options.name || '');
} else if (generator === 'entity') {
    plopArgs.push(options.module || '');
    plopArgs.push(options.name || '');
    plopArgs.push(options.translatable ? 'true' : 'false');
    plopArgs.push(options.schema || options.schemaFile || options.fields || '');
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
    const plopfilePath = require('path').resolve(process.cwd(), 'scripts/cli/plopfile.js');
    console.log(`\n🚀 Generating ${generator}...\n`);

    const escapedArgs = plopArgs.map((arg) => {
        if (arg.includes(' ') || arg.includes('(') || arg.includes(')') || arg.includes(':')) {
            return `"${arg.replace(/"/g, '\\"')}"`;
        }
        return arg;
    });

    execSync(
        `npx plop --plopfile "${plopfilePath}" --dest "${process.cwd()}" ${escapedArgs.join(' ')}`,
        {
            stdio: 'inherit',
            cwd: process.cwd(),
        },
    );
    console.log(`\n✅ ${generator} generated successfully!\n`);
} catch (error) {
    console.error(`\n❌ Failed to generate ${generator}\n`);
    process.exit(1);
}
