import jwt from "@elysiajs/jwt"
import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { appointmentRoutes } from "./modules/appointments/appointments.routes"
import { authRoutes } from "./modules/auth/auth.routes"
import { doctorRoutes } from "./modules/doctors/doctors.routes"
import { patientRoutes } from "./modules/patients/patients.routes"
import { secretaryRoutes } from "./modules/secretaries/secretaries.routes"

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
  .use(patientRoutes)
  .use(doctorRoutes)
  .use(secretaryRoutes)
  .use(appointmentRoutes)
  .listen(PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
)
