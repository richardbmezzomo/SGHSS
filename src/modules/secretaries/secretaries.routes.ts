import Elysia from "elysia"
import {
  createSecretaryController,
  getSecretaryByIdController,
  listSecretariesController,
} from "./secretaries.controller"
import { createSecretaryDto } from "./secretaries.dto"

export const secretaryRoutes = new Elysia({ name: "secretaries-module" }).group(
  "/api/secretaries",
  (app) =>
    app
      .post("/", createSecretaryController, {
        body: createSecretaryDto,
      })
      .get("/", listSecretariesController)
      .get("/:id", getSecretaryByIdController),
)
