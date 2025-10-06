import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserHandler } from '../../../../user/application/commands/update-user.handler';
import { User } from '../../../../user/domain/entities/user.entity';
import { AuthTokenService } from '../../../domain/services/auth-token.service';
import { LoginCommand, LoginHandler } from '../login.handler';

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid-v4'),
}));

describe('LoginHandler', () => {
    let handler: LoginHandler;
    let authTokenService: jest.Mocked<AuthTokenService>;
    let updateUserHandler: jest.Mocked<UpdateUserHandler>;

    const mockUser = User.create('user-123', 'test@example.com', 'Test User', 'hashed-password');

    beforeEach(async () => {
        const mockAuthTokenService = {
            generateTokens: jest.fn(),
        };

        const mockUpdateUserHandler = {
            execute: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginHandler,
                {
                    provide: AuthTokenService,
                    useValue: mockAuthTokenService,
                },
                {
                    provide: UpdateUserHandler,
                    useValue: mockUpdateUserHandler,
                },
            ],
        }).compile();

        handler = module.get<LoginHandler>(LoginHandler);
        authTokenService = module.get(AuthTokenService);
        updateUserHandler = module.get(UpdateUserHandler);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    describe('execute', () => {
        it('should login user successfully', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const command = new LoginCommand({ user: mockUser });
            const result = await handler.execute(command);

            expect(result).toBeDefined();
            expect(result.accessToken).toBe(mockTokens.accessToken);
            expect(result.refreshToken).toBe(mockTokens.refreshToken);
            expect(result.user).toBeDefined();
        });

        it('should generate tokens for user', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const command = new LoginCommand({ user: mockUser });
            await handler.execute(command);

            expect(authTokenService.generateTokens).toHaveBeenCalledWith(mockUser);
            expect(authTokenService.generateTokens).toHaveBeenCalledTimes(1);
        });

        it('should update user refresh token in database', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const command = new LoginCommand({ user: mockUser });
            await handler.execute(command);

            expect(updateUserHandler.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { refreshToken: mockTokens.refreshToken },
                }),
            );
            expect(updateUserHandler.execute).toHaveBeenCalledTimes(1);
        });

        it('should update user entity refresh token', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const updateRefreshTokenSpy = jest.spyOn(mockUser, 'updateRefreshToken');

            const command = new LoginCommand({ user: mockUser });
            await handler.execute(command);

            expect(updateRefreshTokenSpy).toHaveBeenCalledWith(mockTokens.refreshToken);
        });

        it('should return correct response structure', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const command = new LoginCommand({ user: mockUser });
            const result = await handler.execute(command);

            expect(result).toMatchObject({
                user: {
                    id: mockUser.id,
                    email: mockUser.email,
                    name: mockUser.name,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
                accessToken: mockTokens.accessToken,
                refreshToken: mockTokens.refreshToken,
            });
        });

        it('should return user dates as ISO strings', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockResolvedValue(mockUser);

            const command = new LoginCommand({ user: mockUser });
            const result = await handler.execute(command);

            expect(result.user.createdAt).toBe(mockUser.createdAt.toISOString());
            expect(result.user.updatedAt).toBe(mockUser.updatedAt.toISOString());
        });

        it('should throw error if token generation fails', async () => {
            authTokenService.generateTokens.mockRejectedValue(new Error('Token generation failed'));

            const command = new LoginCommand({ user: mockUser });

            await expect(handler.execute(command)).rejects.toThrow('Token generation failed');
            expect(updateUserHandler.execute).not.toHaveBeenCalled();
        });

        it('should throw error if database update fails', async () => {
            const mockTokens = {
                accessToken: 'mock-access-token',
                refreshToken: 'mock-refresh-token',
            };

            authTokenService.generateTokens.mockResolvedValue(mockTokens);
            updateUserHandler.execute.mockRejectedValue(new Error('Database error'));

            const command = new LoginCommand({ user: mockUser });

            await expect(handler.execute(command)).rejects.toThrow('Database error');
        });
    });
});
