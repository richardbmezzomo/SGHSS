// src/modules/secretaries/secretaries.service.ts
import { and, eq, like } from "drizzle-orm"
import { db } from "../../config/db"
import { secretaries, users } from "../../db/schema"
import type { CreateSecretaryDto } from "./secretaries.dto"

export async function createSecretaryService(dto: CreateSecretaryDto) {
  const { userId, fullName, registration, email } = dto

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) throw new Error("USER_NOT_FOUND")
  if (user.profile !== "SECRETARIA" && user.profile !== "ADMIN") {
    throw new Error("INVALID_PROFILE")
  }

  const existing = await db
    .select()
    .from(secretaries)
    .where(eq(secretaries.user_id, userId))
    .limit(1)

  if (existing.length > 0) {
    throw new Error("SECRETARY_ALREADY_EXISTS_FOR_USER")
  }

  const [created] = await db
    .insert(secretaries)
    .values({
      user_id: userId,
      full_name: fullName,
      registration,
      email,
    })
    .returning({
      id: secretaries.id,
      userId: secretaries.user_id,
      fullName: secretaries.full_name,
      registration: secretaries.registration,
      email: secretaries.email,
      createdAt: secretaries.created_at,
    })

  return created
}

export async function listSecretariesService(filters: {
  fullName?: string
  registration?: string
}) {
  const whereClauses = []

  if (filters.fullName) {
    whereClauses.push(like(secretaries.full_name, `%${filters.fullName}%`))
  }

  if (filters.registration) {
    whereClauses.push(
      like(secretaries.registration, `%${filters.registration}%`),
    )
  }

  const result = await db
    .select({
      id: secretaries.id,
      userId: secretaries.user_id,
      fullName: secretaries.full_name,
      registration: secretaries.registration,
      email: secretaries.email,
      createdAt: secretaries.created_at,
    })
    .from(secretaries)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(secretaries.full_name)

  return result
}

export async function getSecretaryByIdService(id: number) {
  const result = await db
    .select({
      id: secretaries.id,
      userId: secretaries.user_id,
      fullName: secretaries.full_name,
      registration: secretaries.registration,
      email: secretaries.email,
      createdAt: secretaries.created_at,
    })
    .from(secretaries)
    .where(eq(secretaries.id, id))
    .limit(1)

  return result[0] ?? null
}
