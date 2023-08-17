import { params } from '@ampt/sdk';
import { ConfigRepository } from '../../domain/definitions/repositories/ConfigRepository';

export class ConfigRepositoryAmpt implements ConfigRepository {
	getAuth0TokenUrl(): Promise<string> {
		return params('AUTH0_TOKEN_URL');
	}
	getAuth0ClientSecret(): Promise<string> {
		return params('AUTH0_CLIENT_SECRET');
	}
	getAuth0ClientId(): Promise<string> {
		return params('AUTH0_CLIENT_ID');
	}
	getAuth0Domain(): Promise<string> {
		return params('AUTH0_DOMAIN');
	}
	async getAuth0Audience(): Promise<string> {
		return params('AUTH0_AUDIENCE');
	}
}
