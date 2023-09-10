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
import { PollStore } from '../stores/poll';
import { AccountStore } from '../stores/account';

interface Params {
	pollId: string;
	option: string;
}

type SchemaProperties = 'pollId' | 'option';

export class VoteOnPollCommand extends BaseCommand {
	public schema: AppSchema<SchemaProperties> = {
		$id: 'VoteOnPollCommand',
		type: 'object',
		required: ['pollId', 'option'],
		properties: {
			pollId: {
				dataType: 'string',
				fieldNumber: 1,
			},
			option: {
				dataType: 'string',
				fieldNumber: 2,
			},
		},
	};

	public async verify(context: CommandVerifyContext<Params>): Promise<VerificationResult> {
		const { params, header, transaction } = context;
		const { pollId, option } = params;

		const pollStore = this.stores.get(PollStore);
		const pollIdBuffer = Buffer.from(pollId, 'hex');

		const pollExists = await pollStore.has(context, pollIdBuffer);
		if (!pollExists) throw new Error(`Poll ${pollId} does not exist`);

		const poll = await pollStore.get(context, pollIdBuffer);
		const pollIsActive = header.timestamp <= poll.expirationDate;
		const validPollOption = poll.options
			.map(opt => opt.toLowerCase())
			.includes(option.toLowerCase());

		if (!pollIsActive) throw new Error(`Poll ${pollId} has expired`);
		if (!validPollOption) throw new Error(`Option ${option} is not a valid choice`);

		const stringAddress = cryptography.address.getLisk32AddressFromAddress(
			transaction.senderAddress,
		);
		const existingVote = poll.votes.find(
			vote =>
				cryptography.address.getLisk32AddressFromAddress(vote.voter).toLowerCase() ===
				stringAddress.toLowerCase(),
		);
		if (existingVote) throw new Error(`User ${stringAddress} has voted`);

		return {
			status: VerifyStatus.OK,
		};
	}

	public async execute(context: CommandExecuteContext<Params>): Promise<void> {
		const { params, transaction, header } = context;
		const { pollId, option } = params;

		const pollIdBuffer = Buffer.from(pollId, 'hex');

		const pollStore = this.stores.get(PollStore);
		const accountStore = this.stores.get(AccountStore);

		// Get Sender
		const sender = await accountStore.getOrDefault(context, transaction.senderAddress);

		const poll = await pollStore.get(context, pollIdBuffer);

		const vote = {
			voter: sender.address,
			date: header.timestamp,
			option,
		};

		const voteId = poll.votes.length.toString();

		poll.votes.push(vote);
		sender.forYou.votes.push(`${poll.id}:${voteId}`);

		await pollStore.set(context, pollIdBuffer, poll);
		await accountStore.set(context, transaction.senderAddress, sender);
	}
}
