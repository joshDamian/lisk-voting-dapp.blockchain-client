/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { PollModule } from './modules/poll/module';

export const registerModules = (app: Application): void => {
	app.registerModule(new PollModule());
};
