import type { Meta, StoryObj } from '@storybook/react';
import { MediaFile, MediaGallery } from './media-gallery';

const meta = {
    title: 'Components/MediaGallery',
    component: MediaGallery,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MediaGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockFiles: MediaFile[] = [
    {
        id: '1',
        url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
        originalName: 'Mountain Landscape.jpg',
        filename: 'mountain-landscape.jpg',
        mimeType: 'image/jpeg',
        size: 2048000,
        extension: 'jpg',
        visibility: 'public',
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1682687221038-404670f09439?w=400',
        originalName: 'Ocean Sunset.png',
        filename: 'ocean-sunset.png',
        mimeType: 'image/png',
        size: 3145728,
        extension: 'png',
        visibility: 'private',
    },
    {
        id: '3',
        url: 'https://example.com/video.mp4',
        originalName: 'Dance Tutorial.mp4',
        filename: 'dance-tutorial.mp4',
        mimeType: 'video/mp4',
        size: 52428800,
        extension: 'mp4',
        visibility: 'public',
    },
    {
        id: '4',
        url: 'https://example.com/document.pdf',
        originalName: 'Course Material.pdf',
        filename: 'course-material.pdf',
        mimeType: 'application/pdf',
        size: 1048576,
        extension: 'pdf',
        visibility: 'private',
    },
];

export const Default: Story = {
    args: {
        files: mockFiles,
        onFileClick: (file) => console.log('File clicked:', file),
    },
};

export const WithDelete: Story = {
    args: {
        files: mockFiles,
        allowDelete: true,
        onFileClick: (file) => console.log('File clicked:', file),
        onDelete: (fileId) => console.log('Delete file:', fileId),
    },
};

export const WithPagination: Story = {
    args: {
        files: mockFiles,
        pagination: {
            page: 1,
            totalPages: 5,
            onPageChange: (page) => console.log('Page changed:', page),
        },
        onFileClick: (file) => console.log('File clicked:', file),
    },
};

export const Loading: Story = {
    args: {
        files: [],
        isLoading: true,
    },
};

export const Empty: Story = {
    args: {
        files: [],
        onFileClick: (file) => console.log('File clicked:', file),
    },
};

export const ImagesOnly: Story = {
    args: {
        files: mockFiles.filter((f) => f.mimeType.startsWith('image/')),
        allowDelete: true,
        onFileClick: (file) => console.log('File clicked:', file),
        onDelete: (fileId) => console.log('Delete file:', fileId),
    },
};
