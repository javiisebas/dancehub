import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayerCard } from './video-player-card';

const meta: Meta<typeof VideoPlayerCard> = {
    title: 'Complex/VideoPlayerCard',
    component: VideoPlayerCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoPlayerCard>;

export const Default: Story = {
    args: {
        title: 'Introduction to React',
        description: 'Learn the basics of React in this comprehensive tutorial',
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayerCard {...args} />
        </div>
    ),
};

export const WithoutDescription: Story = {
    args: {
        title: 'Quick Tutorial',
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayerCard {...args} />
        </div>
    ),
};

export const NoTitleOrDescription: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayerCard {...args} />
        </div>
    ),
};

export const WithCallbacks: Story = {
    args: {
        title: 'Advanced Patterns',
        description: 'Explore advanced patterns and best practices',
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        onPlay: () => console.log('Playing'),
        onPause: () => console.log('Paused'),
        onEnded: () => console.log('Ended'),
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayerCard {...args} />
            <p className="mt-4 text-sm text-muted-foreground">Check console for callbacks</p>
        </div>
    ),
};

