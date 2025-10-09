'use client';

import { Icon } from '@iconify/react';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { useLessonProgress } from '@web/hooks/use-lesson-progress.hook';
import { LessonVideoPlayer } from './lesson-video-player';

interface Lesson {
    id: string;
    title: string;
    description: string;
    videoStorageId: string;
    videoUrl: string;
    posterUrl?: string;
    duration: number;
    order: number;
}

interface CourseLessonExampleProps {
    lesson: Lesson;
    courseId: string;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export function CourseLessonExample({
    lesson,
    courseId,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
}: CourseLessonExampleProps) {
    const { progress, isSaving, updateProgress, markAsComplete } = useLessonProgress(
        lesson.id,
        courseId,
    );

    const handleComplete = async () => {
        await markAsComplete();

        if (hasNext && onNext) {
            setTimeout(() => {
                onNext();
            }, 1000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{lesson.title}</h1>
                    <p className="mt-2 text-muted-foreground">{lesson.description}</p>
                </div>

                {isSaving && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon icon="iconoir:refresh" className="h-4 w-4 animate-spin" />
                        Saving progress...
                    </div>
                )}
            </div>

            <LessonVideoPlayer
                lessonId={lesson.id}
                videoUrl={lesson.videoUrl}
                posterUrl={lesson.posterUrl}
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                onComplete={handleComplete}
                onProgress={updateProgress}
            />

            <Card className="p-6">
                <div className="flex items-center justify-between">
                    <Button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        variant="outline"
                        size="lg"
                    >
                        <Icon icon="iconoir:nav-arrow-left" className="mr-2 h-5 w-5" />
                        Previous Lesson
                    </Button>

                    <div className="text-center">
                        <div className="text-sm font-medium">
                            {progress.completed ? (
                                <span className="text-green-600 dark:text-green-400">
                                    ✓ Lesson Completed
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    {progress.progress.toFixed(0)}% watched
                                </span>
                            )}
                        </div>
                    </div>

                    <Button onClick={onNext} disabled={!hasNext} size="lg">
                        Next Lesson
                        <Icon icon="iconoir:nav-arrow-right" className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
