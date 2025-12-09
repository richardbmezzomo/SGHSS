import {
  date,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  profile: varchar("profile", { length: 50 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  birth_date: date("birth_date").notNull(),
  cpf: varchar("cpf", { length: 14 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  crm: varchar("crm", { length: 20 }).notNull().unique(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const secretaries = pgTable("secretaries", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  registration: varchar("registration", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
})

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patient_id: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  doctor_id: integer("doctor_id")
    .references(() => doctors.id)
    .notNull(),
  secretary_id: integer("secretary_id").references(() => secretaries.id),
  date_time: timestamp("date_time").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  appointment_type: varchar("appointment_type", { length: 20 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  cancel_reason: varchar("cancel_reason", { length: 255 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
})
