-- Payment tables migration

-- Customers table
CREATE TABLE IF NOT EXISTS "customers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "stripe_customer_id" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Payment status enum
DO $$ BEGIN
    CREATE TYPE "payment_status" AS ENUM (
        'pending',
        'processing',
        'succeeded',
        'failed',
        'canceled',
        'refunded',
        'partially_refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment type enum
DO $$ BEGIN
    CREATE TYPE "payment_type" AS ENUM (
        'one_time',
        'subscription',
        'marketplace',
        'feature_pack'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment intents table
CREATE TABLE IF NOT EXISTS "payment_intents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "stripe_payment_intent_id" TEXT NOT NULL UNIQUE,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" payment_status NOT NULL DEFAULT 'pending',
    "payment_type" payment_type NOT NULL DEFAULT 'one_time',
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Subscription status enum
DO $$ BEGIN
    CREATE TYPE "subscription_status" AS ENUM (
        'active',
        'past_due',
        'unpaid',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'trialing',
        'paused'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscription interval enum
DO $$ BEGIN
    CREATE TYPE "subscription_interval" AS ENUM (
        'day',
        'week',
        'month',
        'year'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "stripe_subscription_id" TEXT NOT NULL UNIQUE,
    "stripe_price_id" TEXT NOT NULL,
    "stripe_product_id" TEXT NOT NULL,
    "status" subscription_status NOT NULL DEFAULT 'incomplete',
    "current_period_start" TIMESTAMP NOT NULL,
    "current_period_end" TIMESTAMP NOT NULL,
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT FALSE,
    "interval" subscription_interval NOT NULL,
    "interval_count" INTEGER NOT NULL DEFAULT 1,
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "trial_end" TIMESTAMP,
    "canceled_at" TIMESTAMP,
    "metadata" JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Connected accounts table
CREATE TABLE IF NOT EXISTS "connected_accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
    "stripe_account_id" TEXT NOT NULL UNIQUE,
    "charges_enabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "payouts_enabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "details_submitted" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Webhook events table
CREATE TABLE IF NOT EXISTS "webhook_events" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "stripe_event_id" TEXT NOT NULL UNIQUE,
    "event_type" VARCHAR(100) NOT NULL,
    "data" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT FALSE,
    "processed_at" TIMESTAMP,
    "error" TEXT,
    "retry_count" VARCHAR(255) NOT NULL DEFAULT '0',
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_customers_user_id" ON "customers"("user_id");
CREATE INDEX IF NOT EXISTS "idx_customers_stripe_customer_id" ON "customers"("stripe_customer_id");

CREATE INDEX IF NOT EXISTS "idx_payment_intents_user_id" ON "payment_intents"("user_id");
CREATE INDEX IF NOT EXISTS "idx_payment_intents_stripe_payment_intent_id" ON "payment_intents"("stripe_payment_intent_id");
CREATE INDEX IF NOT EXISTS "idx_payment_intents_status" ON "payment_intents"("status");
CREATE INDEX IF NOT EXISTS "idx_payment_intents_payment_type" ON "payment_intents"("payment_type");

CREATE INDEX IF NOT EXISTS "idx_subscriptions_user_id" ON "subscriptions"("user_id");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_stripe_subscription_id" ON "subscriptions"("stripe_subscription_id");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_status" ON "subscriptions"("status");

CREATE INDEX IF NOT EXISTS "idx_connected_accounts_user_id" ON "connected_accounts"("user_id");
CREATE INDEX IF NOT EXISTS "idx_connected_accounts_stripe_account_id" ON "connected_accounts"("stripe_account_id");

CREATE INDEX IF NOT EXISTS "idx_webhook_events_stripe_event_id" ON "webhook_events"("stripe_event_id");
CREATE INDEX IF NOT EXISTS "idx_webhook_events_processed" ON "webhook_events"("processed");
CREATE INDEX IF NOT EXISTS "idx_webhook_events_event_type" ON "webhook_events"("event_type");

