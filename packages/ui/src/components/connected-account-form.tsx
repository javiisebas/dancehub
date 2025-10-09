'use client';

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';

export interface ConnectedAccountData {
    businessName: string;
    email: string;
    country?: string;
    businessType?: string;
}

interface ConnectedAccountFormProps {
    onSubmit: (data: ConnectedAccountData) => void;
    isSubmitting?: boolean;
    title?: string;
    description?: string;
}

export function ConnectedAccountForm({
    onSubmit,
    isSubmitting = false,
    title = 'Setup Marketplace Account',
    description = 'Create a connected account to receive payments directly from customers.',
}: ConnectedAccountFormProps) {
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            businessName,
            email,
            country: 'US',
            businessType: 'individual',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                            id="businessName"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Your Business Name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="business@example.com"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? 'Creating Account...' : 'Continue to Onboarding'}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                        You'll be redirected to complete your account setup.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
