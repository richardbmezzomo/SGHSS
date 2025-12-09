import type {
  CancelAppointmentDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "./appointments.dto"
import {
  cancelAppointmentService,
  createAppointmentService,
  getAppointmentByIdService,
  listAppointmentsService,
  updateAppointmentService,
} from "./appointments.service"

export const createAppointmentController = async (ctx: any) => {
  const { body, set, jwt, request } = ctx
  const data = body as CreateAppointmentDto

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

    // Regra de negócio: só SECRETARIA ou ADMIN podem agendar
    if (payload.profile !== "SECRETARIA" && payload.profile !== "ADMIN") {
      set.status = 403
      return {
        success: false,
        message:
          "Apenas secretárias ou administradores podem agendar consultas",
      }
    }

    const appointment = await createAppointmentService(data)

    set.status = 201
    return {
      success: true,
      message: "Consulta agendada com sucesso",
      data: appointment,
    }
  } catch (err: any) {
    if (err.message === "PATIENT_NOT_FOUND") {
      set.status = 400
      return { success: false, message: "Paciente não encontrado" }
    }

    if (err.message === "DOCTOR_NOT_FOUND") {
      set.status = 400
      return { success: false, message: "Médico não encontrado" }
    }

    if (err.message === "SECRETARY_NOT_FOUND") {
      set.status = 400
      return { success: false, message: "Secretária não encontrada" }
    }

    if (err.message === "APPOINTMENT_CONFLICT") {
      set.status = 400
      return {
        success: false,
        message:
          "Já existe uma consulta agendada para esse médico neste horário",
      }
    }

    console.error("Erro ao agendar consulta:", err)
    set.status = 500
    return { success: false, message: "Erro ao agendar consulta" }
  }
}

export const updateAppointmentController = async (ctx: any) => {
  const { params, body, set, jwt, request } = ctx
  const data = body as UpdateAppointmentDto

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

    if (payload.profile !== "SECRETARIA" && payload.profile !== "ADMIN") {
      set.status = 403
      return {
        success: false,
        message:
          "Apenas secretárias ou administradores podem atualizar consultas",
      }
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      set.status = 400
      return { success: false, message: "ID inválido" }
    }

    const updated = await updateAppointmentService(id, data)

    return {
      success: true,
      message: "Consulta atualizada com sucesso",
      data: updated,
    }
  } catch (err: any) {
    if (err.message === "APPOINTMENT_NOT_FOUND") {
      set.status = 404
      return { success: false, message: "Consulta não encontrada" }
    }

    if (err.message === "APPOINTMENT_CONFLICT") {
      set.status = 400
      return {
        success: false,
        message:
          "Já existe uma consulta agendada para esse médico neste horário",
      }
    }

    console.error("Erro ao atualizar consulta:", err)
    set.status = 500
    return { success: false, message: "Erro ao atualizar consulta" }
  }
}

export const listAppointmentsController = async (ctx: any) => {
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

    const patientId =
      query?.patientId !== undefined ? Number(query.patientId) : undefined
    const doctorId =
      query?.doctorId !== undefined ? Number(query.doctorId) : undefined

    if (query?.patientId !== undefined && Number.isNaN(patientId)) {
      set.status = 400
      return { success: false, message: "patientId inválido" }
    }

    if (query?.doctorId !== undefined && Number.isNaN(doctorId)) {
      set.status = 400
      return { success: false, message: "doctorId inválido" }
    }

    const filters = {
      patientId,
      doctorId,
      status: query?.status, // "AGENDADA" | "REALIZADA" | "CANCELADA"
      startDate: query?.startDate,
      endDate: query?.endDate,
    }

    const appointments = await listAppointmentsService(filters)

    return {
      success: true,
      data: appointments,
    }
  } catch (err) {
    console.error("Erro ao listar consultas:", err)
    set.status = 500
    return { success: false, message: "Erro ao listar consultas" }
  }
}

export const getAppointmentByIdController = async (ctx: any) => {
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

    const appointment = await getAppointmentByIdService(id)

    if (!appointment) {
      set.status = 404
      return { success: false, message: "Consulta não encontrada" }
    }

    return {
      success: true,
      data: appointment,
    }
  } catch (err) {
    console.error("Erro ao buscar consulta por ID:", err)
    set.status = 500
    return { success: false, message: "Erro ao buscar consulta" }
  }
}

export const cancelAppointmentController = async (ctx: any) => {
  const { params, body, set, jwt, request } = ctx
  const data = body as CancelAppointmentDto

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

    // Só SECRETARIA ou ADMIN podem cancelar
    if (payload.profile !== "SECRETARIA" && payload.profile !== "ADMIN") {
      set.status = 403
      return {
        success: false,
        message:
          "Apenas secretárias ou administradores podem cancelar consultas",
      }
    }

    const id = Number(params.id)
    if (Number.isNaN(id)) {
      set.status = 400
      return { success: false, message: "ID inválido" }
    }

    const updated = await cancelAppointmentService(id, data.cancelReason)

    return {
      success: true,
      message: "Consulta cancelada com sucesso",
      data: updated,
    }
  } catch (err: any) {
    if (err.message === "APPOINTMENT_NOT_FOUND") {
      set.status = 404
      return { success: false, message: "Consulta não encontrada" }
    }

    if (err.message === "APPOINTMENT_ALREADY_CANCELLED") {
      set.status = 400
      return { success: false, message: "A consulta já está cancelada" }
    }

    if (err.message === "APPOINTMENT_ALREADY_COMPLETED") {
      set.status = 400
      return {
        success: false,
        message: "Não é possível cancelar uma consulta já realizada",
      }
    }

    console.error("Erro ao cancelar consulta:", err)
    set.status = 500
    return { success: false, message: "Erro ao cancelar consulta" }
  }
}
