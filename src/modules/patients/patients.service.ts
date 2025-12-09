// src/modules/patients/patients.service.ts
import { eq, ne } from "drizzle-orm"
import { db } from "../../config/db"
import { patients } from "../../db/schema"
import type { CreatePatientDto, UpdatePatientDto } from "./patients.dto"

export async function createPatientService(dto: CreatePatientDto) {
  const { name, birthDate, cpf, phone, email } = dto

  const existing = await db
    .select()
    .from(patients)
    .where(eq(patients.cpf, cpf))
    .limit(1)

  if (existing.length > 0) {
    throw new Error("PATIENT_ALREADY_EXISTS")
  }

  const [createdPatient] = await db
    .insert(patients)
    .values({
      name,
      birth_date: birthDate,
      cpf,
      phone: phone ?? null,
      email: email ?? null,
    })
    .returning({
      id: patients.id,
      name: patients.name,
      birthDate: patients.birth_date,
      cpf: patients.cpf,
      phone: patients.phone,
      email: patients.email,
      createdAt: patients.created_at,
    })

  return createdPatient
}

import { and, like } from "drizzle-orm"

export async function listPatientsService(filters: {
  name?: string
  cpf?: string
}) {
  const whereClauses = []

  if (filters.name) {
    whereClauses.push(like(patients.name, `%${filters.name}%`))
  }

  if (filters.cpf) {
    whereClauses.push(like(patients.cpf, `%${filters.cpf}%`))
  }

  const result = await db
    .select({
      id: patients.id,
      name: patients.name,
      birthDate: patients.birth_date,
      cpf: patients.cpf,
      phone: patients.phone,
      email: patients.email,
      createdAt: patients.created_at,
    })
    .from(patients)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(patients.name)

  return result
}

export async function getPatientByIdService(id: number) {
  const result = await db
    .select({
      id: patients.id,
      name: patients.name,
      birthDate: patients.birth_date,
      cpf: patients.cpf,
      phone: patients.phone,
      email: patients.email,
      createdAt: patients.created_at,
    })
    .from(patients)
    .where(eq(patients.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function updatePatientService(id: number, dto: UpdatePatientDto) {
  const existing = await db
    .select()
    .from(patients)
    .where(eq(patients.id, id))
    .limit(1)

  const patient = existing[0]

  if (!patient) {
    throw new Error("PATIENT_NOT_FOUND")
  }

  if (dto.cpf) {
    const cpfOwner = await db
      .select()
      .from(patients)
      .where(and(eq(patients.cpf, dto.cpf), ne(patients.id, id)))
      .limit(1)

    if (cpfOwner.length > 0) {
      throw new Error("PATIENT_CPF_ALREADY_EXISTS")
    }
  }

  const updateData: Record<string, any> = {}

  if (dto.name !== undefined) updateData.name = dto.name
  if (dto.birthDate !== undefined) updateData.birth_date = dto.birthDate
  if (dto.cpf !== undefined) updateData.cpf = dto.cpf
  if (dto.phone !== undefined) updateData.phone = dto.phone
  if (dto.email !== undefined) updateData.email = dto.email

  if (Object.keys(updateData).length === 0) {
    return {
      id: patient.id,
      name: patient.name,
      birthDate: patient.birth_date,
      cpf: patient.cpf,
      phone: patient.phone,
      email: patient.email,
      createdAt: patient.created_at,
    }
  }

  const [updated] = await db
    .update(patients)
    .set(updateData)
    .where(eq(patients.id, id))
    .returning({
      id: patients.id,
      name: patients.name,
      birthDate: patients.birth_date,
      cpf: patients.cpf,
      phone: patients.phone,
      email: patients.email,
      createdAt: patients.created_at,
    })

  return updated
}
