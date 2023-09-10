import { VoteOnPollCommand } from '../../../../../src/app/modules/poll/commands/vote_on_poll_command';

describe('VoteOnPollCommand', () => {
	let command: VoteOnPollCommand;

	beforeEach(() => {
		command = new VoteOnPollCommand();
	});

	describe('constructor', () => {
		it('should have valid name', () => {
			expect(command.name).toBe('voteOnPoll');
		});

		it('should have valid schema', () => {
			expect(command.schema).toMatchSnapshot();
		});
	});

	describe('verify', () => {
		describe('schema validation', () => {
			it.todo('should throw errors for invalid schema');
			it.todo('should be ok for valid schema');
		});
	});

	describe('execute', () => {
		describe('valid cases', () => {
			it.todo('should update the state store');
		});

		describe('invalid cases', () => {
			it.todo('should throw error');
		});
	});
});
