import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigService } from '../core/config/config.service';
import { AppMailerModule } from '../core/mailer/mailer.module';
import { UserModule } from '../user/user.module';
import { ChangePasswordHandler } from './application/commands/change-password.handler';
import { LoginHandler } from './application/commands/login.handler';
import { LogoutHandler } from './application/commands/logout.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token.handler';
import { RegisterHandler } from './application/commands/register.handler';
import { ResendVerificationHandler } from './application/commands/resend-verification.handler';
import { ResetPasswordHandler } from './application/commands/reset-password.handler';
import { SetNewPasswordHandler } from './application/commands/set-new-password.handler';
import { SocialLoginHandler } from './application/commands/social-login.handler';
import { VerifyEmailHandler } from './application/commands/verify-email.handler';
import { EmailVerificationRequestedListener } from './application/events/email-verification-requested.event';
import { PasswordResetRequestedListener } from './application/events/password-reset-requested.event';
import { UserRegisteredListener } from './application/events/user-registered.event';
import { GetAuthenticatedUserHandler } from './application/queries/get-authenticated-user.handler';
import { ValidateUserExistsHandler } from './application/queries/validate-user-exists.handler';
import { AuthPasswordService } from './domain/services/auth-password.service';
import { AuthTokenService } from './domain/services/auth-token.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { GoogleStrategy } from './infrastructure/strategies/google.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt-auth.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';

const CommandHandlers: Provider[] = [
    RegisterHandler,
    LoginHandler,
    LogoutHandler,
    VerifyEmailHandler,
    ResendVerificationHandler,
    ResetPasswordHandler,
    SetNewPasswordHandler,
    ChangePasswordHandler,
    SocialLoginHandler,
    RefreshTokenHandler,
];

const QueryHandlers: Provider[] = [GetAuthenticatedUserHandler, ValidateUserExistsHandler];

const EventListeners: Provider[] = [
    EmailVerificationRequestedListener,
    PasswordResetRequestedListener,
    UserRegisteredListener,
];

const DomainServices: Provider[] = [AuthPasswordService, AuthTokenService];

const Strategies: Provider[] = [JwtStrategy, JwtRefreshStrategy, LocalStrategy, GoogleStrategy];

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [TypedConfigService],
            useFactory: (configService: TypedConfigService) => ({
                secret: configService.get('auth.jwtSecret'),
                signOptions: {
                    expiresIn: configService.get('auth.jwtExpirationTime'),
                },
            }),
        }),
        AppMailerModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        ...DomainServices,
        ...CommandHandlers,
        ...QueryHandlers,
        ...EventListeners,
        ...Strategies,
    ],
    exports: [AuthPasswordService, AuthTokenService],
})
export class AuthModule {}
