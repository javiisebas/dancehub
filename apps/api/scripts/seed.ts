import * as argon2 from 'argon2';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString =
    process.env.DATABASE_URL || 'postgresql://dancehub:dancehub123@localhost:5432/dancehub';

const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
    console.log('🌱 Starting database seeding...');

    const hashedPassword = await argon2.hash('Password123!');

    await db.execute(`
        INSERT INTO users (email, name, first_name, last_name, password, status, provider)
        VALUES
            ('admin@dancehub.com', 'Admin User', 'Admin', 'User', '${hashedPassword}', 'verified', 'local'),
            ('user@dancehub.com', 'Test User', 'Test', 'User', '${hashedPassword}', 'verified', 'local'),
            ('pending@dancehub.com', 'Pending User', 'Pending', 'User', '${hashedPassword}', 'pending', 'local')
        ON CONFLICT (email) DO NOTHING;
    `);

    console.log('✅ Users seeded successfully');

    await db.execute(`
        INSERT INTO dance_styles (slug)
        VALUES
            ('salsa'),
            ('bachata'),
            ('kizomba'),
            ('tango'),
            ('merengue')
        ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Dance styles seeded successfully');

    const danceStylesResult = await db.execute(`
        SELECT id, slug FROM dance_styles ORDER BY created_at;
    `);

    const danceStyles = danceStylesResult as unknown as Array<{ id: string; slug: string }>;

    for (const style of danceStyles) {
        let enName = '';
        let enDesc = '';
        let esName = '';
        let esDesc = '';

        switch (style.slug) {
            case 'salsa':
                enName = 'Salsa';
                enDesc = 'A lively Caribbean dance';
                esName = 'Salsa';
                esDesc = 'Un baile caribeño animado';
                break;
            case 'bachata':
                enName = 'Bachata';
                enDesc = 'A romantic dance from the Dominican Republic';
                esName = 'Bachata';
                esDesc = 'Un baile romántico de República Dominicana';
                break;
            case 'kizomba':
                enName = 'Kizomba';
                enDesc = 'An Angolan dance with sensual movements';
                esName = 'Kizomba';
                esDesc = 'Un baile angoleño con movimientos sensuales';
                break;
            case 'tango':
                enName = 'Tango';
                enDesc = 'An elegant Argentine dance';
                esName = 'Tango';
                esDesc = 'Un elegante baile argentino';
                break;
            case 'merengue':
                enName = 'Merengue';
                enDesc = 'A fast-paced Dominican dance';
                esName = 'Merengue';
                esDesc = 'Un baile dominicano de ritmo rápido';
                break;
        }

        await db.execute(`
            INSERT INTO dance_style_translations (dance_style_id, locale, name, description)
            VALUES
                ('${style.id}', 'en', '${enName}', '${enDesc}'),
                ('${style.id}', 'es', '${esName}', '${esDesc}')
            ON CONFLICT (dance_style_id, locale) DO NOTHING;
        `);
    }

    console.log('✅ Dance style translations seeded successfully');

    await client.end();

    console.log('🎉 Database seeding completed!');
    console.log('\n📧 Test credentials:');
    console.log('Admin: admin@dancehub.com / Password123!');
    console.log('User: user@dancehub.com / Password123!');
    console.log('Pending: pending@dancehub.com / Password123!');
}

seed()
    .catch((error) => {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    })
    .then(() => {
        process.exit(0);
    });
