import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class AuthPasswordService {
    /**
     * Hash a password using argon2
     * @param password - The password to hash
     * @returns The hashed password
     */
    public async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    /**
     * Verify a password against a hashed password
     * @param hashedPassword - The hashed password
     * @param plainPassword - The plain password
     * @returns True if the password is correct, false otherwise
     */
    public async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, plainPassword);
    }
}
