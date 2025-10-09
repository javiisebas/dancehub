import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { BookOpen, Clock, Play, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockEnrolledCourses = [
    {
        id: '1',
        title: 'Contemporary Dance Fundamentals',
        artist: 'Sarah Johnson',
        thumbnail: '/placeholder-course.jpg',
        progress: 45,
        totalLessons: 24,
        completedLessons: 11,
        lastWatched: '2 days ago',
    },
    {
        id: '2',
        title: 'Hip Hop Choreography Masterclass',
        artist: 'Marcus Williams',
        thumbnail: '/placeholder-course.jpg',
        progress: 78,
        totalLessons: 16,
        completedLessons: 12,
        lastWatched: '1 day ago',
    },
    {
        id: '3',
        title: 'Ballet Technique & Artistry',
        artist: 'Elena Petrova',
        thumbnail: '/placeholder-course.jpg',
        progress: 12,
        totalLessons: 32,
        completedLessons: 4,
        lastWatched: '1 week ago',
    },
];

export default function MyCoursesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">My Courses</h2>
                    <p className="text-muted-foreground">Continue your learning journey</p>
                </div>
                <Link href="/marketplace">
                    <Button>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Browse More
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mockEnrolledCourses.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24.5</div>
                    </CardContent>
                </Card>
            </div>

            {/* Course List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Continue Learning</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockEnrolledCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <div className="relative aspect-video bg-muted">
                                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                    Course Preview
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                    <Link href={`/courses/${course.id}/learn`}>
                                        <Button size="lg" className="gap-2">
                                            <Play className="h-5 w-5" />
                                            Continue
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <CardHeader className="flex-1">
                                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                <CardDescription>by {course.artist}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{course.progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary">
                                        <div
                                            className="h-2 rounded-full bg-primary"
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>
                                        {course.completedLessons}/{course.totalLessons} lessons
                                    </span>
                                    <span>{course.lastWatched}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
