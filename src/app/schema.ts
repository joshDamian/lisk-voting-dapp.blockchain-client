import { Schema } from 'lisk-sdk';

export type DataTypeMap = {
	string: string;
	uint32: number;
	bytes: Buffer;
};

export type SchemaProperties<Properties extends string> = {
	[key in Properties]: {
		format?: 'lisk32';
		dataType?: keyof DataTypeMap;
		type?: 'array' | 'object';
		fieldNumber: number;
		items?: {
			dataType?: keyof DataTypeMap;
			type?: 'array' | 'object';
			properties?: {
				[key: string]: SchemaProperties<string>[string];
			};
		};
		properties?: {
			[key: string]: SchemaProperties<string>[string];
		};
		default?: {
			[key: string]: unknown;
		};
		minLength?: number;
		maxLength?: number;
	};
};

export type AppSchema<Properties extends string> = Schema & {
	type: 'array' | 'object';
	required: Properties[];
	properties: SchemaProperties<Properties>;
};
