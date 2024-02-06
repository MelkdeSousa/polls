import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

new Elysia()
	.use(swagger())
	.post(
		"/polls",
		({ body, set }) => {
			console.log(body);

			set.status = 201;

			return body;
		},
		{
			body: t.Object({
				title: t.String({ maxLength: 256 }),
			}),
			detail: {
				responses: {
					201: {
						description: "Created",
					},
				},
			},
		},
	)
	.listen(3000);
