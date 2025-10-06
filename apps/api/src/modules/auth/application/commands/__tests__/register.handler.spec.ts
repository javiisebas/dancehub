import { BusinessException } from '@api/common/exceptions/business.exception';
import { CacheService } from '@api/modules/core/cache/cache.service';
import { CreateUserHandler } from '@api/modules/user/application/commands/create-user.handler';
import { UpdateUserHandler } from '@api/modules/user/application/commands/update-user.handler';
import { User } from '@api/modules/user/domain/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordService } from '../../../domain/services/auth-password.service';
import { AuthTokenService } from '../../../domain/services/auth-token.service';
import { UserRegisteredEvent } from '../../events/user-registered.event';
import { RegisterCommand, RegisterHandler } from '../register.handler';

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid-v4'),
}));

describe('RegisterHandler', () => {
    let handler: RegisterHandler;
    let authPasswordService: jest.Mocked<AuthPasswordService>;
    let authTokenService: jest.Mocked<AuthTokenService>;
    let cacheService: jest.Mocked<CacheService>;
    let createUserHandler: jest.Mocked<CreateUserHandler>;
    let updateUserHandler: jest.Mocked<UpdateUserHandler>;
    let eventEmitter: jest.Mocked<EventEmitter2>;

    const mockUserData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        confirmPassword: 'password123',
    };

    const mockUser = User.create('user-123', 'test@example.com', 'Test User', 'hashed-password');

    beforeEach(async () => {
        const mockAuthPasswordService = {
            hashPassword: jest.fn(),
        };

        const mockAuthTokenService = {
            generateToken: jest.fn(),
            generateTokens: jest.fn(),
        };

        const mockCacheService = {
            set: jest.fn(),
        };

        const mockCreateUserHandler = {
            execute: jest.fn(),
        };

        const mockUpdateUserHandler = {
            execute: jest.fn(),
        };

        const mockEventEmitter = {
            emit: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterHandler,
                {
                    provide: AuthPasswordService,
                    useValue: mockAuthPasswordService,
                },
                {
                    provide: AuthTokenService,
                    useValue: mockAuthTokenService,
                },
                {
                    provide: CacheService,
                    useValue: mockCacheService,
                },
                {
                    provide: CreateUserHandler,
                    useValue: mockCreateUserHandler,
                },
                {
                    provide: UpdateUserHandler,
                    useValue: mockUpdateUserHandler,
                },
                {
                    provide: EventEmitter2,
                    useValue: mockEventEmitter,
                },
            ],
        }).compile();

        handler = module.get<RegisterHandler>(RegisterHandler);
        authPasswordService = module.get(AuthPasswordService);
        authTokenService = module.get(AuthTokenService);
        cacheService = module.get(CacheService);
        createUserHandler = module.get(CreateUserHandler);
        updateUserHandler = module.get(UpdateUserHandler);
        eventEmitter = module.get(EventEmitter2);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    describe('execute', () => {
        beforeEach(() => {
            authPasswordService.hashPassword.mockResolvedValue('hashed-password');
            authTokenService.generateToken.mockResolvedValue('verification-token');
            authTokenService.generateTokens.mockResolvedValue({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });
            createUserHandler.execute.mockResolvedValue(mockUser);
            updateUserHandler.execute.mockResolvedValue(mockUser);
            cacheService.set.mockResolvedValue(undefined);
        });

        it('should register user successfully', async () => {
            const command = new RegisterCommand(mockUserData);
            const result = await handler.execute(command);

            expect(result).toBeDefined();
            expect(result.user.email).toBe(mockUser.email);
            expect(result.accessToken).toBe('access-token');
            expect(result.refreshToken).toBe('refresh-token');
        });

        it('should throw error when passwords do not match', async () => {
            const invalidData = {
                ...mockUserData,
                confirmPassword: 'different-password',
            };

            const command = new RegisterCommand(invalidData);

            await expect(handler.execute(command)).rejects.toThrow(BusinessException);
            await expect(handler.execute(command)).rejects.toThrow('auth.passwordMismatch');

            expect(authPasswordService.hashPassword).not.toHaveBeenCalled();
        });

        it('should hash password before creating user', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(authPasswordService.hashPassword).toHaveBeenCalledWith(mockUserData.password);
            expect(authPasswordService.hashPassword).toHaveBeenCalledTimes(1);
        });

        it('should create user with hashed password', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(createUserHandler.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: mockUserData.email,
                        name: mockUserData.name,
                        password: 'hashed-password',
                        confirmPassword: 'hashed-password',
                    }),
                }),
            );
        });

        it('should generate verification token', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(authTokenService.generateToken).toHaveBeenCalled();
        });

        it('should store verification token in cache', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(cacheService.set).toHaveBeenCalledWith(
                expect.objectContaining({
                    identifier: 'email-verification',
                    suffix: 'verification-token',
                }),
                mockUser.id,
            );
        });

        it('should emit user registered event', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'auth.user.registered',
                expect.any(UserRegisteredEvent),
            );
        });

        it('should emit event with correct data', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            const emittedEvent = eventEmitter.emit.mock.calls[0][1] as UserRegisteredEvent;
            expect(emittedEvent.userId).toBe(mockUser.id);
            expect(emittedEvent.email).toBe(mockUser.email);
            expect(emittedEvent.verificationToken).toBe('verification-token');
        });

        it('should generate JWT tokens', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(authTokenService.generateTokens).toHaveBeenCalledWith(mockUser);
        });

        it('should update user refresh token in database', async () => {
            const command = new RegisterCommand(mockUserData);
            await handler.execute(command);

            expect(updateUserHandler.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { refreshToken: 'refresh-token' },
                }),
            );
        });

        it('should return correct response structure', async () => {
            const command = new RegisterCommand(mockUserData);
            const result = await handler.execute(command);

            expect(result).toMatchObject({
                user: {
                    id: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            });
        });

        it('should return user dates as ISO strings', async () => {
            const command = new RegisterCommand(mockUserData);
            const result = await handler.execute(command);

            expect(result.user.createdAt).toBe(mockUser.createdAt.toISOString());
            expect(result.user.updatedAt).toBe(mockUser.updatedAt.toISOString());
        });

        it('should throw error if password hashing fails', async () => {
            authPasswordService.hashPassword.mockRejectedValue(new Error('Hashing failed'));

            const command = new RegisterCommand(mockUserData);

            await expect(handler.execute(command)).rejects.toThrow('Hashing failed');
            expect(createUserHandler.execute).not.toHaveBeenCalled();
        });

        it('should throw error if user creation fails', async () => {
            createUserHandler.execute.mockRejectedValue(new Error('User already exists'));

            const command = new RegisterCommand(mockUserData);

            await expect(handler.execute(command)).rejects.toThrow('User already exists');
            expect(authTokenService.generateTokens).not.toHaveBeenCalled();
        });

        it('should throw error if token generation fails', async () => {
            authTokenService.generateTokens.mockRejectedValue(new Error('Token generation failed'));

            const command = new RegisterCommand(mockUserData);

            await expect(handler.execute(command)).rejects.toThrow('Token generation failed');
        });
    });
});
