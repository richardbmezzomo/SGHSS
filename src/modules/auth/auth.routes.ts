import { Elysia, t } from "elysia"
import { loginController, signupController } from "./auth.controller"

// DTO + validação
const createUserDto = t.Object({
  name: t.String(),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6 }),
  profile: t.String(),
})

const loginDto = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
})

export const authRoutes = new Elysia({ name: "auth-module" }).group(
  "/api/auth",
  (app) =>
    app
      .post(
        "/signup",
        signupController, // <── aqui entra a função controller
        {
          body: createUserDto, // validação do body
        },
      )
      .post("/login", loginController, {
        body: loginDto,
      }),
)
