type Message = { optionId: string; votes: number };
type Subscriber = (message: Message) => void;
type PollId = string;

class VotingPubSub {
	private channels: Map<PollId, Subscriber[]> = new Map();

	subscribe(pollId: PollId, subscriber: Subscriber) {
		if (!this.channels.has(pollId)) {
			this.channels.set(pollId, []);
		}

		this.channels.get(pollId)?.push(subscriber);
	}

	publish(pollId: PollId, message: Message) {
		if (!this.channels.has(pollId)) {
			return;
		}

		this.channels.get(pollId)?.forEach((subscriber) => subscriber(message));
	}
}

export const votingPubSub = new VotingPubSub();
