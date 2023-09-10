import { BaseStore, ImmutableStoreGetter } from 'lisk-sdk';
import { NotFoundError } from '@liskhq/lisk-chain';
import { AppSchema } from '../../../schema';

type Properties = 'address' | 'forYou';

export const accountSchema: AppSchema<Properties> = {
	$id: 'voter/account',
	type: 'object',
	required: ['address', 'forYou'],
	properties: {
		address: {
			dataType: 'bytes',
			format: 'lisk32',
			fieldNumber: 1,
		},
		forYou: {
			fieldNumber: 2,
			type: 'object',
			properties: {
				polls: {
					fieldNumber: 1,
					type: 'array',
					items: {
						dataType: 'string',
					},
				},
				votes: {
					fieldNumber: 2,
					type: 'array',
					items: {
						dataType: 'string',
					},
				},
			},
			default: {
				polls: [],
				votes: [],
			},
		},
	},
};

interface Account {
	address: Buffer;
	forYou: {
		polls: string[]; // array of pollId
		votes: string[]; // pollId:voteId
	};
}

export class AccountStore extends BaseStore<Account> {
	public schema = accountSchema;

	public async getOrDefault(context: ImmutableStoreGetter, address: Buffer): Promise<Account> {
		try {
			const authAccount = await this.get(context, address);
			return authAccount;
		} catch (error) {
			if (!(error instanceof NotFoundError)) {
				throw error;
			}

			return {
				address,
				forYou: {
					polls: [],
					votes: [],
				},
			};
		}
	}
}
