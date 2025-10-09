import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: string[];
            accessToken?: string;
            refreshToken?: string;
        } & DefaultSession['user'];
        error?: string;
    }

    interface User extends DefaultUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roles: string[];
        accessToken?: string;
        refreshToken?: string;
        accessTokenExpires?: number;
        error?: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: string[];
        };
    }
}
