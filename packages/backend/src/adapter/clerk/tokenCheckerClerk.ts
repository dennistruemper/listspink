import { Handler } from 'express';
import { TokenChecker } from '../../domain/definitions/tokenChecker';

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { ConfigRepository } from '../../domain/definitions/repositories/configRepository';

export class TokenCheckerClerk implements TokenChecker {
	private config: ConfigRepository;
	private handler: Handler | undefined = undefined;
	constructor(config: ConfigRepository) {
		this.config = config;
	}

	async getHandler(): Promise<Handler> {
		if (this.handler) {
			return this.handler;
		}

		const checkJwt = ClerkExpressRequireAuth({
			//apiUrl: await this.config.getClerkApi() TODO remove this?
		});

		return checkJwt;
	}
}
