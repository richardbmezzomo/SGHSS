import type { CreateSecretaryDto } from "./secretaries.dto"
import {
  createSecretaryService,
  getSecretaryByIdService,
  listSecretariesService,
} from "./secretaries.services"

export const createSecretaryController = async (ctx: any) => {
  const { body, set, jwt, request } = ctx
  const data = body as CreateSecretaryDto

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

    const secretary = await createSecretaryService(data)

    set.status = 201
    return {
      success: true,
      message: "Secretária cadastrada com sucesso",
      data: secretary,
    }
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      set.status = 400
      return { success: false, message: "Usuário informado não existe" }
    }

    if (err.message === "INVALID_PROFILE") {
      set.status = 400
      return {
        success: false,
        message: "O usuário informado não possui perfil de secretária",
      }
    }

    if (err.message === "SECRETARY_ALREADY_EXISTS_FOR_USER") {
      set.status = 400
      return {
        success: false,
        message: "Este usuário já está vinculado a uma secretária",
      }
    }

    console.error("Erro ao cadastrar secretária:", err)
    set.status = 500
    return {
      success: false,
      message: "Erro ao cadastrar secretária",
    }
  }
}

export const listSecretariesController = async (ctx: any) => {
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
      fullName: query?.fullName,
      registration: query?.registration,
    }

    const secretaries = await listSecretariesService(filters)

    return {
      success: true,
      data: secretaries,
    }
  } catch (err) {
    console.error("Erro ao listar secretárias:", err)
    set.status = 500
    return {
      success: false,
      message: "Erro ao listar secretárias",
    }
  }
}

export const getSecretaryByIdController = async (ctx: any) => {
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

    const secretary = await getSecretaryByIdService(id)

    if (!secretary) {
      set.status = 404
      return { success: false, message: "Secretária não encontrada" }
    }

    return {
      success: true,
      data: secretary,
    }
  } catch (err) {
    console.error("Erro ao buscar secretária por ID:", err)
    set.status = 500
    return {
      success: false,
      message: "Erro ao buscar secretária",
    }
  }
}
