import { t } from "elysia"

export const createDoctorDto = t.Object({
  userId: t.Number(),
  name: t.String(),
  crm: t.String({ minLength: 3 }),
  specialty: t.String(),
})

export type CreateDoctorDto = typeof createDoctorDto.static
