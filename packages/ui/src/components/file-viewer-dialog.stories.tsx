import type { Meta, StoryObj } from '@storybook/react';
import { FileData, FileViewerDialog } from './file-viewer-dialog';

const meta = {
    title: 'Components/FileViewerDialog',
    component: FileViewerDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof FileViewerDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const imageFile: FileData = {
    id: '1',
    url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    originalName: 'mountain-landscape.jpg',
    mimeType: 'image/jpeg',
    size: 2048000,
    extension: 'jpg',
    visibility: 'public',
};

const pdfFile: FileData = {
    id: '2',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    originalName: 'document.pdf',
    mimeType: 'application/pdf',
    size: 13264,
    extension: 'pdf',
    visibility: 'private',
};

const videoFile: FileData = {
    id: '3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    originalName: 'sample-video.mp4',
    mimeType: 'video/mp4',
    size: 158008374,
    extension: 'mp4',
    visibility: 'public',
};

const audioFile: FileData = {
    id: '4',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    originalName: 'sample-audio.mp3',
    mimeType: 'audio/mpeg',
    size: 7311410,
    extension: 'mp3',
    visibility: 'public',
};

const unknownFile: FileData = {
    id: '5',
    url: 'https://example.com/file.zip',
    originalName: 'archive.zip',
    mimeType: 'application/zip',
    size: 10485760,
    extension: 'zip',
    visibility: 'private',
};

export const Image: Story = {
    args: {
        file: imageFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: false,
    },
};

export const PDF: Story = {
    args: {
        file: pdfFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: false,
    },
};

export const Video: Story = {
    args: {
        file: videoFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: false,
    },
};

export const Audio: Story = {
    args: {
        file: audioFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: false,
    },
};

export const UnknownType: Story = {
    args: {
        file: unknownFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: false,
    },
};

export const Downloading: Story = {
    args: {
        file: imageFile,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
        onDownload: () => console.log('Download clicked'),
        isDownloading: true,
    },
};

export const NoFile: Story = {
    args: {
        file: null,
        open: true,
        onOpenChange: (open) => console.log('Dialog open:', open),
    },
};
