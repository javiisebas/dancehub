import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordRequest {
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email!: string;
}
