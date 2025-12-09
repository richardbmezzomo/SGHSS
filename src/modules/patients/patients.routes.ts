// src/modules/patients/patients.routes.ts
import { Elysia } from "elysia"
import {
  createPatientController,
  getPatientByIdController,
  listPatientsController,
  updatePatientController,
} from "./patients.controller"
import { createPatientDto } from "./patients.dto"

export const patientRoutes = new Elysia({ name: "patients-module" }).group(
  "/api/pacientes",
  (app) =>
    app
      .post("/", createPatientController, {
        body: createPatientDto,
      })
      .get("/", listPatientsController)
      .get("/:id", getPatientByIdController)
      .put("/:id", updatePatientController),
)
