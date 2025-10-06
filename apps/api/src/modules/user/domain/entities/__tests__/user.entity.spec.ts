import { ProvidersEnum, UserStatusEnum } from '@repo/shared';
import { User } from '../user.entity';

describe('User Entity', () => {
    describe('create', () => {
        it('should create a new user with valid data', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user).toBeInstanceOf(User);
            expect(user.id).toBe('user-id');
            expect(user.email).toBe('test@example.com');
            expect(user.name).toBe('Test User');
            expect(user.status).toBe(UserStatusEnum.PENDING);
            expect(user.provider).toBe(ProvidersEnum.LOCAL);
        });

        it('should normalize email to lowercase', () => {
            const user = User.create('user-id', 'TEST@EXAMPLE.COM', 'Test User', 'hashedPassword');

            expect(user.email).toBe('test@example.com');
        });

        it('should trim name', () => {
            const user = User.create(
                'user-id',
                'test@example.com',
                '  Test User  ',
                'hashedPassword',
            );

            expect(user.name).toBe('Test User');
        });
    });

    describe('hasPassword', () => {
        it('should return true when user has password', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user.hasPassword()).toBe(true);
        });

        it('should return false when user has no password', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User');

            expect(user.hasPassword()).toBe(false);
        });
    });

    describe('status checks', () => {
        it('should check if user is verified', () => {
            const user = User.create(
                'user-id',
                'test@example.com',
                'Test User',
                'hashedPassword',
                ProvidersEnum.LOCAL,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                UserStatusEnum.VERIFIED,
            );

            expect(user.isVerified()).toBe(true);
            expect(user.isPending()).toBe(false);
            expect(user.isSuspended()).toBe(false);
        });

        it('should check if user is pending', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user.isPending()).toBe(true);
            expect(user.isVerified()).toBe(false);
        });

        it('should check if user is suspended', () => {
            const user = User.create(
                'user-id',
                'test@example.com',
                'Test User',
                'hashedPassword',
                ProvidersEnum.LOCAL,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                UserStatusEnum.SUSPENDED,
            );

            expect(user.isSuspended()).toBe(true);
            expect(user.isVerified()).toBe(false);
        });
    });

    describe('markAsVerified', () => {
        it('should change status to verified', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user.isPending()).toBe(true);

            user.markAsVerified();

            expect(user.isVerified()).toBe(true);
            expect(user.isPending()).toBe(false);
        });
    });

    describe('updateEmail', () => {
        it('should update email', () => {
            const user = User.create('user-id', 'old@example.com', 'Test User', 'hashedPassword');

            user.updateEmail('NEW@EXAMPLE.COM');

            expect(user.email).toBe('new@example.com');
        });
    });

    describe('isLocalProvider', () => {
        it('should return true for local provider', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user.isLocalProvider()).toBe(true);
        });

        it('should return false for Google provider', () => {
            const user = User.create(
                'user-id',
                'test@example.com',
                'Test User',
                undefined,
                ProvidersEnum.GOOGLE,
                'google-123',
            );

            expect(user.isLocalProvider()).toBe(false);
        });
    });

    describe('isRecentlyCreated', () => {
        it('should return true for newly created user', () => {
            const user = User.create('user-id', 'test@example.com', 'Test User', 'hashedPassword');

            expect(user.isRecentlyCreated()).toBe(true);
        });

        it('should return false for old user', () => {
            const oldDate = new Date();
            oldDate.setDate(oldDate.getDate() - 2);

            const user = new User(
                'user-id',
                'test@example.com',
                'Test User',
                'hashedPassword',
                null,
                UserStatusEnum.VERIFIED,
                ProvidersEnum.LOCAL,
                null,
                null,
                null,
                null,
                null,
                oldDate,
                oldDate,
            );

            expect(user.isRecentlyCreated()).toBe(false);
        });
    });
});
