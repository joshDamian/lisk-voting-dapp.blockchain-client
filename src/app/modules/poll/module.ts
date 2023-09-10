/* eslint-disable class-methods-use-this */

import { BaseModule, ModuleMetadata } from 'lisk-sdk';
import { CreatePollCommand } from './commands/create_poll_command';
import { VoteOnPollCommand } from './commands/vote_on_poll_command';
import { PollEndpoint, getDataByAddressSchema, getPollSchema } from './endpoint';
import { PollMethod } from './method';
import {
	AccountStore,
	PollStore,
	PollsStore,
	accountSchema,
	pollSchema,
	pollsSchema,
} from './stores';

export class PollModule extends BaseModule {
	public constructor() {
		super();
		// registration of stores and events
		this.stores.register(AccountStore, new AccountStore(this.name, 0));
		this.stores.register(PollStore, new PollStore(this.name, 1));
		this.stores.register(PollsStore, new PollsStore(this.name, 2));
	}

	public endpoint = new PollEndpoint(this.stores, this.offchainStores);
	public method = new PollMethod(this.stores, this.events);
	public commands = [
		new CreatePollCommand(this.stores, this.events),
		new VoteOnPollCommand(this.stores, this.events),
	];

	public metadata(): ModuleMetadata {
		return {
			...this.baseMetadata(),
			endpoints: [
				{
					name: this.endpoint.getAccount.name,
					request: getDataByAddressSchema,
					response: accountSchema,
				},
				{
					name: this.endpoint.getPoll.name,
					request: getPollSchema,
					response: pollSchema,
				},
				{
					name: this.endpoint.getPolls.name,
					request: getDataByAddressSchema,
					response: pollsSchema,
				},
			],
			assets: [],
		};
	}

	// Lifecycle hooks
	// public async init(_args: ModuleInitArgs): Promise<void> {
	// 	// initialize this module when starting a node
	// }

	// public async insertAssets(_context: InsertAssetContext) {
	// 	// initialize block generation, add asset
	// }

	// public async verifyAssets(_context: BlockVerifyContext): Promise<void> {
	// 	// verify block
	// }

	// Lifecycle hooks
	// public async verifyTransaction(_context: TransactionVerifyContext): Promise<VerificationResult> {
	// verify transaction will be called multiple times in the transaction pool
	// return { status: VerifyStatus.OK };
	// }

	// public async beforeCommandExecute(_context: TransactionExecuteContext): Promise<void> {
	// }

	// public async afterCommandExecute(_context: TransactionExecuteContext): Promise<void> {

	// }
	// public async initGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async finalizeGenesisState(_context: GenesisBlockExecuteContext): Promise<void> {

	// }

	// public async beforeTransactionsExecute(_context: BlockExecuteContext): Promise<void> {

	// }

	// public async afterTransactionsExecute(_context: BlockAfterExecuteContext): Promise<void> {

	// }
}
