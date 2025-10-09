import { GetBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

const envPath = existsSync(join(__dirname, '../.env'))
    ? join(__dirname, '../.env')
    : join(__dirname, '../../../.env');

dotenv.config({ path: envPath });

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

async function verifyCors(): Promise<void> {
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}🔍 R2 CORS Verification${colors.reset}`);
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    const accountId = process.env.STORAGE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.STORAGE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.STORAGE_R2_SECRET_ACCESS_KEY;
    const bucket = process.env.STORAGE_R2_BUCKET;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
        console.error(`${colors.red}❌ Missing required environment variables${colors.reset}`);
        process.exit(1);
    }

    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });

    try {
        console.log(`${colors.blue}📦 Bucket: ${bucket}${colors.reset}`);
        console.log(
            `${colors.blue}🔗 Endpoint: https://${accountId}.r2.cloudflarestorage.com${colors.reset}\n`,
        );

        const command = new GetBucketCorsCommand({
            Bucket: bucket,
        });

        const response = await client.send(command);

        if (!response.CORSRules || response.CORSRules.length === 0) {
            console.log(`${colors.yellow}⚠️  No CORS rules configured${colors.reset}\n`);
            console.log(`${colors.yellow}To configure CORS, run:${colors.reset}`);
            console.log(`${colors.blue}  ./scripts/setup-r2-cors.sh${colors.reset}\n`);
            process.exit(1);
        }

        console.log(`${colors.green}✓ CORS is configured!${colors.reset}\n`);
        console.log(`${colors.blue}📋 CORS Rules:${colors.reset}\n`);

        response.CORSRules.forEach((rule, index) => {
            console.log(`${colors.blue}Rule ${index + 1}:${colors.reset}`);
            console.log(`  ${colors.blue}Allowed Origins:${colors.reset}`);
            rule.AllowedOrigins?.forEach((origin) => {
                const hasLocalhost = origin.includes('localhost');
                const color = hasLocalhost ? colors.green : colors.blue;
                console.log(`    ${color}• ${origin}${colors.reset}`);
            });
            console.log(
                `  ${colors.blue}Allowed Methods:${colors.reset} ${rule.AllowedMethods?.join(', ')}`,
            );
            console.log(
                `  ${colors.blue}Allowed Headers:${colors.reset} ${rule.AllowedHeaders?.join(', ')}`,
            );
            if (rule.ExposeHeaders) {
                console.log(
                    `  ${colors.blue}Expose Headers:${colors.reset} ${rule.ExposeHeaders.join(', ')}`,
                );
            }
            if (rule.MaxAgeSeconds) {
                console.log(`  ${colors.blue}Max Age:${colors.reset} ${rule.MaxAgeSeconds}s`);
            }
            console.log('');
        });

        const hasLocalhost = response.CORSRules.some((rule) =>
            rule.AllowedOrigins?.some((origin) => origin.includes('localhost')),
        );

        if (!hasLocalhost) {
            console.log(`${colors.yellow}⚠️  Warning: No localhost origins found${colors.reset}`);
            console.log(
                `${colors.yellow}   Add http://localhost:3000 to AllowedOrigins for development${colors.reset}\n`,
            );
        }

        const hasRequiredMethods = response.CORSRules.some((rule) =>
            rule.AllowedMethods?.includes('GET'),
        );

        if (!hasRequiredMethods) {
            console.log(
                `${colors.yellow}⚠️  Warning: GET method not found in CORS rules${colors.reset}`,
            );
            console.log(
                `${colors.yellow}   Add GET to AllowedMethods for video playback${colors.reset}\n`,
            );
        }

        console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.green}✓ CORS verification complete!${colors.reset}`);
        console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    } catch (error) {
        console.error(`${colors.red}❌ Failed to verify CORS:${colors.reset}`);
        if (error instanceof Error) {
            console.error(`${colors.red}   ${error.message}${colors.reset}\n`);
        }

        if ((error as any).Code === 'NoSuchCORSConfiguration') {
            console.log(
                `${colors.yellow}ℹ️  CORS is not configured for this bucket${colors.reset}\n`,
            );
            console.log(`${colors.yellow}To configure CORS, run:${colors.reset}`);
            console.log(`${colors.blue}  ./scripts/setup-r2-cors.sh${colors.reset}\n`);
        }

        process.exit(1);
    }
}

verifyCors().catch((error) => {
    console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
    process.exit(1);
});
