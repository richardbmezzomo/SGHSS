import { t } from "elysia"

export const createSecretaryDto = t.Object({
  userId: t.Number(),
  fullName: t.String(),
  registration: t.String({ minLength: 1, maxLength: 20 }),
  email: t.String({ format: "email" }),
})

export type CreateSecretaryDto = typeof createSecretaryDto.static
