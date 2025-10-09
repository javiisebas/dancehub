import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUploader } from './file-uploader';

const meta: Meta<typeof FileUploader> = {
    title: 'UI/FileUploader',
    component: FileUploader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="w-[500px]">
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    maxFiles={5}
                    maxSize={5 * 1024 * 1024}
                />
            </div>
        );
    },
};

export const ImagesOnly: Story = {
    render: () => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="w-[500px]">
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    accept={{ 'image/*': [] }}
                    maxFiles={3}
                    maxSize={2 * 1024 * 1024}
                />
            </div>
        );
    },
};

export const SingleFile: Story = {
    render: () => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div className="w-[500px]">
                <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    maxFiles={1}
                    maxSize={10 * 1024 * 1024}
                />
            </div>
        );
    },
};
