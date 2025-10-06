/**
 * Test Cache Consistency
 *
 * This script tests the critical scenario:
 * 1. Fetch entity with relations
 * 2. Update relations
 * 3. Fetch entity again
 * 4. Verify data is FRESH (not cached/stale)
 */

import { NestFactory } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { AppModule } from '../src/app.module';
import { Artist } from '../src/modules/artist/domain/entities/artist.entity';
import { ArtistRepositoryImpl } from '../src/modules/artist/infrastructure/repositories/artist.repository';
import { LogService } from '../src/modules/core/logger/services/logger.service';
import { DanceStyleTranslation } from '../src/modules/dance-style/domain/entities/dance-style-translation.entity';
import { DanceStyle } from '../src/modules/dance-style/domain/entities/dance-style.entity';
import { DanceStyleRepositoryImpl } from '../src/modules/dance-style/infrastructure/repositories/dance-style.repository';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
    totalTests++;
    if (condition) {
        console.log(`${GREEN}✅ PASSED${RESET}: ${testName}`);
        passedTests++;
    } else {
        console.log(`${RED}❌ FAILED${RESET}: ${testName}`);
        if (details) {
            console.log(`   ${RED}${details}${RESET}`);
        }
        failedTests++;
    }
}

function log(message: string, color: string = BLUE) {
    console.log(`${color}${message}${RESET}`);
}

function section(title: string) {
    console.log('\n' + '='.repeat(60));
    log(title, BLUE);
    console.log('='.repeat(60) + '\n');
}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
    });

    const artistRepo = app.get(ArtistRepositoryImpl);
    const danceStyleRepo = app.get(DanceStyleRepositoryImpl);
    const logger = app.get(LogService);

    log('🔍 CACHE CONSISTENCY TESTS', BLUE);
    log('Testing: No stale data after updates\n', BLUE);

    try {
        // ==============================================
        // SCENARIO 1: Artist with Albums (One-to-Many)
        // ==============================================
        section('SCENARIO 1: Artist with Albums (One-to-Many)');

        log('Step 1: Creating artist...', YELLOW);
        const artist = new Artist(
            undefined as any,
            'Test Artist for Cache',
            'US',
            'Testing cache consistency',
            new Date(),
            new Date(),
        );
        const savedArtist = await artistRepo.save(artist);
        log(`Created artist with ID: ${savedArtist.id}`, GREEN);

        log('\nStep 2: Fetching artist with albums (should be empty)...', YELLOW);
        const artistWithAlbums1 = (await artistRepo.findById(savedArtist.id, {
            with: ['albums'],
        })) as any;
        const albumsCount1 = artistWithAlbums1.albums?.length || 0;
        log(`Albums count (initial): ${albumsCount1}`, GREEN);

        assert(
            albumsCount1 === 0,
            'Artist albums initially empty',
            `Expected 0, got ${albumsCount1}`,
        );

        log('\nStep 3: Adding 2 albums to artist...', YELLOW);
        // Since we don't have an AlbumRepository in the module, we'll simulate this by
        // directly inserting into the database
        const db = (artistRepo as any).databaseService.db;
        const { albums } = await import(
            '../src/modules/artist/infrastructure/schemas/album.schema'
        );

        const album1 = await db
            .insert(albums)
            .values({
                title: 'First Album',
                artistId: savedArtist.id,
                releaseDate: new Date('2024-01-01'),
                genre: 'Rock',
            })
            .returning();

        const album2 = await db
            .insert(albums)
            .values({
                title: 'Second Album',
                artistId: savedArtist.id,
                releaseDate: new Date('2024-06-01'),
                genre: 'Pop',
            })
            .returning();

        log(`Created albums with IDs: ${album1[0].id}, ${album2[0].id}`, GREEN);

        log('\nStep 4: Fetching artist again (albums should appear)...', YELLOW);
        const artistWithAlbums2 = (await artistRepo.findById(savedArtist.id, {
            with: ['albums'],
        })) as any;
        const albumsCount2 = artistWithAlbums2.albums?.length || 0;
        log(`Albums count (after adding): ${albumsCount2}`, GREEN);

        assert(
            albumsCount2 === 2,
            'Artist albums appear immediately (NO STALE CACHE)',
            `Expected 2, got ${albumsCount2}`,
        );

        log('\nStep 5: Adding third album...', YELLOW);
        const album3 = await db
            .insert(albums)
            .values({
                title: 'Third Album',
                artistId: savedArtist.id,
                releaseDate: new Date('2024-12-01'),
                genre: 'Jazz',
            })
            .returning();
        log(`Created album with ID: ${album3[0].id}`, GREEN);

        log('\nStep 6: Fetching artist again (should have 3 albums)...', YELLOW);
        const artistWithAlbums3 = (await artistRepo.findById(savedArtist.id, {
            with: ['albums'],
        })) as any;
        const albumsCount3 = artistWithAlbums3.albums?.length || 0;
        log(`Albums count (after adding third): ${albumsCount3}`, GREEN);

        assert(
            albumsCount3 === 3,
            'Third album appears immediately (NO STALE CACHE)',
            `Expected 3, got ${albumsCount3}`,
        );

        log('\nStep 7: Updating second album title...', YELLOW);
        await db
            .update(albums)
            .set({ title: 'Updated Second Album' })
            .where((albums as any).id === album2[0].id);
        log('Album updated', GREEN);

        log('\nStep 8: Fetching artist and checking album title...', YELLOW);
        const artistWithAlbums4 = (await artistRepo.findById(savedArtist.id, {
            with: ['albums'],
        })) as any;
        const album2Updated = artistWithAlbums4.albums?.find((a: any) => a.id === album2[0].id);
        const album2Title = album2Updated?.title || '';
        log(`Album 2 title: ${album2Title}`, GREEN);

        assert(
            album2Title === 'Updated Second Album',
            'Album update appears immediately (NO STALE CACHE)',
            `Expected "Updated Second Album", got "${album2Title}"`,
        );

        log('\nStep 9: Deleting first album...', YELLOW);
        await db.delete(albums).where((albums as any).id === album1[0].id);
        log('Album deleted', GREEN);

        log('\nStep 10: Fetching artist (should have 2 albums now)...', YELLOW);
        const artistWithAlbums5 = (await artistRepo.findById(savedArtist.id, {
            with: ['albums'],
        })) as any;
        const albumsCount4 = artistWithAlbums5.albums?.length || 0;
        log(`Albums count (after deletion): ${albumsCount4}`, GREEN);

        assert(
            albumsCount4 === 2,
            'Album deletion appears immediately (NO STALE CACHE)',
            `Expected 2, got ${albumsCount4}`,
        );

        // ==============================================
        // SCENARIO 2: DanceStyle with Translations
        // ==============================================
        section('SCENARIO 2: DanceStyle with Translations');

        log('Step 1: Creating dance style...', YELLOW);
        const danceStyle = new DanceStyle(
            undefined as any,
            'test-cache-style',
            new Date(),
            new Date(),
        );
        const savedStyle = await danceStyleRepo.save(danceStyle);
        log(`Created dance style with ID: ${savedStyle.id}`, GREEN);

        log('\nStep 2: Adding translations...', YELLOW);
        const translations = [
            new DanceStyleTranslation(
                undefined as any,
                'es',
                'Estilo de Prueba',
                'Descripción inicial',
                new Date(),
                new Date(),
            ),
            new DanceStyleTranslation(
                undefined as any,
                'en',
                'Test Style',
                'Initial description',
                new Date(),
                new Date(),
            ),
        ];
        await danceStyleRepo.saveTranslations(savedStyle.id, translations);
        log('Translations added', GREEN);

        log('\nStep 3: Fetching with ES locale...', YELLOW);
        // Mock I18n context for ES locale
        const mockI18nContext = {
            lang: 'es',
            t: (key: string) => key,
        };
        jest.spyOn(I18nContext, 'current').mockReturnValue(mockI18nContext as any);

        const styleES1 = await danceStyleRepo.findById(savedStyle.id);
        const nameES1 = styleES1.translation?.name || '';
        log(`ES name (initial): ${nameES1}`, GREEN);

        assert(
            nameES1 === 'Estilo de Prueba',
            'Translation fetched correctly',
            `Expected "Estilo de Prueba", got "${nameES1}"`,
        );

        log('\nStep 4: Updating ES translation...', YELLOW);
        const updatedTranslations = [
            new DanceStyleTranslation(
                translations[0].id,
                'es',
                'Estilo Actualizado',
                'Descripción actualizada',
                translations[0].createdAt,
                new Date(),
            ),
        ];
        await danceStyleRepo.upsertTranslations(savedStyle.id, updatedTranslations);
        log('Translation updated', GREEN);

        log('\nStep 5: Fetching again with ES locale...', YELLOW);
        const styleES2 = await danceStyleRepo.findById(savedStyle.id);
        const nameES2 = styleES2.translation?.name || '';
        log(`ES name (after update): ${nameES2}`, GREEN);

        assert(
            nameES2 === 'Estilo Actualizado',
            'Translation update appears immediately (NO STALE CACHE)',
            `Expected "Estilo Actualizado", got "${nameES2}"`,
        );

        log('\nStep 6: Switching to EN locale...', YELLOW);
        mockI18nContext.lang = 'en';

        const styleEN = await danceStyleRepo.findById(savedStyle.id);
        const nameEN = styleEN.translation?.name || '';
        log(`EN name: ${nameEN}`, GREEN);

        assert(
            nameEN === 'Test Style',
            'Locale change works correctly',
            `Expected "Test Style", got "${nameEN}"`,
        );

        log('\nStep 7: Switching back to ES locale...', YELLOW);
        mockI18nContext.lang = 'es';

        const styleES3 = await danceStyleRepo.findById(savedStyle.id);
        const nameES3 = styleES3.translation?.name || '';
        log(`ES name (again): ${nameES3}`, GREEN);

        assert(
            nameES3 === 'Estilo Actualizado',
            'Locale switching maintains fresh data (NO STALE CACHE)',
            `Expected "Estilo Actualizado", got "${nameES3}"`,
        );

        // ==============================================
        // SCENARIO 3: Multiple Fetches
        // ==============================================
        section('SCENARIO 3: Multiple Fetches (Verify Always Fresh)');

        log('Fetching artist 5 times in a row...', YELLOW);
        const counts: number[] = [];
        for (let i = 1; i <= 5; i++) {
            const fetch = (await artistRepo.findById(savedArtist.id, { with: ['albums'] })) as any;
            const count = fetch.albums?.length || 0;
            counts.push(count);
            log(`Fetch ${i}: ${count} albums`, GREEN);
        }

        const allSame = counts.every((c) => c === counts[0]);
        assert(
            allSame && counts[0] === 2,
            'Multiple fetches always return same fresh data (NO CACHE POLLUTION)',
            `Expected all to be 2, got [${counts.join(', ')}]`,
        );

        // ==============================================
        // CLEANUP
        // ==============================================
        section('CLEANUP');

        log('Cleaning up test data...', YELLOW);
        await db.delete(albums).where((albums as any).artistId === savedArtist.id);
        await artistRepo.delete(savedArtist.id);
        await danceStyleRepo.deleteTranslations(savedStyle.id);
        await danceStyleRepo.delete(savedStyle.id);
        log('✅ Cleanup complete', GREEN);
    } catch (error) {
        console.error(`${RED}Error during tests:${RESET}`, error);
        failedTests++;
    } finally {
        await app.close();
    }

    // ==============================================
    // SUMMARY
    // ==============================================
    console.log('\n' + '='.repeat(60));
    log('📊 SUMMARY', BLUE);
    console.log('='.repeat(60) + '\n');

    log(`Total Tests: ${totalTests}`, BLUE);
    log(`Passed: ${passedTests}`, GREEN);
    log(`Failed: ${failedTests}`, RED);

    if (failedTests === 0) {
        console.log('\n' + '='.repeat(60));
        log('✅ ALL TESTS PASSED - NO STALE CACHE ISSUES', GREEN);
        log('🎉 CACHE STRATEGY: PRODUCTION READY', GREEN);
        console.log('='.repeat(60) + '\n');
        process.exit(0);
    } else {
        console.log('\n' + '='.repeat(60));
        log('❌ SOME TESTS FAILED - REVIEW CACHING STRATEGY', RED);
        console.log('='.repeat(60) + '\n');
        process.exit(1);
    }
}

bootstrap();
