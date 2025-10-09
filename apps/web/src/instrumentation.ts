export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('reflect-metadata');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        await import('reflect-metadata');
    }
}
