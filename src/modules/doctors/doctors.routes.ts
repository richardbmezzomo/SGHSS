import Elysia from "elysia"
import {
  createDoctorController,
  getDoctorByIdController,
  listDoctorsController,
} from "./doctors.controller"
import { createDoctorDto } from "./doctors.dto"

export const doctorRoutes = new Elysia({ name: "doctors-module" }).group(
  "/api/medicos",
  (app) =>
    app
      .post("/", createDoctorController, {
        body: createDoctorDto,
      })
      .get("/", listDoctorsController)
      .get("/:id", getDoctorByIdController),
)
