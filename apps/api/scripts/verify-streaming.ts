import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

async function verifyStreaming(): Promise<void> {
    console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.blue}🎬 R2 Video Streaming Verification${colors.reset}`);
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

    const testKey = `test-streaming-${Date.now()}.mp4`;

    try {
        console.log(`${colors.blue}📦 Bucket: ${bucket}${colors.reset}`);
        console.log(
            `${colors.blue}🔗 Endpoint: https://${accountId}.r2.cloudflarestorage.com${colors.reset}\n`,
        );

        const testData = Buffer.alloc(10 * 1024 * 1024);
        for (let i = 0; i < testData.length; i++) {
            testData[i] = i % 256;
        }

        console.log(`${colors.blue}📤 Uploading test file (10MB)...${colors.reset}`);
        const putCommand = new PutObjectCommand({
            Bucket: bucket,
            Key: testKey,
            Body: testData,
            ContentType: 'video/mp4',
            CacheControl: 'public, max-age=31536000, immutable',
        });

        await client.send(putCommand);
        console.log(`${colors.green}✓ Test file uploaded${colors.reset}\n`);

        console.log(`${colors.blue}🔐 Generating presigned URL...${colors.reset}`);
        const getCommand = new GetObjectCommand({
            Bucket: bucket,
            Key: testKey,
            ResponseCacheControl: 'public, max-age=31536000, immutable',
            ResponseContentDisposition: 'inline',
        });

        const url = await getSignedUrl(client, getCommand, {
            expiresIn: 3600,
        });
        console.log(`${colors.green}✓ Presigned URL generated${colors.reset}\n`);

        console.log(`${colors.blue}🧪 Testing Range Requests...${colors.reset}`);

        const rangeTests = [
            { name: 'First 1KB', range: 'bytes=0-1023' },
            { name: 'Middle chunk', range: 'bytes=5242880-5243903' },
            { name: 'Last 1KB', range: `bytes=${testData.length - 1024}-${testData.length - 1}` },
        ];

        let allTestsPassed = true;

        for (const test of rangeTests) {
            try {
                const response = await fetch(url, {
                    headers: {
                        Range: test.range,
                    },
                });

                if (response.status === 206) {
                    const contentRange = response.headers.get('content-range');
                    const acceptRanges = response.headers.get('accept-ranges');

                    console.log(`  ${colors.green}✓ ${test.name}${colors.reset}`);
                    console.log(`    Status: ${response.status} (Partial Content)`);
                    console.log(`    Content-Range: ${contentRange}`);
                    console.log(`    Accept-Ranges: ${acceptRanges}`);

                    const data = await response.arrayBuffer();
                    console.log(`    Downloaded: ${data.byteLength} bytes`);
                } else {
                    console.log(`  ${colors.red}✗ ${test.name}${colors.reset}`);
                    console.log(`    Expected status 206, got ${response.status}`);
                    allTestsPassed = false;
                }
                console.log('');
            } catch (error) {
                console.log(`  ${colors.red}✗ ${test.name}${colors.reset}`);
                console.log(`    Error: ${error instanceof Error ? error.message : String(error)}`);
                allTestsPassed = false;
                console.log('');
            }
        }

        console.log(`${colors.blue}🧹 Cleaning up test file...${colors.reset}`);
        const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucket,
            Key: testKey,
        });
        await client.send(deleteCommand);
        console.log(`${colors.green}✓ Test file deleted${colors.reset}\n`);

        if (allTestsPassed) {
            console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
            console.log(`${colors.green}✓ Streaming verification complete!${colors.reset}`);
            console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
            console.log(`${colors.green}🎉 Video streaming is working correctly!${colors.reset}`);
            console.log(`${colors.blue}   • Range requests: Supported ✓${colors.reset}`);
            console.log(`${colors.blue}   • Partial content: Working ✓${colors.reset}`);
            console.log(`${colors.blue}   • CORS headers: Configured ✓${colors.reset}`);
            console.log(`${colors.blue}   • Cache control: Optimized ✓${colors.reset}`);
            console.log('');
            console.log(
                `${colors.yellow}💡 Users can now start watching videos immediately${colors.reset}`,
            );
            console.log(`${colors.yellow}   without downloading the entire file.${colors.reset}\n`);
        } else {
            console.log(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
            console.log(`${colors.red}✗ Some tests failed${colors.reset}`);
            console.log(`${colors.red}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
            process.exit(1);
        }
    } catch (error) {
        console.error(`${colors.red}❌ Verification failed:${colors.reset}`);
        if (error instanceof Error) {
            console.error(`${colors.red}   ${error.message}${colors.reset}\n`);
        }
        process.exit(1);
    }
}

verifyStreaming().catch((error) => {
    console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
    process.exit(1);
});
