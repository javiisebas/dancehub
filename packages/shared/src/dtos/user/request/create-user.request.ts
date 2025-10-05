import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequest {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email!: string;

    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(255, { message: 'Name cannot exceed 255 characters' })
    name!: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password!: string;

    @IsString({ message: 'Confirm password must be a string' })
    @IsNotEmpty({ message: 'Confirm password cannot be empty' })
    @MinLength(8, { message: 'Confirm password must be at least 8 characters long' })
    confirmPassword!: string;
}
