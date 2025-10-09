import { UploadFileResponse } from '@repo/shared';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { StorageService } from '../api/storage.service';

export const useStorageFile = (storageId: string): UseQueryResult<UploadFileResponse, Error> => {
    return useQuery({
        queryKey: ['storage', 'file', storageId],
        queryFn: () => StorageService.getFile(storageId),
        enabled: !!storageId,
    });
};

export const useStorageFileDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (storageId: string) => StorageService.deleteFile(storageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['storage', 'list'] });
            toast.success('Archivo eliminado correctamente');
        },
        onError: (error: Error) => {
            toast.error(`Error al eliminar archivo: ${error.message}`);
        },
    });
};

export const useStorageFileDownload = () => {
    return useMutation({
        mutationFn: async ({ storageId, filename }: { storageId: string; filename: string }) => {
            const blob = await StorageService.downloadFile(storageId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
        onSuccess: () => {
            toast.success('Archivo descargado');
        },
        onError: (error: Error) => {
            toast.error(`Error al descargar: ${error.message}`);
        },
    });
};
