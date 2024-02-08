import { t, type Elysia, type Static } from "elysia";
import { db } from "../../db/drizzle/connection";
import { redis } from "../../db/redis";

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

			const result = await redis.zrange(params.pollId, 0, -1, "WITHSCORES");

			const votes = result.reduce(
				(obj, line, index) => {
					if (index % 2 === 0) {
						const score = result[index + 1];

						Object.assign(obj, {
							[line]: Number(score),
						});
					}

					return obj;
				},
				{} as Record<string, number>,
			);

			return {
				poll: {
					...poll,
					options: poll.options.map((opt) => ({
						...opt,
						score: opt.id in votes ? votes[opt.id] : 0,
					})),
				},
			};
		},
		{
			params: t.Object({
				pollId: t.String(),
			}),
		},
	);
};
