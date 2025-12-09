ALTER TABLE "secretarias" RENAME TO "secretaries";--> statement-breakpoint
ALTER TABLE "secretaries" RENAME COLUMN "name" TO "full_name";--> statement-breakpoint
ALTER TABLE "secretaries" RENAME COLUMN "matricula" TO "registration";--> statement-breakpoint
ALTER TABLE "secretaries" DROP CONSTRAINT "secretarias_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "secretaries" ADD CONSTRAINT "secretaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;