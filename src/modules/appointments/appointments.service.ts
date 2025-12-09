import { and, eq, gte, lte, ne } from "drizzle-orm"
import { db } from "../../config/db"
import { appointments, doctors, patients, secretaries } from "../../db/schema"
import type { CreateAppointmentDto } from "./appointments.dto"

export async function createAppointmentService(dto: CreateAppointmentDto) {
  const {
    patientId,
    doctorId,
    secretaryId,
    dateTime,
    appointmentType,
    reason,
  } = dto

  const [patient] = await db
    .select()
    .from(patients)
    .where(eq(patients.id, patientId))
    .limit(1)

  if (!patient) {
    throw new Error("PATIENT_NOT_FOUND")
  }

  const [doctor] = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, doctorId))
    .limit(1)

  if (!doctor) {
    throw new Error("DOCTOR_NOT_FOUND")
  }

  if (secretaryId !== undefined) {
    const [secretary] = await db
      .select()
      .from(secretaries)
      .where(eq(secretaries.id, secretaryId))
      .limit(1)

    if (!secretary) {
      throw new Error("SECRETARY_NOT_FOUND")
    }
  }

  const [existing] = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.doctor_id, doctorId),
        eq(appointments.date_time, new Date(dateTime)),
      ),
    )
    .limit(1)

  if (existing) {
    throw new Error("APPOINTMENT_CONFLICT")
  }

  const [created] = await db
    .insert(appointments)
    .values({
      patient_id: patientId,
      doctor_id: doctorId,
      secretary_id: secretaryId,
      date_time: new Date(dateTime),
      status: "AGENDADA",
      appointment_type: appointmentType,
      reason,
    })
    .returning({
      id: appointments.id,
      patientId: appointments.patient_id,
      doctorId: appointments.doctor_id,
      secretaryId: appointments.secretary_id,
      dateTime: appointments.date_time,
      status: appointments.status,
      appointmentType: appointments.appointment_type,
      reason: appointments.reason,
      cancelReason: appointments.cancel_reason,
      createdAt: appointments.created_at,
    })

  return created
}

import type { UpdateAppointmentDto } from "./appointments.dto"

// ...

export async function updateAppointmentService(
  id: number,
  dto: UpdateAppointmentDto,
) {
  // 1. Buscar consulta atual
  const [existing] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1)

  if (!existing) {
    throw new Error("APPOINTMENT_NOT_FOUND")
  }

  const updateData: Record<string, any> = {}

  if (dto.dateTime !== undefined) {
    const newDate = new Date(dto.dateTime)

    const [conflict] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctor_id, existing.doctor_id),
          eq(appointments.date_time, newDate),
          ne(appointments.id, id),
        ),
      )
      .limit(1)

    if (conflict) {
      throw new Error("APPOINTMENT_CONFLICT")
    }

    updateData.date_time = newDate
  }

  if (dto.appointmentType !== undefined) {
    updateData.appointment_type = dto.appointmentType
  }

  if (dto.reason !== undefined) {
    updateData.reason = dto.reason
  }

  if (Object.keys(updateData).length === 0) {
    return {
      id: existing.id,
      patientId: existing.patient_id,
      doctorId: existing.doctor_id,
      secretaryId: existing.secretary_id,
      dateTime: existing.date_time,
      status: existing.status,
      appointmentType: existing.appointment_type,
      reason: existing.reason,
      cancelReason: existing.cancel_reason,
      createdAt: existing.created_at,
    }
  }

  const [updated] = await db
    .update(appointments)
    .set(updateData)
    .where(eq(appointments.id, id))
    .returning({
      id: appointments.id,
      patientId: appointments.patient_id,
      doctorId: appointments.doctor_id,
      secretaryId: appointments.secretary_id,
      dateTime: appointments.date_time,
      status: appointments.status,
      appointmentType: appointments.appointment_type,
      reason: appointments.reason,
      cancelReason: appointments.cancel_reason,
      createdAt: appointments.created_at,
    })

  return updated
}

type ListAppointmentsFilters = {
  patientId?: number
  doctorId?: number
  status?: string
  startDate?: string
  endDate?: string
}

export async function listAppointmentsService(
  filters: ListAppointmentsFilters,
) {
  const whereClauses = []

  if (filters.patientId) {
    whereClauses.push(eq(appointments.patient_id, filters.patientId))
  }

  if (filters.doctorId) {
    whereClauses.push(eq(appointments.doctor_id, filters.doctorId))
  }

  if (filters.status) {
    whereClauses.push(eq(appointments.status, filters.status))
  }

  if (filters.startDate) {
    whereClauses.push(gte(appointments.date_time, new Date(filters.startDate)))
  }

  if (filters.endDate) {
    whereClauses.push(lte(appointments.date_time, new Date(filters.endDate)))
  }

  const result = await db
    .select({
      id: appointments.id,
      patientId: appointments.patient_id,
      doctorId: appointments.doctor_id,
      secretaryId: appointments.secretary_id,
      dateTime: appointments.date_time,
      status: appointments.status,
      appointmentType: appointments.appointment_type,
      reason: appointments.reason,
      cancelReason: appointments.cancel_reason,
      createdAt: appointments.created_at,
    })
    .from(appointments)
    .where(whereClauses.length ? and(...whereClauses) : undefined)
    .orderBy(appointments.date_time)

  return result
}

export async function getAppointmentByIdService(id: number) {
  const result = await db
    .select({
      id: appointments.id,
      patientId: appointments.patient_id,
      doctorId: appointments.doctor_id,
      secretaryId: appointments.secretary_id,
      dateTime: appointments.date_time,
      status: appointments.status,
      appointmentType: appointments.appointment_type,
      reason: appointments.reason,
      cancelReason: appointments.cancel_reason,
      createdAt: appointments.created_at,

      patientName: patients.name,
      doctorName: doctors.name,
      secretaryName: secretaries.full_name,
    })
    .from(appointments)
    .leftJoin(patients, eq(appointments.patient_id, patients.id))
    .leftJoin(doctors, eq(appointments.doctor_id, doctors.id))
    .leftJoin(secretaries, eq(appointments.secretary_id, secretaries.id))
    .where(eq(appointments.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function cancelAppointmentService(
  id: number,
  cancelReason?: string,
) {
  const [existing] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1)

  if (!existing) {
    throw new Error("APPOINTMENT_NOT_FOUND")
  }

  if (existing.status === "CANCELADA") {
    throw new Error("APPOINTMENT_ALREADY_CANCELLED")
  }

  if (existing.status === "REALIZADA") {
    throw new Error("APPOINTMENT_ALREADY_COMPLETED")
  }

  const [updated] = await db
    .update(appointments)
    .set({
      status: "CANCELADA",
      cancel_reason: cancelReason ?? null,
    })
    .where(eq(appointments.id, id))
    .returning({
      id: appointments.id,
      patientId: appointments.patient_id,
      doctorId: appointments.doctor_id,
      secretaryId: appointments.secretary_id,
      dateTime: appointments.date_time,
      status: appointments.status,
      appointmentType: appointments.appointment_type,
      reason: appointments.reason,
      cancelReason: appointments.cancel_reason,
      createdAt: appointments.created_at,
    })

  return updated
}
