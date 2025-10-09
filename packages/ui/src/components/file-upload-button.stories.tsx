import type { Meta, StoryObj } from '@storybook/react';
import { FileUploadButton } from './file-upload-button';

const meta = {
    title: 'Components/FileUploadButton',
    component: FileUploadButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FileUploadButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onFilesSelected: (files) => console.log('Files selected:', files),
        onComplete: () => console.log('Upload complete'),
    },
};

export const CustomLabel: Story = {
    args: {
        buttonLabel: 'Choose Files',
        onFilesSelected: (files) => console.log('Files selected:', files),
        onComplete: () => console.log('Upload complete'),
    },
};

export const ImagesOnly: Story = {
    args: {
        buttonLabel: 'Upload Images',
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
        },
        onFilesSelected: (files) => console.log('Files selected:', files),
        onComplete: () => console.log('Upload complete'),
    },
};

export const SingleFile: Story = {
    args: {
        buttonLabel: 'Upload File',
        multiple: false,
        maxFiles: 1,
        onFilesSelected: (files) => console.log('Files selected:', files),
        onComplete: () => console.log('Upload complete'),
    },
};

export const SecondaryVariant: Story = {
    args: {
        buttonLabel: 'Upload Files',
        buttonVariant: 'secondary',
        buttonSize: 'lg',
        onFilesSelected: (files) => console.log('Files selected:', files),
        onComplete: () => console.log('Upload complete'),
    },
};
