import { Handler } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { TokenChecker } from '../../../../shared/src/definitions/tokenChecker';
import { ConfigRepository } from '../../domain/definitions/repositories/ConfigRepository';

export class TokenCheckerAuth0 implements TokenChecker {
	private config: ConfigRepository;
	private handler: Handler | undefined = undefined;
	constructor(config: ConfigRepository) {
		this.config = config;
	}

	async getHandler(): Promise<Handler> {
		if (this.handler) {
			return this.handler;
		}

		const audience = await this.config.getAuth0Audience();
		const baseUrl = (await this.config.getAuth0TokenUrl()).slice(0, 'oauth/token'.length * -1);
		const checkJwt = auth({
			audience: audience,
			issuerBaseURL: baseUrl,
			tokenSigningAlg: 'RS256'
		});
		return checkJwt;
	}
}
