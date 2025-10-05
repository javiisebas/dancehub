import { TypedConfigService } from '@api/modules/core/config/config.service';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../../user/infrastructure/schemas/user.schema';
import * as schema from './schema';

async function seed() {
    console.log('🌱 Seeding database...');

    const config = new TypedConfigService();
    const databaseUrl = config.get('database.url') || buildDatabaseUrl(config);

    const client = postgres(databaseUrl);
    const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

    try {
        await db.delete(users);

        const testUsers = [
            {
                email: 'john.doe@gmail.com',
                name: 'John Doe',
                password: 'hashedPassword1',
            },
            {
                email: 'jane.smith@yahoo.com',
                name: 'Jane Smith',
                password: 'hashedPassword2',
            },
            {
                email: 'alice.wonder@gmail.com',
                name: 'Alice Wonder',
                password: 'hashedPassword3',
            },
            {
                email: 'bob.builder@example.com',
                name: 'Bob Builder',
                password: 'hashedPassword4',
            },
            {
                email: 'charlie.brown@gmail.com',
                name: 'Charlie Brown',
                password: null,
            },
            {
                email: 'david.lee@yahoo.com',
                name: 'David Lee',
                password: 'hashedPassword6',
            },
            {
                email: 'emma.watson@example.com',
                name: 'Emma Watson',
                password: 'hashedPassword7',
            },
            {
                email: 'frank.ocean@gmail.com',
                name: 'Frank Ocean',
                password: null,
            },
            {
                email: 'grace.hopper@example.com',
                name: 'Grace Hopper',
                password: 'hashedPassword9',
            },
            {
                email: 'henry.ford@yahoo.com',
                name: 'Henry Ford',
                password: 'hashedPassword10',
            },
            {
                email: 'isabel.allende@gmail.com',
                name: 'Isabel Allende',
                password: 'hashedPassword11',
            },
            {
                email: 'jack.sparrow@example.com',
                name: 'Jack Sparrow',
                password: null,
            },
            {
                email: 'karen.nguyen@gmail.com',
                name: 'Karen Nguyen',
                password: 'hashedPassword13',
            },
            {
                email: 'luis.garcia@yahoo.com',
                name: 'Luis Garcia',
                password: 'hashedPassword14',
            },
            {
                email: 'maria.rodriguez@example.com',
                name: 'Maria Rodriguez',
                password: 'hashedPassword15',
            },
        ];

        await db.insert(users).values(testUsers);

        console.log(`✅ Seeded ${testUsers.length} users successfully`);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await client.end();
    }
}

function buildDatabaseUrl(config: TypedConfigService): string {
    const host = config.get('database.host') || 'localhost';
    const port = config.get('database.port') || 5432;
    const username = config.get('database.username') || 'dancehub';
    const password = config.get('database.password') || 'dancehub123';
    const database = config.get('database.name') || 'dancehub';

    return `postgresql://${username}:${password}@${host}:${port}/${database}`;
}

seed()
    .then(() => {
        console.log('🎉 Seeding completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
