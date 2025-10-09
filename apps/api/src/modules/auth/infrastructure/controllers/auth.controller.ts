import { AUTH } from '@api/common/constants/auth.constants';
import { CurrentUser } from '@api/common/decorators/current-user.decorator';
import { Serialize } from '@api/common/decorators/serialize.decorator';
import { Verified } from '@api/common/decorators/verified.decorator';
import { JwtAuthGuard } from '@api/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@api/common/guards/local-auth.guard';
import { VerifiedGuard } from '@api/common/guards/verified.guard';
import { User } from '@api/modules/user/domain/entities/user.entity';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {
    CreateUserRequest,
    LoginResponse,
    NewPasswordRequest,
    PasswordResponse,
    PasswordValuesRequest,
    ResetPasswordRequest,
    SocialLoginRequest,
    UserResponse,
    UserStatusEnum,
} from '@repo/shared';
import { Request, Response } from 'express';
import {
    ChangePasswordCommand,
    ChangePasswordHandler,
} from '../../application/commands/change-password.handler';
import { LoginCommand, LoginHandler } from '../../application/commands/login.handler';
import { LogoutCommand, LogoutHandler } from '../../application/commands/logout.handler';
import {
    RefreshTokenCommand,
    RefreshTokenHandler,
} from '../../application/commands/refresh-token.handler';
import { RegisterCommand, RegisterHandler } from '../../application/commands/register.handler';
import {
    ResendVerificationCommand,
    ResendVerificationHandler,
} from '../../application/commands/resend-verification.handler';
import {
    ResetPasswordCommand,
    ResetPasswordHandler,
} from '../../application/commands/reset-password.handler';
import {
    SetNewPasswordCommand,
    SetNewPasswordHandler,
} from '../../application/commands/set-new-password.handler';
import {
    SocialLoginCommand,
    SocialLoginHandler,
} from '../../application/commands/social-login.handler';
import {
    VerifyEmailCommand,
    VerifyEmailHandler,
} from '../../application/commands/verify-email.handler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly changePasswordHandler: ChangePasswordHandler,
        private readonly loginHandler: LoginHandler,
        private readonly logoutHandler: LogoutHandler,
        private readonly refreshTokenHandler: RefreshTokenHandler,
        private readonly registerHandler: RegisterHandler,
        private readonly resendVerificationHandler: ResendVerificationHandler,
        private readonly resetPasswordHandler: ResetPasswordHandler,
        private readonly setNewPasswordHandler: SetNewPasswordHandler,
        private readonly socialLoginHandler: SocialLoginHandler,
        private readonly verifyEmailHandler: VerifyEmailHandler,
    ) {}

    @Post('local/register')
    async register(@Body() credentials: CreateUserRequest): Promise<LoginResponse> {
        return this.registerHandler.execute(new RegisterCommand(credentials));
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('local/login')
    async login(@CurrentUser() user: User): Promise<LoginResponse> {
        return this.loginHandler.execute(new LoginCommand({ user }));
    }

    @Delete('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: User): Promise<PasswordResponse> {
        return this.logoutHandler.execute(new LogoutCommand({ userId: user.id }));
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @Serialize(UserResponse)
    getProfile(@CurrentUser() user: User): User {
        return user;
    }

    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<LoginResponse> {
        return this.refreshTokenHandler.execute(new RefreshTokenCommand({ refreshToken }));
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string): Promise<PasswordResponse> {
        return this.verifyEmailHandler.execute(new VerifyEmailCommand({ token }));
    }

    @Verified(UserStatusEnum.PENDING)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Post('resend-verify-email')
    resendConfirmToken(@CurrentUser() user: User): Promise<PasswordResponse> {
        return this.resendVerificationHandler.execute(new ResendVerificationCommand({ user }));
    }

    @Post('password/reset')
    resetPassword(@Body() { email }: ResetPasswordRequest): Promise<PasswordResponse> {
        return this.resetPasswordHandler.execute(new ResetPasswordCommand({ email }));
    }

    @Patch('password/new')
    setNewPassword(@Body() data: NewPasswordRequest): Promise<PasswordResponse> {
        return this.setNewPasswordHandler.execute(new SetNewPasswordCommand(data));
    }

    @Patch('password/change')
    @Verified(UserStatusEnum.VERIFIED)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    changePassword(
        @CurrentUser() user: User,
        @Body() passwordValues: PasswordValuesRequest,
    ): Promise<PasswordResponse> {
        return this.changePasswordHandler.execute(
            new ChangePasswordCommand({
                user,
                ...passwordValues,
            }),
        );
    }

    @HttpCode(200)
    @Post('social/login')
    async socialLogin(@Body() socialLoginData: SocialLoginRequest): Promise<LoginResponse> {
        return this.socialLoginHandler.execute(new SocialLoginCommand(socialLoginData));
    }

    @Get('google')
    @UseGuards(AuthGuard(AUTH.GOOGLE))
    async googleAuth(): Promise<void> {
        // Guard initiates Google OAuth flow
    }

    @Get('google/redirect')
    @UseGuards(AuthGuard(AUTH.GOOGLE))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
        const socialUser = req.user as any;

        const { accessToken, refreshToken } = await this.socialLoginHandler.execute(
            new SocialLoginCommand({
                provider: socialUser.provider,
                providerId: socialUser.providerId,
                email: socialUser.email,
                displayName: socialUser.name,
                image: socialUser.picture,
                verified: true,
            }),
        );

        res.redirect(
            `${process.env.FRONTEND_ORIGIN}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
        );
    }
}
