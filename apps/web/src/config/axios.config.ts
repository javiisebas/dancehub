import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const createAxiosInstance = async (withAuth: boolean = true): Promise<AxiosInstance> => {
    const instance = axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        timeout: 300000, // 5 minutes for large file uploads
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const isServer = typeof window === 'undefined';

    if (!withAuth) {
        return instance;
    }

    instance.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            let token: string | undefined;

            if (isServer) {
                const { headers, cookies } = await import('next/headers');
                const reqHeaders = await headers();
                const reqCookies = await cookies();

                const fakeReq = {
                    headers: Object.fromEntries(reqHeaders),
                    cookies: reqCookies,
                } as unknown as NextApiRequest;

                const tokenData = await getToken({
                    req: fakeReq,
                    secret: process.env.NEXTAUTH_SECRET,
                });

                token = tokenData?.accessToken;
            } else {
                const session = await getSession();
                token = session?.user?.accessToken as string;
            }

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response?.status === 401) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        },
    );

    return instance;
};

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
