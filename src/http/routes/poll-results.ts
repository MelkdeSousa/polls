import { t, type Elysia } from "elysia";
import { votingPubSub } from "../../lib/voting-pub-sub";

export const pollResults = async (app: Elysia) => {
	return app.ws("/polls/:pollId", {
		params: t.Object({
			pollId: t.String(),
		}),
		open: (ws) => {
			votingPubSub.subscribe(ws.data.params.pollId, (message) => {
				ws.send(message);
			});
		},
	});
};
