import { Metadata } from 'next';
import { PaymentExamples } from './payment-examples';

export const metadata: Metadata = {
    title: 'Payment Examples',
    description: 'Examples of payment integration',
};

export default function PaymentPage() {
    return <PaymentExamples />;
}

