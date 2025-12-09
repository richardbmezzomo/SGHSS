import { t } from "elysia"

export const createPatientDto = t.Object({
  name: t.String(),
  birthDate: t.String({ format: "date" }),
  cpf: t.String({ minLength: 11, maxLength: 14 }),
  phone: t.Optional(t.String()),
  email: t.Optional(
    t.String({
      format: "email",
    }),
  ),
})

export type CreatePatientDto = typeof createPatientDto.static

export const updatePatientDto = t.Object({
  name: t.Optional(t.String()),
  birthDate: t.Optional(t.String({ format: "date" })),
  cpf: t.Optional(t.String({ minLength: 11, maxLength: 14 })),
  phone: t.Optional(t.String()),
  email: t.Optional(t.String({ format: "email" })),
})

export type UpdatePatientDto = typeof updatePatientDto.static
