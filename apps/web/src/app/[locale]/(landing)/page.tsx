import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { Award, BookOpen, Check, Sparkles, TrendingUp, Users, Video } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-24 md:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="mb-1 mr-2 inline h-4 w-4" />
                        The Future of Dance Education
                    </div>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                        Learn Dance from
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {' '}
                            World-Class Artists
                        </span>
                    </h1>
                    <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                        Master your craft with structured courses, interactive lessons, and direct
                        feedback from professional dancers. Join thousands of students transforming
                        their passion into skill.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                Start Learning
                            </Button>
                        </Link>
                        <Link href="/marketplace">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Browse Courses
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>100+ Courses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Expert Instructors</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>Lifetime Access</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="border-t bg-muted/30 py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Everything You Need to Excel
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            A complete learning platform designed for dancers of all levels
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <BookOpen className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>Structured Courses</CardTitle>
                                <CardDescription>
                                    Follow step-by-step curriculums designed by professional dancers
                                    to take you from beginner to advanced
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Video className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>HD Video Lessons</CardTitle>
                                <CardDescription>
                                    Crystal-clear video tutorials with multiple angles and playback
                                    controls for perfect practice
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Users className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>Community Support</CardTitle>
                                <CardDescription>
                                    Connect with fellow dancers, ask questions, and share your
                                    progress with our vibrant community
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <TrendingUp className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>Progress Tracking</CardTitle>
                                <CardDescription>
                                    Monitor your growth with detailed analytics and completion
                                    tracking for every lesson
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Award className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>Expert Instructors</CardTitle>
                                <CardDescription>
                                    Learn from world-renowned dancers with years of teaching
                                    experience and proven methods
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Sparkles className="mb-4 h-10 w-10 text-primary" />
                                <CardTitle>Flexible Learning</CardTitle>
                                <CardDescription>
                                    Study at your own pace with lifetime access to all course
                                    materials and regular updates
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-2xl text-center">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                            Flexible Pricing for Everyone
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the plan that works best for your learning journey
                        </p>
                    </div>
                    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                        <Card className="relative">
                            <CardHeader>
                                <CardTitle className="text-2xl">One-Time Purchase</CardTitle>
                                <CardDescription>
                                    Buy individual courses and get lifetime access
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="text-4xl font-bold">From $49</div>
                                    <p className="text-sm text-muted-foreground">per course</p>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Lifetime access to course content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>All video lessons and materials</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Progress tracking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Community access</span>
                                    </li>
                                </ul>
                                <Link href="/marketplace">
                                    <Button className="w-full" size="lg">
                                        Browse Courses
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                        <Card className="relative border-primary">
                            <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                                Popular
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
                                <CardDescription>
                                    Access selected courses with a monthly plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="text-4xl font-bold">From $29</div>
                                    <p className="text-sm text-muted-foreground">per month</p>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Access while subscribed</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>All video lessons and materials</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Progress tracking</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Community access</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Cancel anytime</span>
                                    </li>
                                </ul>
                                <Link href="/marketplace">
                                    <Button className="w-full" size="lg" variant="default">
                                        Get Started
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t bg-primary py-24 text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                            Ready to Start Your Dance Journey?
                        </h2>
                        <p className="mb-8 text-lg opacity-90">
                            Join thousands of students learning from the best instructors in the
                            world
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                    Create Free Account
                                </Button>
                            </Link>
                            <Link href="/marketplace">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
                                >
                                    Explore Marketplace
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
