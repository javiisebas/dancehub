import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { danceStyles } from '../src/modules/dance-style/infrastructure/schemas/dance-style.schema';
import { users } from '../src/modules/user/infrastructure/schemas/user.schema';
import { venueDanceStyles } from '../src/modules/venue/infrastructure/schemas/venue-dance-style.schema';
import { venues } from '../src/modules/venue/infrastructure/schemas/venue.schema';

async function seedVenues() {
    const pool = new Pool({
        connectionString:
            process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dancehub',
    });

    const db = drizzle(pool);

    console.log('🌱 Seeding venues...');

    try {
        const existingUsers = await db.select().from(users).limit(1);
        if (existingUsers.length === 0) {
            console.error('❌ No users found. Please seed users first.');
            return;
        }

        const user = existingUsers[0];
        console.log(`✅ Found user: ${user.email}`);

        const existingDanceStyles = await db.select().from(danceStyles);
        if (existingDanceStyles.length === 0) {
            console.error('❌ No dance styles found. Please seed dance styles first.');
            return;
        }
        console.log(`✅ Found ${existingDanceStyles.length} dance styles`);

        const existingVenue = await db
            .select()
            .from(venues)
            .where(eq(venues.slug, 'el-salon-madrid'))
            .limit(1);

        let venue1;
        if (existingVenue.length > 0) {
            console.log('⏭️  Venue "El Salón Madrid" already exists, skipping...');
            venue1 = existingVenue[0];
        } else {
            const [insertedVenue] = await db
                .insert(venues)
                .values({
                    name: 'El Salón Madrid',
                    slug: 'el-salon-madrid',
                    address: 'Calle Gran Vía 25',
                    city: 'Madrid',
                    country: 'Spain',
                    capacity: 150,
                    hasParking: true,
                    ownerId: user.id,
                })
                .returning();
            venue1 = insertedVenue;
            console.log(`✅ Created venue: ${venue1.name}`);
        }

        const salsa = existingDanceStyles.find((ds) => ds.slug === 'salsa');
        const bachata = existingDanceStyles.find((ds) => ds.slug === 'bachata');
        const kizomba = existingDanceStyles.find((ds) => ds.slug === 'kizomba');

        if (salsa) {
            const existing = await db
                .select()
                .from(venueDanceStyles)
                .where(eq(venueDanceStyles.venueId, venue1.id))
                .limit(1);

            if (existing.length === 0) {
                const danceStylesToAdd = [salsa, bachata].filter(Boolean);
                if (danceStylesToAdd.length > 0) {
                    await db.insert(venueDanceStyles).values(
                        danceStylesToAdd.map((ds) => ({
                            venueId: venue1.id,
                            danceStyleId: ds!.id,
                        })),
                    );
                    console.log(
                        `✅ Added ${danceStylesToAdd.length} dance styles to ${venue1.name}`,
                    );
                }
            } else {
                console.log('⏭️  Dance styles already linked, skipping...');
            }
        }

        const existingVenue2 = await db
            .select()
            .from(venues)
            .where(eq(venues.slug, 'barcelona-dance-club'))
            .limit(1);

        let venue2;
        if (existingVenue2.length > 0) {
            console.log('⏭️  Venue "Barcelona Dance Club" already exists, skipping...');
            venue2 = existingVenue2[0];
        } else {
            const [insertedVenue2] = await db
                .insert(venues)
                .values({
                    name: 'Barcelona Dance Club',
                    slug: 'barcelona-dance-club',
                    address: 'Passeig de Gràcia 100',
                    city: 'Barcelona',
                    country: 'Spain',
                    capacity: 200,
                    hasParking: false,
                    ownerId: user.id,
                })
                .returning();
            venue2 = insertedVenue2;
            console.log(`✅ Created venue: ${venue2.name}`);
        }

        if (bachata && kizomba) {
            const existing = await db
                .select()
                .from(venueDanceStyles)
                .where(eq(venueDanceStyles.venueId, venue2.id))
                .limit(1);

            if (existing.length === 0) {
                const danceStylesToAdd = [bachata, kizomba].filter(Boolean);
                if (danceStylesToAdd.length > 0) {
                    await db.insert(venueDanceStyles).values(
                        danceStylesToAdd.map((ds) => ({
                            venueId: venue2.id,
                            danceStyleId: ds!.id,
                        })),
                    );
                    console.log(
                        `✅ Added ${danceStylesToAdd.length} dance styles to ${venue2.name}`,
                    );
                }
            } else {
                console.log('⏭️  Dance styles already linked for Barcelona venue, skipping...');
            }
        }

        console.log('🎉 Venues seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding venues:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seedVenues();
