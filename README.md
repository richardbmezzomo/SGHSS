# SGHSS

# 📘 SGHSS – Sistema de Gestão Hospitalar e Serviços de Saúde

API Backend desenvolvida em **Node.js**, **Elysia**, **Drizzle ORM** e **PostgreSQL**.

Este projeto implementa o backend do SGHSS, contemplando autenticação, gerenciamento de pacientes, médicos, secretárias e consultas.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Bun**
- **Elysia.js**
- **Drizzle ORM**
- **PostgreSQL**
- **JWT Authentication**
- **TypeScript**

---

## 📁 Estrutura do Projeto

```
src/
  config/
    db.ts
  db/
    schema.ts
  modules/
    auth/
    patients/
    doctors/
    secretaries/
    appointments/
index.ts
```

---

# 🔧 Como rodar o projeto

## 1️⃣ Pré-requisitos

- Bun instalado
- PostgreSQL instalado

## 2️⃣ Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/sghss-backend.git
cd sghss-backend
```

## 3️⃣ Instale dependências

```bash
bun install
```

## 4️⃣ Configure o `.env`

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/sghss
JWT_SECRET=sua_chave_jwt_segura
PORT=3000
```

## 5️⃣ Rodar migrações

```bash
bun run db:push
```

## 6️⃣ Iniciar servidor

```bash
bun dev
```

---

# 🔑 Autenticação

O login retorna um **JWT** usado em rotas protegidas:

```
Authorization: Bearer <token>
```

---

# 📌 Endpoints Principais

## 🔐 Auth

```
POST /auth/signup
POST /auth/login
```

## 👤 Pacientes

```
POST /api/pacientes
GET /api/pacientes
GET /api/pacientes/:id
PUT /api/pacientes/:id
```

## 🩺 Médicos

```
POST /api/medicos
GET /api/medicos
GET /api/medicos/:id
```

## 🗂 Secretárias

```
POST /api/secretaries
GET /api/secretaries
GET /api/secretaries/:id
```

## 📅 Consultas

```
POST /api/consultas
GET /api/consultas
GET /api/consultas/:id
PUT /api/consultas/:id
PUT /api/consultas/:id/cancelar
PUT /api/consultas/:id/realizar
```

---

# 🧪 Testes no Postman

1. Cadastre usuário
2. Faça login
3. Use o token no header

```
Authorization: Bearer <token>
```

---
