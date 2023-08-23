import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import type { AuthRepository } from '../../domain/definitions/authRepository';
import type { User } from '../../domain/definitions/user';

export class AuthRepositoryAuth0 implements AuthRepository {
	private client: Auth0Client;
	private audience: string;

	constructor(client: Auth0Client, audience: string) {
		this.client = client;
		this.audience = audience;
	}

	static async create(input: {
		domain: string;
		clientId: string;
		audience: string;
	}): Promise<AuthRepositoryAuth0> {
		const client = await createAuth0Client({
			domain: input.domain,
			clientId: input.clientId
		});
		return new AuthRepositoryAuth0(client, input.audience);
	}

	async getAccessToken(): Promise<string | undefined> {
		const token = await this.client.getTokenWithPopup({
			authorizationParams: {
				redirect_uri: window.origin,
				audience: this.audience,
				scope: 'openid profile email'
			}
		});

		return token;
	}

	async getUser(): Promise<User | undefined> {
		const user = await this.client.getUser();
		if (user === undefined) {
			return undefined;
		}

		if (user.name === undefined || user.email === undefined) {
			return undefined;
		}

		return {
			name: user.name,
			displayName: user.nickname,
			email: user.email
		};
	}
	async handleRedirectCallback(url: string) {
		await this.client.handleRedirectCallback(url);
	}

	async login() {
		await this.client.loginWithRedirect({ authorizationParams: { redirect_uri: window.origin } });
	}

	async logout() {
		await this.client.logout({ logoutParams: { returnTo: window.origin } });
	}

	async isAuthenticated() {
		return await this.client.isAuthenticated();
	}
}
