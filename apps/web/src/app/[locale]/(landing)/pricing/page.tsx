import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-24">
            <div className="mx-auto mb-16 max-w-3xl text-center">
                <h1 className="mb-6 text-4xl font-bold md:text-5xl">Choose Your Learning Path</h1>
                <p className="text-lg text-muted-foreground">
                    Whether you want to commit to a single course or explore multiple styles, we
                    have a plan that fits your goals.
                </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
                {/* One-Time Purchase */}
                <Card className="relative flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Individual Courses</CardTitle>
                        <CardDescription className="text-base">
                            Perfect for focused learning on a specific style
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div>
                            <div className="text-4xl font-bold">From $49</div>
                            <p className="text-sm text-muted-foreground">One-time payment</p>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Lifetime access</strong> to course content, videos, and
                                    materials
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>All video lessons</strong> in HD with multiple camera
                                    angles
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Downloadable resources</strong> including PDFs and
                                    practice materials
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Progress tracking</strong> to monitor your advancement
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Community access</strong> to connect with other students
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Free updates</strong> when course content is added or
                                    improved
                                </span>
                            </li>
                        </ul>
                        <Link href="/marketplace" className="block">
                            <Button className="w-full" size="lg">
                                Browse Courses
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Subscription */}
                <Card className="relative flex flex-col border-primary shadow-lg">
                    <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                        Most Flexible
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl">Monthly Subscription</CardTitle>
                        <CardDescription className="text-base">
                            Great for exploring multiple styles and artists
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div>
                            <div className="text-4xl font-bold">From $29</div>
                            <p className="text-sm text-muted-foreground">Per month, per course</p>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Full access</strong> to enrolled courses while
                                    subscribed
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>All video lessons</strong> in HD with multiple camera
                                    angles
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Downloadable resources</strong> including PDFs and
                                    practice materials
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Progress tracking</strong> to monitor your advancement
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Community access</strong> to connect with other students
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Cancel anytime</strong>, no long-term commitment
                                    required
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                <span>
                                    <strong>Lower upfront cost</strong> to try before committing
                                </span>
                            </li>
                        </ul>
                        <Link href="/marketplace" className="block">
                            <Button className="w-full" size="lg">
                                Explore Subscriptions
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* FAQ Section */}
            <div className="mx-auto mt-24 max-w-3xl">
                <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            What's the difference between one-time purchase and subscription?
                        </h3>
                        <p className="text-muted-foreground">
                            A one-time purchase gives you lifetime access to a course with a single
                            payment. A subscription requires monthly payments but has a lower
                            upfront cost and can be cancelled anytime.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Can I switch from subscription to lifetime access?
                        </h3>
                        <p className="text-muted-foreground">
                            Yes! You can upgrade from a subscription to lifetime access at any time.
                            Contact support for assistance.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Do instructors set their own prices?
                        </h3>
                        <p className="text-muted-foreground">
                            Yes, each artist determines the pricing for their courses based on
                            content, duration, and expertise level.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">
                            Is there a money-back guarantee?
                        </h3>
                        <p className="text-muted-foreground">
                            Yes, we offer a 30-day money-back guarantee for all course purchases. If
                            you're not satisfied, contact us for a full refund.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mx-auto mt-24 max-w-2xl rounded-2xl bg-primary p-12 text-center text-primary-foreground">
                <h2 className="mb-4 text-3xl font-bold">Ready to Begin?</h2>
                <p className="mb-8 text-lg opacity-90">
                    Join thousands of dancers learning from the best instructors worldwide
                </p>
                <Link href="/register">
                    <Button size="lg" variant="secondary">
                        Create Your Free Account
                    </Button>
                </Link>
            </div>
        </div>
    );
}
