import { t } from "elysia"

export const createAppointmentDto = t.Object({
  patientId: t.Number(),
  doctorId: t.Number(),
  secretaryId: t.Optional(t.Number()),
  dateTime: t.String({ format: "date-time" }),
  appointmentType: t.Union([
    t.Literal("PRESENCIAL"),
    t.Literal("TELECONSULTA"),
  ]),
  reason: t.String(),
})

export type CreateAppointmentDto = typeof createAppointmentDto.static

export const updateAppointmentDto = t.Object({
  dateTime: t.Optional(t.String({ format: "date-time" })),
  appointmentType: t.Optional(
    t.Union([t.Literal("PRESENCIAL"), t.Literal("TELECONSULTA")]),
  ),
  reason: t.Optional(t.String()),
})

export type UpdateAppointmentDto = typeof updateAppointmentDto.static

export const cancelAppointmentDto = t.Object({
  cancelReason: t.Optional(t.String()),
})

export type CancelAppointmentDto = typeof cancelAppointmentDto.static
