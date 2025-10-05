CREATE TYPE "public"."storage_provider" AS ENUM('r2', 's3', 'local');--> statement-breakpoint
CREATE TYPE "public"."storage_status" AS ENUM('uploading', 'active', 'failed', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."storage_visibility" AS ENUM('public', 'private', 'authenticated');--> statement-breakpoint
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
 ALTER TABLE "storages" ADD CONSTRAINT "storages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
