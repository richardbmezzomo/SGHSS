import jwt from "@elysiajs/jwt"
import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { authRoutes } from "./modules/auth/auth.routes"

const PORT = process.env.PORT

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "default-secret",
    }),
  )
  .use(openapi())
  .use(authRoutes)
  .get("/", () => "Hello Elysia")
  .listen(PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
