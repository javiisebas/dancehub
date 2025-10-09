'use client';

import { cn } from '../../utils/cn';

interface RichTextRendererProps {
    content: string | null | undefined;
    className?: string;
}

export function RichTextRenderer({ content, className }: RichTextRendererProps) {
    if (!content) {
        return null;
    }

    return (
        <div
            className={cn(
                'prose prose-sm sm:prose-base lg:prose-lg max-w-none',
                'prose-headings:font-bold prose-headings:text-foreground',
                'prose-p:text-foreground prose-p:leading-relaxed',
                'prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80',
                'prose-strong:text-foreground prose-strong:font-bold',
                'prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
                'prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:p-4',
                'prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground',
                'prose-ul:list-disc prose-ul:ml-6',
                'prose-ol:list-decimal prose-ol:ml-6',
                'prose-li:text-foreground prose-li:my-1',
                'prose-table:border-collapse prose-table:w-full',
                'prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-bold',
                'prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2',
                'prose-img:rounded-lg prose-img:shadow-md',
                'prose-hr:border-border',
                className,
            )}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
