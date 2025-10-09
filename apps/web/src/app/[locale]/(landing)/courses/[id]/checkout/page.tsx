'use client';

import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@repo/ui/components';
import { ArrowLeft, Check, CreditCard, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data - will be replaced with real API calls
const mockCourse = {
    id: '1',
    title: 'Contemporary Dance Fundamentals',
    artist: 'Sarah Johnson',
    thumbnail: '/placeholder-course.jpg',
    price: 49.99,
    priceType: 'one-time',
    currency: 'usd',
};

export default function CheckoutPage({ params }: { params: { id: string } }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        setIsProcessing(true);

        try {
            // TODO: Call API to create Stripe checkout session
            // const response = await fetch(`/api/courses/${params.id}/purchase`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         successUrl: `${window.location.origin}/courses/${params.id}/success`,
            //         cancelUrl: window.location.href,
            //     }),
            // });
            // const { sessionUrl } = await response.json();
            // window.location.href = sessionUrl;

            // Mock redirect for now
            setTimeout(() => {
                alert('Payment integration will redirect to Stripe Checkout');
                setIsProcessing(false);
            }, 1500);
        } catch (error) {
            console.error('Checkout error:', error);
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-4xl">
                <Link
                    href={`/courses/${params.id}`}
                    className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Course
                </Link>

                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Order Summary */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <div className="h-24 w-32 flex-shrink-0 rounded-lg bg-muted"></div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{mockCourse.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            by {mockCourse.artist}
                                        </p>
                                        <div className="mt-2">
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {mockCourse.priceType === 'subscription'
                                                    ? 'Monthly Subscription'
                                                    : 'Lifetime Access'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            ${mockCourse.price}
                                            {mockCourse.priceType === 'subscription' && (
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    /mo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What's Included */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>What's Included</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>
                                            {mockCourse.priceType === 'subscription'
                                                ? 'Access while subscribed'
                                                : 'Lifetime access to course content'}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>All video lessons in HD quality</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Downloadable resources and materials</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Progress tracking and completion certificates</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="h-5 w-5 text-primary" />
                                        <span>Community access and Q&A support</span>
                                    </li>
                                    {mockCourse.priceType === 'subscription' && (
                                        <li className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-primary" />
                                            <span>Cancel anytime, no commitment</span>
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                                <CardDescription>Secure checkout powered by Stripe</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">${mockCourse.price}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span className="font-medium">Calculated at checkout</span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Total</span>
                                            <span className="text-2xl font-bold">
                                                ${mockCourse.price}
                                                {mockCourse.priceType === 'subscription' && (
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                        /mo
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        {mockCourse.priceType === 'subscription' && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Recurring monthly payment
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-5 w-5" />
                                            Proceed to Payment
                                        </>
                                    )}
                                </Button>

                                <div className="space-y-3 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        <span>Secure 256-bit SSL encryption</span>
                                    </div>
                                    <p>
                                        By completing your purchase you agree to our Terms of
                                        Service and acknowledge our Privacy Policy.
                                    </p>
                                    <p className="font-medium text-foreground">
                                        💯 30-day money-back guarantee
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust Badges */}
                        <Card className="mt-4">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        <span>Fast</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        <span>Trusted</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
