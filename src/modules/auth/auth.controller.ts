// src/modules/auth/auth.controller.ts
import { createUserService, loginUserService } from "./auth.service"

// signup
export const signupController = async (ctx: any) => {
  const { body, set } = ctx

  try {
    const user = await createUserService(body)
    return user
  } catch (err: any) {
    if (err.message === "O e-mail informado já está em uso!") {
      set.status = 400
      return { message: "E-mail já cadastrado" }
    }

    set.status = 500
    return { message: "Erro ao criar usuário" }
  }
}

// login
export const loginController = async (ctx: any) => {
  const { body, jwt, set } = ctx

  try {
    const user = await loginUserService(body)

    const token = await jwt.sign({
      sub: user.id,
      email: user.email,
      profile: user.profile,
    })

    return {
      message: "Login realizado com sucesso",
      token,
      user,
    }
  } catch (err: any) {
    set.status = 401
    console.log(err)
    return { message: "Credenciais inválidas" }
  }
}
