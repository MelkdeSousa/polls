import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

new Elysia()
	.use(swagger())
	.get("/", () => "Hello Elysia")
	.listen(3000);
