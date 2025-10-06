#!/usr/bin/env ts-node

import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'redis';

dotenv.config();

interface HealthStatus {
    service: string;
    status: 'healthy' | 'unhealthy';
    details?: string;
}

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
};

async function checkPostgres(): Promise<HealthStatus> {
    const pool = new Pool({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        user: process.env.DATABASE_USERNAME || 'dancehub',
        password: process.env.DATABASE_PASSWORD || 'dancehub123',
        database: process.env.DATABASE_NAME || 'dancehub',
    });

    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        await pool.end();
        return {
            service: 'PostgreSQL',
            status: 'healthy',
            details: `Connected - ${result.rows[0].now}`,
        };
    } catch (error: any) {
        await pool.end();
        return {
            service: 'PostgreSQL',
            status: 'unhealthy',
            details: error.message,
        };
    }
}

async function checkRedis(): Promise<HealthStatus> {
    const redisClient = createClient({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6380'),
        },
    });

    try {
        await redisClient.connect();
        const pong = await redisClient.ping();
        await redisClient.quit();
        return {
            service: 'Redis',
            status: 'healthy',
            details: `Connected - PING: ${pong}`,
        };
    } catch (error: any) {
        await redisClient.quit();
        return {
            service: 'Redis',
            status: 'unhealthy',
            details: error.message,
        };
    }
}

async function checkEnvVars(): Promise<HealthStatus> {
    const required = [
        'DATABASE_HOST',
        'DATABASE_PORT',
        'DATABASE_USERNAME',
        'DATABASE_PASSWORD',
        'DATABASE_NAME',
        'REDIS_HOST',
        'REDIS_PORT',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        return {
            service: 'Environment',
            status: 'unhealthy',
            details: `Missing: ${missing.join(', ')}`,
        };
    }

    return {
        service: 'Environment',
        status: 'healthy',
        details: 'All required variables set',
    };
}

function printStatus(status: HealthStatus) {
    const icon = status.status === 'healthy' ? '✅' : '❌';
    const color = status.status === 'healthy' ? colors.green : colors.red;

    console.log(
        `${icon} ${color}${status.service.padEnd(15)}${colors.reset} ${status.status.toUpperCase().padEnd(12)} ${status.details || ''}`,
    );
}

async function main() {
    console.log(`\n${colors.blue}🏥 DanceHub Health Check${colors.reset}\n`);
    console.log('─'.repeat(80));
    console.log('');

    const checks: Promise<HealthStatus>[] = [checkEnvVars(), checkPostgres(), checkRedis()];

    const results = await Promise.all(checks);

    results.forEach(printStatus);

    console.log('');
    console.log('─'.repeat(80));

    const allHealthy = results.every((r) => r.status === 'healthy');

    if (allHealthy) {
        console.log(`\n${colors.green}✅ All services are healthy!${colors.reset}\n`);
        process.exit(0);
    } else {
        console.log(`\n${colors.red}❌ Some services are unhealthy${colors.reset}\n`);
        console.log(`${colors.yellow}💡 Tips:${colors.reset}`);
        console.log(`  1. Run: make start (or docker-compose up -d)`);
        console.log(`  2. Check .env file exists and has correct values`);
        console.log(`  3. Wait a few seconds for services to start`);
        console.log('');
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(`${colors.red}Error running health check:${colors.reset}`, error);
    process.exit(1);
});
