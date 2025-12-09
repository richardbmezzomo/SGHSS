// src/modules/patients/patients.controller.ts
import type { CreatePatientDto, UpdatePatientDto } from "./patients.dto"
import {
  createPatientService,
  getPatientByIdService,
  listPatientsService,
  updatePatientService,
} from "./patients.service"

export const createPatientController = async (ctx: any) => {
  const { body, set, jwt, request } = ctx
  const data = body as CreatePatientDto

  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401
      return {
        success: false,
        message: "Token não informado",
      }
    }

    const token = authHeader.substring("Bearer ".length)
    const payload = await jwt.verify(token).catch(() => null)

    if (!payload) {
      set.status = 401
      return {
        success: false,
        message: "Token inválido",
      }
    }

    const patient = await createPatientService(data)

    set.status = 201
    return {
      success: true,
      message: "Paciente cadastrado com sucesso",
      data: patient,
    }
  } catch (err: any) {
    if (err.message === "PATIENT_ALREADY_EXISTS") {
      set.status = 400
      return {
        success: false,
        message: "Já existe um paciente cadastrado com esse CPF",
      }
    }

    console.error("Erro ao criar paciente:", err)
    set.status = 500
    return {
      success: false,
      message: "Erro ao cadastrar paciente",
    }
  }
}

export const listPatientsController = async (ctx: any) => {
  const { query, set, jwt, request } = ctx

  try {
    const auth = request.headers.get("authorization")
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401
      return { success: false, message: "Token não informado" }
    }

    const token = auth.substring(7)
    const payload = await jwt.verify(token).catch(() => null)

    if (!payload) {
      set.status = 401
      return { success: false, message: "Token inválido" }
    }

    const filters = {
      name: query?.name,
      cpf: query?.cpf,
    }

    const patients = await listPatientsService(filters)

    return {
      success: true,
      data: patients,
    }
  } catch (err) {
    console.error(err)
    set.status = 500
    return { success: false, message: "Erro ao listar pacientes" }
  }
}

export const getPatientByIdController = async (ctx: any) => {
  const { params, set, jwt, request } = ctx

  try {
    const auth = request.headers.get("authorization")
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401
      return { success: false, message: "Token não informado" }
    }

    const token = auth.substring(7)
    const payload = await jwt.verify(token).catch(() => null)

    if (!payload) {
      set.status = 401
      return { success: false, message: "Token inválido" }
    }

    const id = Number(params.id)

    if (Number.isNaN(id)) {
      set.status = 400
      return { success: false, message: "ID inválido" }
    }

    // 3. Buscar paciente
    const patient = await getPatientByIdService(id)

    if (!patient) {
      set.status = 404
      return { success: false, message: "Paciente não encontrado" }
    }

    return {
      success: true,
      data: patient,
    }
  } catch (err) {
    console.error("Erro ao buscar paciente por ID:", err)
    set.status = 500
    return { success: false, message: "Erro ao buscar paciente" }
  }
}

export const updatePatientController = async (ctx: any) => {
  const { params, body, set, jwt, request } = ctx
  const data = body as UpdatePatientDto

  try {
    const auth = request.headers.get("authorization")
    if (!auth?.startsWith("Bearer ")) {
      set.status = 401
      return { success: false, message: "Token não informado" }
    }

    const token = auth.substring(7)
    const payload = await jwt.verify(token).catch(() => null)

    if (!payload) {
      set.status = 401
      return { success: false, message: "Token inválido" }
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      set.status = 400
      return { success: false, message: "ID inválido" }
    }

    const updated = await updatePatientService(id, data)

    return {
      success: true,
      message: "Paciente atualizado com sucesso",
      data: updated,
    }
  } catch (err: any) {
    if (err.message === "PATIENT_NOT_FOUND") {
      set.status = 404
      return { success: false, message: "Paciente não encontrado" }
    }

    if (err.message === "PATIENT_CPF_ALREADY_EXISTS") {
      set.status = 400
      return {
        success: false,
        message: "Já existe outro paciente com esse CPF",
      }
    }

    console.error("Erro ao atualizar paciente:", err)
    set.status = 500
    return { success: false, message: "Erro ao atualizar paciente" }
  }
}
