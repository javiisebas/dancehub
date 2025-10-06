CREATE TYPE "public"."provider" AS ENUM('local', 'google', 'facebook', 'apple');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('pending', 'verified', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('TO_BE_SENT', 'PENDING', 'SENT', 'FAILED', 'RATE_LIMITED');--> statement-breakpoint
CREATE TYPE "public"."email_template" AS ENUM('verify-email', 'reset-password', 'welcome');--> statement-breakpoint
CREATE TYPE "public"."thumbnail_size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."storage_provider" AS ENUM('r2', 's3', 'local');--> statement-breakpoint
CREATE TYPE "public"."storage_status" AS ENUM('uploading', 'active', 'failed', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."storage_visibility" AS ENUM('public', 'private', 'authenticated');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dance_style_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dance_style_id" uuid NOT NULL,
	"locale" varchar(10) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dance_style_translations_dance_style_id_locale_unique" UNIQUE("dance_style_id","locale")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dance_styles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dance_styles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_dance_styles" (
	"user_id" uuid NOT NULL,
	"dance_style_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_dance_styles_user_id_dance_style_id_pk" PRIMARY KEY("user_id","dance_style_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" text,
	"refresh_token" text,
	"status" "user_status" DEFAULT 'pending' NOT NULL,
	"provider" "provider" DEFAULT 'local' NOT NULL,
	"provider_id" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"display_name" varchar(255),
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to" varchar(255) NOT NULL,
	"subject" varchar(500) NOT NULL,
	"template" "email_template" NOT NULL,
	"data" json,
	"status" "email_status" DEFAULT 'PENDING' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storage_thumbnails" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_id" uuid NOT NULL,
	"size" "thumbnail_size" NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"path" text NOT NULL,
	"file_size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "storages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"extension" varchar(10) NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"provider" "storage_provider" DEFAULT 'r2' NOT NULL,
	"provider_id" varchar(255),
	"visibility" "storage_visibility" DEFAULT 'private' NOT NULL,
	"status" "storage_status" DEFAULT 'uploading' NOT NULL,
	"user_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dance_style_translations" ADD CONSTRAINT "dance_style_translations_dance_style_id_dance_styles_id_fk" FOREIGN KEY ("dance_style_id") REFERENCES "public"."dance_styles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_dance_styles" ADD CONSTRAINT "user_dance_styles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_dance_styles" ADD CONSTRAINT "user_dance_styles_dance_style_id_dance_styles_id_fk" FOREIGN KEY ("dance_style_id") REFERENCES "public"."dance_styles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storage_thumbnails" ADD CONSTRAINT "storage_thumbnails_storage_id_storages_id_fk" FOREIGN KEY ("storage_id") REFERENCES "public"."storages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "storages" ADD CONSTRAINT "storages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
