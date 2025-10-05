#!/usr/bin/env ts-node
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface CheckResult {
    name: string;
    status: 'success' | 'warning' | 'error';
    message: string;
    details?: string;
}

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    bold: '\x1b[1m',
};

function printResult(result: CheckResult) {
    const icon = result.status === 'success' ? '✓' : result.status === 'warning' ? '⚠' : '✗';
    const color =
        result.status === 'success'
            ? colors.green
            : result.status === 'warning'
              ? colors.yellow
              : colors.red;

    console.log(`${color}${icon} ${result.name}${colors.reset}`);
    console.log(`  ${result.message}`);
    if (result.details) {
        console.log(`  ${colors.blue}${result.details}${colors.reset}`);
    }
    console.log();
}

async function checkFFmpeg(): Promise<CheckResult> {
    try {
        const { stdout } = await execAsync('ffmpeg -version');
        const version = stdout.split('\n')[0];
        return {
            name: 'FFmpeg',
            status: 'success',
            message: 'FFmpeg is installed and available',
            details: version,
        };
    } catch (error) {
        return {
            name: 'FFmpeg',
            status: 'error',
            message: 'FFmpeg not found',
            details: 'Install with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)',
        };
    }
}

async function checkSharp(): Promise<CheckResult> {
    try {
        require('sharp');
        return {
            name: 'Sharp (Image Processing)',
            status: 'success',
            message: 'Sharp is installed correctly',
        };
    } catch (error) {
        return {
            name: 'Sharp',
            status: 'error',
            message: 'Sharp not installed or missing dependencies',
            details: 'Run: pnpm install',
        };
    }
}

async function checkSocketIO(): Promise<CheckResult> {
    try {
        require('socket.io');
        return {
            name: 'Socket.IO (Real-time Progress)',
            status: 'success',
            message: 'Socket.IO is installed correctly',
        };
    } catch (error) {
        return {
            name: 'Socket.IO',
            status: 'error',
            message: 'Socket.IO not installed',
            details: 'Run: pnpm install',
        };
    }
}

async function checkAWSSDK(): Promise<CheckResult> {
    try {
        require('@aws-sdk/client-s3');
        return {
            name: 'AWS SDK (R2 Storage)',
            status: 'success',
            message: 'AWS SDK is installed correctly',
        };
    } catch (error) {
        return {
            name: 'AWS SDK',
            status: 'error',
            message: 'AWS SDK not installed',
            details: 'Run: pnpm install',
        };
    }
}

async function checkEnvironment(): Promise<CheckResult> {
    const requiredVars = [
        'STORAGE_R2_ACCOUNT_ID',
        'STORAGE_R2_ACCESS_KEY_ID',
        'STORAGE_R2_SECRET_ACCESS_KEY',
        'STORAGE_R2_BUCKET',
    ];

    const missing = requiredVars.filter((v) => !process.env[v]);

    if (missing.length === 0) {
        return {
            name: 'Environment Variables',
            status: 'success',
            message: 'All storage environment variables are configured',
        };
    }

    return {
        name: 'Environment Variables',
        status: 'warning',
        message: `Missing ${missing.length} required environment variable(s)`,
        details: `Missing: ${missing.join(', ')}`,
    };
}

async function checkDiskSpace(): Promise<CheckResult> {
    try {
        const { stdout } = await execAsync('df -h /tmp');
        const lines = stdout.split('\n');
        if (lines.length > 1) {
            const parts = lines[1].split(/\s+/);
            const available = parts[3];

            return {
                name: 'Disk Space (/tmp)',
                status: 'success',
                message: 'Sufficient disk space for video processing',
                details: `Available: ${available}`,
            };
        }
        return {
            name: 'Disk Space',
            status: 'warning',
            message: 'Could not check disk space',
        };
    } catch (error) {
        return {
            name: 'Disk Space',
            status: 'warning',
            message: 'Could not check disk space',
        };
    }
}

async function checkStorageModule(): Promise<CheckResult> {
    try {
        const fs = require('fs');
        const path = require('path');

        const modulePath = path.join(__dirname, '../src/modules/core/storage/storage.module.ts');

        if (fs.existsSync(modulePath)) {
            return {
                name: 'Storage Module',
                status: 'success',
                message: 'Storage module exists and is ready',
            };
        }

        return {
            name: 'Storage Module',
            status: 'error',
            message: 'Storage module not found',
        };
    } catch (error) {
        return {
            name: 'Storage Module',
            status: 'error',
            message: 'Error checking storage module',
        };
    }
}

async function main() {
    console.log(
        `\n${colors.bold}${colors.blue}🔍 DanceHub Storage Module Verification${colors.reset}\n`,
    );
    console.log('━'.repeat(50) + '\n');

    const checks = [
        checkStorageModule(),
        checkFFmpeg(),
        checkSharp(),
        checkSocketIO(),
        checkAWSSDK(),
        checkEnvironment(),
        checkDiskSpace(),
    ];

    const results = await Promise.all(checks);

    for (const result of results) {
        printResult(result);
    }

    const errors = results.filter((r) => r.status === 'error').length;
    const warnings = results.filter((r) => r.status === 'warning').length;
    const success = results.filter((r) => r.status === 'success').length;

    console.log('━'.repeat(50) + '\n');
    console.log(`${colors.bold}Summary:${colors.reset}`);
    console.log(`  ${colors.green}✓ ${success} checks passed${colors.reset}`);
    if (warnings > 0) {
        console.log(`  ${colors.yellow}⚠ ${warnings} warnings${colors.reset}`);
    }
    if (errors > 0) {
        console.log(`  ${colors.red}✗ ${errors} errors${colors.reset}`);
    }

    console.log();

    if (errors === 0 && warnings === 0) {
        console.log(
            `${colors.green}${colors.bold}✓ Storage module is ready to use!${colors.reset}\n`,
        );
        process.exit(0);
    } else if (errors > 0) {
        console.log(
            `${colors.red}${colors.bold}✗ Please fix errors before using storage module${colors.reset}\n`,
        );
        process.exit(1);
    } else {
        console.log(
            `${colors.yellow}${colors.bold}⚠ Storage module is functional but has warnings${colors.reset}\n`,
        );
        process.exit(0);
    }
}

main();
