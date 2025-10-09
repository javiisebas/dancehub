import { useCallback, useState } from 'react';

interface UseRichTextEditorReturn {
    content: string;
    setContent: (content: string) => void;
    handleChange: (content: string) => void;
    isEmpty: boolean;
    reset: () => void;
}

export function useRichTextEditor(initialContent: string = ''): UseRichTextEditorReturn {
    const [content, setContent] = useState<string>(initialContent);

    const handleChange = useCallback((newContent: string) => {
        setContent(newContent);
    }, []);

    const isEmpty = !content || content === '<p></p>' || content.trim() === '';

    const reset = useCallback(() => {
        setContent('');
    }, []);

    return {
        content,
        setContent,
        handleChange,
        isEmpty,
        reset,
    };
}
