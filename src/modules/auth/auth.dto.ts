import { t } from "elysia"

export const createUserDto = t.Object({
  name: t.String(),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  profile: t.String(),
})

export const loginDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
})

export type CreateUserDto = typeof createUserDto.static
export type LoginDto = typeof loginDto.static
