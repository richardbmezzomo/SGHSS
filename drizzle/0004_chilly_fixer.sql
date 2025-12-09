CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"doctor_id" integer NOT NULL,
	"secretary_id" integer,
	"date_time" timestamp NOT NULL,
	"status" varchar(20) NOT NULL,
	"appointment_type" varchar(20) NOT NULL,
	"reason" varchar(255) NOT NULL,
	"cancel_reason" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_secretary_id_secretaries_id_fk" FOREIGN KEY ("secretary_id") REFERENCES "public"."secretaries"("id") ON DELETE no action ON UPDATE no action;