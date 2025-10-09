'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@repo/ui/components';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    MessageSquare,
    Play,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data
const mockCourseData = {
    id: '1',
    title: 'Contemporary Dance Fundamentals',
    modules: [
        {
            id: 'm1',
            title: 'Introduction & Basics',
            lessons: [
                {
                    id: 'l1',
                    title: 'Welcome to Contemporary Dance',
                    duration: '5:23',
                    completed: true,
                    videoUrl: '',
                    description: 'Introduction to the course and what you will learn',
                },
                {
                    id: 'l2',
                    title: 'Understanding Body Alignment',
                    duration: '12:45',
                    completed: true,
                    videoUrl: '',
                    description: 'Learn proper body alignment and posture',
                },
                {
                    id: 'l3',
                    title: 'Basic Movement Principles',
                    duration: '15:30',
                    completed: false,
                    videoUrl: '',
                    description: 'Core principles of contemporary movement',
                },
            ],
        },
        {
            id: 'm2',
            title: 'Core Techniques',
            lessons: [
                {
                    id: 'l4',
                    title: 'Floor Work Fundamentals',
                    duration: '18:20',
                    completed: false,
                    videoUrl: '',
                },
                {
                    id: 'l5',
                    title: 'Weight Transfer & Balance',
                    duration: '14:55',
                    completed: false,
                    videoUrl: '',
                },
            ],
        },
    ],
};

export default function CourseLearningPage() {
    const [currentLessonIndex, setCurrentLessonIndex] = useState(2); // Starting at lesson 3
    const allLessons = mockCourseData.modules.flatMap((m) => m.lessons);
    const currentLesson = allLessons[currentLessonIndex];

    const goToNextLesson = () => {
        if (currentLessonIndex < allLessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const goToPreviousLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <div className="border-b bg-background">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <Link href="/courses">
                                <Button variant="ghost" size="sm">
                                    <ChevronLeft className="mr-1 h-4 w-4" />
                                    Back to Courses
                                </Button>
                            </Link>
                            <div>
                                <h1 className="font-semibold">{mockCourseData.title}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {currentLessonIndex + 1} of {allLessons.length} lessons
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPreviousLesson}
                                disabled={currentLessonIndex === 0}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextLesson}
                                disabled={currentLessonIndex === allLessons.length - 1}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Video Player */}
                <div className="aspect-video bg-black">
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center text-white">
                            <Play className="mx-auto mb-4 h-20 w-20 opacity-50" />
                            <p className="text-sm opacity-75">Video Player Placeholder</p>
                            <p className="text-xs opacity-50">{currentLesson?.title}</p>
                        </div>
                    </div>
                </div>

                {/* Lesson Details */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="notes">Notes</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                            <TabsTrigger value="questions">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Q&A
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <div>
                                <h2 className="mb-2 text-2xl font-bold">{currentLesson?.title}</h2>
                                <p className="text-muted-foreground">
                                    {currentLesson?.description ||
                                        'Detailed lesson description will appear here.'}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{currentLesson?.duration}</span>
                                </div>
                                {currentLesson?.completed && (
                                    <div className="flex items-center gap-1 text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Completed</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={goToNextLesson}
                                    disabled={currentLessonIndex === allLessons.length - 1}
                                >
                                    Next Lesson
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button variant="outline">Mark as Complete</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Notes</CardTitle>
                                    <CardDescription>
                                        Take notes as you learn. They'll be saved automatically.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        className="w-full rounded-md border p-4"
                                        rows={10}
                                        placeholder="Add your notes here..."
                                    />
                                    <Button className="mt-4">Save Notes</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="resources" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Downloadable Resources</CardTitle>
                                    <CardDescription>
                                        Additional materials for this lesson
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary"
                                        >
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    Lesson Notes & Key Points.pdf
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    2.5 MB
                                                </p>
                                            </div>
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary"
                                        >
                                            <FileText className="h-5 w-5 text-primary" />
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    Practice Routine Guide.pdf
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    1.8 MB
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="questions" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Questions & Answers</CardTitle>
                                    <CardDescription>
                                        Ask questions and discuss with other students
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-muted"></div>
                                                <div>
                                                    <p className="text-sm font-medium">John Doe</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        2 days ago
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm">
                                            How should I position my weight during floor
                                            transitions?
                                        </p>
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Ask a Question
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Sidebar - Course Content */}
            <div className="w-80 border-l bg-muted/30">
                <div className="border-b p-4">
                    <h3 className="font-semibold">Course Content</h3>
                    <p className="text-xs text-muted-foreground">
                        {allLessons.filter((l) => l.completed).length} / {allLessons.length} lessons
                        completed
                    </p>
                </div>
                <div className="h-[calc(100vh-8rem)] overflow-y-auto">
                    {mockCourseData.modules.map((module) => (
                        <div key={module.id} className="border-b p-4">
                            <h4 className="mb-3 font-medium">{module.title}</h4>
                            <div className="space-y-1">
                                {module.lessons.map((lesson, idx) => {
                                    const lessonGlobalIndex = allLessons.findIndex(
                                        (l) => l.id === lesson.id,
                                    );
                                    const isActive = lessonGlobalIndex === currentLessonIndex;
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLessonIndex(lessonGlobalIndex)}
                                            className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'hover:bg-secondary'
                                            }`}
                                        >
                                            {lesson.completed ? (
                                                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                                            ) : (
                                                <div className="h-4 w-4 flex-shrink-0 rounded-full border-2" />
                                            )}
                                            <span className="flex-1 truncate">{lesson.title}</span>
                                            <span className="text-xs opacity-75">
                                                {lesson.duration}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
