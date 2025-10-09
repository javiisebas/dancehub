import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { Check, Clock, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';

// Mock data
const mockCourse = {
    id: '1',
    title: 'Contemporary Dance Fundamentals',
    artist: {
        id: 'artist-1',
        name: 'Sarah Johnson',
        bio: 'Professional contemporary dancer with 15+ years of experience',
        avatar: '/placeholder-avatar.jpg',
    },
    thumbnail: '/placeholder-course.jpg',
    price: 49.99,
    priceType: 'one-time',
    rating: 4.8,
    totalRatings: 1250,
    students: 2500,
    duration: '12 hours',
    level: 'Beginner',
    description:
        'Master the fundamentals of contemporary dance with comprehensive step-by-step instruction. This course covers everything from basic techniques to advanced choreography.',
    longDescription:
        'In this comprehensive course, you will learn the essential foundations of contemporary dance. We will cover proper form, technique, musicality, and expression. Each lesson builds upon the previous one, ensuring a structured learning path.',
    modules: [
        {
            id: 'm1',
            title: 'Introduction & Basics',
            lessons: [
                { id: 'l1', title: 'Welcome to Contemporary Dance', duration: '5:23' },
                { id: 'l2', title: 'Understanding Body Alignment', duration: '12:45' },
                { id: 'l3', title: 'Basic Movement Principles', duration: '15:30' },
            ],
        },
        {
            id: 'm2',
            title: 'Core Techniques',
            lessons: [
                { id: 'l4', title: 'Floor Work Fundamentals', duration: '18:20' },
                { id: 'l5', title: 'Weight Transfer & Balance', duration: '14:55' },
                { id: 'l6', title: 'Isolations & Control', duration: '16:40' },
            ],
        },
        {
            id: 'm3',
            title: 'Musicality & Expression',
            lessons: [
                { id: 'l7', title: 'Dancing to Music', duration: '13:25' },
                { id: 'l8', title: 'Emotional Expression', duration: '17:10' },
                { id: 'l9', title: 'Improvisation Techniques', duration: '19:30' },
            ],
        },
    ],
    whatYouWillLearn: [
        'Proper contemporary dance technique and form',
        'Floor work and weight transfer skills',
        'Musicality and rhythm interpretation',
        'Emotional expression through movement',
        'Improvisation and creative exploration',
        'Building confidence in performance',
    ],
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Hero */}
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-sm">
                            <Link
                                href="/marketplace"
                                className="text-muted-foreground hover:text-primary"
                            >
                                Marketplace
                            </Link>
                            <span className="text-muted-foreground">/</span>
                            <span>Course Details</span>
                        </div>
                        <h1 className="mb-4 text-4xl font-bold">{mockCourse.title}</h1>
                        <p className="mb-4 text-lg text-muted-foreground">
                            {mockCourse.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{mockCourse.rating}</span>
                                <span className="text-muted-foreground">
                                    ({mockCourse.totalRatings} ratings)
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{mockCourse.students.toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{mockCourse.duration}</span>
                            </div>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                {mockCourse.level}
                            </span>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="aspect-video rounded-lg bg-muted">
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                                <Play className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Course Preview</p>
                            </div>
                        </div>
                    </div>

                    {/* What You'll Learn */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What You'll Learn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2">
                                {mockCourse.whatYouWillLearn.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Course Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>
                                {mockCourse.modules.length} modules •{' '}
                                {mockCourse.modules.reduce((acc, m) => acc + m.lessons.length, 0)}{' '}
                                lessons • {mockCourse.duration} total
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockCourse.modules.map((module, index) => (
                                <div
                                    key={module.id}
                                    className="border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <h4 className="mb-3 font-semibold">
                                        {index + 1}. {module.title}
                                    </h4>
                                    <div className="space-y-2">
                                        {module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Play className="h-4 w-4 text-muted-foreground" />
                                                    <span>{lesson.title}</span>
                                                </div>
                                                <span className="text-muted-foreground">
                                                    {lesson.duration}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Instructor */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <div className="h-16 w-16 rounded-full bg-muted"></div>
                                <div>
                                    <h4 className="font-semibold">{mockCourse.artist.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {mockCourse.artist.bio}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Purchase Card */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <div className="text-3xl font-bold">
                                ${mockCourse.price}
                                {mockCourse.priceType === 'subscription' && (
                                    <span className="text-base font-normal text-muted-foreground">
                                        /month
                                    </span>
                                )}
                            </div>
                            <CardDescription>
                                {mockCourse.priceType === 'subscription'
                                    ? 'Monthly subscription'
                                    : 'One-time purchase - lifetime access'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href={`/courses/${mockCourse.id}/checkout`}>
                                <Button size="lg" className="w-full">
                                    Enroll Now
                                </Button>
                            </Link>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>
                                        {mockCourse.priceType === 'subscription'
                                            ? 'Access while subscribed'
                                            : 'Lifetime access'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>All video lessons in HD</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Downloadable resources</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Progress tracking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-primary" />
                                    <span>Community access</span>
                                </div>
                                {mockCourse.priceType === 'subscription' && (
                                    <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" />
                                        <span>Cancel anytime</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-center text-xs text-muted-foreground">
                                    30-day money-back guarantee
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
