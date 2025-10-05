import { CurrentUser } from '@api/common/decorators/current-user.decorator';
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
    UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
        private readonly registerHandler: RegisterHandler,
        private readonly loginHandler: LoginHandler,
        private readonly logoutHandler: LogoutHandler,
        private readonly verifyEmailHandler: VerifyEmailHandler,
        private readonly resendVerificationHandler: ResendVerificationHandler,
        private readonly resetPasswordHandler: ResetPasswordHandler,
        private readonly setNewPasswordHandler: SetNewPasswordHandler,
        private readonly changePasswordHandler: ChangePasswordHandler,
        private readonly socialLoginHandler: SocialLoginHandler,
        private readonly refreshTokenHandler: RefreshTokenHandler,
    ) {}

    @ApiCreatedResponse({ description: 'Create an account with provided data if correct' })
    @Post('local/register')
    async register(@Body() credentials: CreateUserRequest): Promise<LoginResponse> {
        return this.registerHandler.execute(new RegisterCommand(credentials));
    }

    @ApiOkResponse({ description: 'Logs in user' })
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('local/login')
    async login(@CurrentUser() user: User): Promise<LoginResponse> {
        return this.loginHandler.execute(new LoginCommand(user));
    }

    @ApiOkResponse({ description: 'Logs out user' })
    @Delete('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@CurrentUser() user: User): Promise<PasswordResponse> {
        return this.logoutHandler.execute(new LogoutCommand(user.id));
    }

    @ApiOkResponse({ description: 'Currently logged user profile' })
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@CurrentUser() user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt:
                user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
            updatedAt:
                user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt,
        };
    }

    @ApiOkResponse({ description: 'Refresh tokens' })
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string): Promise<LoginResponse> {
        return this.refreshTokenHandler.execute(new RefreshTokenCommand(refreshToken));
    }

    @ApiOkResponse({ description: 'Confirm account' })
    @Get('verify-email')
    verifyEmail(@Query('token') token: string): Promise<PasswordResponse> {
        return this.verifyEmailHandler.execute(new VerifyEmailCommand(token));
    }

    @ApiOkResponse({ description: 'Resend confirmation token' })
    @Verified(UserStatusEnum.PENDING)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    @Post('resend-verify-email')
    resendConfirmToken(@CurrentUser() user: User): Promise<PasswordResponse> {
        return this.resendVerificationHandler.execute(new ResendVerificationCommand(user));
    }

    @ApiOkResponse({ description: 'Reset your password' })
    @Post('password/reset')
    resetPassword(@Body() { email }: ResetPasswordRequest): Promise<PasswordResponse> {
        return this.resetPasswordHandler.execute(new ResetPasswordCommand(email));
    }

    @ApiOkResponse({ description: 'Set new password' })
    @Patch('password/new')
    setNewPassword(@Body() data: NewPasswordRequest): Promise<PasswordResponse> {
        return this.setNewPasswordHandler.execute(
            new SetNewPasswordCommand(data.token, data.newPassword, data.confirmPassword),
        );
    }

    @ApiOkResponse({ description: 'Change your password' })
    @Patch('password/change')
    @Verified(UserStatusEnum.VERIFIED)
    @UseGuards(JwtAuthGuard, VerifiedGuard)
    changePassword(
        @CurrentUser() user: User,
        @Body() passwordValues: PasswordValuesRequest,
    ): Promise<PasswordResponse> {
        return this.changePasswordHandler.execute(
            new ChangePasswordCommand(
                user,
                passwordValues.oldPassword,
                passwordValues.newPassword,
                passwordValues.confirmPassword,
            ),
        );
    }

    @ApiOkResponse({ description: 'Login o registro de usuario vía proveedor social' })
    @Post('social/login')
    async socialLogin(@Body() socialLoginDto: SocialLoginRequest): Promise<LoginResponse> {
        return this.socialLoginHandler.execute(new SocialLoginCommand(socialLoginDto));
    }
}
