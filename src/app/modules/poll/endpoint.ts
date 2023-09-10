import { validator } from '@liskhq/lisk-validator';
import { BaseEndpoint, cryptography, ModuleEndpointContext } from 'lisk-sdk';
import { AppSchema } from '../../schema';
import { AccountStore, PollStore, Poll, PollsStore } from './stores';

interface PollJSON {
	id: string;
	title: string;
	description: string;
	options: string[];
	date: number;
	creator: string;
	expirationDate: number;
	votes: {
		voter: string;
		date: number;
		option: string;
	}[];
}

interface AccountJSON {
	address: string;
	forYou: {
		votes: string[]; // postId:voteId
		polls: string[]; // array of pollId
	};
}

const stringifyPost = (poll: Poll): PollJSON =>
	({
		...poll,
		creator: cryptography.address.getLisk32AddressFromAddress(poll.creator),
		votes: poll.votes.map(v => ({
			...v,
			voter: cryptography.address.getLisk32AddressFromAddress(v.voter),
		})),
	} as PollJSON);

export const getPollSchema: AppSchema<'id'> = {
	$id: '/voter/getPoll',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};
export const getDataByAddressSchema: AppSchema<'address'> = {
	$id: '/voter/getPolls',
	type: 'object',
	required: [],
	properties: {
		address: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export class PollEndpoint extends BaseEndpoint {
	public async getPoll(context: ModuleEndpointContext): Promise<PollJSON> {
		validator.validate<{ id: string }>(getPollSchema, context.params);
		const { id } = context.params;

		const poll = await this.stores.get(PollStore).get(context, Buffer.from(id, 'hex'));

		return stringifyPost(poll);
	}

	public async getPolls(context: ModuleEndpointContext): Promise<string[]> {
		validator.validate<{ address: string }>(getDataByAddressSchema, context.params);
		const { address } = context.params;

		if (address) {
			const account = await this.stores
				.get(AccountStore)
				.getOrDefault(context, cryptography.address.getAddressFromLisk32Address(address));
			return account.forYou.polls;
		}
		const { polls } = await this.stores.get(PollsStore).getPolls(context);
		return polls;
	}

	public async getAccount(context: ModuleEndpointContext): Promise<AccountJSON> {
		validator.validate<{ address: string }>(getDataByAddressSchema, context.params);
		const { address } = context.params;

		const account = await this.stores
			.get(AccountStore)
			.getOrDefault(context, cryptography.address.getAddressFromLisk32Address(address));
		return {
			...account,
			address: cryptography.address.getLisk32AddressFromAddress(account.address),
		};
	}
}
