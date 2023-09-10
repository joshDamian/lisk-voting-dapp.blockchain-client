import { BaseStore, ImmutableStoreGetter, StoreGetter } from 'lisk-sdk';
import { AppSchema } from '../../../schema';

const properties = ['polls'] as const;
type Properties = typeof properties[number];

export const pollsSchema: AppSchema<Properties> = {
	$id: 'voter/polls',
	type: 'object',
	required: ['polls'],
	properties: {
		polls: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'string',
			},
		},
	},
};
interface Polls {
	polls: string[];
}

const DEFAULT_KEY = Buffer.alloc(0);

export class PollsStore extends BaseStore<Polls> {
	public schema = pollsSchema;

	public async getPolls(context: ImmutableStoreGetter): Promise<Polls> {
		if (!(await this.has(context, DEFAULT_KEY))) {
			return {
				polls: [],
			};
		}
		return this.get(context, DEFAULT_KEY);
	}

	public async setPolls(context: StoreGetter, polls: Polls) {
		return this.set(context, DEFAULT_KEY, polls);
	}
}
