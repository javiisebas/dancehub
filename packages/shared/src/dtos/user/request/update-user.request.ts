import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserStatusEnum } from '../../../enums/user-status.enum';

export class UpdateUserRequest {
    @IsOptional()
    @IsEmail({}, { message: 'Invalid email format' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password?: string;

    @IsOptional()
    @IsString()
    refreshToken?: string | null;

    @IsOptional()
    @IsEnum(UserStatusEnum)
    status?: UserStatusEnum;
}
