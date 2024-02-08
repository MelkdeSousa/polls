import { eq } from "drizzle-orm";
import { t, type Elysia } from "elysia";
import { db } from "../../db/drizzle/connection";
import { votes } from "../../db/drizzle/schemas";
import { redis } from "../../db/redis";
import { votingPubSub } from "../../lib/voting-pub-sub";

export const voteOnPoll = async (app: Elysia) => {
	return app.post(
		"/polls/:pollId/votes",
		async ({ params, set, cookie: { sessionId }, body }) => {
			if (!sessionId.value) {
				sessionId.value = crypto.randomUUID();
			}

			if (sessionId.value) {
				const userPreviouslyVotedOnPoll = await db.query.votes.findFirst({
					where: (votes, { eq }) =>
						eq(votes.session_id, sessionId.value as string),
				});

				if (
					userPreviouslyVotedOnPoll &&
					userPreviouslyVotedOnPoll.option_id !== body.optionId
				) {
					await db
						.delete(votes)
						.where(eq(votes.id, userPreviouslyVotedOnPoll.id));

					const score = await redis.zincrby(
						params.pollId,
						-1,
						userPreviouslyVotedOnPoll.option_id as string,
					);

					votingPubSub.publish(params.pollId, {
						optionId: userPreviouslyVotedOnPoll.option_id as string,
						votes: Number(score),
					});
				} else if (userPreviouslyVotedOnPoll) {
					set.status = 409;

					return { error: "You have already voted on this poll" };
				}
			}

			await db.insert(votes).values({
				session_id: sessionId.value,
				poll_id: params.pollId,
				option_id: body.optionId,
			});

			const score = await redis.zincrby(params.pollId, 1, body.optionId);

			votingPubSub.publish(params.pollId, {
				optionId: body.optionId,
				votes: Number(score),
			});

			set.status = 201;
		},
		{
			params: t.Object({
				pollId: t.String(),
			}),
			body: t.Object({
				optionId: t.String(),
			}),
			response: {
				201: t.Undefined(),
				409: t.Object({
					error: t.Literal("You have already voted on this poll"),
				}),
			},
			cookie: t.Cookie(
				{
					sessionId: t.Optional(t.String()),
				},
				{
					path: "/",
					maxAge: 60 * 60 * 24 * 30,
					secrets: "fwkjegbflaherbgpg94hf4thwn34tp349tugh3",
					sign: ["sessionId"],
					httpOnly: true,
				},
			),
		},
	);
};
