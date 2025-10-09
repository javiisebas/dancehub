'use client';

import { useState } from 'react';

export interface LessonProgress {
    lessonId: string;
    completed: boolean;
    progress: number;
    lastWatchedAt?: Date;
}

export function useLessonProgress(lessonId: string, courseId: string) {
    const [progress, setProgress] = useState<LessonProgress>({
        lessonId,
        completed: false,
        progress: 0,
    });
    const [isSaving, setIsSaving] = useState(false);

    const updateProgress = async (newProgress: number) => {
        setIsSaving(true);
        setProgress((prev) => ({
            ...prev,
            progress: newProgress,
            completed: newProgress >= 100,
            lastWatchedAt: new Date(),
        }));
        setTimeout(() => setIsSaving(false), 500);
    };

    const markAsComplete = async () => {
        setIsSaving(true);
        setProgress((prev) => ({
            ...prev,
            completed: true,
            progress: 100,
            lastWatchedAt: new Date(),
        }));
        setTimeout(() => setIsSaving(false), 500);
    };

    return {
        progress,
        isSaving,
        updateProgress,
        markAsComplete,
    };
}
