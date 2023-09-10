import { BaseStore } from 'lisk-sdk';
import { AppSchema, DataTypeMap } from '../../../schema';

let fieldNumber = 0;

const getCurrentFieldNumber = () => {
	fieldNumber += 1;
	return fieldNumber;
};

const pollProperties = [
	'id',
	'title',
	'description',
	'options',
	'date',
	'creator',
	'expirationDate',
	'votes',
] as const;
type PollProperty = typeof pollProperties[number];

export const pollSchema: AppSchema<PollProperty> = {
	$id: 'voter/poll',
	type: 'object',
	required: ['id', 'title', 'description', 'options', 'date', 'creator', 'expirationDate'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: getCurrentFieldNumber(),
		},
		title: {
			dataType: 'string',
			fieldNumber: getCurrentFieldNumber(),
			minLength: 3,
			maxLength: 256,
		},
		description: {
			dataType: 'string',
			fieldNumber: getCurrentFieldNumber(),
			minLength: 3,
			maxLength: 256,
		},
		options: {
			type: 'array',
			items: {
				dataType: 'string',
			},
			fieldNumber: getCurrentFieldNumber(),
		},
		date: {
			dataType: 'uint32',
			fieldNumber: getCurrentFieldNumber(),
		},
		creator: {
			dataType: 'bytes',
			fieldNumber: getCurrentFieldNumber(),
		},
		expirationDate: {
			dataType: 'uint32',
			fieldNumber: getCurrentFieldNumber(),
		},
		votes: {
			type: 'array',
			fieldNumber: getCurrentFieldNumber(),
			items: {
				type: 'object',
				properties: {
					voter: {
						fieldNumber: 1,
						dataType: 'bytes',
					},
					option: {
						fieldNumber: 2,
						dataType: 'string',
					},
					date: {
						dataType: 'uint32',
						fieldNumber: 3,
					},
				},
			},
		},
	},
};

export interface Poll {
	id: string;
	title: string;
	description: string;
	options: string[];
	date: number;
	creator: DataTypeMap['bytes'];
	expirationDate: number;
	votes: {
		voter: Buffer;
		date: number;
		option: string;
	}[];
}

export class PollStore extends BaseStore<Poll> {
	public schema = pollSchema;
}
