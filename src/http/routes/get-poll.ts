import { t, type Elysia, type Static } from "elysia";
import { db } from "../../db/drizzle/connection";

const PollOutputBody = t.Object({
	id: t.String(),
	title: t.String(),
	options: t.Array(t.Object({ id: t.String(), title: t.String() })),
});

export const getPoll = async (app: Elysia) => {
	return app.get(
		"/polls/:pollId",
		async ({ params, set }) => {
			const poll = (await db.query.polls.findFirst({
				where: (polls, { eq }) => eq(polls.id, params.pollId),
				with: { options: { columns: { id: true, title: true } } },
			})) as Static<typeof PollOutputBody> | undefined;

			if (!poll) {
				set.status = 404;

				return { error: "Poll not found" };
			}

			return { poll };
		},
		{
			params: t.Object({
				pollId: t.String(),
			}),
		},
	);
};
