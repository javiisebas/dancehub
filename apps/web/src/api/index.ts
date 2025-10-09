import { createAxiosInstance } from '@web/config/axios.config';

class ApiClient {
    async get<T>(url: string, withAuth: boolean = true): Promise<T> {
        const instance = await createAxiosInstance(withAuth);
        const response = await instance.get<T>(url);
        return response.data;
    }

    async post<T, D = any>(url: string, data?: D, withAuth: boolean = true): Promise<T> {
        const instance = await createAxiosInstance(withAuth);
        const response = await instance.post<T>(url, data);
        return response.data;
    }

    async uploadFile<T>(
        url: string,
        formData: FormData,
        withAuth: boolean = true,
        onProgress?: (progress: number) => void,
    ): Promise<T> {
        const instance = await createAxiosInstance(withAuth);

        const response = await instance.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    }

    async put<T, D = any>(url: string, data?: D, withAuth: boolean = true): Promise<T> {
        const instance = await createAxiosInstance(withAuth);
        const response = await instance.put<T>(url, data);
        return response.data;
    }

    async patch<T, D = any>(url: string, data?: D, withAuth: boolean = true): Promise<T> {
        const instance = await createAxiosInstance(withAuth);
        const response = await instance.patch<T>(url, data);
        return response.data;
    }

    async delete<T>(url: string, withAuth: boolean = true): Promise<T> {
        const instance = await createAxiosInstance(withAuth);
        const response = await instance.delete<T>(url);
        return response.data;
    }
}

export const apiClient = new ApiClient();
