import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { AccessTokenDto } from './interfaces/access-token.dto';
import { GenericGenerateTokenDto } from './interfaces/generate-async-token.dto';
import { GenerateTokenDto } from './interfaces/generate-token.dto';
import { RefreshTokenDto } from './interfaces/refresh-token.dto';

@Injectable()
export class AuthTokenService {
    constructor(
        private readonly configService: TypedConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public async generateToken() {
        return uuidv4();
    }

    private async generateAccessToken(data: GenerateTokenDto) {
        return this.genericGenerateToken({
            ...data,
            secret: this.configService.get('auth.jwtSecret'),
            expiresIn: this.configService.get('auth.jwtExpirationTime'),
        });
    }

    private async generateRefreshToken(data: GenerateTokenDto) {
        return this.genericGenerateToken({
            ...data,
            secret: this.configService.get('auth.jwtRefreshSecret'),
            expiresIn: this.configService.get('auth.jwtRefreshExpirationTime'),
        });
    }

    private genericGenerateToken({ email, expiresIn, id, secret, jti }: GenericGenerateTokenDto) {
        try {
            return this.jwtService.signAsync(
                {
                    email,
                    id: id,
                },
                {
                    issuer: 'PoProstuWitold',
                    secret: secret,
                    expiresIn: expiresIn,
                    ...(jti && { jwtid: jti }),
                },
            );
        } catch (err) {
            throw new UnauthorizedException('Failed to generate token');
        }
    }

    async generateTokens<T extends GenerateTokenDto>(user: T) {
        const jwtid = await this.generateToken();

        const accessToken = await this.generateAccessToken({
            email: user.email,
            id: user.id,
        });
        const refreshToken = await this.generateRefreshToken({
            email: user.email,
            id: user.id,
            jti: jwtid,
        });

        return { accessToken, refreshToken };
    }

    public async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenDto> {
        try {
            return await this.jwtService.verifyAsync<RefreshTokenDto>(refreshToken, {
                secret: this.configService.get('auth.jwtRefreshSecret'),
                issuer: 'PoProstuWitold',
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    public async verifyAccessToken(accessToken: string): Promise<AccessTokenDto> {
        try {
            return await this.jwtService.verifyAsync<AccessTokenDto>(accessToken, {
                secret: this.configService.get('auth.jwtSecret'),
                issuer: 'PoProstuWitold',
            });
        } catch (err) {
            throw new UnauthorizedException('Invalid access token');
        }
    }
}
