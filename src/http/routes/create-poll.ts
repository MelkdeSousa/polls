import { t, type Elysia } from "elysia";
import { db } from "../../db/drizzle/connection";
import { pollOptions, polls } from "../../db/drizzle/schemas";

const CreatePollInputBody = t.Object({
	title: t.String({
		maxLength: 256,
		minLength: 3,
		// error: '"title" must be between 3 and 256 characters',
	}),
	options: t.Array(t.String({ maxLength: 256 }), {
		minItems: 2,
		maxItems: 5,
	}),
});
const CreatePollOutputBody = t.Object({ pollId: t.String() });
const CreatePollServerErrorBody = t.Undefined();
const CreatePollClientErrorBody = t.Object({
	errors: t.Array(t.Object({ message: t.String() })),
});

export const createPoll = async (app: Elysia) => {
	return app.post(
		"/polls",
		async ({ body, set }) => {
			const pollId = await db.transaction(async (tx) => {
				const [{ pollId }] = await tx
					.insert(polls)
					.values({
						title: body.title,
					})
					.returning({ pollId: polls.id });

				await tx
					.insert(pollOptions)
					.values(body.options.map((opt) => ({ title: opt, poll_id: pollId })));

				return pollId;
			});

			if (!pollId) {
				set.status = 500;
				return;
			}

			set.status = 201;

			return { pollId };
		},
		{
			body: CreatePollInputBody,
			response: {
				201: CreatePollOutputBody,
				500: CreatePollServerErrorBody,
				400: CreatePollClientErrorBody,
			},
			detail: {
				responses: {
					201: {
						description: "Created",
						content: {
							"application/json": {
								schema: CreatePollOutputBody,
							},
						},
					},
					500: {
						description: "Internal Server Error",
					},
					400: {
						description: "Bad Request",
						content: {
							"application/json": {
								schema: CreatePollClientErrorBody,
							},
						},
					},
				},
			},
		},
	);
};
