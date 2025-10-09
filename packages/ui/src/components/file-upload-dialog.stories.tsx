import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from './button';
import { FileUploadDialog } from './file-upload-dialog';
import { FileUploadItem } from './file-uploader';

const meta: Meta<typeof FileUploadDialog> = {
    title: 'Complex/FileUploadDialog',
    component: FileUploadDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUploadDialog>;

export const Default: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [files, setFiles] = useState<FileUploadItem[]>([]);

        const handleFilesSelected = async (selectedFiles: File[]) => {
            const newFiles: FileUploadItem[] = selectedFiles.map((file, index) => ({
                id: `file-${Date.now()}-${index}`,
                file,
                preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                progress: 0,
                status: 'uploading' as const,
            }));

            setFiles((prev) => [...prev, ...newFiles]);

            for (const newFile of newFiles) {
                await simulateUpload(newFile.id);
            }
        };

        const simulateUpload = async (fileId: string) => {
            for (let i = 0; i <= 100; i += 10) {
                await new Promise((resolve) => setTimeout(resolve, 200));
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileId ? { ...f, progress: i, status: 'uploading' as const } : f,
                    ),
                );
            }
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileId ? { ...f, status: 'complete' as const, progress: 100 } : f,
                ),
            );
        };

        const handleComplete = () => {
            console.log('Upload complete!', files);
            setFiles([]);
            setOpen(false);
        };

        const handleRemove = (fileId: string) => {
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
        };

        return (
            <div>
                <Button onClick={() => setOpen(true)}>Open Upload Dialog</Button>
                <FileUploadDialog
                    open={open}
                    onOpenChange={setOpen}
                    onFilesSelected={handleFilesSelected}
                    onComplete={handleComplete}
                    onRemoveFile={handleRemove}
                    files={files}
                    isUploading={files.some((f) => f.status === 'uploading')}
                />
            </div>
        );
    },
};

export const ImagesOnly: Story = {
    render: () => {
        const [open, setOpen] = useState(false);
        const [files, setFiles] = useState<FileUploadItem[]>([]);

        return (
            <div>
                <Button onClick={() => setOpen(true)}>Upload Images</Button>
                <FileUploadDialog
                    open={open}
                    onOpenChange={setOpen}
                    onFilesSelected={(f) => console.log('Files selected:', f)}
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                    title="Upload Images"
                    description="Select image files only"
                    files={files}
                />
            </div>
        );
    },
};

export const SingleFile: Story = {
    render: () => {
        const [open, setOpen] = useState(false);

        return (
            <div>
                <Button onClick={() => setOpen(true)}>Upload Single File</Button>
                <FileUploadDialog
                    open={open}
                    onOpenChange={setOpen}
                    onFilesSelected={(f) => console.log('File selected:', f)}
                    multiple={false}
                    maxFiles={1}
                    title="Upload File"
                    description="Select a single file"
                />
            </div>
        );
    },
};
