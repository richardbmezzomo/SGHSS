import type { CreateDoctorDto } from "./doctors.dto"
import {
  createDoctorService,
  getDoctorByIdService,
  listDoctorsService,
} from "./doctors.service"

export const createDoctorController = async (ctx: any) => {
  const { body, set, jwt, request } = ctx
  const data = body as CreateDoctorDto

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

    const doctor = await createDoctorService(data)

    set.status = 201
    return {
      success: true,
      message: "Médico cadastrado com sucesso",
      data: doctor,
    }
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      set.status = 400
      return {
        success: false,
        message: "Usuário informado não existe",
      }
    }

    if (err.message === "USER_NOT_MEDICO") {
      set.status = 400
      return {
        success: false,
        message: "O usuário informado não possui perfil de médico",
      }
    }

    if (err.message === "DOCTOR_CRM_ALREADY_EXISTS") {
      set.status = 400
      return {
        success: false,
        message: "Já existe um médico cadastrado com esse CRM",
      }
    }

    console.error("Erro ao criar médico:", err)
    set.status = 500
    return {
      success: false,
      message: "Erro ao cadastrar médico",
    }
  }
}

export const listDoctorsController = async (ctx: any) => {
  console.log("📃 listDoctorsController chamado")

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
      specialty: query?.specialty,
    }

    const doctors = await listDoctorsService(filters)

    return {
      success: true,
      data: doctors,
    }
  } catch (err) {
    console.error("Erro ao listar médicos:", err)
    set.status = 500
    return { success: false, message: "Erro ao listar médicos" }
  }
}

export const getDoctorByIdController = async (ctx: any) => {
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

    console.log(id)
    const doctor = await getDoctorByIdService(id)

    if (!doctor) {
      set.status = 404
      return { success: false, message: "Médico não encontrado" }
    }

    return {
      success: true,
      data: doctor,
    }
  } catch (err) {
    console.error("Erro ao buscar médico por ID:", err)
    set.status = 500
    return { success: false, message: "Erro ao buscar médico" }
  }
}
