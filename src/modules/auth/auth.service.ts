import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "../../config/db"
import { users } from "../../db/schema"
import type { LoginDto } from "./auth.dto"

interface CreateUserBody {
  name: string
  email: string
  password: string
  profile: string
}

export type LoginInput = {
  email: string
  password: string
}

export const createUserService = async (body: CreateUserBody) => {
  const { name, email, password, profile } = body

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (existingUser.length > 0) {
    throw new Error("O e-mail informado já está em uso!")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const [newUser] = await db
    .insert(users)
    .values({ name, email, password: hashedPassword, profile })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      users: users.profile,
    })

  return newUser
}

export async function loginUserService(dto: LoginDto) {
  const { email, password } = dto

  console.log("👉 INICIANDO LOGIN")
  console.log("📩 Email recebido:", email)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  console.log("🔎 RESULTADO DO SELECT:", result)

  const user = result[0]

  if (!user) {
    console.log("❌ Usuário NÃO encontrado")
    throw new Error("INVALID_CREDENTIALS")
  }

  console.log("👤 Usuário encontrado:", {
    id: user.id,
    email: user.email,
    password: user.password, // vamos ver se está hashada!
  })

  const isPasswordValid = await bcrypt.compare(password, user.password)

  console.log("🔐 Senha válida?:", isPasswordValid)

  if (!isPasswordValid) {
    console.log("❌ Senha INCORRETA")
    throw new Error("INVALID_CREDENTIALS")
  }

  console.log("✅ LOGIN OK")

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
  }
}
