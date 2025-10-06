import { AUTH } from '@api/common/constants/auth.constants';
import { TypedConfigService } from '@api/modules/core/config/config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, AUTH.GOOGLE) {
    constructor(private readonly configService: TypedConfigService) {
        super({
            clientID: configService.get('oauth.googleClientId'),
            clientSecret: configService.get('oauth.googleClientSecret'),
            callbackURL: `${configService.get('app.origin')}${configService.get('oauth.googleRedirectUrl')}`,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        const { id, emails, displayName, photos } = profile;

        const user = {
            provider: 'google',
            providerId: id,
            email: emails?.[0]?.value || '',
            name: displayName,
            picture: photos?.[0]?.value || '',
        };

        done(null, user);
    }
}
