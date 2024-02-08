import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { pollResults } from "./routes/poll-results";
import { voteOnPoll } from "./routes/vote-on-poll";

new Elysia()
	.use(swagger())
	.use(createPoll)
	.use(getPoll)
	.use(voteOnPoll)
	.use(pollResults)
	.listen(3000);
