import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypedConfigService } from '../../../../core/config/config.service';
import { AuthTokenService } from '../auth-token.service';

// Mock uuid
jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid-v4'),
}));

describe('AuthTokenService', () => {
    let service: AuthTokenService;
    let jwtService: jest.Mocked<JwtService>;
    let configService: jest.Mocked<TypedConfigService>;

    const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
    };

    beforeEach(async () => {
        const mockConfigService = {
            get: jest.fn((key: string) => {
                const config: Record<string, any> = {
                    'auth.jwtSecret': 'test-jwt-secret',
                    'auth.jwtRefreshSecret': 'test-refresh-secret',
                    'auth.jwtExpirationTime': '15m',
                    'auth.jwtRefreshExpirationTime': '7d',
                };
                return config[key];
            }),
        };

        const mockJwtService = {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthTokenService,
                {
                    provide: TypedConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthTokenService>(AuthTokenService);
        jwtService = module.get(JwtService);
        configService = module.get(TypedConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a UUID token', async () => {
            const token = await service.generateToken();

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token).toBe('mocked-uuid-v4');
        });
    });

    describe('generateTokens', () => {
        it('should generate both access and refresh tokens', async () => {
            const mockAccessToken = 'mock-access-token';
            const mockRefreshToken = 'mock-refresh-token';

            jwtService.signAsync
                .mockResolvedValueOnce(mockAccessToken)
                .mockResolvedValueOnce(mockRefreshToken);

            const result = await service.generateTokens(mockUser);

            expect(result).toHaveProperty('accessToken', mockAccessToken);
            expect(result).toHaveProperty('refreshToken', mockRefreshToken);
            expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
        });

        it('should generate access token with correct payload', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const firstCall = jwtService.signAsync.mock.calls[0];
            expect(firstCall[0]).toEqual({
                email: mockUser.email,
                id: mockUser.id,
            });
        });

        it('should generate access token with correct config', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const firstCall = jwtService.signAsync.mock.calls[0];
            expect(firstCall[1]).toMatchObject({
                issuer: 'PoProstuWitold',
                secret: 'test-jwt-secret',
                expiresIn: '15m',
            });
        });

        it('should generate refresh token with jwtid', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const secondCall = jwtService.signAsync.mock.calls[1];
            expect(secondCall[1]).toHaveProperty('jwtid');
            expect(typeof secondCall[1]?.jwtid).toBe('string');
        });

        it('should generate refresh token with correct config', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const secondCall = jwtService.signAsync.mock.calls[1];
            expect(secondCall[1]).toMatchObject({
                issuer: 'PoProstuWitold',
                secret: 'test-refresh-secret',
                expiresIn: '7d',
            });
        });

        it('should throw UnauthorizedException if token generation fails', async () => {
            jwtService.signAsync.mockRejectedValueOnce(new Error('JWT signing failed'));

            await expect(service.generateTokens(mockUser)).rejects.toThrow('JWT signing failed');
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify valid access token', async () => {
            const mockToken = 'valid-access-token';
            const mockPayload = {
                id: 'user-123',
                email: 'test@example.com',
                iat: Date.now(),
                exp: Date.now() + 900000,
            };

            jwtService.verifyAsync.mockResolvedValue(mockPayload);

            const result = await service.verifyAccessToken(mockToken);

            expect(result).toEqual(mockPayload);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken, {
                secret: 'test-jwt-secret',
                issuer: 'PoProstuWitold',
            });
        });

        it('should throw UnauthorizedException for invalid token', async () => {
            const invalidToken = 'invalid-token';

            jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

            await expect(service.verifyAccessToken(invalidToken)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(service.verifyAccessToken(invalidToken)).rejects.toThrow(
                'Invalid access token',
            );
        });

        it('should throw UnauthorizedException for expired token', async () => {
            const expiredToken = 'expired-token';

            jwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));

            await expect(service.verifyAccessToken(expiredToken)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException for malformed token', async () => {
            const malformedToken = 'malformed.token';

            jwtService.verifyAsync.mockRejectedValue(new Error('Malformed token'));

            await expect(service.verifyAccessToken(malformedToken)).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify valid refresh token', async () => {
            const mockToken = 'valid-refresh-token';
            const mockPayload = {
                id: 'user-123',
                email: 'test@example.com',
                jti: 'uuid-123',
                iat: Date.now(),
                exp: Date.now() + 604800000,
            };

            jwtService.verifyAsync.mockResolvedValue(mockPayload);

            const result = await service.verifyRefreshToken(mockToken);

            expect(result).toEqual(mockPayload);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken, {
                secret: 'test-refresh-secret',
                issuer: 'PoProstuWitold',
            });
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            const invalidToken = 'invalid-refresh-token';

            jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

            await expect(service.verifyRefreshToken(invalidToken)).rejects.toThrow(
                UnauthorizedException,
            );
            await expect(service.verifyRefreshToken(invalidToken)).rejects.toThrow(
                'Invalid refresh token',
            );
        });

        it('should throw UnauthorizedException for expired refresh token', async () => {
            const expiredToken = 'expired-refresh-token';

            jwtService.verifyAsync.mockRejectedValue(new Error('Token expired'));

            await expect(service.verifyRefreshToken(expiredToken)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should verify refresh token with jti claim', async () => {
            const mockToken = 'refresh-token-with-jti';
            const mockPayload = {
                id: 'user-123',
                email: 'test@example.com',
                jti: 'unique-jti-value',
                iat: Date.now(),
                exp: Date.now() + 604800000,
            };

            jwtService.verifyAsync.mockResolvedValue(mockPayload);

            const result = await service.verifyRefreshToken(mockToken);

            expect(result.jti).toBe('unique-jti-value');
        });
    });

    describe('token security', () => {
        it('should use different secrets for access and refresh tokens', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const accessTokenCall = jwtService.signAsync.mock.calls[0];
            const refreshTokenCall = jwtService.signAsync.mock.calls[1];

            expect(accessTokenCall[1]?.secret).toBe('test-jwt-secret');
            expect(refreshTokenCall[1]?.secret).toBe('test-refresh-secret');
            expect(accessTokenCall[1]?.secret).not.toBe(refreshTokenCall[1]?.secret);
        });

        it('should use different expiration times for access and refresh tokens', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const accessTokenCall = jwtService.signAsync.mock.calls[0];
            const refreshTokenCall = jwtService.signAsync.mock.calls[1];

            expect(accessTokenCall[1]?.expiresIn).toBe('15m');
            expect(refreshTokenCall[1]?.expiresIn).toBe('7d');
        });

        it('should include issuer in token generation', async () => {
            jwtService.signAsync.mockResolvedValue('mock-token');

            await service.generateTokens(mockUser);

            const calls = jwtService.signAsync.mock.calls;
            calls.forEach((call) => {
                expect(call[1]?.issuer).toBe('PoProstuWitold');
            });
        });

        it('should verify tokens with correct issuer', async () => {
            const mockPayload = { id: 'user-123', email: 'test@example.com' };
            jwtService.verifyAsync.mockResolvedValue(mockPayload);

            await service.verifyAccessToken('token');
            await service.verifyRefreshToken('token');

            const calls = jwtService.verifyAsync.mock.calls;
            calls.forEach((call) => {
                expect(call[1]?.issuer).toBe('PoProstuWitold');
            });
        });
    });
});
