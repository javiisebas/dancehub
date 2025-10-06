import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordService } from '../auth-password.service';

describe('AuthPasswordService', () => {
    let service: AuthPasswordService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthPasswordService],
        }).compile();

        service = module.get<AuthPasswordService>(AuthPasswordService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'mySecurePassword123!';
            const hash = await service.hashPassword(password);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
            expect(hash).toContain('$argon2');
        });

        it('should generate different hashes for same password', async () => {
            const password = 'mySecurePassword123!';
            const hash1 = await service.hashPassword(password);
            const hash2 = await service.hashPassword(password);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('verifyPassword', () => {
        it('should verify correct password', async () => {
            const password = 'mySecurePassword123!';
            const hash = await service.hashPassword(password);
            const isValid = await service.verifyPassword(password, hash);

            expect(isValid).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const password = 'mySecurePassword123!';
            const wrongPassword = 'wrongPassword123!';
            const hash = await service.hashPassword(password);
            const isValid = await service.verifyPassword(wrongPassword, hash);

            expect(isValid).toBe(false);
        });

        it('should reject empty password', async () => {
            const password = 'mySecurePassword123!';
            const hash = await service.hashPassword(password);
            const isValid = await service.verifyPassword('', hash);

            expect(isValid).toBe(false);
        });
    });
});
