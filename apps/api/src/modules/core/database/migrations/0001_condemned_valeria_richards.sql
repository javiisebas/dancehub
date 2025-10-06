CREATE TABLE IF NOT EXISTS "user_dance_styles" (
	"user_id" uuid NOT NULL,
	"dance_style_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_dance_styles_user_id_dance_style_id_pk" PRIMARY KEY("user_id","dance_style_id")
);
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
