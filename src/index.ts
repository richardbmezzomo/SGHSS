import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";

const PORT = process.env.PORT;

const app = new Elysia()
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .listen(PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
