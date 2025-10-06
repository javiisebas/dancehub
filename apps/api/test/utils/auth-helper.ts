import { JwtService } from '@nestjs/jwt';

export class AuthHelper {
    private static jwtService = new JwtService({
        secret: 'test-secret-key',
    });

    static generateToken(userId: string, email: string): string {
        return this.jwtService.sign(
            { sub: userId, email },
            {
                expiresIn: '15m',
            },
        );
    }

    static generateRefreshToken(userId: string): string {
        return this.jwtService.sign(
            { sub: userId },
            {
                secret: 'test-refresh-secret-key',
                expiresIn: '7d',
            },
        );
    }

    static verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }
}
