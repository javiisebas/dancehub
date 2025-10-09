import type { Meta, StoryObj } from '@storybook/react';
import { VideoPlayer } from './video-player';

const meta: Meta<typeof VideoPlayer> = {
    title: 'Complex/VideoPlayer',
    component: VideoPlayer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const SingleSource: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

export const MultipleSources: Story = {
    args: {
        sources: [
            {
                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4',
                type: 'video/mp4',
                size: 1080,
            },
            {
                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
                type: 'video/mp4',
                size: 720,
            },
            {
                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
                type: 'video/mp4',
                size: 576,
            },
        ],
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

export const WithSubtitles: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        tracks: [
            {
                kind: 'captions',
                label: 'English',
                srclang: 'en',
                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-English.vtt',
                default: true,
            },
            {
                kind: 'captions',
                label: 'French',
                srclang: 'fr',
                src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-French.vtt',
            },
        ],
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

export const Autoplay: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        autoplay: true,
        muted: true,
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

export const Loop: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        loop: true,
        muted: true,
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

export const WithCallbacks: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        onPlay: () => console.log('Video started playing'),
        onPause: () => console.log('Video paused'),
        onEnded: () => console.log('Video ended'),
        onTimeUpdate: (time) => console.log('Current time:', time),
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
            <p className="mt-4 text-sm text-muted-foreground">Check console for callbacks</p>
        </div>
    ),
};

export const CustomOptions: Story = {
    args: {
        sources: {
            src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4',
            type: 'video/mp4',
        },
        poster: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg',
        options: {
            speed: { selected: 1, options: [0.5, 1, 1.5, 2, 3] },
            quality: { default: 720, options: [1080, 720, 480, 360] },
        },
    },
    render: (args) => (
        <div className="w-[800px]">
            <VideoPlayer {...args} />
        </div>
    ),
};

