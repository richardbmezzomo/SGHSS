import Elysia from "elysia"
import {
  cancelAppointmentController,
  createAppointmentController,
  getAppointmentByIdController,
  listAppointmentsController,
  updateAppointmentController,
} from "./appointments.controller"
import {
  cancelAppointmentDto,
  createAppointmentDto,
  updateAppointmentDto,
} from "./appointments.dto"

export const appointmentRoutes = new Elysia({
  name: "appointments-module",
}).group("/api/consultas", (app) =>
  app
    .post("/", createAppointmentController, {
      body: createAppointmentDto,
    })

    .get("/", listAppointmentsController)
    .get("/:id", getAppointmentByIdController)
    .put("/:id/cancelar", cancelAppointmentController, {
      body: cancelAppointmentDto,
    })
    .put("/:id", updateAppointmentController, {
      body: updateAppointmentDto,
    }),
)
