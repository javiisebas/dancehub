import { Profile } from 'next-auth';

export interface GoogleProfile extends Profile {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
}

export interface FacebookProfile extends Profile {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    picture: {
        data: {
            url: string;
        };
    };
}
