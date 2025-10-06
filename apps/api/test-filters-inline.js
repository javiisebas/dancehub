const { spawn } = require('child_process');

const commands = `
const danceStyleRepo = get('DANCE_STYLE_REPOSITORY');
const FilterOperator = require('@repo/shared').FilterOperator;
const SortOrder = require('@repo/shared').SortOrder;

// Test 1: Filtrar por translation.name
console.log('Test 1: Filtrar por translation.name');
const r1 = await danceStyleRepo.findMany({ filter: { field: 'translation.name', operator: 'ilike', value: '%sal%' }, locale: 'es', limit: 3 });
console.log('Resultados:', r1.map(x => ({ slug: x.slug, name: x.translation?.name })));

// Test 2: Ordenar por translation.name
console.log('\\nTest 2: Ordenar por translation.name');
const r2 = await danceStyleRepo.findMany({ sort: { field: 'translation.name', order: 'desc' }, locale: 'en', limit: 3 });
console.log('Resultados:', r2.map(x => ({ slug: x.slug, name: x.translation?.name })));

process.exit(0);
`.trim();

const repl = spawn('pnpm', ['run', 'repl'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'inherit', 'inherit']
});

// Wait a bit for REPL to start
setTimeout(() => {
  repl.stdin.write(commands + '\\n');
}, 3000);

repl.on('exit', () => process.exit(0));
