import type { Meta, StoryObj } from '@storybook/react';
import { PDFViewer } from './pdf-viewer';

const meta: Meta<typeof PDFViewer> = {
    title: 'Complex/PDFViewer',
    component: PDFViewer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PDFViewer>;

export const Default: Story = {
    args: {
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        filename: 'Sample Document.pdf',
    },
};

export const WithoutFilename: Story = {
    args: {
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    },
};

export const WithDownload: Story = {
    args: {
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        filename: 'Important Document.pdf',
        onDownload: () => {
            console.log('Download clicked');
            alert('Download functionality triggered!');
        },
    },
};

export const LargePDF: Story = {
    args: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        filename: 'Large Technical Document.pdf',
    },
};

export const WithCustomClassName: Story = {
    args: {
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        filename: 'Styled Document.pdf',
        className: 'border-2 border-primary rounded-lg',
    },
};
