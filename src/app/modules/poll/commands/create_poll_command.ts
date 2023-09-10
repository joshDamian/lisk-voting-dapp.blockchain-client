/* eslint-disable class-methods-use-this */

import {
	BaseCommand,
	CommandVerifyContext,
	CommandExecuteContext,
	VerificationResult,
	VerifyStatus,
	cryptography,
} from 'lisk-sdk';
import { AppSchema } from '../../../schema';
import { Poll, PollStore, pollSchema } from '../stores/poll';
import { AccountStore } from '../stores/account';
import { PollsStore } from '../stores/polls';

const derivePollId = (address: Buffer, nonce: bigint): Buffer => {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(nonce);
	const seed = Buffer.concat([address, nonceBuffer]);
	return cryptography.utils.hash(seed);
};

type SchemaProperties = 'title' | 'description' | 'options' | 'expirationDate';
type Params = Pick<Poll, SchemaProperties>;

export class CreatePollCommand extends BaseCommand {
	public schema: AppSchema<SchemaProperties> = {
		$id: 'CreatePollCommand',
		type: 'object',
		required: ['title', 'description', 'options', 'expirationDate'],
		properties: {
			title: pollSchema.properties.title,
			description: pollSchema.properties.description,
			options: pollSchema.properties.options,
			expirationDate: pollSchema.properties.expirationDate,
		},
	};

	public async verify(_context: CommandVerifyContext<Params>): Promise<VerificationResult> {
		return Promise.resolve({ status: VerifyStatus.OK });
	}

	public async execute(context: CommandExecuteContext<Params>): Promise<void> {
		const { params, transaction, header } = context;
		const accountStore = this.stores.get(AccountStore);
		const senderProps = await accountStore.getOrDefault(context, transaction.senderAddress);

		const pollId = derivePollId(transaction.senderAddress, transaction.nonce);
		const pollIdHex = pollId.toString('hex');

		const poll: Poll = {
			id: pollIdHex,
			...params,
			date: header.timestamp,
			creator: transaction.senderAddress,
			votes: [],
		};

		// Save post in the DB
		await this.stores.get(PollStore).set(context, pollId, poll);

		// Save pollId to polls list
		const pollsStore = this.stores.get(PollsStore);
		const polls = await pollsStore.getPolls(context);
		polls.polls.push(pollIdHex);
		await pollsStore.setPolls(context, polls);

		// Save pollId in users account
		senderProps.forYou.polls.push(pollIdHex);
		await accountStore.set(context, transaction.senderAddress, senderProps);

		context.logger.info(`POLL ID: ${pollIdHex} created`);
	}
}
