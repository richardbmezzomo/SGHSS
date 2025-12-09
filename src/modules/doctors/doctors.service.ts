// src/modules/doctors/doctors.service.ts
import { and, eq, like } from "drizzle-orm"
import { db } from "../../config/db"
import { doctors, users } from "../../db/schema"
import type { CreateDoctorDto } from "./doctors.dto"

export async function createDoctorService(dto: CreateDoctorDto) {
  const { userId, name, crm, specialty } = dto

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new Error("USER_NOT_FOUND")
  }

  if (user.profile !== "MEDICO") {
    throw new Error("USER_NOT_MEDICO")
  }

  const existingDoctor = await db
    .select()
    .from(doctors)
    .where(eq(doctors.crm, crm))
    .limit(1)

  if (existingDoctor.length > 0) {
    throw new Error("DOCTOR_CRM_ALREADY_EXISTS")
  }

  const [createdDoctor] = await db
    .insert(doctors)
    .values({
      user_id: userId,
      name,
      crm,
      specialty,
    })
    .returning({
      id: doctors.id,
      userId: doctors.user_id,
      name: doctors.name,
      crm: doctors.crm,
      specialty: doctors.specialty,
      createdAt: doctors.created_at,
    })

  return createdDoctor
}

export async function listDoctorsService(filters: {
  name?: string
  specialty?: string
}) {
  const whereClauses = []

  if (filters.name) {
    whereClauses.push(like(doctors.name, `%${filters.name}%`))
  }

  if (filters.specialty) {
    whereClauses.push(like(doctors.specialty, `%${filters.specialty}%`))
  }

  const result = await db
    .select({
      id: doctors.id,
      userId: doctors.user_id,
      name: doctors.name,
      crm: doctors.crm,
      specialty: doctors.specialty,
      createdAt: doctors.created_at,
    })
    .from(doctors)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(doctors.name)

  return result
}

export async function getDoctorByIdService(id: number) {
  const result = await db
    .select({
      id: doctors.id,
      userId: doctors.user_id,
      name: doctors.name,
      crm: doctors.crm,
      specialty: doctors.specialty,
      createdAt: doctors.created_at,
    })
    .from(doctors)
    .where(eq(doctors.id, id))
    .limit(1)

  return result[0] ?? null
}
