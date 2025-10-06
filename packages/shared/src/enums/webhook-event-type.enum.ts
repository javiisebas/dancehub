export enum WebhookEventTypeEnum {
    PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded',
    PAYMENT_INTENT_FAILED = 'payment_intent.failed',
    PAYMENT_INTENT_CANCELED = 'payment_intent.canceled',

    CHARGE_SUCCEEDED = 'charge.succeeded',
    CHARGE_FAILED = 'charge.failed',
    CHARGE_REFUNDED = 'charge.refunded',

    CUSTOMER_CREATED = 'customer.created',
    CUSTOMER_UPDATED = 'customer.updated',
    CUSTOMER_DELETED = 'customer.deleted',

    SUBSCRIPTION_CREATED = 'customer.subscription.created',
    SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
    SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
    SUBSCRIPTION_TRIAL_ENDING = 'customer.subscription.trial_will_end',

    INVOICE_CREATED = 'invoice.created',
    INVOICE_FINALIZED = 'invoice.finalized',
    INVOICE_PAID = 'invoice.paid',
    INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',

    CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
    CHECKOUT_SESSION_EXPIRED = 'checkout.session.expired',

    PAYOUT_CREATED = 'payout.created',
    PAYOUT_PAID = 'payout.paid',
    PAYOUT_FAILED = 'payout.failed',

    ACCOUNT_UPDATED = 'account.updated',
    ACCOUNT_EXTERNAL_ACCOUNT_CREATED = 'account.external_account.created',
}
